import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: { unique: true }, // Use index instead of unique property
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: function(this: any) {
      return !this.provider; // Password required only if no OAuth provider
    },
  },
  image: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    enum: ['github', 'google', 'credentials'],
    default: 'credentials',
  },
  providerId: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
UserSchema.index({ providerId: 1, provider: 1 });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);