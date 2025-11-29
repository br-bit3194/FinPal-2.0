const mongoose = require('mongoose');

const patternSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  patternReason: {
    type: String,
    required: true
  },
  lastOccurrence: {
    type: Date,
    required: true
  },
  nextExpected: {
    type: Date,
    required: true
  },
  occurrences: [{
    date: Date,
    amount: Number,
    transactionId: mongoose.Schema.Types.ObjectId
  }],
  totalOccurrences: {
    type: Number,
    default: 0
  },
  averageAmount: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
patternSchema.index({ user: 1, isActive: 1 });
patternSchema.index({ user: 1, category: 1 });
patternSchema.index({ user: 1, lastUpdated: -1 });

// Method to update pattern with new occurrence
patternSchema.methods.addOccurrence = function(transactionId, amount, date) {
  this.occurrences.push({
    date: date || new Date(),
    amount: amount,
    transactionId: transactionId
  });
  
  // Keep only last 20 occurrences to prevent array from growing too large
  if (this.occurrences.length > 20) {
    this.occurrences = this.occurrences.slice(-20);
  }
  
  this.totalOccurrences = this.occurrences.length;
  this.averageAmount = this.occurrences.reduce((sum, occ) => sum + occ.amount, 0) / this.occurrences.length;
  this.lastOccurrence = date || new Date();
  this.lastUpdated = new Date();
  
  // Update next expected date based on frequency
  this.updateNextExpected();
  
  return this.save();
};

// Method to update next expected date
patternSchema.methods.updateNextExpected = function() {
  const lastDate = new Date(this.lastOccurrence);
  let nextDate = new Date(lastDate);
  
  switch (this.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  this.nextExpected = nextDate;
};

// Method to check if pattern matches a transaction
patternSchema.methods.matchesTransaction = function(transaction) {
  const title = transaction.isIncome ? transaction.income?.title : transaction.expense?.title;
  const amount = transaction.isIncome ? transaction.income?.ammount : transaction.expense?.ammount;
  const category = transaction.expense?.category || 'others';
  
  // Check title similarity (fuzzy match)
  const titleSimilarity = this.calculateTitleSimilarity(title);
  
  // Check amount similarity (within 20% range)
  const amountSimilarity = Math.abs(this.amount - amount) / this.amount <= 0.2;
  
  // Check category match
  const categoryMatch = this.category === category;
  
  // Return confidence score
  let score = 0;
  if (titleSimilarity > 0.7) score += 0.4;
  if (amountSimilarity) score += 0.3;
  if (categoryMatch) score += 0.3;
  
  return {
    matches: score > 0.6,
    confidence: score,
    reason: `Title: ${titleSimilarity.toFixed(2)}, Amount: ${amountSimilarity}, Category: ${categoryMatch}`
  };
};

// Method to calculate title similarity using simple algorithm
patternSchema.methods.calculateTitleSimilarity = function(newTitle) {
  if (!newTitle || !this.title) return 0;
  
  const title1 = this.title.toLowerCase();
  const title2 = newTitle.toLowerCase();
  
  // Simple word overlap similarity
  const words1 = title1.split(/\s+/);
  const words2 = title2.split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = Math.max(words1.length, words2.length);
  
  return commonWords.length / totalWords;
};

const Pattern = mongoose.model('Pattern', patternSchema);

module.exports = Pattern;
