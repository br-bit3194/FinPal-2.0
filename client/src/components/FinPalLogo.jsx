import React from 'react';

const FinPalLogo = ({ className = "w-8 h-8", showText = true, textSize = "text-2xl" }) => {
  return (
    <div className="flex items-center space-x-3 group">
      {/* Creative Professional SVG Logo */}
      <div className="relative">
        <svg 
          viewBox="0 0 100 100" 
          className={`${className} transition-all duration-300 group-hover:scale-110`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle with Gradient */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="url(#mainGradient)" 
            className="group-hover:drop-shadow-lg transition-all duration-300"
          />
          
          {/* Inner Glow Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="none" 
            stroke="url(#glowGradient)" 
            strokeWidth="1" 
            opacity="0.3"
          />
          
          {/* Central Diamond/Hexagon Shape */}
          <path 
            d="M 50 25 L 65 35 L 65 65 L 50 75 L 35 65 L 35 35 Z" 
            fill="url(#diamondGradient)" 
            opacity="0.9"
            className="group-hover:opacity-100 transition-opacity duration-300"
          />
          
          {/* Financial Graph Lines */}
          <g stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9">
            {/* Rising trend line */}
            <path d="M 30 60 Q 40 50 50 45 Q 60 40 70 35" fill="none" />
            
            {/* Data points */}
            <circle cx="30" cy="60" r="2" fill="white" />
            <circle cx="40" cy="50" r="2" fill="white" />
            <circle cx="50" cy="45" r="2" fill="white" />
            <circle cx="60" cy="40" r="2" fill="white" />
            <circle cx="70" cy="35" r="2" fill="white" />
          </g>
          
          {/* Smart AI Brain Circuit Pattern */}
          <g stroke="white" strokeWidth="1.5" opacity="0.7">
            {/* Circuit connections */}
            <line x1="25" y1="30" x2="35" y2="30" />
            <line x1="65" y1="30" x2="75" y2="30" />
            <line x1="25" y1="70" x2="35" y2="70" />
            <line x1="65" y1="70" x2="75" y2="70" />
            
            {/* Circuit nodes */}
            <circle cx="25" cy="30" r="1.5" fill="white" />
            <circle cx="75" cy="30" r="1.5" fill="white" />
            <circle cx="25" cy="70" r="1.5" fill="white" />
            <circle cx="75" cy="70" r="1.5" fill="white" />
          </g>
          
          {/* Innovation Sparkles */}
          <g fill="white" opacity="0.8">
            <path d="M 20 25 L 22 23 L 20 21 L 18 23 Z" />
            <path d="M 80 25 L 82 23 L 80 21 L 78 23 Z" />
            <path d="M 20 75 L 22 73 L 20 71 L 18 73 Z" />
            <path d="M 80 75 L 82 73 L 80 71 L 78 73 Z" />
          </g>
          
          {/* Central FinPal "FP" Monogram */}
          <g fill="white" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle">
            <text x="50" y="52" fill="white" className="font-bold">
              FP
            </text>
          </g>
          
          {/* Outer Ring with Tech Pattern */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="url(#outerGradient)" 
            strokeWidth="1.5" 
            opacity="0.6"
            className="group-hover:opacity-100 transition-opacity duration-300"
          />
          
          {/* Gradient Definitions */}
          <defs>
            {/* Main background gradient */}
            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#0081A7" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
            
            {/* Diamond gradient */}
            <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0F7FA" />
            </linearGradient>
            
            {/* Glow gradient */}
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
            
            {/* Outer ring gradient */}
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#0081A7" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Enhanced Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/20 via-[#0081A7]/20 to-[#00B4D8]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110 blur-sm"></div>
      </div>
      
      {/* Logo Text with Enhanced Typography */}
      {showText && (
        <span className={`self-center font-display font-bold whitespace-nowrap bg-gradient-to-r from-[#1E3A8A] via-[#0081A7] to-[#00B4D8] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#00B4D8] group-hover:via-[#0081A7] group-hover:to-[#1E3A8A] ${textSize}`}>
          FinPal
        </span>
      )}
    </div>
  );
};

export default FinPalLogo;
