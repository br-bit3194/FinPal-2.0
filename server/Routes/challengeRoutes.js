const express = require('express');
const router = express.Router();
const {
    generateChallenges,
    getUserChallenges,
    createChallenge,
    updateChallengeProgress,
    getUserStreaks,
    updateStreaks,
    getUserAchievements,
    getChallengeStats
} = require('../Controllers/challengeController');
const protect = require('../Middlewares/authMIddleware');

// All routes are protected
router.use(protect);

// Challenge routes
router.route('/')
    .get(getUserChallenges)
    .post(createChallenge);

router.route('/generate')
    .post(generateChallenges);

router.route('/:id/progress')
    .put(updateChallengeProgress);

router.route('/streaks')
    .get(getUserStreaks);

router.route('/streaks/update')
    .post(updateStreaks);

router.route('/achievements')
    .get(getUserAchievements);

router.route('/stats')
    .get(getChallengeStats);

module.exports = router;
