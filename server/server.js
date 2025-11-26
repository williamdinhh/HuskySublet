import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getDb } from './db.js';

import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import matchRoutes from './routes/matches.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/matches', matchRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database (creates file if it doesn't exist)
const initDB = async () => {
  try {
    const data = await getDb();
    console.log('✅ Database initialized (file-based JSON)');
    
    // Seed initial data if no listings exist
    if (data.listings.length === 0 && data.users.length < 10) {
      console.log('🌱 Seeding initial data...');
      try {
        const seedModule = await import('./seed-data.js');
        if (seedModule.seedDatabase) {
          await seedModule.seedDatabase();
        }
      } catch (err) {
        console.log('⚠️  Could not auto-seed database. Run "npm run seed" manually if needed.');
        console.error(err);
      }
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
};

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-match', (matchId) => {
    socket.join(`match-${matchId}`);
  });

  socket.on('leave-match', (matchId) => {
    socket.leave(`match-${matchId}`);
  });

  socket.on('send-message', async (data) => {
    // Broadcast to all users in the match room
    io.to(`match-${data.matchId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;

initDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Database: server/data/db.json`);
  });
});

export { io };