import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Globe, ShieldCheck, Smartphone, Zap, PieChart } from 'lucide-react';

const BentoGrid = () => {
    const features = [
        {
            title: "⚡ Lightning-Fast Tracking",
            description: "Track your expenses in real-time with instant updates.",
            icon: PieChart,
            className: "col-span-1 bg-slate-50 border border-slate-200",
            iconColor: "text-blue-600"
        },
        {
            title: "🧠 AI-Powered Insights",
            description: "Get personalized recommendations and insights to help you make better financial decisions.",
            icon: PieChart,
            className: "col-span-1 bg-slate-50 border border-slate-200",
            iconColor: "text-blue-600"
        },
        {
            title: "📊 Smart Analytics",
            description: "Get insights into your spending habits and make informed decisions.",
            icon: PieChart,
            className: "col-span-1 bg-slate-50 border border-slate-200",
            iconColor: "text-blue-600"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                        Everything you need,<br />
                        <span className="text-slate-400">in one place.</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        From everyday spending to long-term savings, we've got you covered with tools that work as hard as you do.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(250px,auto)]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative p-8 rounded-3xl overflow-hidden group ${feature.className}`}
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm mb-4 ${feature.className.includes('text-white') ? 'bg-white/10' : 'bg-slate-100'}`}>
                                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{feature.title}</h3>
                                    <p className={`text-sm leading-relaxed ${feature.className.includes('text-white') ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative Gradient Blob */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
