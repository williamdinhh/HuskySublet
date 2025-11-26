import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {
  users: [],
  listings: [],
  likes: [],
  matches: [],
  messages: [],
});

// Database will be initialized on first read

// Helper functions
export const getDb = async () => {
  await db.read();
  // Ensure default structure
  if (!db.data) {
    db.data = {
      users: [],
      listings: [],
      likes: [],
      matches: [],
      messages: [],
    };
    await db.write();
  }
  return db.data;
};

export const saveDb = async () => {
  await db.write();
};

// User helpers
export const findUserById = async (id) => {
  const data = await getDb();
  return data.users.find(u => u.id === id);
};

export const findUserByEmail = async (email) => {
  const data = await getDb();
  return data.users.find(u => u.email === email.toLowerCase());
};

export const createUser = async (userData) => {
  const data = await getDb();
  const user = {
    id: Date.now().toString(),
    ...userData,
    email: userData.email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  // Hash password if provided
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  data.users.push(user);
  await saveDb();
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Listing helpers
export const findListings = async (filter = {}) => {
  const data = await getDb();
  let listings = [...data.listings];
  
  if (filter.isActive !== undefined) {
    listings = listings.filter(l => l.isActive === filter.isActive);
  }
  if (filter.ownerId) {
    listings = listings.filter(l => l.ownerId === filter.ownerId);
  }
  if (filter.excludeOwnerId) {
    listings = listings.filter(l => l.ownerId !== filter.excludeOwnerId);
  }
  if (filter.excludeIds && filter.excludeIds.length > 0) {
    listings = listings.filter(l => !filter.excludeIds.includes(l.id));
  }
  
  return listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const findListingById = async (id) => {
  const data = await getDb();
  return data.listings.find(l => l.id === id);
};

export const createListing = async (listingData) => {
  const data = await getDb();
  const listing = {
    id: Date.now().toString(),
    ...listingData,
    createdAt: new Date().toISOString(),
    isActive: listingData.isActive !== undefined ? listingData.isActive : true,
  };
  data.listings.push(listing);
  await saveDb();
  return listing;
};

export const updateListing = async (id, updates) => {
  const data = await getDb();
  const index = data.listings.findIndex(l => l.id === id);
  if (index === -1) return null;
  data.listings[index] = { ...data.listings[index], ...updates };
  await saveDb();
  return data.listings[index];
};

// Like helpers
export const findLikes = async (filter = {}) => {
  const data = await getDb();
  let likes = [...data.likes];
  
  if (filter.userId) {
    likes = likes.filter(l => l.userId === filter.userId);
  }
  if (filter.listingId) {
    likes = likes.filter(l => l.listingId === filter.listingId);
  }
  
  return likes;
};

export const findLike = async (userId, listingId) => {
  const data = await getDb();
  return data.likes.find(l => l.userId === userId && l.listingId === listingId);
};

export const createLike = async (likeData) => {
  const data = await getDb();
  // Check if already exists
  const existing = await findLike(likeData.userId, likeData.listingId);
  if (existing) return existing;
  
  const like = {
    id: Date.now().toString(),
    ...likeData,
    createdAt: new Date().toISOString(),
  };
  data.likes.push(like);
  await saveDb();
  return like;
};

export const deleteLike = async (userId, listingId) => {
  const data = await getDb();
  const index = data.likes.findIndex(l => l.userId === userId && l.listingId === listingId);
  if (index === -1) return false;
  data.likes.splice(index, 1);
  await saveDb();
  return true;
};

// Match helpers
export const findMatches = async (userId) => {
  const data = await getDb();
  return data.matches.filter(m => m.users.includes(userId))
    .sort((a, b) => new Date(b.lastMessageAt || b.matchedAt) - new Date(a.lastMessageAt || a.matchedAt));
};

export const findMatchById = async (id) => {
  const data = await getDb();
  return data.matches.find(m => m.id === id);
};

export const findMatchByUsers = async (userIds, listingId) => {
  const data = await getDb();
  const sortedUsers = [...userIds].sort();
  return data.matches.find(m => {
    const matchUsers = [...m.users].sort();
    return matchUsers[0] === sortedUsers[0] && 
           matchUsers[1] === sortedUsers[1] &&
           m.listingId === listingId;
  });
};

export const createMatch = async (matchData) => {
  const data = await getDb();
  const match = {
    id: Date.now().toString(),
    users: [...matchData.users].sort(),
    ...matchData,
    matchedAt: new Date().toISOString(),
    lastMessageAt: matchData.lastMessageAt || new Date().toISOString(),
  };
  data.matches.push(match);
  await saveDb();
  return match;
};

export const updateMatch = async (id, updates) => {
  const data = await getDb();
  const index = data.matches.findIndex(m => m.id === id);
  if (index === -1) return null;
  data.matches[index] = { ...data.matches[index], ...updates };
  await saveDb();
  return data.matches[index];
};

// Message helpers
export const findMessages = async (matchId) => {
  const data = await getDb();
  return data.messages
    .filter(m => m.matchId === matchId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const createMessage = async (messageData) => {
  const data = await getDb();
  const message = {
    id: Date.now().toString(),
    ...messageData,
    createdAt: new Date().toISOString(),
    read: false,
  };
  data.messages.push(message);
  await saveDb();
  return message;
};
