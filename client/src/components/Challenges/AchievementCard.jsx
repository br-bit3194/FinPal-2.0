import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Gem } from 'lucide-react';

const AchievementCard = ({ achievement }) => {
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
            case 'epic': return 'from-purple-400 via-pink-500 to-red-500';
            case 'rare': return 'from-blue-400 via-indigo-500 to-purple-500';
            case 'common': return 'from-gray-400 via-gray-500 to-gray-600';
            default: return 'from-gray-400 via-gray-500 to-gray-600';
        }
    };

    const getRarityIcon = (rarity) => {
        switch (rarity) {
            case 'legendary': return <Crown className="w-5 h-5 text-yellow-500" />;
            case 'epic': return <Gem className="w-5 h-5 text-purple-500" />;
            case 'rare': return <Star className="w-5 h-5 text-blue-500" />;
            case 'common': return <Trophy className="w-5 h-5 text-gray-500" />;
            default: return <Trophy className="w-5 h-5 text-gray-500" />;
        }
    };

    const getRarityText = (rarity) => {
        switch (rarity) {
            case 'legendary': return 'Legendary';
            case 'epic': return 'Epic';
            case 'rare': return 'Rare';
            case 'common': return 'Common';
            default: return 'Common';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-yellow-200 transition-all duration-300 overflow-hidden"
        >
            {/* Background Pattern for Legendary/Epic */}
            {achievement.rarity === 'legendary' && (
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"></div>
                </div>
            )}
            {achievement.rarity === 'epic' && (
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"></div>
                </div>
            )}

            {/* Rarity Badge */}
            <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                    {getRarityIcon(achievement.rarity)}
                    {getRarityText(achievement.rarity)}
                </div>
            </div>

            {/* Achievement Icon */}
            <div className="text-center mb-4">
                <motion.div
                    className="text-6xl mb-2"
                    animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                    }}
                >
                    {achievement.icon}
                </motion.div>
            </div>

            {/* Achievement Title */}
            <h3 className="font-bold text-xl text-gray-800 text-center mb-2">
                {achievement.title}
            </h3>

            {/* Achievement Description */}
            <p className="text-gray-600 text-center mb-4">
                {achievement.description}
            </p>

            {/* Points */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{achievement.points} Points</span>
                </div>
            </div>

            {/* Unlock Date */}
            <div className="text-center mb-4">
                <div className="text-sm text-gray-500">
                    <span className="font-medium">Unlocked: </span>
                    {formatDate(achievement.unlockedAt)}
                </div>
            </div>

            {/* Achievement Criteria */}
            {achievement.criteria && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Criteria: </span>
                        <span className="text-gray-600">
                            {typeof achievement.criteria === 'string' 
                                ? achievement.criteria 
                                : JSON.stringify(achievement.criteria)
                            }
                        </span>
                    </div>
                </div>
            )}

            {/* Special Effects for High Rarity */}
            {achievement.rarity === 'legendary' && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ 
                        background: [
                            'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 20%, rgba(255, 69, 0, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            )}

            {achievement.rarity === 'epic' && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ 
                        background: [
                            'radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 20%, rgba(255, 20, 147, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
            )}

            {/* Floating Particles for Legendary */}
            {achievement.rarity === 'legendary' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{
                                x: [0, 100, 0],
                                y: [0, -50, 0],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.6,
                                ease: "easeInOut"
                            }}
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + i * 10}%`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Bottom Border Glow */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}></div>
        </motion.div>
    );
};

export default AchievementCard;
