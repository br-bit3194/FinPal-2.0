const Challenge = require('../Models/challengeModel');
const Streak = require('../Models/streakModel');
const Achievement = require('../Models/achievementModel');
const Expense = require('../Models/expenseModel');
const Income = require('../Models/incomeModel');
const dayjs = require('dayjs');

class ChallengeService {
    // Generate AI-powered personalized challenges
    async generatePersonalizedChallenges(userId, userExpenses, userIncomes) {
        try {
            const challenges = [];
            const currentDate = dayjs();
            
            // Analyze spending patterns
            const monthlyExpenses = this.analyzeMonthlyExpenses(userExpenses);
            const spendingCategories = this.analyzeSpendingCategories(userExpenses);
            const savingsRate = this.calculateSavingsRate(userIncomes, userExpenses);
            
            // 1. Weekly Savings Challenge
            if (savingsRate < 0.3) { // Less than 30% savings rate
                const weeklyTarget = Math.max(500, Math.floor(userIncomes[0]?.ammount * 0.1) || 1000);
                challenges.push({
                    title: `Save ₹${weeklyTarget} this week`,
                    description: `Boost your savings by setting aside ₹${weeklyTarget} this week. Small steps lead to big results!`,
                    type: 'savings',
                    targetAmount: weeklyTarget,
                    targetProgress: weeklyTarget,
                    progressUnit: 'amount',
                    endDate: currentDate.add(7, 'day').toDate(),
                    difficulty: 'easy',
                    points: 50,
                    isAI: true,
                    aiPrompt: 'Generated based on low savings rate'
                });
            }
            
            // 2. Category-specific spending reduction
            const topSpendingCategory = Object.keys(spendingCategories).reduce((a, b) => 
                spendingCategories[a] > spendingCategories[b] ? a : b
            );
            
            if (spendingCategories[topSpendingCategory] > 5000) {
                const reductionTarget = Math.floor(spendingCategories[topSpendingCategory] * 0.15);
                challenges.push({
                    title: `Reduce ${topSpendingCategory} spending by 15%`,
                    description: `Cut your ${topSpendingCategory} expenses by ₹${reductionTarget} this month compared to last month.`,
                    type: 'spending_reduction',
                    category: topSpendingCategory,
                    targetPercentage: 15,
                    targetProgress: 15,
                    progressUnit: 'percentage',
                    endDate: currentDate.add(30, 'day').toDate(),
                    difficulty: 'medium',
                    points: 75,
                    isAI: true,
                    aiPrompt: `Generated based on high ${topSpendingCategory} spending`
                });
            }
            
            // 3. Habit building challenge
            if (topSpendingCategory === 'food' && spendingCategories.food > 3000) {
                challenges.push({
                    title: 'No food delivery for 5 days',
                    description: 'Cook at home and avoid food delivery for 5 consecutive days to build healthy eating habits.',
                    type: 'habit_building',
                    category: 'food',
                    targetDays: 5,
                    targetProgress: 5,
                    progressUnit: 'days',
                    endDate: currentDate.add(14, 'day').toDate(),
                    difficulty: 'medium',
                    points: 100,
                    isAI: true,
                    aiPrompt: 'Generated based on high food delivery spending'
                });
            }
            
            return challenges;
        } catch (error) {
            throw new Error(`Failed to generate personalized challenges: ${error.message}`);
        }
    }
    
    // Create a new challenge
    async createChallenge(challengeData) {
        try {
            const challenge = new Challenge(challengeData);
            await challenge.save();
            return challenge;
        } catch (error) {
            throw new Error(`Failed to create challenge: ${error.message}`);
        }
    }
    
    // Get user's active challenges
    async getUserChallenges(userId) {
        try {
            const challenges = await Challenge.find({
                user: userId,
                status: { $in: ['active', 'completed'] }
            }).sort({ endDate: 1 });
            
            return challenges;
        } catch (error) {
            throw new Error(`Failed to get user challenges: ${error.message}`);
        }
    }
    
    // Update challenge progress
    async updateChallengeProgress(challengeId, progress) {
        try {
            const challenge = await Challenge.findById(challengeId);
            if (!challenge) {
                throw new Error('Challenge not found');
            }
            
            challenge.currentProgress = progress;
            
            // Check if challenge is completed
            if (progress >= challenge.targetProgress) {
                challenge.status = 'completed';
                await this.awardAchievement(challenge.user, 'challenge_completer');
            }
            
            await challenge.save();
            return challenge;
        } catch (error) {
            throw new Error(`Failed to update challenge progress: ${error.message}`);
        }
    }
    
