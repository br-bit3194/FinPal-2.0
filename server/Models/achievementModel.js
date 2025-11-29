const { mongoose } = require("mongoose");

const achievementSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['budget_master', 'emergency_saver', 'smart_spender', 'streak_master', 'challenge_completer', 'first_save', 'monthly_goal'],
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
        icon: {
            type: String,
            required: true
        },
        unlockedAt: {
            type: Date,
            default: Date.now
        },
        criteria: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        points: {
            type: Number,
            default: 0
        },
        rarity: {
            type: String,
            enum: ['common', 'rare', 'epic', 'legendary'],
            default: 'common'
        },
        isHidden: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient queries
achievementSchema.index({ user: 1, type: 1 });
achievementSchema.index({ user: 1, unlockedAt: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
