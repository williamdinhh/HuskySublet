# 🐺 HuskySublet

A Hinge-style web app for UW students to find sublets and match with roommates.

## ✨ Features

### Current Features
- **User Authentication**: Sign up, log in with secure JWT tokens
- **User Preferences**: Set your housing preferences (price range, roommates, locations)
- **Hinge-style Card Interface**: Swipe through one sublet at a time
- **Smart Filters**: Price range, neighborhood, and vibe tags
- **Like/Pass System**: Like listings you're interested in
- **Mutual Matching**: When both users like each other's listings, they match!
- **Saved Listings**: Keep track of sublets you like
- **Database Storage**: All data stored in MongoDB
- **Beautiful UI**: Hinge-inspired minimalist design

### Coming Soon
- Listing creation UI
- Matches view and chat interface
- Real-time messaging
- Image upload

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- React Router for navigation
- Vite (fast build tool)
- Hinge-inspired CSS design

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Socket.IO for real-time chat (ready)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas) - **See setup guides below**

### Quick Setup

**👉 For fastest setup, see [QUICKSTART.md](./QUICKSTART.md)**

**Or follow these steps:**

1. **Set up MongoDB:**
   - **Easiest:** Use MongoDB Atlas (cloud) - See [MONGODB_SETUP.md](./MONGODB_SETUP.md)
   - **Alternative:** Install locally - See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

2. **Backend setup:**
   ```bash
   cd server
   npm install
   # Create .env file with MongoDB connection string
   npm run dev
   ```

3. **Frontend setup:**
   ```bash
   npm install
   npm run dev
   ```

See [SETUP.md](./SETUP.md) for detailed instructions.

## 📖 Usage

1. **Sign Up**: Create an account with your email and password
2. **Set Preferences**: Choose your housing preferences (optional, can skip)
3. **Browse**: Swipe through available sublet listings
4. **Like**: Tap the heart button on listings you're interested in
5. **Match**: When a listing owner likes you back, you'll get a match!
6. **Saved**: View all your liked listings in the Saved tab

## 🏗️ Project Structure

```
HuskySublet/
├── server/          # Backend (Express + MongoDB)
├── src/
│   ├── pages/      # Login, Signup, Setup pages
│   ├── components/ # Reusable components
│   ├── contexts/   # Auth context
│   ├── utils/      # API client
│   └── BrowseApp.tsx  # Main browsing interface
└── package.json
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and sent with each API request.

## 📡 API

The backend provides REST APIs for:
- User authentication
- Listing management
- Matching system
- Messaging (ready for chat UI)

See [SETUP.md](./SETUP.md) for full API documentation.

## 🎨 Design

Inspired by Hinge's clean, minimalist aesthetic:
- Black & white color scheme
- Soft lilac/mauve accents
- Smooth animations and transitions
- Full-screen card experience
- Fixed bottom action bar

## 📝 Notes

- Requires MongoDB connection (local or Atlas)
- Images currently use placeholder URLs
- All API endpoints (except auth) require authentication
- JWT tokens expire after 7 days

## 🤝 Contributing

This is a learning project. Feel free to fork and extend!

## 📄 License

MIT