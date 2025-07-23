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
  next();
});

// Create indexes
ChatSchema.index({ userId: 1, createdAt: -1 });
ChatSchema.index({ userId: 1, isActive: 1 });

export const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);