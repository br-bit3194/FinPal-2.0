import { api } from '../../api/api';

class ChallengeService {
    // Generate personalized challenges
    async generateChallenges(expenses, incomes) {
        const response = await api.post('/challenges/generate', {
            expenses,
            incomes
        });
        return response.data;
    }

    // Get user challenges
    async getUserChallenges() {
        const response = await api.get('/challenges');
        return response.data;
    }

    // Create a new challenge
    async createChallenge(challengeData) {
        const response = await api.post('/challenges', challengeData);
        return response.data;
    }

    // Update challenge progress
    async updateChallengeProgress(challengeId, progress) {
        const response = await api.put(`/challenges/${challengeId}/progress`, {
            progress
        });
        return response.data;
    }

    // Get user streaks
    async getUserStreaks() {
        const response = await api.get('/challenges/streaks');
        return response.data;
    }

    // Update streaks
    async updateStreaks(expenses, incomes) {
        const response = await api.post('/challenges/streaks/update', {
            expenses,
            incomes
        });
        return response.data;
    }

    // Get user achievements
    async getUserAchievements() {
        const response = await api.get('/challenges/achievements');
        return response.data;
    }

    // Get challenge statistics
    async getChallengeStats() {
        const response = await api.get('/challenges/stats');
        return response.data;
    }
}

export default new ChallengeService();
