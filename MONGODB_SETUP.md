# MongoDB Setup Guide for HuskySublet

This guide covers two ways to set up MongoDB: **Local Installation** and **MongoDB Atlas (Cloud)**.

## Option 1: MongoDB Atlas (Recommended - Easiest)

MongoDB Atlas is a cloud-hosted MongoDB service. No local installation needed!

### Steps:

1. **Create a free MongoDB Atlas account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with your email

2. **Create a new cluster:**
   - After signing up, click "Build a Database"
   - Choose the **FREE tier (M0)** option
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Set up database access:**
   - In the left sidebar, go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Atlas Admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure network access:**
   - In the left sidebar, go to "Network Access"
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   - ⚠️ For production, restrict to specific IPs

5. **Get your connection string:**
   - Go back to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

6. **Update your `.env` file:**
   ```bash
   cd server
   ```
   Open or create `server/.env` and add:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/huskysublet?retryWrites=true&w=majority
   ```
   Replace:
   - `YOUR_USERNAME` with your database username
   - `YOUR_PASSWORD` with your database password
   - `cluster0.xxxxx` with your actual cluster URL
   - The database name `huskysublet` is optional but recommended

7. **Done!** Your server will connect to MongoDB Atlas automatically.

---

## Option 2: Local MongoDB Installation

Install MongoDB on your local machine.

### macOS (using Homebrew):

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install MongoDB:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

3. **Start MongoDB:**
   ```bash
   brew services start mongodb-community
   ```

4. **Verify it's running:**
   ```bash
   mongosh
   ```
   You should see a MongoDB shell prompt. Type `exit` to leave.

5. **Update your `.env` file:**
   ```bash
   cd server
   ```
   Open or create `server/.env` and add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/huskysublet
   ```

6. **Start MongoDB on boot (optional):**
   MongoDB will start automatically if you used `brew services start`. Otherwise:
   ```bash
   brew services start mongodb-community
   ```

### Windows:

1. **Download MongoDB:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and run the installer

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (optional GUI tool)

3. **Start MongoDB:**
   - MongoDB should start automatically as a service
   - Or open Services (Win+R → `services.msc`) and start "MongoDB"

4. **Verify it's running:**
   Open Command Prompt or PowerShell:
   ```bash
   mongosh
   ```
   You should see a MongoDB shell prompt. Type `exit` to leave.

5. **Update your `.env` file:**
   ```bash
   cd server
   ```
   Open or create `server/.env` and add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/huskysublet
   ```

### Linux (Ubuntu/Debian):

1. **Import MongoDB GPG key:**
   ```bash
   curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   ```

2. **Add MongoDB repository:**
   ```bash
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB:**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Start on boot
   ```

5. **Verify it's running:**
   ```bash
   mongosh
   ```

6. **Update your `.env` file:**
   ```bash
   cd server
   ```
   Open or create `server/.env` and add:
   ```env
   MONGODB_URI=mongodb://localhost:27017/huskysublet
   ```

---

## Verify Your Setup

1. **Make sure your `.env` file exists:**
   ```bash
   cd server
   ls -la .env
   ```

2. **Start your backend server:**
   ```bash
   npm run dev
   ```

3. **Look for this message:**
   ```
   ✅ MongoDB connected
   🚀 Server running on http://localhost:3001
   ```

   If you see an error, check:
   - MongoDB is running (if local)
   - Connection string in `.env` is correct
   - Network access is allowed (if using Atlas)
   - Credentials are correct

---

## Troubleshooting

### "MongoServerError: Authentication failed"
- Check your username and password in the connection string
- Make sure special characters in password are URL-encoded (e.g., `@` becomes `%40`)

### "MongooseServerSelectionError: connect ECONNREFUSED"
- MongoDB is not running locally
- For local: Start MongoDB with `brew services start mongodb-community` (macOS) or check Windows Services
- For Atlas: Check network access settings

### "MongoNetworkError: getaddrinfo ENOTFOUND"
- Connection string is incorrect
- Check the cluster URL in Atlas dashboard

### Connection string format
- Local: `mongodb://localhost:27017/huskysublet`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/huskysublet`

### Password with special characters
If your password contains special characters like `@`, `#`, `%`, encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- Or use MongoDB Atlas connection string builder

---

## Quick Test

Once MongoDB is set up, you can test it:

1. Start your server: `cd server && npm run dev`
2. Open http://localhost:5173 in your browser
3. Try signing up a new user
4. Check your MongoDB database - you should see a new user document!

### Using MongoDB Compass (Optional GUI):
- Download from: https://www.mongodb.com/products/compass
- Connect with your connection string
- Browse your databases and collections visually

---

## Next Steps

After MongoDB is set up:
1. ✅ Create `server/.env` file with your connection string
2. ✅ Start your backend: `cd server && npm run dev`
3. ✅ Start your frontend: `npm run dev`
4. ✅ Sign up and start using the app!

For more help, see the main [SETUP.md](./SETUP.md) file.
