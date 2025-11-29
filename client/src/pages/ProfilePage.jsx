import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CreditCard, 
  Settings, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Bell,
  Lock,
  Globe,
  Palette,
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import FinPalLogo from '../components/FinPalLogo';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-01-01',
    location: 'Mumbai, India',
    bio: 'Financial enthusiast and smart money manager.',
    currency: 'INR',
    language: 'English',
    timezone: 'Asia/Kolkata'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+91 98765 43210',
      dateOfBirth: '1990-01-01',
      location: 'Mumbai, India',
      bio: 'Financial enthusiast and smart money manager.',
      currency: 'INR',
      language: 'English',
      timezone: 'Asia/Kolkata'
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/90 to-[#0081A7]/5 p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
              <FinPalLogo className="w-8 h-8" showText={false} />
              <h1 className="text-3xl font-display font-bold text-slate-800">Your <span className="text-[#0081A7]">Command Center</span></h1>
            </div>
            <p className="text-slate-600">Take control of your financial destiny! Customize your experience and become the master of your money universe.</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#0081A7] to-[#00B4D8] text-white shadow-lg'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-[#0081A7]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-display font-semibold text-slate-800">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0081A7] text-white rounded-lg hover:bg-[#0081A7]/90 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Picture Section */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-[#0081A7] to-[#00B4D8] rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <Camera className="w-4 h-4 text-slate-600" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{user?.name}</h3>
                    <p className="text-slate-600">{user?.email}</p>
                    <p className="text-sm text-slate-500">Member since {new Date().getFullYear()}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] disabled:bg-slate-50 disabled:text-slate-500 transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 p-8">
                <h2 className="text-2xl font-display font-semibold text-slate-800 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] transition-colors"
                        />
                      </div>
                      
                      <button className="px-6 py-3 bg-[#0081A7] text-white rounded-lg hover:bg-[#0081A7]/90 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Two-Factor Authentication</h3>
                    <p className="text-slate-600 mb-4">Add an extra layer of security to your account</p>
                    <button className="px-6 py-3 bg-[#0081A7] text-white rounded-lg hover:bg-[#0081A7]/90 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 p-8">
                <h2 className="text-2xl font-display font-semibold text-slate-800 mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] transition-colors"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0081A7]/30 focus:border-[#0081A7] transition-colors"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                        <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                        <option value="America/New_York">America/New_York (UTC-5)</option>
                        <option value="Europe/London">Europe/London (UTC+0)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Data Export</h3>
                    <p className="text-slate-600 mb-4">Download your financial data and transaction history</p>
                    <button className="px-6 py-3 bg-[#0081A7] text-white rounded-lg hover:bg-[#0081A7]/90 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                  </div>
                  
                  <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
                    <p className="text-red-600 mb-4">Permanently delete your account and all associated data</p>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 p-8">
                <h2 className="text-2xl font-display font-semibold text-slate-800 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0081A7] rounded focus:ring-[#0081A7]/30" />
                        <span className="text-slate-700">Weekly financial summary</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0081A7] rounded focus:ring-[#0081A7]/30" />
                        <span className="text-slate-700">Budget alerts and reminders</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-[#0081A7] rounded focus:ring-[#0081A7]/30" />
                        <span className="text-slate-700">Marketing and promotional emails</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0081A7] rounded focus:ring-[#0081A7]/30" />
                        <span className="text-slate-700">Transaction alerts</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0081A7] rounded focus:ring-[#0081A7]/30" />
                        <span className="text-slate-700">Budget limit warnings</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-[#0081A7] rounded focus:ring-[#0081A7]/30" />
                        <span className="text-slate-700">AI insights and recommendations</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
