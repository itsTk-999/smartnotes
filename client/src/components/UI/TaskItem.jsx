import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Clock, Trash2, PlayCircle, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

const TaskItem = ({ task, onToggle, onDelete, onFocus }) => {
  const [isLoading, setIsLoading] = useState(false);

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const handleClick = () => {
    if (task.completed) {
        onToggle(task._id);
        return;
    }
    
    setIsLoading(true);
    
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF7043', '#FFCCBC', '#4A90E2']
    });

    setTimeout(() => {
      setIsLoading(false);
      onToggle(task._id);
    }, 600);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={`group flex items-center gap-4 p-4 rounded-xl border shadow-sm hover:shadow-md transition-all mb-3 relative overflow-hidden ${
        isOverdue 
           ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50' 
           : 'bg-surface dark:bg-dark-surface border-gray-100 dark:border-dark-border hover:border-warm-peach dark:hover:border-warm-orange/50'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={clsx(
          "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors shrink-0",
          task.completed 
            ? "bg-green-500 border-green-500" 
            : isOverdue ? "border-red-400 hover:border-red-500" : "border-gray-300 dark:border-gray-600 hover:border-warm-orange"
        )}
      >
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <motion.div
              key="spinner"
              initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} exit={{ scale: 0 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Loader2 size={14} className="text-warm-orange" />
            </motion.div>
          ) : task.completed ? (
            <motion.div
              key="check"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
            >
              <Check size={14} className="text-white" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <p className={clsx(
            "font-medium transition-all truncate pr-2",
            task.completed ? "text-gray-400 dark:text-gray-600 line-through" : "text-primary dark:text-dark-text"
            )}>
            {task.text}
            </p>
            
            {/* Overdue Warning Icon */}
            {isOverdue && (
                <AlertTriangle size={16} className="text-red-500 shrink-0 animate-pulse" />
            )}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          {/* Urgency Badge */}
          <span className={clsx(
            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border",
            task.urgency === 'high' ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" :
            task.urgency === 'medium' ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800" :
            "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
          )}>
            {task.urgency}
          </span>
          
          {/* Date */}
          {task.dueDate && (
            <span className={clsx(
                "flex items-center text-xs font-medium",
                isOverdue ? "text-red-500" : "text-gray-400 dark:text-gray-500"
            )}>
              <Clock size={10} className="mr-1" /> 
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!task.completed && (
          <button 
            onClick={() => onFocus(task)}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
            title="Start Focus Timer"
          >
            <PlayCircle size={20} />
          </button>
        )}
        <button 
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
            title="Delete Task"
        >
            <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;