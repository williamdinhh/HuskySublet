import express from 'express';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  createUser,
  comparePassword,
  getDb,
  saveDb,
} from '../db.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev-secret-key', { expiresIn: '7d' });
};

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = await createUser({ email, password, name, preferences: {
      priceRange: { min: 0, max: 2000 },
      numRoommates: 'Any',
      preferredGenders: ['Any'],
      preferredLocations: [],
    }});

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const data = await getDb();
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get full user with password
    const fullUser = data.users.find(u => u.id === user.id);
    
    // Check password
    const isMatch = await comparePassword(password, fullUser.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    const user = await findUserById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Helper to find user by ID
const findUserById = async (id) => {
  const data = await getDb();
  return data.users.find(u => u.id === id);
};

// Update preferences
router.put('/preferences', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
    const data = await getDb();
    const userIndex = data.users.findIndex(u => u.id === decoded.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update preferences
    if (req.body.priceRange) {
      data.users[userIndex].preferences.priceRange = req.body.priceRange;
    }
    if (req.body.numRoommates) {
      data.users[userIndex].preferences.numRoommates = req.body.numRoommates;
    }
    if (req.body.preferredGenders) {
      data.users[userIndex].preferences.preferredGenders = req.body.preferredGenders;
    }
    if (req.body.preferredLocations) {
      data.users[userIndex].preferences.preferredLocations = req.body.preferredLocations;
    }

    await saveDb();

    const { password, ...userWithoutPassword } = data.users[userIndex];

    res.json({
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;