    // Get user streaks
    async getUserStreaks(userId) {
        try {
            const streaks = await Streak.find({ user: userId }).sort({ type: 1 });
            
            // If no streaks exist, create default ones
            if (streaks.length === 0) {
                const defaultStreaks = [
                    {
                        user: userId,
                        type: 'savings',
                        title: 'Savings Streak',
                        description: 'Days in a row you\'ve saved money',
                        currentStreak: 0,
                        longestStreak: 0,
                        isActive: true,
                        lastActivityDate: new Date()
                    },
                    {
                        user: userId,
                        type: 'budget',
                        title: 'Budget Master',
                        description: 'Months staying under budget',
                        currentStreak: 0,
                        longestStreak: 0,
                        isActive: true,
                        lastActivityDate: new Date()
                    },
                    {
                        user: userId,
                        type: 'no_delivery',
                        title: 'Home Chef',
                        description: 'Days without food delivery',
                        currentStreak: 0,
                        longestStreak: 0,
                        isActive: true,
                        lastActivityDate: new Date()
                    }
                ];
                
                await Streak.insertMany(defaultStreaks);
                return defaultStreaks;
            }
            
            return streaks;
        } catch (error) {
            throw new Error(`Failed to get user streaks: ${error.message}`);
        }
    }

    // Check and update streaks
    async updateStreaks(userId, userExpenses, userIncomes) {
        try {
            const currentDate = dayjs();
            const streaks = await Streak.find({ user: userId, isActive: true });
            
            for (const streak of streaks) {
                let shouldIncrement = false;
                
                switch (streak.type) {
                    case 'no_delivery':
                        shouldIncrement = !this.hasFoodDeliveryToday(userExpenses, currentDate);
                        break;
                    case 'under_budget':
                        shouldIncrement = this.isUnderBudgetThisMonth(userExpenses, userIncomes);
                        break;
                    case 'category_reduction':
                        shouldIncrement = this.hasReducedCategorySpending(userExpenses, streak.category);
                        break;
                }
                
                if (shouldIncrement) {
                    streak.currentStreak += 1;
                    streak.longestStreak = Math.max(streak.currentStreak, streak.longestStreak);
                    streak.lastActivityDate = currentDate.toDate();
                    
                    // Check for streak achievements
                    if (streak.currentStreak === 7) {
                        await this.awardAchievement(userId, 'streak_master');
                    }
                } else {
                    // Reset streak if condition not met
                    streak.currentStreak = 0;
                }
                
                await streak.save();
            }
            
            return streaks;
        } catch (error) {
            throw new Error(`Failed to update streaks: ${error.message}`);
        }
    }
    
    // Award achievements
    async awardAchievement(userId, achievementType) {
        try {
            const existingAchievement = await Achievement.findOne({
                user: userId,
                type: achievementType
            });
            
            if (existingAchievement) {
                return existingAchievement; // Already awarded
            }
            
            const achievementData = this.getAchievementData(achievementType);
            const achievement = new Achievement({
                user: userId,
                ...achievementData
            });
            
            await achievement.save();
            return achievement;
        } catch (error) {
            throw new Error(`Failed to award achievement: ${error.message}`);
        }
    }
    
    // Helper methods
    analyzeMonthlyExpenses(expenses) {
        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();
        
        return expenses
            .filter(expense => {
                const date = dayjs(expense.transactionDate || expense.createdAt);
                return date.month() === currentMonth && date.year() === currentYear;
            })
            .reduce((total, expense) => total + (expense.ammount || 0), 0);
    }
    
    analyzeSpendingCategories(expenses) {
        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();
        
        return expenses
            .filter(expense => {
                const date = dayjs(expense.transactionDate || expense.createdAt);
                return date.month() === currentMonth && date.year() === currentYear;
            })
            .reduce((categories, expense) => {
                const category = expense.category || 'others';
                categories[category] = (categories[category] || 0) + (expense.ammount || 0);
                return categories;
            }, {});
    }
    
    calculateSavingsRate(incomes, expenses) {
        const totalIncome = incomes.reduce((sum, income) => sum + (income.ammount || 0), 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.ammount || 0), 0);
        
