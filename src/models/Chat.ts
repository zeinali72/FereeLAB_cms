import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  model: {
    type: String,
    default: null,
  },
  replyTo: {
    type: String,
    default: null,
  },
  isStreaming: {
    type: Boolean,
    default: false,
  },
});

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Chat',
  },
  messages: [MessageSchema],
  model: {
    id: String,
    name: String,
    provider: String,
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
ChatSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Ensure userId is set
  if (!this.userId) {
    return next(new Error('userId is required'));
  }
  
  next();
});

// Create indexes for better performance and security
ChatSchema.index({ userId: 1, createdAt: -1 });
ChatSchema.index({ userId: 1, isActive: 1 });
ChatSchema.index({ userId: 1, _id: 1 }); // Compound index for secure lookups

// Static method to find chats securely by user
ChatSchema.statics.findByUser = function(userId: string, options: any = {}) {
  return this.find({ 
    userId, 
    isActive: true,
    ...options 
  });
};

// Instance method to check if user owns this chat
ChatSchema.methods.isOwnedBy = function(userId: string) {
  return this.userId.toString() === userId;
};

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);