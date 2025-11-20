import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const VARIANTS = {
  // Standard clean card
  default: "bg-surface border-gray-200 dark:bg-dark-surface dark:border-dark-border",
  
  // Highlighted (e.g. Tasks) - Subtle Orange Tint
  sunrise: "bg-white border-orange-100 dark:bg-dark-surface dark:border-orange-900/50 relative overflow-hidden",
  
  // Focus (e.g. Study) - Subtle Blue Tint
  ocean: "bg-white border-blue-100 dark:bg-dark-surface dark:border-blue-900/50",
  
  // Creative (e.g. Stats) - Subtle Purple Tint
  lavender: "bg-white border-purple-100 dark:bg-dark-surface dark:border-purple-900/50",
};

const BentoCard = ({ 
  children, 
  className, 
  variant = 'default', 
  onClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={onClick ? { y: -4, shadow: '0 10px 30px -10px rgba(0,0,0,0.1)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={twMerge(
        clsx(
          'rounded-3xl p-6 border shadow-sm transition-all duration-300',
          // Base text colors handled globally, but ensured here:
          'text-primary dark:text-dark-text',
          VARIANTS[variant],
          onClick ? 'cursor-pointer' : '',
          className
        )
      )}
    >
      {children}
      
      {/* Decorative Gradients for specific variants (Subtle Glows) */}
      {variant === 'sunrise' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
      )}
      {variant === 'lavender' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />
      )}
       {variant === 'ocean' && (
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full -ml-10 -mb-10 pointer-events-none" />
      )}
    </motion.div>
  );
};

export default BentoCard;