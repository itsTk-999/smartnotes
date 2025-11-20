import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Layers, Folder, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: CalendarDays, label: 'Schedule', path: '/calendar' },
    { icon: BookOpen, label: 'Notes', path: '/notes' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Layers, label: 'Study', path: '/study' },
    { icon: Folder, label: 'Vault', path: '/resources' },
  ];

  return (
    /* THE MASK CONTAINER 
       - Sits at the bottom to hide scrolling content.
       - Matches page background color.
    */
    <div className="fixed bottom-0 left-0 w-full z-[90] md:hidden">
      
      {/* Gradient Fade for smoothness */}
      <div className="absolute bottom-full left-0 w-full h-6 bg-gradient-to-t from-background dark:from-dark-bg to-transparent pointer-events-none" />

      {/* THE COMPACT DOCK 
          - Changed max-w-md to w-fit: Shrinks to fit icons exactly.
          - Added mx-auto: Centers it.
      */}
      <div className="w-fit mx-auto px-4">
        <div className="relative flex items-center justify-center gap-1 px-2 py-2 rounded-[2rem] 
          bg-white dark:bg-[#1E293B] 
          border border-gray-100 dark:border-gray-800
          shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]
          transition-colors duration-300"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className="relative z-10"
              >
                {/* Reduced w-12 to w-11 for tighter spacing */}
                <div className="relative w-11 h-11 flex items-center justify-center cursor-pointer group">
                  
                  {/* ACTIVE PILL */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-warm-orange to-red-500 shadow-md shadow-orange-500/25"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* ICON */}
                  <motion.div
                    animate={isActive ? { y: -2, scale: 1 } : { y: 0, scale: 1 }}
                    whileTap={{ scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative z-20"
                  >
                    <item.icon 
                      size={20} // Slightly smaller icon
                      strokeWidth={2.5}
                      className={`transition-colors duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`} 
                    />
                  </motion.div>

                  {/* GLOW DOT */}
                  {isActive && (
                     <motion.div
                       initial={{ opacity: 0, scale: 0 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full opacity-60 z-20"
                     />
                  )}

                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;