import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  LogOut,
  Menu,
  X,
  User,
  InspectIcon,
  Trophy
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import FinPalLogo from '../FinPalLogo';

const SidebarComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close user dropdown when route changes
  useEffect(() => {
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
    window.location.reload(); // Force reload to update landing page
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', onClick: () => navigate('/dashboard'), active: location.pathname === '/dashboard' },
    { icon: TrendingUp, label: 'Income', onClick: () => navigate('/dashboard/income'), active: location.pathname === '/dashboard/income' },
    { icon: TrendingDown, label: 'Expenses', onClick: () => navigate('/dashboard/expenses'), active: location.pathname === '/dashboard/expenses' },
    { icon: InspectIcon, label: 'Genie', onClick: () => navigate('/dashboard/finsight'), active: location.pathname === '/dashboard/finsight' },
    { icon: Trophy, label: 'Challenges', onClick: () => navigate('/dashboard/challenges'), active: location.pathname === '/dashboard/challenges' },
    { icon: User, label: 'Profile', onClick: () => navigate('/dashboard/profile'), active: location.pathname === '/dashboard/profile' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout, active: false }
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-[#0081A7]/20 shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1),_0_1px_2px_-1px_rgb(0_0_0_/_0.1)]">
        <div className="px-6 py-4 lg:px-8 lg:pl-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center p-2.5 text-sm text-[#0081A7] rounded-lg sm:hidden hover:bg-[#0081A7]/10 focus:outline-none focus:ring-2 focus:ring-[#0081A7]/30 transition-all duration-200"
              >
                <span className="sr-only">Open sidebar</span>
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <a href="/" className="ms-2 md:me-24 group">
                <FinPalLogo className="w-8 h-8" showText={true} textSize="text-xl sm:text-2xl" />
              </a>
            </div>

            {/* User menu */}
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex text-sm bg-gradient-to-r from-[#0081A7] to-[#00B4D8] rounded-full focus:ring-2 focus:ring-[#0081A7]/30 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* User dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 my-4 text-base list-none bg-white/95 backdrop-blur-xl divide-y divide-[#0081A7]/10 rounded-xl shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),_0_8px_10px_-6px_rgb(0_0_0_/_0.1)] border border-[#0081A7]/20 min-w-48">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-slate-900 font-medium">{user?.name}</p>
                      <p className="text-sm font-normal text-slate-600 truncate">{user?.email}</p>
                    </div>
                    <ul className="py-1">
                      <li><button onClick={() => navigate('/dashboard/profile')} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-[#0081A7]/5 hover:text-[#0081A7] transition-colors rounded-lg mx-1">Profile</button></li>
                      <li><button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg mx-1">Sign out</button></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm sm:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white/95 backdrop-blur-xl border-r border-[#0081A7]/20 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),_0_8px_10px_-6px_rgb(0_0_0_/_0.1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-6 pb-4 overflow-y-auto bg-gradient-to-b from-white/95 to-[#0081A7]/5 backdrop-blur-xl">
          <ul className="space-y-3 font-medium mt-6">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <button
                    onClick={item.onClick}
                    className={`group w-full flex items-center p-4 rounded-xl transition-all duration-200 ${item.active
                        ? 'bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),_0_4px_6px_-2px_rgb(0_0_0_/_0.1)]'
                        : 'text-slate-700 hover:bg-[#0081A7]/5 hover:text-[#0081A7] hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),_0_2px_4px_-2px_rgb(0_0_0_/_0.1)]'
                      } hover:scale-[1.02] border border-transparent ${item.active ? 'border-[#0081A7]/20' : 'hover:border-[#0081A7]/20'
                      }`}
                  >
                    <IconComponent className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${item.active ? 'text-white' : 'text-slate-500 group-hover:text-[#0081A7]'
                      }`} />
                    <span className="ms-3 font-medium">{item.label}</span>
                    {item.active && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Bottom section with user info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-gradient-to-r from-[#0081A7]/5 to-[#00B4D8]/5 rounded-xl border border-[#0081A7]/20 backdrop-blur-sm shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Click outside to close user dropdown */}
      {isUserDropdownOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setIsUserDropdownOpen(false)} />
      )}
    </>
  );
};

export default SidebarComponent;
