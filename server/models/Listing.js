import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  neighborhood: {
    type: String,
    enum: ['U-District', 'Capitol Hill', 'Northgate', 'Other'],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  vibes: {
    type: [String],
    default: [],
  },
  promptQuestion: {
    type: String,
    required: true,
  },
  promptAnswer: {
    type: String,
    required: true,
  },
  preferences: {
    numRoommates: {
      type: String,
      enum: ['0', '1', '2', '3+', 'Any'],
      default: 'Any',
    },
    preferredGenders: {
      type: [String],
      enum: ['Male', 'Female', 'Non-binary', 'Any'],
      default: ['Any'],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Listing', listingSchema);
