import React, { useState } from 'react';
import MobileNav from '../components/Layout/MobileNav';
import TaskItem from '../components/UI/TaskItem';
import FocusTimer from '../components/UI/FocusTimer'; 
import { Plus, CalendarClock, Bell, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext'; 
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  
  // State
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [focusedTask, setFocusedTask] = useState(null); 

  // Sort: High Urgency > Overdue > Date Created
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    if (a.urgency === 'high' && b.urgency !== 'high') return -1;
    if (b.urgency === 'high' && a.urgency !== 'high') return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText, urgency, dueDate);
    setNewTaskText('');
    setDueDate('');
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-300 pb-24 p-4 md:p-8">
      
      {/* Focus Timer Modal */}
      <AnimatePresence>
        {focusedTask && (
          <FocusTimer 
            task={focusedTask} 
            onClose={() => setFocusedTask(null)} 
            onComplete={(id) => {
                toggleTask(id);
                setFocusedTask(null);
            }}
          />
        )}
      </AnimatePresence>

      <header className="max-w-2xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-dark-text">Tasks</h1>
          <p className="text-secondary dark:text-dark-subtext">Prioritize and execute.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`p-3 rounded-full shadow-lg transition-transform ${isAdding ? 'bg-gray-200 dark:bg-gray-700 text-primary dark:text-white rotate-45' : 'bg-primary dark:bg-white text-white dark:text-primary hover:scale-110'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="max-w-2xl mx-auto">
        
        {/* ADD TASK FORM */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-surface dark:bg-dark-surface p-4 rounded-2xl shadow-sm border border-warm-orange relative transition-colors">
                
                {/* Text Input */}
                <input 
                  autoFocus
                  className="w-full text-lg outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-4 bg-transparent text-primary dark:text-dark-text"
                  placeholder="What needs to be done?"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex flex-wrap gap-3 items-center">
                    
                    {/* Urgency Toggles */}
                    <div className="flex gap-1 bg-gray-100 dark:bg-dark-bg rounded-lg p-1 transition-colors">
                        {['low', 'medium', 'high'].map(level => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => setUrgency(level)}
                            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-colors ${
                            urgency === level 
                                ? (level === 'high' ? 'bg-surface dark:bg-dark-surface text-red-500 shadow-sm' : level === 'medium' ? 'bg-surface dark:bg-dark-surface text-orange-500 shadow-sm' : 'bg-surface dark:bg-dark-surface text-blue-500 shadow-sm')
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                        >
                            {level}
                        </button>
                        ))}
                    </div>

                    {/* Date Picker */}
                    <div className="relative flex items-center">
                        <div className="absolute left-3 text-gray-400 pointer-events-none">
                            <CalendarClock size={16} />
                        </div>
                        <input 
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            // "color-scheme: dark" forces the browser picker to be dark
                            style={{ colorScheme: 'light dark' }} 
                            className="pl-9 pr-3 py-1.5 bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg outline-none focus:ring-2 ring-warm-orange/20 uppercase tracking-wide"
                        />
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="bg-warm-orange text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center">
                    <Bell size={16} /> Set Reminder
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* TASK LIST */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 ml-1">
             <h2 className="text-sm font-bold text-secondary dark:text-dark-subtext uppercase tracking-wider">To Do</h2>
             <span className="text-xs bg-gray-200 dark:bg-dark-surface text-primary dark:text-dark-text px-2 py-0.5 rounded-md font-bold">
                {tasks.filter(t => !t.completed).length}
             </span>
          </div>
          
          <AnimatePresence mode='popLayout'>
            {sortedTasks.filter(t => !t.completed).map(task => (
              <TaskItem 
                key={task._id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask}
                onFocus={setFocusedTask} 
              />
            ))}
          </AnimatePresence>

          {tasks.filter(t => !t.completed).length === 0 && (
            <div className="p-10 text-center border-2 border-dashed border-gray-200 dark:border-dark-border rounded-3xl opacity-60">
              <CheckCircle2 size={48} className="mx-auto mb-3 text-warm-orange" />
              <p className="text-primary dark:text-dark-text font-medium">All caught up!</p>
              <p className="text-sm text-secondary dark:text-dark-subtext">Enjoy your free time.</p>
            </div>
          )}
        </div>

        {/* COMPLETED TASKS */}
        {tasks.filter(t => t.completed).length > 0 && (
          <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-sm font-bold text-secondary dark:text-dark-subtext uppercase tracking-wider mb-4 ml-1">Completed</h2>
            {tasks.filter(t => t.completed).map(task => (
              <TaskItem 
                key={task._id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask}
                onFocus={() => {}} 
              />
            ))}
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default Tasks;