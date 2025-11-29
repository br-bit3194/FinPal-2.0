const Pattern = require('../Models/patternModel');
const Finance = require('../Models/financeModel');

class PatternService {
  // Get optimal data range based on transaction count
  static getOptimalDataRange(transactionCount) {
    if (transactionCount < 100) return 'all';           // New users: full analysis
    if (transactionCount < 500) return '6months';       // Growing users: 6 months
    if (transactionCount < 1000) return '3months';      // Active users: 3 months
    return '1month';                                     // Power users: 1 month
  }

  // Get transactions within optimal range
  static async getTransactionsInRange(userId, range) {
    const query = { user: userId };
    
    if (range !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (range) {
        case '1month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          startDate.setMonth(now.getMonth() - 6);
          break;
      }
      
      query.createdAt = { $gte: startDate };
    }
    
    return await Finance.find(query).populate('income').populate('expense');
  }

  // Quick pattern check for immediate matches
  static async quickPatternCheck(transaction) {
    const userId = transaction.user;
    const existingPatterns = await Pattern.find({ user: userId, isActive: true });
    
    for (const pattern of existingPatterns) {
      const match = pattern.matchesTransaction(transaction);
      if (match.matches) {
        return { pattern, match };
      }
    }
    
    return null;
  }

  // Lightweight pattern analysis with recent data
  static async lightPatternAnalysis(userId, recentTransactions) {
    // Simple pattern detection without AI
    const patterns = [];
    const seenTitles = new Set();
    
    recentTransactions.forEach(transaction => {
      const title = transaction.isIncome ? transaction.income?.title : transaction.expense?.title;
      const amount = transaction.isIncome ? transaction.income?.ammount : transaction.expense?.ammount;
      const category = transaction.expense?.category || 'others';
      
      if (title && !seenTitles.has(title.toLowerCase())) {
        seenTitles.add(title.toLowerCase());
        
        // Simple frequency detection
        const frequency = this.detectSimpleFrequency(recentTransactions, title);
        
        patterns.push({
          title: title,
          amount: amount,
          type: transaction.isIncome ? 'income' : 'expense',
          category: category,
          frequency: frequency,
          confidence: 0.6, // Basic confidence
          patternReason: 'Basic pattern detection from recent data'
        });
      }
    });
    
    return patterns;
  }

  // Detect simple frequency without complex analysis
  static detectSimpleFrequency(transactions, title) {
    const matchingTransactions = transactions.filter(t => {
      const tTitle = t.isIncome ? t.income?.title : t.expense?.title;
      return tTitle && tTitle.toLowerCase().includes(title.toLowerCase());
    });
    
    if (matchingTransactions.length >= 3) {
      // Check if transactions are roughly monthly
      const dates = matchingTransactions.map(t => new Date(t.createdAt)).sort();
      const avgDaysBetween = (dates[dates.length - 1] - dates[0]) / (dates.length - 1) / (1000 * 60 * 60 * 24);
      
      if (avgDaysBetween < 7) return 'daily';
      if (avgDaysBetween < 14) return 'weekly';
      if (avgDaysBetween < 45) return 'monthly';
      if (avgDaysBetween < 120) return 'quarterly';
      return 'yearly';
    }
    
    return 'monthly'; // Default
  }

  // Full AI pattern analysis (expensive, run periodically)
  static async runFullPatternAnalysis(userId) {
    try {
      // Get all transactions for comprehensive analysis
      const allTransactions = await Finance.find({ user: userId })
        .populate('income')
        .populate('expense');
      
      if (allTransactions.length === 0) return [];
      
      // Call AI service for comprehensive analysis
      const aiPatterns = await this.callAIForPatterns(allTransactions);
      
      // Store or update patterns in database
      await this.storePatterns(userId, aiPatterns);
      
      return aiPatterns;
    } catch (error) {
      console.error('Full pattern analysis failed:', error);
      return [];
    }
  }

  // Call AI service for pattern detection
  static async callAIForPatterns(transactions) {
    // This would call your existing AI service
    // For now, return empty array - implement based on your AI setup
    return [];
  }

