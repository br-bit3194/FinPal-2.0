import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';


const HeroRevolut = () => {
    return (
        <section className="relative min-h-[90vh] w-full bg-white overflow-hidden flex items-center">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-100/30 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-secondary-100/30 rounded-full blur-[100px]" />

                {/* Animated Robot Graphics */}
                {/* Robot 1 - Top Left */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 0.15, y: 0 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute top-[15%] left-[5%] w-32 h-32 hidden lg:block"
                >
                    <motion.svg
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        viewBox="0 0 100 100"
                        className="w-full h-full"
                    >
                        {/* Robot Head */}
                        <rect x="25" y="20" width="50" height="40" rx="8" fill="url(#robotGrad1)" />
                        {/* Antenna */}
                        <line x1="50" y1="20" x2="50" y2="10" stroke="#0081A7" strokeWidth="2" />
                        <circle cx="50" cy="8" r="3" fill="#00B4D8" />
                        {/* Eyes */}
                        <motion.circle
                            cx="38" cy="35" r="4" fill="#00B4D8"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.circle
                            cx="62" cy="35" r="4" fill="#00B4D8"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        {/* Mouth */}
                        <path d="M 35 48 Q 50 52 65 48" stroke="#0081A7" strokeWidth="2" fill="none" />
                        {/* Body */}
                        <rect x="30" y="60" width="40" height="30" rx="5" fill="url(#robotGrad1)" />
                        {/* Arms */}
                        <rect x="15" y="65" width="15" height="8" rx="4" fill="#0081A7" />
                        <rect x="70" y="65" width="15" height="8" rx="4" fill="#0081A7" />
                        {/* Gradient */}
                        <defs>
                            <linearGradient id="robotGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0081A7" />
                                <stop offset="100%" stopColor="#00B4D8" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                </motion.div>

                {/* Robot 2 - Bottom Right */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 0.12, x: 0 }}
                    transition={{ duration: 2, delay: 1 }}
                    className="absolute bottom-[20%] right-[8%] w-40 h-40 hidden lg:block"
                >
                    <motion.svg
                        animate={{
                            y: [0, 15, 0],
                            rotate: [0, -3, 0, 3, 0]
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        viewBox="0 0 100 100"
                        className="w-full h-full"
                    >
                        {/* Robot Head */}
                        <rect x="20" y="15" width="60" height="45" rx="10" fill="url(#robotGrad2)" />
                        {/* Antenna with light */}
                        <line x1="50" y1="15" x2="50" y2="5" stroke="#0081A7" strokeWidth="3" />
                        <motion.circle
                            cx="50" cy="3" r="4" fill="#00B4D8"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        {/* Eyes - Digital style */}
                        <rect x="30" y="28" width="12" height="8" rx="2" fill="#00B4D8" />
                        <rect x="58" y="28" width="12" height="8" rx="2" fill="#00B4D8" />
                        {/* Display panel */}
                        <rect x="30" y="45" width="40" height="3" rx="1" fill="#0081A7" opacity="0.6" />
                        <rect x="30" y="50" width="30" height="3" rx="1" fill="#0081A7" opacity="0.6" />
                        {/* Body */}
                        <rect x="25" y="60" width="50" height="35" rx="8" fill="url(#robotGrad2)" />
                        {/* Chest panel */}
                        <circle cx="50" cy="77" r="8" fill="#00B4D8" opacity="0.3" />
                        {/* Arms */}
                        <motion.rect
                            x="10" y="68" width="15" height="10" rx="5" fill="#0081A7"
                            animate={{ rotate: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ transformOrigin: "17px 73px" }}
                        />
                        <motion.rect
                            x="75" y="68" width="15" height="10" rx="5" fill="#0081A7"
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ transformOrigin: "83px 73px" }}
                        />
                        {/* Gradient */}
                        <defs>
                            <linearGradient id="robotGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00B4D8" />
                                <stop offset="100%" stopColor="#0081A7" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                </motion.div>

                {/* Robot 3 - Middle Left (smaller) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 2, delay: 1.5 }}
                    className="absolute top-[50%] left-[10%] w-24 h-24 hidden md:block"
                >
                    <motion.svg
                        animate={{
                            y: [0, -10, 0],
                            x: [0, 5, 0]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                        viewBox="0 0 100 100"
                        className="w-full h-full"
                    >
                        {/* Simple geometric robot */}
                        <circle cx="50" cy="30" r="18" fill="url(#robotGrad3)" />
                        {/* Eyes */}
                        <circle cx="43" cy="28" r="3" fill="#00B4D8" />
                        <circle cx="57" cy="28" r="3" fill="#00B4D8" />
                        {/* Smile */}
                        <path d="M 42 35 Q 50 38 58 35" stroke="#0081A7" strokeWidth="2" fill="none" />
                        {/* Body */}
                        <rect x="35" y="48" width="30" height="25" rx="6" fill="url(#robotGrad3)" />
                        {/* Simple arms */}
                        <circle cx="30" cy="60" r="5" fill="#0081A7" />
                        <circle cx="70" cy="60" r="5" fill="#0081A7" />
                        {/* Gradient */}
                        <defs>
                            <linearGradient id="robotGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0081A7" opacity="0.8" />
                                <stop offset="100%" stopColor="#00B4D8" opacity="0.8" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                </motion.div>

                {/* Floating AI Particles */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 0.3, 0],
                            y: [0, -100],
                            x: [0, Math.random() * 50 - 25]
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeOut"
                        }}
                        className="absolute hidden lg:block"
                        style={{
                            left: `${20 + i * 15}%`,
                            bottom: '10%',
                            width: '8px',
                            height: '8px',
                            background: 'linear-gradient(135deg, #0081A7, #00B4D8)',
                            borderRadius: '50%',
                            boxShadow: '0 0 10px rgba(0, 129, 167, 0.5)'
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium mb-8">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            FinPal 2.0 is Live
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-8">
                            Master Your Money<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">Like a Boss!</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 max-w-lg mb-10 leading-relaxed">
                            Ready to dominate your finances? FinPal is your ultimate weapon for crushing debt, building wealth, and living the life you deserve! 🔥💪
                        </p>

                        {/* <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Get Started
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>

                            <button className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" />
                                Download App
                            </button>
                        </div> */}
                    </motion.div>

                    {/* Hero Motion Graphics */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative lg:h-[600px] flex items-center justify-center w-full"
                    >
                        <div className="relative w-full max-w-[500px] aspect-square">
                            {/* Main Dashboard Card */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="absolute inset-x-0 top-[10%] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-10"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Total Balance</p>
                                        <h3 className="text-3xl font-bold text-slate-900">₹1,39,860.50</h3>
                                    </div>
                                    <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                                    </div>
                                </div>

                                {/* Animated Graph */}
                                <div className="h-32 flex items-end justify-between gap-2 mb-8">
                                    {[40, 70, 45, 90, 65, 85, 55].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (i * 0.1), ease: "backOut" }}
                                            className="w-full bg-primary-100 rounded-t-lg relative group"
                                        >
                                            <motion.div
                                                className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg"
                                                initial={{ height: 0 }}
                                                animate={{ height: "100%" }}
                                                transition={{ duration: 1.5, delay: 1 + (i * 0.1) }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Recent Activity */}
                                <div className="space-y-4">
                                    {[
                                        { name: "Netflix", amount: "-₹149.00", color: "bg-red-100 text-red-600", icon: "🎬" },
                                        { name: "Salary", amount: "+₹1,40,250.00", color: "bg-green-100 text-green-600", icon: "💰" },
                                        { name: "Uber", amount: "-₹240.50", color: "bg-slate-100 text-slate-600", icon: "🚗" }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 1.5 + (i * 0.2) }}
                                            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-lg`}>
                                                    {item.icon}
                                                </div>
                                                <span className="font-medium text-slate-700">{item.name}</span>
                                            </div>
                                            <span className={`font-semibold ${item.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900'}`}>
                                                {item.amount}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                        🎯
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Goal</p>
                                        <p className="font-bold text-slate-900">New Car</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[10%] -left-8 z-20 bg-slate-900 p-4 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                        📈
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Growth</p>
                                        <p className="font-bold text-white">+12.5%</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HeroRevolut;
