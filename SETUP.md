# HuskySublet - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
  - **👉 See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed MongoDB setup instructions**

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # If env.example exists:
   cp env.example .env
   
   # Or create it manually with these contents:
   ```
   
   Create a `.env` file in the `server/` directory with:

4. **Edit `.env` with your settings:**
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/huskysublet
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

5. **Start MongoDB** (if running locally):
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community

   # Or run directly
   mongod
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional, defaults to localhost:3001):**
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:5173`

## 📁 Project Structure

```
HuskySublet/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Match.js
│   │   ├── Like.js
│   │   └── Message.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── listings.js
│   │   └── matches.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.js
│   └── server.js          # Main server file
│
├── src/                   # Frontend React app
│   ├── pages/            # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Setup.tsx
│   ├── components/       # Reusable components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── utils/            # Utilities
│   │   └── api.ts        # API client
│   ├── BrowseApp.tsx     # Main browsing interface
│   └── App.tsx           # Router setup
│
└── package.json
```

## 🔐 Authentication Flow

1. **Sign Up:** User creates account with email, password, and name
2. **Login:** User logs in with email and password (receives JWT token)
3. **Setup Preferences:** User sets housing preferences (optional)
4. **Browse:** User browses listings (authenticated)
5. **Like:** User likes listings they're interested in
6. **Match:** When both users like each other's listings, they match
7. **Chat:** Matched users can chat with each other

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Log in
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update preferences

### Listings
- `GET /api/listings/browse` - Get all listings to browse
- `GET /api/listings/my-listings` - Get user's own listings
- `POST /api/listings` - Create new listing
- `GET /api/listings/:id` - Get single listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `POST /api/listings/:id/like` - Like a listing
- `DELETE /api/listings/:id/like` - Unlike a listing
- `GET /api/listings/likes/saved` - Get saved/liked listings

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get single match
- `GET /api/matches/:id/messages` - Get messages for match
- `POST /api/matches/:id/messages` - Send message

## 🗄️ Database Models

### User
- email, password (hashed), name
- preferences (priceRange, numRoommates, preferredGenders, preferredLocations)

### Listing
- ownerId, title, price, neighborhood
- startDate, endDate, images, vibes
- promptQuestion, promptAnswer
- preferences (numRoommates, preferredGenders)

### Match
- users[] (2 users)
- listingId
- matchedAt, lastMessageAt

### Like
- userId, listingId

### Message
- matchId, senderId, content
- createdAt, read

## 🎨 Features Implemented

✅ User authentication (signup/login)
✅ User preference setup
✅ Browse listings
✅ Like/unlike listings
✅ Mutual matching system
✅ Saved listings view
✅ Protected routes
✅ JWT token authentication
✅ MongoDB database integration

## 🚧 Coming Soon

- Listing creation UI
- Matches view UI
- Real-time chat interface
- Image upload functionality
- User profile management

## 🐛 Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running: `mongosh` to test
- Check MONGODB_URI in `.env` file
- For MongoDB Atlas, use the connection string from your cluster

**CORS errors:**
- Make sure CLIENT_URL in server `.env` matches your frontend URL
- Default is `http://localhost:5173`

**Port already in use:**
- Change PORT in server `.env` file
- Update VITE_API_URL in frontend `.env` to match

## 📝 Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcryptjs
- All API routes (except auth) require authentication
- Images currently use placeholder URLs from Unsplash
