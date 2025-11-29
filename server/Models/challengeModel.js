const { mongoose } = require("mongoose");

const challengeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['savings', 'spending_reduction', 'habit_building', 'category_specific'],
            required: true
        },
        category: {
            type: String,
            enum: ['food', 'rent', 'travel', 'shopping', 'entertainment', 'others', 'general'],
            default: 'general'
        },
        targetAmount: {
            type: Number,
            required: function() { return this.type === 'savings' || this.type === 'spending_reduction'; }
        },
        targetPercentage: {
            type: Number,
            required: function() { return this.type === 'spending_reduction'; }
        },
        targetDays: {
            type: Number,
            required: function() { return this.type === 'habit_building'; }
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        currentProgress: {
            type: Number,
            default: 0
        },
        targetProgress: {
            type: Number,
            required: true
        },
        progressUnit: {
            type: String,
            enum: ['amount', 'percentage', 'days', 'count'],
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'failed', 'expired'],
            default: 'active'
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        points: {
            type: Number,
            default: 0
        },
        isAI: {
            type: Boolean,
            default: false
        },
        aiPrompt: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
challengeSchema.index({ user: 1, status: 1, endDate: 1 });
challengeSchema.index({ user: 1, type: 1, category: 1 });

module.exports = mongoose.model('Challenge', challengeSchema);
