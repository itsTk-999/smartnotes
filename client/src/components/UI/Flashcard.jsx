import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen } from 'lucide-react';

const Flashcard = ({ question, topic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className="w-full h-80 bg-surface dark:bg-dark-surface rounded-3xl shadow-lg border-2 border-gray-100 dark:border-dark-border flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group transition-colors duration-300"
    >
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-warm-peach/10 dark:bg-warm-orange/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

      {/* Icon Badge */}
      <div className="mb-6 p-4 bg-orange-50 dark:bg-dark-bg rounded-full shadow-sm border border-orange-100 dark:border-dark-border group-hover:scale-110 transition-transform duration-300">
        <HelpCircle size={32} className="text-warm-orange" />
      </div>

      {/* Topic Label */}
      <div className="flex items-center gap-2 mb-4 opacity-60">
        <BookOpen size={14} className="text-secondary dark:text-dark-subtext" />
        <span className="text-xs font-bold text-secondary dark:text-dark-subtext uppercase tracking-widest">
            {topic} Challenge
        </span>
      </div>

      {/* The Question */}
      <h3 className="text-2xl md:text-3xl font-bold text-primary dark:text-dark-text leading-snug max-w-md">
        {question}
      </h3>
      
      <p className="absolute bottom-8 text-xs font-medium text-gray-400 dark:text-gray-600 italic">
        Research this topic externally to master it.
      </p>
    </motion.div>
  );
};

export default Flashcard;