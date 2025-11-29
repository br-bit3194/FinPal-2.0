const challengeService = require('../Services/challengeService');
const asyncHandler = require('express-async-handler');

// @desc    Generate personalized challenges for user
// @route   POST /api/challenges/generate
// @access  Private
const generateChallenges = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { expenses, incomes } = req.body;
    
    if (!expenses || !incomes) {
        res.status(400);
        throw new Error('Expenses and incomes data required');
    }
    
    const challenges = await challengeService.generatePersonalizedChallenges(userId, expenses, incomes);
    
    res.status(200).json({
        success: true,
        data: challenges,
        message: `Generated ${challenges.length} personalized challenges`
    });
});

// @desc    Get user's active challenges
// @route   GET /api/challenges
// @access  Private
const getUserChallenges = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const challenges = await challengeService.getUserChallenges(userId);
    
    res.status(200).json({
        success: true,
        data: challenges,
        count: challenges.length
    });
});

// @desc    Create a new challenge
// @route   POST /api/challenges
// @access  Private
const createChallenge = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const challengeData = { ...req.body, user: userId };
        
        console.log('Creating challenge with data:', challengeData);
        
        const challenge = await challengeService.createChallenge(challengeData);
        
        console.log('Challenge created successfully:', challenge);
        
        res.status(201).json({
            success: true,
            data: challenge,
            message: 'Challenge created successfully'
        });
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create challenge'
        });
    }
});

// @desc    Update challenge progress
// @route   PUT /api/challenges/:id/progress
// @access  Private
const updateChallengeProgress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0) {
        res.status(400);
        throw new Error('Valid progress value required');
    }
    
    const challenge = await challengeService.updateChallengeProgress(id, progress);
    
    res.status(200).json({
        success: true,
        data: challenge,
        message: 'Challenge progress updated successfully'
    });
});

// @desc    Get user streaks
// @route   GET /api/challenges/streaks
// @access  Private
const getUserStreaks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const streaks = await challengeService.getUserStreaks(userId);
    
    res.status(200).json({
        success: true,
        data: streaks,
        count: streaks.length
    });
});

// @desc    Update user streaks
// @route   POST /api/challenges/streaks/update
// @access  Private
const updateStreaks = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { expenses, incomes } = req.body;
    
    if (!expenses || !incomes) {
        res.status(400);
        throw new Error('Expenses and incomes data required');
    }
    
    const streaks = await challengeService.updateStreaks(userId, expenses, incomes);
    
    res.status(200).json({
        success: true,
        data: streaks,
        message: 'Streaks updated successfully'
    });
});

// @desc    Get user achievements
// @route   GET /api/challenges/achievements
// @access  Private
const getUserAchievements = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const achievements = await challengeService.getUserAchievements(userId);
    
    res.status(200).json({
        success: true,
        data: achievements,
        count: achievements.length
    });
});

// @desc    Get challenge statistics
// @route   GET /api/challenges/stats
// @access  Private
const getChallengeStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const stats = await challengeService.getChallengeStats(userId);
    
    res.status(200).json({
        success: true,
        data: stats
    });
});

module.exports = {
    generateChallenges,
    getUserChallenges,
    createChallenge,
    updateChallengeProgress,
    getUserStreaks,
    updateStreaks,
    getUserAchievements,
    getChallengeStats
};
