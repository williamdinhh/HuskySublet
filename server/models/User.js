import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  preferences: {
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 2000 },
    },
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
    preferredLocations: {
      type: [String],
      enum: ['U-District', 'Capitol Hill', 'Northgate', 'Other'],
      default: [],
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
