import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: function() {
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
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ providerId: 1, provider: 1 });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);