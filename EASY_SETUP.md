# 🎉 Super Easy Setup - No Database Needed!

## What Changed?

I switched from MongoDB to a **simple file-based database**! 

✅ **No MongoDB installation needed**
✅ **No configuration needed**
✅ **Just works out of the box!**

## How to Start

### 1. Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

You should see:
```
✅ Database initialized (file-based JSON)
🚀 Server running on http://localhost:3001
📁 Database: server/data/db.json
```

### 2. Start Frontend (Terminal 2)

```bash
npm run dev
```

### 3. Open Browser

Go to: **http://localhost:5173**

**That's it!** 🎉

---

## How It Works

All your data is stored in a simple JSON file: `server/data/db.json`

- Users, listings, matches, messages - everything in one file
- Automatically created when you start the server
- No database server needed
- Perfect for development and small projects

---

## What's in the Database File?

The `server/data/db.json` file contains:
- `users` - All user accounts
- `listings` - All housing listings
- `likes` - User likes on listings
- `matches` - Mutual matches between users
- `messages` - Chat messages

You can even open it and look at the data if you want!

---

## Need to Reset?

Just delete `server/data/db.json` and restart the server:
```bash
rm server/data/db.json
npm run dev
```

This will create a fresh, empty database.

---

## That's It!

No more MongoDB setup headaches. Just start the servers and go! 🚀
