import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, X, Volume2, Music, Loader2, PauseCircle, PlayCircle } from 'lucide-react';

// --- SINGLE TRACK CONFIGURATION ---
const LOFI_TRACK = { 
  id: 'lofi', 
  name: 'Lofi Study Beats', 
  icon: Music, 
  src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  color: 'text-purple-500 bg-purple-50 border-purple-200'
};

const ZenPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef(new Audio());

  const togglePlay = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      // Stop Logic
      audio.pause();
      setIsPlaying(false);
    } else {
      // Play Logic
      setIsLoading(true);
      
      if (audio.src !== LOFI_TRACK.src) {
        audio.src = LOFI_TRACK.src;
        audio.loop = true;
      }
      
      audio.volume = volume;
      
      audio.play()
        .then(() => {
          setIsLoading(false);
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Playback failed:", e);
          setIsLoading(false);
          setIsPlaying(false);
        });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      audio.pause();
      audio.src = "";
    };
  }, []);

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-colors ${
          isPlaying ? 'bg-accent-purple animate-pulse-slow' : 'bg-primary dark:bg-white dark:text-primary'
        }`}
      >
        {isOpen ? <X size={24} /> : (
            isLoading ? <Loader2 size={24} className="animate-spin" /> : <Headphones size={24} />
        )}
        
        {isPlaying && !isOpen && !isLoading && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
        )}
      </motion.button>

      {/* The Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-40 md:bottom-24 right-4 md:right-8 z-50 w-80 bg-surface dark:bg-dark-surface backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-border p-6 overflow-hidden transition-colors"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-primary dark:text-dark-text uppercase tracking-wider">Zen Mode</h3>
              <div className="flex items-center gap-2 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Music size={14} className="text-accent-purple" />
                <span className="text-xs font-bold text-accent-purple">Lofi Station</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={togglePlay}
                disabled={isLoading}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg mb-4 ${
                  isPlaying 
                    ? 'bg-accent-purple text-white hover:scale-105' 
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-dark-border'
                }`}
              >
                {isLoading ? (
                  <Loader2 size={40} className="animate-spin" />
                ) : isPlaying ? (
                  <PauseCircle size={48} />
                ) : (
                  <PlayCircle size={48} className="ml-1" />
                )}
              </button>
              
              <p className="text-sm font-bold text-primary dark:text-dark-text">
                {isLoading ? "Loading Audio..." : isPlaying ? "Focusing..." : "Start Session"}
              </p>
              
              {/* Visualizer Animation */}
              {isPlaying && !isLoading && (
                 <div className="flex gap-1 items-end h-6 mt-3">
                    <motion.div animate={{ height: [8, 24, 8] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-purple-400 rounded-full" />
                    <motion.div animate={{ height: [12, 32, 12] }} transition={{ repeat: Infinity, duration: 1.1 }} className="w-1.5 bg-purple-500 rounded-full" />
                    <motion.div animate={{ height: [8, 20, 8] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1.5 bg-purple-400 rounded-full" />
                    <motion.div animate={{ height: [10, 28, 10] }} transition={{ repeat: Infinity, duration: 1.3 }} className="w-1.5 bg-purple-500 rounded-full" />
                 </div>
              )}
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-dark-bg rounded-xl p-3">
              <Volume2 size={18} className="text-gray-500 dark:text-dark-subtext" />
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-purple"
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZenPlayer;