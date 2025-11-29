import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Target, Zap } from 'lucide-react';

const StreakCard = ({ type, title, description, currentStreak, longestStreak, icon }) => {
    const getStreakColor = (streak) => {
        if (streak >= 10) return 'text-orange-500';
        if (streak >= 7) return 'text-red-500';
        if (streak >= 5) return 'text-yellow-500';
        if (streak >= 3) return 'text-blue-500';
        return 'text-gray-400';
    };

    const getFlameSize = (streak) => {
        if (streak >= 10) return 'text-4xl';
        if (streak >= 7) return 'text-3xl';
        if (streak >= 5) return 'text-2xl';
        if (streak >= 3) return 'text-xl';
        return 'text-lg';
    };

    const getMotivationalMessage = (streak) => {
        if (streak >= 10) return "🔥 You're on fire! Keep it up!";
        if (streak >= 7) return "🔥 Amazing streak! Don't break it!";
        if (streak >= 5) return "🔥 Great progress! You're building momentum!";
        if (streak >= 3) return "🔥 Good start! Keep going!";
        return "Start your streak today!";
    };

    const getProgressPercentage = () => {
        if (longestStreak === 0) return 0;
        return Math.min((currentStreak / longestStreak) * 100, 100);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{icon}</div>
                <div className="flex items-center gap-1">
                    {currentStreak > 0 && (
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                repeatType: "reverse" 
                            }}
                        >
                            <Flame className={`${getFlameSize(currentStreak)} ${getStreakColor(currentStreak)}`} />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Title and Description */}
            <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{description}</p>

            {/* Current Streak */}
            <div className="text-center mb-4">
                <div className="text-4xl font-bold text-orange-600 mb-1">
                    {currentStreak}
                </div>
                <div className="text-sm text-gray-500">Current Streak</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>0</span>
                    <span>Progress</span>
                    <span>{longestStreak}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>
            </div>

            {/* Longest Streak */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Longest Streak</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">{longestStreak}</span>
            </div>

            {/* Motivational Message */}
            <div className="text-center py-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700 font-medium">
                    {getMotivationalMessage(currentStreak)}
                </p>
            </div>

            {/* Streak Milestones */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span>3 days</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${currentStreak >= 5 ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                        <span>5 days</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${currentStreak >= 7 ? 'bg-orange-400' : 'bg-gray-300'}`}></div>
                        <span>7 days</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${currentStreak >= 10 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span>10 days</span>
                    </div>
                </div>
            </div>

            {/* Next Milestone */}
            {currentStreak > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <div className="text-sm">
                            <span className="text-blue-700 font-medium">Next milestone: </span>
                            <span className="text-blue-600">
                                {currentStreak < 3 ? '3 days' : 
                                 currentStreak < 5 ? '5 days' : 
                                 currentStreak < 7 ? '7 days' : 
                                 currentStreak < 10 ? '10 days' : '15 days'}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Streak Tips */}
            {currentStreak === 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <div className="text-sm text-green-700">
                            <span className="font-medium">Tip: </span>
                            Start small and build consistency. Every day counts!
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default StreakCard;
