import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Layers, Folder, CalendarDays, Sparkles, LogOut, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const DesktopSidebar = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: CalendarDays, label: 'Schedule', path: '/calendar' },
    { icon: BookOpen, label: 'Notes', path: '/notes' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Layers, label: 'Study', path: '/study' },
    { icon: Folder, label: 'Vault', path: '/resources' },
  ];

  return (
    // Fixed Sidebar Container (Hidden on mobile)
    <div className="hidden md:flex flex-col justify-between w-20 h-screen bg-surface dark:bg-dark-surface border-r border-gray-100 dark:border-dark-border p-3 shadow-lg transition-colors duration-300 relative z-30">
      
      {/* Top Section: Logo & Main Navigation */}
      <nav className="flex flex-col items-center gap-3 mt-4">
        {/* Logo/App Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-warm-orange to-red-500 rounded-xl flex items-center justify-center text-white shadow-md mb-4">
          <Sparkles size={24} />
        </div>

        {/* Navigation Links */}
        <div className="space-y-2 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink 
                key={item.label} 
                to={item.path} 
                className="relative block"
              >
                <motion.div
                  layoutId="sidebar-pill"
                  className={`w-full h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary dark:bg-white text-white dark:text-primary shadow-md' 
                      : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <item.icon size={22} strokeWidth={2.5} />
                </motion.div>
                
                {/* Optional: Label Pop-out on Hover (Desktop Feature) */}
                <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block">
                    {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section: Settings & Logout */}
      <div className="flex flex-col items-center gap-2 mb-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-12 h-12 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;