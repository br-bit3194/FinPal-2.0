const { mongoose } = require("mongoose");

const streakSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['savings', 'budget_adherence', 'no_delivery', 'no_impulse_shopping', 'under_budget', 'category_reduction'],
            required: true
        },
        category: {
            type: String,
            enum: ['food', 'rent', 'travel', 'shopping', 'entertainment', 'others', 'general'],
            default: 'general'
        },
        currentStreak: {
            type: Number,
            default: 0
        },
        longestStreak: {
            type: Number,
            default: 0
        },
        lastActivityDate: {
            type: Date,
            default: Date.now
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        },
        target: {
            type: Number,
            required: true
        },
        targetUnit: {
            type: String,
            enum: ['days', 'amount', 'percentage'],
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
streakSchema.index({ user: 1, type: 1, isActive: 1 });
streakSchema.index({ user: 1, lastActivityDate: 1 });

module.exports = mongoose.model('Streak', streakSchema);
