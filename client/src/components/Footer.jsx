import React from 'react';
import FinPalLogo from './FinPalLogo';

const FooterPage = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-[#0081A7]/5 to-[#00B4D8]/10 border-t border-[#0081A7]/20">
      <div className="mx-auto w-full max-w-7xl p-6 py-12 lg:py-16 flex flex-col items-center justify-center">
        <a href="/" className="group mb-4">
          <FinPalLogo className="w-8 h-8" showText={true} textSize="text-2xl" />
        </a>
        <p className="text-sm text-slate-600 mb-4 text-center font-medium">
          Smart financial tracking & expense management
        </p>
        
        {/* Footer Links */}
        <div className="flex gap-6 mb-4">
          <a
            href="/team"
            className="text-[#0081A7] hover:text-[#006B8A] text-sm font-medium transition-colors duration-200"
          >
            Our Team
          </a>
        </div>
        
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#0081A7]/30 to-transparent"></div>
        {/* <span className="text-xs text-slate-500 mt-4">
          © 2025 FinPal. All Rights Reserved.
        </span> */}
      </div>
    </footer>
  );
};

export default FooterPage;