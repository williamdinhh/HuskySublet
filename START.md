# 🚀 How to Start Your App

## Current Status

✅ All files are in place
✅ Dependencies installed
✅ MongoDB is installed on your system

## Issue: MongoDB Needs to be Running

Your `.env` is configured for **local MongoDB**, but it needs to be running.

### Option 1: Start Local MongoDB (Quick)

```bash
brew services start mongodb-community
```

Then verify it's running:
```bash
mongosh --eval "db.adminCommand('ping')"
```

You should see: `{ ok: 1 }`

### Option 2: Use MongoDB Atlas (Cloud - No Local Setup)

If you don't want to run MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create free cluster
3. Create database user
4. Add IP `0.0.0.0/0` to Network Access
5. Get connection string from "Connect" button
6. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/huskysublet
   ```

## Starting the App

### Step 1: Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:3001
```

**If you see a MongoDB connection error:**
- Make sure MongoDB is running (see above)
- Or switch to MongoDB Atlas

### Step 2: Start Frontend (Terminal 2)

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Step 3: Open in Browser

Go to: **http://localhost:5173**

You should see the login page! 🎉

## Quick Fixes

**"MongoDB connection error":**
```bash
# Start MongoDB
brew services start mongodb-community

# Or use Atlas instead (easier!)
```

**"Port 3001 already in use":**
- Change `PORT=3002` in `server/.env`
- Backend will run on port 3002

**"Port 5173 already in use":**
- Vite will automatically use the next available port

## Need Help?

Run the diagnostic:
```bash
node check-setup.js
```

Or see:
- `MONGODB_SETUP.md` - MongoDB setup guide
- `QUICKSTART.md` - Quick start guide
