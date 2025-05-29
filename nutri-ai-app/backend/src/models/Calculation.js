const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  food: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  model: {
    type: String,
    required: true,
    enum: ['gpt-4', 'gpt-3.5-turbo', 'claude', 'gemini', 'deepseek']
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['single', 'consistency_test'],
    default: 'single'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  responseTime: {
    type: Number,
    default: 0
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Indexes
calculationSchema.index({ userId: 1, createdAt: -1 });
calculationSchema.index({ food: 'text' });
calculationSchema.index({ model: 1, createdAt: -1 });

// Virtual for formatted date
calculationSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

calculationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Calculation', calculationSchema);
