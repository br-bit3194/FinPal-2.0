import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
    Target, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    TrendingUp,
    Edit3,
    Trophy,
    Zap
} from 'lucide-react';
import { updateChallengeProgress } from '../../features/challenges/challengeSlice';
import ProgressRing from './ProgressRing';
import dayjs from 'dayjs';

const ChallengeCard = ({ challenge }) => {
    const dispatch = useDispatch();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showProgressInput, setShowProgressInput] = useState(false);
    const [progressInput, setProgressInput] = useState(challenge.currentProgress || 0);

    const isCompleted = challenge.status === 'completed';
    const isExpired = new Date(challenge.endDate) < new Date();
    const progressPercentage = Math.min((challenge.currentProgress / challenge.targetProgress) * 100, 100);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'savings': return '💰';
            case 'spending_reduction': return '📉';
            case 'habit_building': return '🔄';
            case 'category_specific': return '🎯';
            default: return '🎮';
        }
    };

    const getProgressUnit = (unit) => {
        switch (unit) {
            case 'amount': return '₹';
            case 'percentage': return '%';
            case 'days': return 'days';
            case 'count': return 'times';
            default: return '';
        }
    };

    const handleProgressUpdate = async () => {
        const newProgress = challenge.currentProgress + Number(progressInput);
        if (newProgress < 0 || newProgress > challenge.targetProgress) return;
        
        setIsUpdating(true);
        try {
            await dispatch(updateChallengeProgress({ 
                challengeId: challenge._id, 
                progress: newProgress 
            })).unwrap();
            setProgressInput('');
            setShowProgressInput(false);
        } catch (error) {
            console.error('Failed to update progress:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (date) => {
        return dayjs(date).format('MMM DD, YYYY');
    };

    const getTimeRemaining = () => {
        const endDate = dayjs(challenge.endDate);
        const now = dayjs();
        const diff = endDate.diff(now, 'day');
        
        if (diff < 0) return 'Expired';
        if (diff === 0) return 'Ends today';
        if (diff === 1) return 'Ends tomorrow';
        return `${diff} days left`;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`relative bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
                isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isExpired 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-gray-100 hover:border-blue-200'
            }`}
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
                {isCompleted ? (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                    </div>
                ) : isExpired ? (
                    <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Expired
                    </div>
                ) : (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        <Target className="w-3 h-3" />
                        Active
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <div className="text-3xl">{getTypeIcon(challenge.type)}</div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm">{challenge.description}</p>
                </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Progress</span>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">
                            {challenge.currentProgress} / {challenge.targetProgress} {getProgressUnit(challenge.progressUnit)}
                        </div>
                        <div className="text-xs text-gray-500">
                            {Math.round(progressPercentage)}% Complete
                        </div>
                    </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                        className={`h-3 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Challenge Details */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {formatDate(challenge.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>{challenge.points} points</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                    </span>
                </div>
            </div>

            {/* AI Badge */}
            {challenge.isAI && (
                <div className="mb-4">
                    <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        AI Generated
                    </div>
                </div>
            )}

            {/* Progress Update Section */}
            {!isCompleted && !isExpired && (
                <div className="border-t pt-4">
                    {showProgressInput ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={progressInput === 0 ? '' : progressInput}
                                    onChange={(e) => setProgressInput(Number(e.target.value))}
                                    min="0"
                                    max={challenge.targetProgress}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Add amount (max ${challenge.targetProgress - challenge.currentProgress})`}
                                />
                                <button
                                    onClick={handleProgressUpdate}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                >
                                    {isUpdating ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                            <button
                                onClick={() => setShowProgressInput(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowProgressInput(true)}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Add Progress
                        </button>
                    )}
                </div>
            )}

            {/* Completion Celebration */}
            {isCompleted && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-3 bg-green-100 rounded-lg"
                >
                    <div className="text-2xl mb-2">🎉</div>
                    <p className="text-green-700 font-medium">Challenge Completed!</p>
                    <p className="text-green-600 text-sm">+{challenge.points} points earned</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ChallengeCard;
