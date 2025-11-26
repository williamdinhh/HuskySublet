import express from 'express';
import {
  findListings,
  findListingById,
  createListing,
  updateListing,
  findLikes,
  findLike,
  createLike,
  deleteLike,
  findMatches,
  findMatchByUsers,
  createMatch,
  findUserById,
  getDb,
  saveDb,
} from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper to populate listing with owner info
const populateListing = async (listing) => {
  const owner = await findUserById(listing.ownerId);
  return {
    ...listing,
    _id: listing.id, // Add _id for frontend compatibility
    ownerId: owner ? {
      id: owner.id,
      name: owner.name,
      email: owner.email,
    } : listing.ownerId,
  };
};

// Get all active listings (for browsing)
router.get('/browse', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const browseType = req.query.type; // 'sellers' or 'buyers'
    
    // Get current user to check their role
    const currentUser = await findUserById(userId);
    
    // Get all listings user has already liked
    const userLikes = await findLikes({ userId });
    const likedListingIds = userLikes.map(like => like.listingId);

    // Get all active listings, excluding user's own and already liked
    let listings = await findListings({
      isActive: true,
      excludeOwnerId: userId,
      excludeIds: likedListingIds,
    });

    // Filter by seller/buyer role if specified
    if (browseType === 'sellers') {
      // Show listings from sellers (users with role 'seller' or 'both')
      const sellerIds = new Set();
      const data = await getDb();
      data.users.forEach(u => {
        if ((u.role === 'seller' || u.role === 'both') && u.id !== userId) {
          sellerIds.add(u.id);
        }
      });
      listings = listings.filter(l => sellerIds.has(l.ownerId));
    } else if (browseType === 'buyers') {
      // For buyers tab, show listings from users who are buyers or both
      // But only if they have listings (since buyers typically don't list, but "both" users might)
      const buyerIds = new Set();
      const data = await getDb();
      data.users.forEach(u => {
        // Only show buyers (not sellers) - so exclude sellers, only show pure buyers
        if (u.role === 'buyer' && u.id !== userId) {
          buyerIds.add(u.id);
        }
      });
      listings = listings.filter(l => buyerIds.has(l.ownerId));
    }

    // Populate owner info
    listings = await Promise.all(listings.map(populateListing));

    res.json({ listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's own listings
router.get('/my-listings', authenticate, async (req, res) => {
  try {
    const listings = await findListings({ ownerId: req.user.id });
    res.json({ listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new listing
router.post('/', authenticate, async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      ownerId: req.user.id,
    };

    const listing = await createListing(listingData);
    const populated = await populateListing(listing);

    res.status(201).json({ listing: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single listing
router.get('/:id', authenticate, async (req, res) => {
  try {
    const listing = await findListingById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const populated = await populateListing(listing);
    res.json({ listing: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update listing
router.put('/:id', authenticate, async (req, res) => {
  try {
    const listing = await findListingById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const updated = await updateListing(req.params.id, req.body);
    const populated = await populateListing(updated);

    res.json({ listing: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete listing
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const listing = await findListingById(req.params.id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check ownership
    if (listing.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    // Actually delete from database
    const data = await getDb();
    const index = data.listings.findIndex(l => l.id === req.params.id);
    if (index !== -1) {
      data.listings.splice(index, 1);
      await saveDb();
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a listing
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user.id;

    // Check if listing exists and is active
    const listing = await findListingById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Can't like your own listing
    if (listing.ownerId === userId) {
      return res.status(400).json({ error: 'Cannot like your own listing' });
    }

    // Check if already liked
    const existingLike = await findLike(userId, listingId);
    if (existingLike) {
      return res.status(400).json({ error: 'Listing already liked' });
    }

    // Create like
    const like = await createLike({ userId, listingId });

    // Check for mutual match: see if listing owner has liked any of this user's listings
    const userListings = await findListings({ ownerId: userId, isActive: true });
    const userListingIds = userListings.map(l => l.id);

    let matched = false;
    let match = null;

    if (userListingIds.length > 0) {
      // Check if owner has liked any of user's listings
      for (const userListingId of userListingIds) {
        const ownerLike = await findLike(listing.ownerId, userListingId);
        if (ownerLike) {
          // Mutual match!
          const existingMatch = await findMatchByUsers([userId, listing.ownerId], listingId);
          if (!existingMatch) {
            match = await createMatch({
              users: [userId, listing.ownerId],
              listingId: listingId,
            });
            matched = true;
          } else {
            match = existingMatch;
            matched = true;
          }
          break;
        }
      }
    }

    // Populate match with user info
    if (match) {
      const populated = await populateListing(listing);
      const owner = await findUserById(listing.ownerId);
      match = {
        ...match,
        listingId: populated,
        users: [
          { id: req.user.id, name: req.user.name, email: req.user.email },
          owner ? { id: owner.id, name: owner.name, email: owner.email } : null,
        ].filter(Boolean),
      };
    }

    res.json({ like, matched, match });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlike a listing
router.delete('/:id/like', authenticate, async (req, res) => {
  try {
    const deleted = await deleteLike(req.user.id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Like not found' });
    }
    res.json({ message: 'Like removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get liked listings (saved)
router.get('/likes/saved', authenticate, async (req, res) => {
  try {
    const likes = await findLikes({ userId: req.user.id });
    const listingIds = likes.map(like => like.listingId);
    
    const listings = [];
    for (const id of listingIds) {
      const listing = await findListingById(id);
      if (listing && listing.isActive) {
        const populated = await populateListing(listing);
        listings.push(populated);
      }
    }

    // Sort by like date (most recent first)
    listings.sort((a, b) => {
      const likeA = likes.find(l => l.listingId === a.id);
      const likeB = likes.find(l => l.listingId === b.id);
      return new Date(likeB.createdAt) - new Date(likeA.createdAt);
    });

    res.json({ listings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;