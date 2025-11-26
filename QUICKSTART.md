# 🚀 Quick Start Guide

## Fastest Setup (MongoDB Atlas - Recommended)

### 1. Set Up MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up and create a **FREE** cluster
3. Create a database user (username + password)
4. Add IP `0.0.0.0/0` to Network Access (for development)
5. Get connection string from "Connect" → "Connect your application"

### 2. Backend Setup (2 minutes)

```bash
cd server
npm install
```

Create `server/.env` file:
```env
PORT=3001
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/huskysublet?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-key-12345
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `cluster0.xxxxx` with your Atlas values.

Start backend:
```bash
npm run dev
```

You should see: `✅ MongoDB connected`

### 3. Frontend Setup (1 minute)

In a new terminal:
```bash
# From project root
npm install
npm run dev
```

### 4. Use the App!

Open http://localhost:5173 in your browser and sign up!

---

## Alternative: Local MongoDB

If you prefer local MongoDB, see [MONGODB_SETUP.md](./MONGODB_SETUP.md) for installation steps.

For macOS with Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Then use this in `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/huskysublet
```

---

## Troubleshooting

**"MongoDB connection error"**
- Check your connection string in `server/.env`
- Make sure MongoDB is running (if local)
- Verify network access in Atlas (if using Atlas)

**"Port already in use"**
- Change `PORT=3001` to a different port in `.env`
- Update `VITE_API_URL` in frontend if needed

**Need more help?**
- See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed MongoDB instructions
- See [SETUP.md](./SETUP.md) for full setup guide
