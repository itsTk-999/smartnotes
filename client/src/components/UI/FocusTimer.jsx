import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, CheckCircle2, Volume2, Clock, PlayCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const DURATIONS = [15, 25, 45, 60];

// --- SOUND GENERATOR (Web Audio API) ---
const playSystemSound = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'Zen Bell') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 1.5);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc.start(now);
    osc.stop(now + 1.5);
  } 
  else if (type === 'Retro Alarm') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(800, now + 0.1);
    osc.frequency.setValueAtTime(600, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
  else if (type === 'Success Chime') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554, now + 0.1);
    osc.frequency.setValueAtTime(659, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
    osc.start(now);
    osc.stop(now + 1);
  }
};

const FocusTimer = ({ task, onClose, onComplete }) => {
  const [selectedSound, setSelectedSound] = useState(() => localStorage.getItem('timerSound') || 'Zen Bell');
  const [selectedDuration, setSelectedDuration] = useState(() => parseInt(localStorage.getItem('timerDuration')) || 25);

  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60); 
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleFinish();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleFinish = () => {
    setIsActive(false);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    playSystemSound(selectedSound);

    if (Notification.permission === 'granted') {
      new Notification("Focus Session Complete! 🎉", {
        body: `Great job on "${task.text}". Take a break!`,
        icon: '/vite.svg'
      });
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSoundChange = (soundName) => {
    setSelectedSound(soundName);
    localStorage.setItem('timerSound', soundName);
    playSystemSound(soundName); 
  };

  const handleTestSound = (e, soundName) => {
    e.stopPropagation();
    playSystemSound(soundName);
  };

  const handleDurationChange = (mins) => {
    const validMins = Math.max(1, Math.min(999, Number(mins)));
    setSelectedDuration(validMins);
    setTimeLeft(validMins * 60); 
    setIsActive(false);
    localStorage.setItem('timerDuration', validMins);
  };

  const handleCompleteTask = () => {
    onComplete(task._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface dark:bg-dark-surface w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-gray-200 dark:border-dark-border transition-colors"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-warm-peach to-warm-orange" />
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-orange-100 dark:bg-orange-900/30 text-warm-orange' : 'hover:bg-gray-100 dark:hover:bg-dark-bg text-secondary dark:text-dark-subtext'}`}
          >
            <Volume2 size={20} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full text-secondary dark:text-dark-subtext">
            <X size={20} />
          </button>
        </div>

        <div className="text-center mb-4 mt-2">
          <span className="text-xs font-bold text-warm-orange uppercase tracking-wider">Focus Mode</span>
          <h2 className="text-xl font-bold text-primary dark:text-dark-text mt-2 line-clamp-2">{task.text}</h2>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border"
            >
              <div className="p-4 space-y-4">
                
                {/* Duration Input */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-secondary dark:text-dark-subtext">
                    <Clock size={14} />
                    <span className="text-xs font-bold uppercase">Session Length (Min)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {DURATIONS.map((mins) => (
                      <button
                        key={mins}
                        onClick={() => handleDurationChange(mins)}
                        className={`py-2 rounded-lg text-sm font-bold transition-all ${
                          selectedDuration === mins 
                            ? 'bg-warm-orange text-white shadow-md' 
                            : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border hover:border-warm-orange dark:hover:border-warm-orange'
                        }`}
                      >
                        {mins}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg p-2">
                    <span className="text-sm text-gray-400 font-medium pl-2">Custom:</span>
                    <input 
                        type="number" 
                        min="1" max="999"
                        value={selectedDuration}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        className="w-full outline-none text-primary dark:text-dark-text font-bold text-lg bg-transparent"
                    />
                  </div>
                </div>

                {/* Sound Selector */}
                <div>
                   <div className="flex items-center gap-2 mb-2 text-secondary dark:text-dark-subtext">
                    <Volume2 size={14} />
                    <span className="text-xs font-bold uppercase">Alarm Sound</span>
                  </div>
                  <div className="space-y-1">
                    {['Zen Bell', 'Success Chime', 'Retro Alarm'].map((sound) => (
                      <div 
                        key={sound}
                        onClick={() => handleSoundChange(sound)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          selectedSound === sound 
                            ? 'bg-white dark:bg-dark-surface text-warm-orange border border-orange-200 dark:border-orange-900' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-bg'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedSound === sound && <CheckCircle2 size={14} />}
                          {sound}
                        </div>
                        <button 
                          onClick={(e) => handleTestSound(e, sound)}
                          className="p-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-400 hover:text-warm-orange"
                          title="Test Sound"
                        >
                          <PlayCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer Display */}
        <div className="flex justify-center mb-10 relative">
           {isActive && (
             <div className="absolute inset-0 bg-warm-peach/20 blur-3xl rounded-full animate-pulse" />
           )}
          <div className="text-7xl font-bold text-primary dark:text-dark-text font-mono tracking-tighter relative z-10">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Play Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button onClick={resetTimer} className="p-4 rounded-full bg-gray-100 dark:bg-dark-bg text-secondary dark:text-dark-subtext hover:bg-gray-200 dark:hover:bg-dark-border transition-colors">
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform ${
              isActive ? 'bg-warm-orange' : 'bg-primary dark:bg-white dark:text-primary'
            }`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
        </div>

        <button 
          onClick={handleCompleteTask}
          className="w-full py-3 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <CheckCircle2 size={20} /> Mark as Complete
        </button>

      </motion.div>
    </div>
  );
};

export default FocusTimer;