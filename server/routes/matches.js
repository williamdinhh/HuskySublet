import express from 'express';
import {
  findMatches,
  findMatchById,
  updateMatch,
  findMessages,
  createMessage,
  findListingById,
  findUserById,
} from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper to populate match with user and listing info
const populateMatch = async (match) => {
  const users = await Promise.all(match.users.map(id => findUserById(id)));
  const listing = await findListingById(match.listingId);
  
  return {
    ...match,
    users: users.filter(Boolean).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })),
    listingId: listing || match.listingId,
  };
};

// Helper to populate message with sender info
const populateMessage = async (message) => {
  const sender = await findUserById(message.senderId);
  return {
    ...message,
    senderId: sender ? {
      id: sender.id,
      name: sender.name,
      email: sender.email,
    } : message.senderId,
  };
};

// Get all matches for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await findMatches(userId);
    const populated = await Promise.all(matches.map(populateMatch));

    res.json({ matches: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single match
router.get('/:id', authenticate, async (req, res) => {
  try {
    const match = await findMatchById(req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is part of this match
    if (!match.users.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to view this match' });
    }

    const populated = await populateMatch(match);
    res.json({ match: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a match
router.get('/:id/messages', authenticate, async (req, res) => {
  try {
    const match = await findMatchById(req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is part of this match
    if (!match.users.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to view this match' });
    }

    const messages = await findMessages(req.params.id);
    const populated = await Promise.all(messages.map(populateMessage));

    res.json({ messages: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message
router.post('/:id/messages', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const match = await findMatchById(req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Check if user is part of this match
    if (!match.users.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized to send messages in this match' });
    }

    const message = await createMessage({
      matchId: req.params.id,
      senderId: req.user.id,
      content: content.trim(),
    });

    // Update match's lastMessageAt
    await updateMatch(req.params.id, {
      lastMessageAt: new Date().toISOString(),
    });

    const populated = await populateMessage(message);

    res.status(201).json({ message: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;