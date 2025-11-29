import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, TrendingUp, Shield, PieChart } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase/firebase';
import { useDispatch } from 'react-redux';
import { signInUser } from '../features/auth/authSlice';
import { Boxes } from './Background-boxes';

const Hero = () => {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const formData = {
        name: user.displayName,
        email: user.email,
      };
      dispatch(signInUser(formData));
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 flex flex-col justify-center">
      <div className="absolute inset-0 w-full h-full bg-slate-50 z-0 pointer-events-none" />
      <Boxes />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-0 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center"
      >

        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 mb-8 mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          <span className="text-sm font-medium tracking-wide uppercase">FinPal 2.0 is Live</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
          Master Your Money <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
            Build Your Future
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
          Experience the next generation of financial tracking.
          AI-powered insights, real-time analytics, and a design that makes
          managing money a pleasure, not a chore.
        </motion.p>

        {/* Feature Pills */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: TrendingUp, text: "Real-time Analytics", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Shield, text: "Bank-grade Security", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: PieChart, text: "Smart Insights", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((feature, index) => (
            <div key={index} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`p-2 rounded-lg ${feature.bg}`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <span className="font-medium text-slate-700">{feature.text}</span>
            </div>
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Hero;