import { Menu, X, LogOut, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, provider } from '../Firebase/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { signInUser, logoutUser, reset } from '../features/auth/authSlice';
import FinPalLogo from './FinPalLogo';
import { useNavigate } from 'react-router-dom';

const NavbarPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isSuccess } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard');
      dispatch(reset());
    }
  }, [isSuccess, navigate, dispatch]);

  // Check if user is authenticated
  const isAuthenticated = user && user.token;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      const formData = {
        name: user.displayName,
        email: user.email,
        firebaseIdToken: idToken // Send Firebase token to backend
      };

      dispatch(signInUser(formData));
    } catch (error) {
      console.error('Google login error:', error);
      // You might want to show a toast error here
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between">

        {/* Logo */}
        <a href="/" className="group relative z-20">
          <FinPalLogo className="w-9 h-9" showText={true} textSize="text-2xl" />
        </a>

        {/* Hamburger icon (mobile) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center p-2.5 text-sm text-slate-600 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-200"
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {/* Navigation Links */}
          <div className="flex items-center mr-8">
            <a
              href="/team"
              className="text-slate-600 hover:text-primary-600 font-medium text-sm px-4 py-2.5 rounded-full hover:bg-slate-50 transition-all duration-200"
            >
              Our Team
            </a>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-3 text-slate-700 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <User className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                type="button"
                className="text-slate-600 hover:text-red-600 hover:bg-red-50 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="group relative text-white bg-slate-900 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-full text-sm px-6 py-2.5 text-center inline-flex items-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg
                className="w-4 h-4 me-2 transition-transform group-hover:rotate-12"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fillRule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-6 border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-lg">
          {/* Mobile Navigation Links */}
          <div className="pt-4 pb-4 border-b border-slate-100">
            <a
              href="/team"
              className="block text-slate-600 hover:text-primary-600 font-medium text-sm px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200"
            >
              Our Team
            </a>
          </div>

          {isAuthenticated ? (
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3 text-slate-700 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <User className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                type="button"
                className="w-full text-slate-600 bg-white hover:bg-red-50 hover:text-red-600 font-medium rounded-lg text-sm px-4 py-3 text-center inline-flex items-center justify-center border border-slate-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full text-white bg-slate-900 hover:bg-slate-800 font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center justify-center shadow-lg transition-all duration-200 mt-4"
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fillRule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavbarPage;
