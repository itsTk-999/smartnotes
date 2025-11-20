import React, { useState } from 'react';
import MobileNav from '../components/Layout/MobileNav';
import BentoCard from '../components/UI/BentoCard';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import ReactCalendar from 'react-calendar';
import { motion } from 'framer-motion';

const Calendar = () => {
  const { tasks, toggleTask } = useTasks();
  const [date, setDate] = useState(new Date());

  // Helper: Check if a date has tasks
  const hasTaskOnDate = (dateToCheck) => {
    return tasks.some(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === dateToCheck.getDate() &&
        taskDate.getMonth() === dateToCheck.getMonth() &&
        taskDate.getFullYear() === dateToCheck.getFullYear() &&
        !task.completed
      );
    });
  };

  // Filter tasks for selected date
  const selectedTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

  selectedTasks.sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-300 pb-24 p-4 md:p-8 relative">
      
      <header className="max-w-5xl mx-auto mb-8 flex items-center gap-3">
        <div className="p-3 bg-warm-orange rounded-2xl text-white shadow-lg">
            <CalendarIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-dark-text">Schedule</h1>
          <p className="text-secondary dark:text-dark-subtext">Plan your deadlines effectively.</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* CALENDAR WIDGET */}
        <div className="md:col-span-7 lg:col-span-8">
            <BentoCard className="bg-surface dark:bg-dark-surface p-6 min-h-[450px] flex flex-col relative overflow-hidden transition-colors">
                {/* Decorative Gradient Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-warm-peach to-warm-orange" />
                
                {/* Calendar Instance */}
                <div className="custom-calendar-wrapper h-full flex flex-col justify-center">
                    <ReactCalendar 
                        onChange={setDate} 
                        value={date}
                        prevLabel={<ChevronLeft size={24} className="text-primary dark:text-dark-text hover:text-warm-orange transition-colors" />}
                        nextLabel={<ChevronRight size={24} className="text-primary dark:text-dark-text hover:text-warm-orange transition-colors" />}
                        tileClassName={({ date, view }) => {
                            if (view === 'month' && hasTaskOnDate(date)) {
                                return 'has-task'; 
                            }
                        }}
                    />
                </div>
            </BentoCard>
        </div>

        {/* SELECTED DAY VIEW */}
        <div className="md:col-span-5 lg:col-span-4">
            <div className="bg-surface/60 dark:bg-dark-surface/60 backdrop-blur-sm rounded-3xl p-6 border border-gray-200 dark:border-dark-border h-full flex flex-col transition-colors">
                <h2 className="text-2xl font-bold text-primary dark:text-dark-text mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                </h2>
                <p className="text-warm-orange font-bold uppercase tracking-wider text-sm mb-6">
                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>

                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedTasks.length > 0 ? (
                        <ul className="space-y-3">
                            {selectedTasks.map((task) => (
                                <motion.li 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={task._id} 
                                    onClick={() => toggleTask(task._id)}
                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                                        task.completed 
                                            ? 'bg-gray-50 dark:bg-dark-bg/50 border-transparent opacity-60' 
                                            : 'bg-white dark:bg-dark-bg border-gray-100 dark:border-dark-border hover:border-warm-orange dark:hover:border-warm-orange shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                            task.completed 
                                                ? 'bg-green-500 border-green-500' 
                                                : 'border-gray-300 dark:border-gray-600 group-hover:border-warm-orange'
                                        }`}>
                                            {task.completed && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold leading-tight ${
                                                task.completed 
                                                    ? 'text-gray-400 dark:text-gray-600 line-through' 
                                                    : 'text-primary dark:text-dark-text'
                                            }`}>
                                                {task.text}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                    task.urgency === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                    task.urgency === 'medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                    {task.urgency}
                                                </span>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                    <Clock size={10} /> Due today
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} className="text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="font-bold text-primary dark:text-dark-text">No tasks for this day.</p>
                            <p className="text-sm text-secondary dark:text-dark-subtext">Enjoy your free time!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>

      <MobileNav />
    </div>
  );
};

export default Calendar;