        if (totalIncome === 0) return 0;
        return (totalIncome - totalExpenses) / totalIncome;
    }
    
    hasFoodDeliveryToday(expenses, currentDate) {
        return expenses.some(expense => {
            const expenseDate = dayjs(expense.transactionDate || expense.createdAt);
            return expenseDate.isSame(currentDate, 'day') && 
                   expense.category === 'food' && 
                   expense.title.toLowerCase().includes('delivery');
        });
    }
    
    isUnderBudgetThisMonth(expenses, incomes) {
        const monthlyExpenses = this.analyzeMonthlyExpenses(expenses);
        const monthlyIncome = incomes
            .filter(income => {
                const date = dayjs(income.transactionDate || income.createdAt);
                return date.month() === dayjs().month() && date.year() === dayjs().year();
            })
            .reduce((sum, income) => sum + (income.ammount || 0), 0);
        
        return monthlyExpenses < monthlyIncome * 0.8; // Under 80% of income
    }
    
    hasReducedCategorySpending(expenses, category) {
        const currentMonth = dayjs().month();
        const lastMonth = dayjs().subtract(1, 'month').month();
        
        const currentMonthSpending = expenses
            .filter(expense => {
                const date = dayjs(expense.transactionDate || expense.createdAt);
                return date.month() === currentMonth && expense.category === category;
            })
            .reduce((sum, expense) => sum + (expense.ammount || 0), 0);
        
        const lastMonthSpending = expenses
            .filter(expense => {
                const date = dayjs(expense.transactionDate || expense.createdAt);
                return date.month() === lastMonth && expense.category === category;
            })
            .reduce((sum, expense) => sum + (expense.ammount || 0), 0);
        
        return currentMonthSpending < lastMonthSpending;
    }

    getAchievementData(achievementType) {
        const achievements = {
            'challenge_completer': {
                type: 'challenge_completer',
                title: 'Challenge Completer',
                description: 'Completed your first challenge',
                icon: '🏆',
                points: 100,
                rarity: 'common',
                criteria: {
                    required: 1,
                    progress: 0,
                    target: 1
                }
            },
            'streak_master': {
                type: 'streak_master',
                title: 'Streak Master',
                description: 'Maintained a 7-day streak',
                icon: '🔥',
                points: 200,
                rarity: 'rare',
                criteria: {
                    required: 7,
                    progress: 0,
                    target: 7
                }
            },
            'savings_champ': {
                type: 'savings_champ',
                title: 'Savings Champion',
                description: 'Saved more than ₹10,000',
                icon: '💰',
                points: 300,
                rarity: 'rare',
                criteria: {
                    required: 10000,
                    progress: 0,
                    target: 10000
                }
            },
            'budget_pro': {
                type: 'budget_pro',
                title: 'Budget Pro',
                description: 'Stayed under budget for a month',
                icon: '📊',
                points: 400,
                rarity: 'epic',
                criteria: {
                    required: 1,
                    progress: 0,
                    target: 1
                }
            },
            'goal_achiever': {
                type: 'goal_achiever',
                title: 'Goal Achiever',
                description: 'Reached 5 financial goals',
                icon: '🎯',
                points: 500,
                rarity: 'epic',
                criteria: {
                    required: 5,
                    progress: 0,
                    target: 5
                }
            },
            'emergency_saver': {
                type: 'emergency_saver',
                title: 'Emergency Saver',
                description: 'Saved ₹1,00,000 or more',
                icon: '🛡️',
                points: 1000,
                rarity: 'legendary',
                criteria: {
                    required: 100000,
                    progress: 0,
                    target: 100000
                }
            },
            'smart_spender': {
                type: 'smart_spender',
                title: 'Smart Spender',
                description: 'Reduced spending in 3 different categories',
                icon: '🧠',
                points: 300,
                rarity: 'rare',
                criteria: {
                    required: 3,
                    progress: 0,
                    target: 3
                }
            },
            'consistent_saver': {
                type: 'consistent_saver',
                title: 'Consistent Saver',
                description: 'Saved money for 5 consecutive weeks',
                icon: '💪',
                points: 400,
                rarity: 'epic',
                criteria: {
                    required: 5,
                    progress: 0,
                    target: 5
                }
            }
        };
            
        return achievements[achievementType] || achievements['challenge_completer'];
    }

    async getUserAchievements(userId) {
        try {
            const achievements = await Achievement.find({ user: userId })
                .select('-criteria') // Exclude the criteria field
                .sort({ unlockedAt: -1 })
                .lean();
            
            return achievements;
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            throw new Error('Failed to fetch achievements');
        }
    }

    async getChallengeStats(userId) {
        try {
            const currentDate = dayjs();
            const startOfMonth = currentDate.startOf('month');
            const startOfWeek = currentDate.startOf('week');

            // Get challenges for current month
            const monthlyChallenges = await Challenge.find({
                user: userId,
                startDate: { $gte: startOfMonth.toDate() }
            }).lean();

            // Get challenges for current week
            const weeklyChallenges = await Challenge.find({
                user: userId,
                startDate: { $gte: startOfWeek.toDate() }
            }).lean();

            // Get active streaks
            const activeStreaks = await Streak.find({
                user: userId,
                isActive: true
            }).lean();

            // Get total achievements
            const totalAchievements = await Achievement.countDocuments({ user: userId });

            // Calculate completion rates
            const monthlyCompleted = monthlyChallenges.filter(c => c.status === 'completed').length;
            const weeklyCompleted = weeklyChallenges.filter(c => c.status === 'completed').length;
            const monthlyTotal = monthlyChallenges.length;
            const weeklyTotal = weeklyChallenges.length;

            const stats = {
                monthly: {
                    total: monthlyTotal,
                    completed: monthlyCompleted,
                    completionRate: monthlyTotal > 0 ? (monthlyCompleted / monthlyTotal * 100).toFixed(1) : 0
                },
                weekly: {
                    total: weeklyTotal,
                    completed: weeklyCompleted,
                    completionRate: weeklyTotal > 0 ? (weeklyCompleted / weeklyTotal * 100).toFixed(1) : 0
                },
                streaks: {
                    active: activeStreaks.length,
                    total: activeStreaks.reduce((sum, streak) => sum + streak.currentStreak, 0)
                },
                achievements: {
                    total: totalAchievements,
                    recent: await Achievement.find({ user: userId })
                        .sort({ unlockedAt: -1 })
                        .limit(3)
                        .lean()
                }
            };

            return stats;
        } catch (error) {
            console.error('Error fetching challenge stats:', error);
            throw new Error('Failed to fetch challenge statistics');
        }
    }
}

module.exports = new ChallengeService();
