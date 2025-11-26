import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  matchedAt: {
    type: Date,
    default: Date.now,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure users array has exactly 2 users
matchSchema.pre('save', function (next) {
  if (this.users.length !== 2) {
    return next(new Error('Match must have exactly 2 users'));
  }
  // Sort user IDs to prevent duplicate matches
  this.users.sort();
  next();
});

// Compound index to prevent duplicate matches
matchSchema.index({ users: 1, listingId: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);
