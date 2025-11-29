import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, Zap, Save, TrendingDown, RefreshCw, Tag, Star } from 'lucide-react';
import { createChallenge } from '../../features/challenges/challengeSlice';
import dayjs from 'dayjs';

const CreateChallengeModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'savings',
        category: 'general',
        targetAmount: '',
        targetPercentage: '',
        targetDays: '',
        endDate: '',
        difficulty: 'medium',
        points: 50
    });

    const challengeTypes = [
        { value: 'savings', label: 'Savings Challenge', icon: '💰', description: 'Save a specific amount of money' },
        { value: 'spending_reduction', label: 'Spending Reduction', icon: '📉', description: 'Reduce spending in a category' },
        { value: 'habit_building', label: 'Habit Building', icon: '🔄', description: 'Build a daily habit' },
        { value: 'category_specific', label: 'Category Specific', icon: '🎯', description: 'Focus on a specific spending category' }
    ];

    const categories = [
        { value: 'general', label: 'General' },
        { value: 'food', label: 'Food & Dining' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'travel', label: 'Travel' },
        { value: 'rent', label: 'Housing' },
        { value: 'others', label: 'Others' }
    ];

    const difficulties = [
        { value: 'easy', label: 'Easy', points: 25, color: 'text-green-600' },
        { value: 'medium', label: 'Medium', points: 50, color: 'text-yellow-600' },
        { value: 'hard', label: 'Hard', points: 100, color: 'text-red-600' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-adjust points based on difficulty
        if (name === 'difficulty') {
            const difficulty = difficulties.find(d => d.value === value);
            if (difficulty) {
                setFormData(prev => ({ ...prev, points: difficulty.points }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.endDate) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const challengeData = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                category: formData.category,
                difficulty: formData.difficulty,
                points: formData.points,
                endDate: new Date(formData.endDate),
                startDate: new Date(),
                currentProgress: 0,
                status: 'active'
            };

            // Add type-specific fields based on backend model requirements
            if (formData.type === 'savings') {
                challengeData.targetAmount = Number(formData.targetAmount);
                challengeData.targetProgress = Number(formData.targetAmount);
                challengeData.progressUnit = 'amount';
            } else if (formData.type === 'spending_reduction') {
                challengeData.targetPercentage = Number(formData.targetPercentage);
                challengeData.targetProgress = Number(formData.targetPercentage);
                challengeData.progressUnit = 'percentage';
            } else if (formData.type === 'habit_building') {
                challengeData.targetDays = Number(formData.targetDays);
                challengeData.targetProgress = Number(formData.targetDays);
                challengeData.progressUnit = 'days';
            } else if (formData.type === 'category_specific') {
                challengeData.targetAmount = Number(formData.targetAmount);
                challengeData.targetProgress = Number(formData.targetAmount);
                challengeData.progressUnit = 'amount';
            }

            // Ensure all required fields are present
            if (!challengeData.description) {
                challengeData.description = 'No description provided';
            }

            await dispatch(createChallenge(challengeData)).unwrap();
            onClose();
            setFormData({
                title: '',
                description: '',
                type: 'savings',
                category: 'general',
                targetAmount: '',
                targetPercentage: '',
                targetDays: '',
                endDate: '',
                difficulty: 'medium',
                points: 50
            });
        } catch (error) {
            console.error('Failed to create challenge:', error);
            console.error('Challenge data sent:', challengeData);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert(`Failed to create challenge: ${error.message || 'Please try again.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRequiredFields = () => {
        switch (formData.type) {
            case 'savings':
                return ['targetAmount'];
            case 'spending_reduction':
                return ['targetPercentage', 'category'];
            case 'habit_building':
                return ['targetDays'];
            case 'category_specific':
                return ['targetAmount', 'category'];
            default:
                return [];
        }
    };

    const isFormValid = () => {
        const requiredFields = getRequiredFields();
        return requiredFields.every(field => formData[field]) && formData.title && formData.endDate;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Create New Challenge</h2>
                                <p className="text-gray-600 text-sm">Set a goal and start your journey!</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Challenge Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Challenge Type
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {challengeTypes.map((type) => (
                                    <div
                                        key={type.value}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                            formData.type === type.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{type.icon}</div>
                                            <div>
                                                <div className="font-medium text-gray-800">{type.label}</div>
                                                <div className="text-sm text-gray-600">{type.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Challenge Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Save ₹500 this week"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Describe your challenge goal and motivation..."
                            />
                        </div>

                        {/* Target Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.type === 'savings' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Amount (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        name="targetAmount"
                                        value={formData.targetAmount}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="500"
                                        required
                                    />
                                </div>
                            )}

                            {formData.type === 'spending_reduction' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reduction Percentage (%) *
                                        </label>
                                        <input
                                            type="number"
                                            name="targetPercentage"
                                            value={formData.targetPercentage}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="100"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="15"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {formData.type === 'habit_building' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Target Days *
                                    </label>
                                    <input
                                        type="number"
                                        name="targetDays"
                                        value={formData.targetDays}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="365"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="7"
                                        required
                                    />
                                </div>
                            )}

                            {formData.type === 'category_specific' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target Amount (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            name="targetAmount"
                                            value={formData.targetAmount}
                                            onChange={handleInputChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="1000"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            {categories.map((category) => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Difficulty and Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty Level
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {difficulties.map((difficulty) => (
                                        <div
                                            key={difficulty.value}
                                            className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all duration-200 ${
                                                formData.difficulty === difficulty.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setFormData(prev => ({ 
                                                ...prev, 
                                                difficulty: difficulty.value,
                                                points: difficulty.points
                                            }))}
                                        >
                                            <div className={`font-medium ${difficulty.color}`}>
                                                {difficulty.label}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {difficulty.points} pts
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Points Reward
                                </label>
                                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span className="text-lg font-bold text-yellow-700">
                                        {formData.points} Points
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Points are awarded upon challenge completion
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isFormValid() || isSubmitting}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Create Challenge
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateChallengeModal;
