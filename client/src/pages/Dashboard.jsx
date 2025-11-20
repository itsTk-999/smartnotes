import React, { useMemo } from 'react';
import BentoCard from '../components/UI/BentoCard';
import MobileNav from '../components/Layout/MobileNav';
import { ArrowRight, Clock, BookOpen, CheckCircle2, Activity, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useTasks } from '../context/TaskContext';
import { useTimeTracker } from '../context/TimeTrackerContext';
import { Link, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const { notes } = useNotes();
  const { tasks, toggleTask } = useTasks();
  const { weeklyStats, getTotalHours } = useTimeTracker();
  const navigate = useNavigate();

  // --- LIVE CHART DATA CONFIGURATION ---
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      subject: day,
      // Convert Seconds to Hours (we use Math.max(0.2) so empty days still show a tiny dot)
      A: Math.max(0.2, parseFloat((weeklyStats[day] / 3600).toFixed(2))), 
      fullMark: 10 
    }));
  }, [weeklyStats]);

  // Custom Tooltip (Adapts to Dark Mode)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const hours = Math.floor(val);
      const minutes = Math.round((val - hours) * 60);
      return (
        <div className="bg-surface dark:bg-dark-surface text-primary dark:text-dark-text text-xs font-bold py-2 px-3 rounded-xl shadow-xl border border-gray-100 dark:border-dark-border">
          <span className="text-warm-orange uppercase tracking-wider mr-1">{label}:</span>
          {hours}h {minutes}m
        </div>
      );
    }
    return null;
  };

  // Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get Top 3 Pending Tasks
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  // Calculate Smart Subject (Most unmastered objectives)
  const smartSubject = useMemo(() => {
    const topicCounts = {};
    notes.forEach(note => {
      if (note.objectives) {
        note.objectives.forEach(obj => {
          if (!obj.isMastered) {
            topicCounts[note.subject] = (topicCounts[note.subject] || 0) + 1;
          }
        });
      }
    });
    const topSubject = Object.keys(topicCounts).reduce((a, b) => topicCounts[a] > topicCounts[b] ? a : b, null);
    return topSubject ? { name: topSubject, count: topicCounts[topSubject] } : null;
  }, [notes]);

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-300 pb-32 md:pb-10 p-4 md:p-8">
      
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-primary dark:text-dark-text tracking-tight transition-colors">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-orange to-red-500">{user?.name?.split(' ')[0] || 'Scholar'}</span>
          </h1>
          <p className="text-secondary dark:text-dark-subtext mt-1 font-medium">Ready to crush your goals?</p>
        </div>
        
        {/* Avatar Link */}
        <Link to="/profile">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border flex items-center justify-center text-warm-orange font-bold text-xl shadow-sm cursor-pointer hover:scale-105 transition-transform">
             {user?.name?.[0] || 'U'}
          </div>
        </Link>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        
        {/* 1. UP NEXT TASKS CARD -> Variant: SUNRISE (Warm Orange Theme) */}
        <BentoCard variant="sunrise" className="col-span-1 md:col-span-1 h-64 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-warm-orange">
                <Clock size={20} />
            </div>
            <h3 className="font-bold text-lg text-primary dark:text-dark-text">Up Next</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {pendingTasks.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <CheckCircle2 size={32} className="mb-2 text-warm-orange" />
                    <p className="text-sm font-medium text-secondary dark:text-dark-subtext">All clear! No pending tasks.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                {pendingTasks.map((task) => (
                    <li key={task._id} className="flex items-center gap-3 p-3 bg-background dark:bg-dark-bg rounded-xl border border-transparent hover:border-warm-orange/50 transition-colors cursor-pointer group" onClick={() => toggleTask(task._id)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${task.urgency === 'high' ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            <div className="w-2.5 h-2.5 bg-transparent rounded-full group-hover:bg-warm-orange transition-colors" />
                        </div>
                        <span className="text-sm font-medium line-clamp-1 text-primary dark:text-dark-text">{task.text}</span>
                    </li>
                ))}
                </ul>
            )}
          </div>
        </BentoCard>

        {/* 2. LIVE ACTIVITY CHART CARD -> Variant: LAVENDER (Purple Theme) */}
        <BentoCard variant="lavender" className="col-span-1 md:col-span-2 h-64 flex items-center justify-between relative overflow-hidden">
           {/* Text Info Section */}
           <div className="z-10 flex flex-col justify-between h-full py-2 pl-2">
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-accent-purple">
                        <Activity size={20} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-secondary dark:text-dark-subtext">Live Activity</span>
                </div>
                <p className="text-sm text-primary dark:text-dark-text font-medium max-w-[180px] leading-relaxed">
                    Tracking your daily focus sessions in real-time.
                </p>
             </div>
             <div>
                <span className="text-4xl font-black text-primary dark:text-white block tracking-tight">{getTotalHours()}h</span>
                <span className="text-[10px] font-bold text-accent-purple bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">TOTAL FOCUS TIME</span>
             </div>
           </div>

           {/* Radar Chart Section */}
           <div className="w-[65%] h-[130%] -mr-8 mt-6">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#94A3B8" strokeOpacity={0.2} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 'bold' }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Radar
                    name="Hours"
                    dataKey="A"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
             </ResponsiveContainer>
           </div>
        </BentoCard>

        {/* 3. SMART SUGGESTION CARD -> Variant: OCEAN (Blue Theme) */}
        <BentoCard variant="ocean" className="col-span-1 md:col-span-3 flex items-center justify-between h-36 px-8 relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2">
               <Sparkles size={20} className="text-blue-500" />
               <span className="text-xs font-bold uppercase tracking-wider text-secondary dark:text-dark-subtext">Recommended Focus</span>
             </div>
             
             {smartSubject ? (
                 <h3 className="text-2xl font-bold text-primary dark:text-white">{smartSubject.name}</h3>
             ) : (
                 <h3 className="text-2xl font-bold text-primary dark:text-white">Free Time</h3>
             )}
             
             <p className="text-sm text-secondary dark:text-dark-subtext mt-1">
                {smartSubject ? `You have ${smartSubject.count} items pending review.` : "Explore a new topic or take a rest."}
             </p>
           </div>

           <button 
             onClick={() => navigate('/study')}
             className="px-8 py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-3 z-10"
           >
             {smartSubject ? 'Resume' : 'Start'} <ArrowRight size={20} />
           </button>
           
           {/* Decorative Gradient Overlay */}
           <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 dark:from-blue-900/20 to-transparent pointer-events-none" />
        </BentoCard>

      </div>

      <MobileNav />
    </div>
  );
};

export default Dashboard;