  // Store patterns in database
  static async storePatterns(userId, patterns) {
    for (const pattern of patterns) {
      await Pattern.findOneAndUpdate(
        { user: userId, title: pattern.title, type: pattern.type },
        {
          ...pattern,
          user: userId,
          lastOccurrence: new Date(),
          nextExpected: this.calculateNextExpected(new Date(), pattern.frequency),
          averageAmount: pattern.amount,
          totalOccurrences: 1,
          occurrences: [{
            date: new Date(),
            amount: pattern.amount,
            transactionId: null
          }]
        },
        { upsert: true, new: true }
      );
    }
  }

  // Calculate next expected date
  static calculateNextExpected(lastDate, frequency) {
    const nextDate = new Date(lastDate);
    
    switch (frequency) {
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
    
    return nextDate;
  }

  // Check if full analysis should be run
  static async shouldRunFullAnalysis(userId) {
    const lastAnalysis = await Pattern.findOne({ user: userId })
      .sort({ lastUpdated: -1 })
      .select('lastUpdated');
    
    if (!lastAnalysis) return true;
    
    const daysSinceLastAnalysis = (Date.now() - lastAnalysis.lastUpdated) / (1000 * 60 * 60 * 24);
    
    // Run full analysis every 7 days
    return daysSinceLastAnalysis >= 7;
  }

  // Get user patterns with smart caching
  static async getUserPatterns(userId) {
    // First try to get from database
    const dbPatterns = await Pattern.find({ user: userId, isActive: true })
      .sort({ confidence: -1, lastUpdated: -1 });
    
    if (dbPatterns.length > 0) {
      return dbPatterns;
    }
    
    // If no patterns in DB, run light analysis
    const transactionCount = await Finance.countDocuments({ user: userId });
    const range = this.getOptimalDataRange(transactionCount);
    const recentTransactions = await this.getTransactionsInRange(userId, range);
    
    return await this.lightPatternAnalysis(userId, recentTransactions);
  }

  // Update patterns when new transaction is added
  static async updatePatternsWithTransaction(userId, transaction) {
    // Quick check for existing pattern match
    const quickMatch = await this.quickPatternCheck(transaction);
    
    if (quickMatch) {
      // Update existing pattern
      const { pattern, match } = quickMatch;
      await pattern.addOccurrence(
        transaction._id,
        transaction.isIncome ? transaction.income.ammount : transaction.expense.ammount,
        transaction.createdAt
      );
      return { updated: true, pattern };
    }
    
    // Check if we should create new pattern
    const shouldCreate = await this.shouldCreateNewPattern(userId, transaction);
    
    if (shouldCreate) {
      // Create new pattern (lightweight)
      const newPattern = await this.createLightweightPattern(transaction);
      return { created: true, pattern: newPattern };
    }
    
    return { updated: false, created: false };
  }

  // Check if new pattern should be created
  static async shouldCreateNewPattern(userId, transaction) {
    const title = transaction.isIncome ? transaction.income?.title : transaction.expense?.title;
    const amount = transaction.isIncome ? transaction.income?.ammount : transaction.expense?.ammount;
    
    // Check if similar transactions exist
    const similarTransactions = await Finance.find({
      user: userId,
      $or: [
        { 'income.title': { $regex: title, $options: 'i' } },
        { 'expense.title': { $regex: title, $options: 'i' } }
      ]
    }).limit(3);
    
    return similarTransactions.length >= 2;
  }

  // Create lightweight pattern without AI
  static async createLightweightPattern(transaction) {
    const title = transaction.isIncome ? transaction.income?.title : transaction.expense?.title;
    const amount = transaction.isIncome ? transaction.income?.ammount : transaction.expense?.ammount;
    const category = transaction.expense?.category || 'others';
    
    return {
      title: title,
      amount: amount,
      type: transaction.isIncome ? 'income' : 'expense',
      category: category,
      frequency: 'monthly', // Default
      confidence: 0.5, // Low confidence for new patterns
      patternReason: 'New pattern detected from recent transactions'
    };
  }
}

module.exports = PatternService;
