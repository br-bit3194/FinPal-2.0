import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, 
    Flame, 
    Target, 
    TrendingUp, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle,
    Plus,
    Sparkles,
    Star,
    Zap
} from 'lucide-react';
import { 
    getUserChallenges, 
    generateChallenges, 
    getUserAchievements,
    getChallengeStats,
    getUserStreaks,
    updateStreaks
} from '../../features/challenges/challengeSlice';
import { getAllExpenses } from '../../features/expense/expenseSlice';
import { getAllIncomes } from '../../features/income/incomeSlice';
import ChallengeCard from './ChallengeCard';
import StreakCard from './StreakCard';
import AchievementCard from './AchievementCard';
import CreateChallengeModal from './CreateChallengeModal';
import ProgressRing from './ProgressRing';

const ChallengesDashboard = () => {
    const dispatch = useDispatch();
    const { challenges, achievements, stats, streaks, isLoading } = useSelector(state => state.challenges);
    const { allExpenses } = useSelector(state => state.expense);
    const { allIncomes } = useSelector(state => state.income);
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('challenges');

    useEffect(() => {
        dispatch(getUserChallenges());
        dispatch(getUserAchievements());
        dispatch(getUserStreaks());
        dispatch(getChallengeStats());
        dispatch(getAllExpenses());
        dispatch(getAllIncomes());
    }, [dispatch]);

    useEffect(() => {
        if (allExpenses.length > 0 && allIncomes.length > 0) {
            dispatch(updateStreaks({ expenses: allExpenses, incomes: allIncomes }));
        }
    }, [dispatch, allExpenses, allIncomes]);

    const handleGenerateChallenges = () => {
        if (allExpenses.length > 0 && allIncomes.length > 0) {
            dispatch(generateChallenges({ expenses: allExpenses, incomes: allIncomes }));
        }
    };

    const activeChallenges = challenges.filter(c => c.status === 'active');
    const completedChallenges = challenges.filter(c => c.status === 'completed');
    const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 px-6 pb-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with Action Buttons */}
                <motion.div 
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="flex-1">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                🚀 Epic Financial Quest
                            </h1>
                            <p className="text-gray-600 text-xl max-w-3xl leading-relaxed">
                                Embark on an epic journey to financial mastery! Conquer challenges, build legendary streaks, and unlock achievements that will transform your money game forever! 💪✨
                            </p>
                        </div>
                        
                        {/* Professional Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl hover:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-1 border-0 overflow-hidden min-w-[160px] h-[52px]"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <span className="font-semibold text-white text-sm block leading-tight">Launch New Quest</span>
                                        <span className="text-white/80 text-xs block leading-tight">Create epic mission</span>
                                    </div>
                                </div>
                            </button>
                            
                            <button
                                onClick={handleGenerateChallenges}
                                disabled={allExpenses.length === 0 || allIncomes.length === 0}
                                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl hover:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:-translate-y-1 border-0 overflow-hidden min-w-[160px] h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-3 px-4 py-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <span className="font-semibold text-white text-sm block leading-tight">Summon AI Wizard</span>
                                        <span className="text-white/80 text-xs block leading-tight">Magical suggestions</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Overview */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Active Challenges Card */}
                    <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-200/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300 border border-blue-200/50">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-blue-600 mb-1">Active Quests</p>
                                    <p className="text-3xl font-bold text-blue-700">{activeChallenges.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className="text-blue-600 font-medium">+{activeChallenges.length > 0 ? '2' : '0'}</span>
                                <span className="text-blue-500/70 ml-2">this week</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Completed Challenges Card */}
                    <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all duration-300 border border-green-200/50">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-green-600 mb-1">Victories</p>
                                    <p className="text-3xl font-bold text-green-700">{completedChallenges.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className="text-green-600 font-medium">+{completedChallenges.length > 0 ? '1' : '0'}</span>
                                <span className="text-green-500/70 ml-2">this month</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Total Points Card */}
                    <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-200/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all duration-300 border border-purple-200/50">
                                    <Star className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-purple-600 mb-1">Power Level</p>
                                    <p className="text-3xl font-bold text-purple-700">{totalPoints}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className="text-purple-600 font-medium">+{totalPoints > 0 ? '25' : '0'}</span>
                                <span className="text-purple-500/70 ml-2">this week</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievements Card */}
                    <motion.div variants={itemVariants} className="group relative bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-orange-200/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl group-hover:from-orange-500/20 group-hover:to-orange-600/20 transition-all duration-300 border border-orange-200/50">
                                    <Trophy className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-orange-600 mb-1">Legendary Feats</p>
                                    <p className="text-3xl font-bold text-orange-700">{achievements.length}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm">
                                <span className="text-orange-600 font-medium">+{achievements.length > 0 ? '1' : '0'}</span>
                                <span className="text-orange-500/70 ml-2">recently</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div 
                    className="flex justify-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-100">
                        {[
                            { key: 'challenges', label: '🔥 Quests' },
                            { key: 'streaks', label: '⚡ Streaks' },
                            { key: 'achievements', label: '🏆 Feats' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                                    activeTab === tab.key
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'challenges' && (
                        <motion.div
                            key="challenges"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {activeChallenges.map((challenge) => (
                                    <ChallengeCard key={challenge._id} challenge={challenge} />
                                ))}
                                {completedChallenges.map((challenge) => (
                                    <ChallengeCard key={challenge._id} challenge={challenge} />
                                ))}
                                {challenges.length === 0 && (
                                                                         <div className="col-span-full text-center py-12">
                                         <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                         <h3 className="text-xl font-semibold text-gray-600 mb-2">No Quests Yet, Brave Warrior! 🗡️</h3>
                                         <p className="text-gray-500 mb-4">Your epic financial journey awaits! Launch your first quest or summon the AI Wizard for magical suggestions!</p>
                                         <button
                                             onClick={() => setShowCreateModal(true)}
                                             className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                         >
                                             🚀 Launch First Quest
                                         </button>
                                     </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'streaks' && (
                        <motion.div
                            key="streaks"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {streaks && streaks.length > 0 ? (
                                    streaks.map((streak) => (
                                        <StreakCard 
                                            key={streak._id}
                                            type={streak.type}
                                            title={streak.title}
                                            description={streak.description}
                                            currentStreak={streak.currentStreak}
                                            longestStreak={streak.longestStreak}
                                            icon={streak.type === 'savings' ? '💰' : 
                                                  streak.type === 'budget' ? '🎯' : '👨‍🍳'}
                                        />
                                    ))
                                ) : (
                                                                         <div className="col-span-full text-center py-12">
                                         <Flame className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                         <h3 className="text-xl font-semibold text-gray-600 mb-2">No Streaks Yet, Fire Starter! 🔥</h3>
                                         <p className="text-gray-500">Complete epic quests to ignite your legendary streaks and become unstoppable!</p>
                                     </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {achievements.map((achievement) => (
                                    <AchievementCard key={achievement._id} achievement={achievement} />
                                ))}
                                {achievements.length === 0 && (
                                                                         <div className="col-span-full text-center py-12">
                                         <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                         <h3 className="text-xl font-semibold text-gray-600 mb-2">No Legendary Feats Yet, Champion! 🏆</h3>
                                         <p className="text-gray-500">Conquer epic quests to unlock legendary achievements and ascend to financial greatness!</p>
                                     </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Create Challenge Modal */}
            <CreateChallengeModal 
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default ChallengesDashboard;
