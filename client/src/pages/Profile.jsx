import React from 'react';
import MobileNav from '../components/Layout/MobileNav';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import Theme Context
import { ArrowLeft, Moon, Sun, LogOut, User, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme(); // Use the hook

  return (
    <div className="min-h-screen pb-24 p-4 md:p-8 transition-colors duration-300 bg-background dark:bg-dark-bg">
      
      {/* HEADER */}
      <header className="mb-8 flex items-center gap-4">
        <Link to="/" className="p-3 bg-surface dark:bg-dark-surface rounded-full shadow-sm border border-gray-100 dark:border-dark-border text-primary dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-primary dark:text-dark-text">Profile</h1>
      </header>

      {/* USER CARD */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface dark:bg-dark-surface rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-dark-border mb-8 flex items-center gap-6 transition-colors"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-warm-orange to-warm-peach flex items-center justify-center text-white text-4xl font-bold shadow-md shrink-0">
          {user?.name?.[0] || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-dark-text">{user?.name || 'Student'}</h2>
          <p className="text-secondary dark:text-dark-subtext text-sm mb-3">{user?.email}</p>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/30 text-warm-orange text-xs font-bold uppercase tracking-wide border border-orange-100 dark:border-orange-800">
            
          </div>
        </div>
      </motion.div>

      {/* SETTINGS LIST */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-bold text-secondary dark:text-dark-subtext uppercase tracking-wider ml-2">App Settings</h3>
        
        {/* THEME TOGGLE */}
        <div className="bg-surface dark:bg-dark-surface rounded-2xl p-4 border border-gray-100 dark:border-dark-border flex items-center justify-between transition-colors cursor-pointer" onClick={toggleTheme}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-warm-orange'}`}>
              {isDarkMode ? <Moon size={22} /> : <Sun size={22} />}
            </div>
            <span className="font-bold text-primary dark:text-dark-text text-lg">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          
          {/* Toggle Switch Visual */}
          <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-200'}`}>
            <motion.div 
              className="w-6 h-6 bg-white rounded-full shadow-sm"
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              animate={{ x: isDarkMode ? 24 : 0 }}
            />
          </div>
        </div>

      </motion.div>

      {/* LOGOUT BUTTON */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={logout}
        className="w-full mt-12 bg-surface dark:bg-dark-surface border border-red-100 dark:border-red-900/30 text-red-500 font-bold py-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-3 text-lg shadow-sm"
      >
        <LogOut size={22} />
        Sign Out
      </motion.button>

      <MobileNav />
    </div>
  );
};

export default Profile;