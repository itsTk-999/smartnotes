import React, { useState, useMemo } from 'react';
import MobileNav from '../components/Layout/MobileNav';
import Flashcard from '../components/UI/Flashcard';
import BentoCard from '../components/UI/BentoCard';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, BookOpen, Trophy, BrainCircuit, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../context/NotesContext';

const Flashcards = () => {
  const { notes, toggleMastery, resetTopicProgress } = useNotes();
  
  const [view, setView] = useState('selection'); 
  const [currentTopic, setCurrentTopic] = useState(null);
  const [studyQueue, setStudyQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- TRANSFORM NOTES TO CARDS ---
  const allCards = useMemo(() => {
    let cards = [];
    notes.forEach(note => {
      if (note.objectives) {
        note.objectives.forEach(obj => {
          cards.push({
            id: obj._id || obj.text,
            noteId: note._id,
            topic: note.subject,
            question: obj.text,
            isMastered: obj.isMastered
          });
        });
      }
    });
    return cards;
  }, [notes]);

  // --- GROUP BY TOPIC ---
  const topics = useMemo(() => {
    const topicMap = {};
    allCards.forEach(card => {
      if (!topicMap[card.topic]) {
        topicMap[card.topic] = { name: card.topic, total: 0, toReview: 0 };
      }
      topicMap[card.topic].total++;
      if (!card.isMastered) topicMap[card.topic].toReview++;
    });
    return Object.values(topicMap);
  }, [allCards]);

  // --- CALCULATE REMAINING FOR CURRENT TOPIC ---
  // This runs in real-time, so we know exactly how many are left when the session ends
  const remainingInCurrentTopic = useMemo(() => {
    if (!currentTopic) return 0;
    return allCards.filter(c => c.topic === currentTopic && !c.isMastered).length;
  }, [allCards, currentTopic]);

  // --- ACTIONS ---
  const startSession = (topicName) => {
    const queue = allCards.filter(c => c.topic === topicName && !c.isMastered);
    if (queue.length === 0) return;
    
    setStudyQueue(queue);
    setCurrentTopic(topicName);
    setCurrentIndex(0);
    setView('study');
  };

  const markAsMastered = () => {
    const currentCard = studyQueue[currentIndex];
    toggleMastery(currentCard.noteId, currentCard.id);
    
    if (currentIndex < studyQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView('completed');
    }
  };

  const nextCard = () => {
    if (currentIndex < studyQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setView('completed');
    }
  };

  const handleReset = async (e, topicName) => {
    e.stopPropagation();
    if(confirm(`Reset all progress for ${topicName}?`)) {
      await resetTopicProgress(topicName);
    }
  };

  const exitSession = () => {
    setView('selection');
    setCurrentTopic(null);
  };

  const progress = studyQueue.length > 0 ? ((currentIndex + 1) / studyQueue.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg transition-colors duration-300 pb-24 p-4 md:p-8 flex flex-col">
      
      <AnimatePresence mode='wait'>
        
        {/* VIEW 1: SELECTION SCREEN */}
        {view === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-4xl mx-auto w-full"
          >
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-primary dark:text-dark-text">Study Objectives</h1>
              <p className="text-secondary dark:text-dark-subtext">Select a topic to begin your session.</p>
            </header>

            {topics.length === 0 ? (
              <div className="p-12 text-center bg-surface dark:bg-dark-surface rounded-3xl border-2 border-dashed border-gray-200 dark:border-dark-border">
                <AlertCircle className="mx-auto text-warm-orange mb-3" size={40} />
                <p className="text-primary dark:text-dark-text font-bold text-lg">No objectives found.</p>
                <p className="text-sm text-secondary dark:text-dark-subtext">Go to Notes and add some objectives first!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topics.map((t) => {
                  const isMastered = t.toReview === 0;
                  
                  return (
                    <BentoCard 
                      key={t.name}
                      variant={isMastered ? 'mint' : 'ocean'} 
                      onClick={() => !isMastered && startSession(t.name)}
                      className={`flex justify-between items-center relative group transition-all h-32 ${
                        isMastered ? 'opacity-90' : 'cursor-pointer hover:scale-[1.02]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {isMastered ? (
                             <Trophy size={16} className="text-teal-600 dark:text-teal-400" />
                          ) : (
                             <BrainCircuit size={16} className="text-blue-600 dark:text-blue-400" />
                          )}
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                              isMastered ? 'text-teal-700 dark:text-teal-300' : 'text-blue-700 dark:text-blue-300'
                          }`}>
                            {t.name}
                          </span>
                        </div>

                        <h3 className={`text-2xl font-bold ${
                            isMastered ? 'text-teal-900 dark:text-teal-100' : 'text-blue-900 dark:text-blue-100'
                        }`}>
                          {isMastered ? 'Mastered!' : `${t.toReview} Pending`}
                        </h3>
                        
                        <p className={`text-xs mt-1 font-medium ${
                            isMastered ? 'text-teal-600/70 dark:text-teal-200/70' : 'text-blue-600/70 dark:text-blue-200/70'
                        }`}>
                           {t.total} cards total
                        </p>
                      </div>
                      
                      <div className={`p-3 rounded-full backdrop-blur-md shadow-sm ${
                          isMastered ? 'bg-teal-200/30 text-teal-700 dark:text-teal-200' : 'bg-blue-200/30 text-blue-700 dark:text-blue-200'
                      }`}>
                        {isMastered ? (
                          <button 
                            onClick={(e) => handleReset(e, t.name)}
                            className="hover:rotate-180 transition-transform duration-500"
                            title="Reset Progress"
                          >
                            <RefreshCw size={24} />
                          </button>
                        ) : (
                          <BookOpen size={24} />
                        )}
                      </div>
                    </BentoCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW 2: STUDY MODE */}
        {view === 'study' && (
          <motion.div 
            key="study"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col max-w-lg mx-auto w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <button onClick={exitSession} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full text-primary dark:text-dark-text transition-colors">
                <ArrowLeft size={24} />
              </button>
              <span className="text-sm font-bold text-secondary dark:text-dark-subtext uppercase tracking-wider">{currentTopic}</span>
              <span className="text-sm font-bold text-primary dark:text-dark-text">{currentIndex + 1} / {studyQueue.length}</span>
            </div>

            <div className="h-1.5 w-full bg-gray-200 dark:bg-dark-surface rounded-full overflow-hidden mb-8">
              <motion.div 
                className="h-full bg-warm-orange" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }} 
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10 mb-8">
              <Flashcard 
                question={studyQueue[currentIndex].question} 
                topic={currentTopic}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => nextCard()}
                className="py-4 px-4 rounded-2xl bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-secondary dark:text-dark-subtext font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Need Research
              </button>
              <button 
                onClick={markAsMastered}
                className="py-4 px-4 rounded-2xl bg-primary dark:bg-white text-white dark:text-primary font-bold shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                I Know This
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: COMPLETED SCREEN (CONDITIONAL) */}
        {view === 'completed' && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center"
          >
            {/* LOGIC: Check if there are still unmastered cards in this topic */}
            {remainingInCurrentTopic > 0 ? (
                // CASE A: NOT MASTERED YET (Blue Theme)
                <>
                    <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Target size={48} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-primary dark:text-dark-text mb-3">Session Complete!</h2>
                    <p className="text-secondary dark:text-dark-subtext mb-2 text-lg font-medium">
                        Keep up the effort.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
                        You still have <strong>{remainingInCurrentTopic}</strong> objectives to master in {currentTopic}.
                    </p>
                </>
            ) : (
                // CASE B: FULLY MASTERED (Green Theme)
                <>
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Trophy size={48} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-primary dark:text-dark-text mb-3">Topic Mastered!</h2>
                    <p className="text-secondary dark:text-dark-subtext mb-10 text-lg leading-relaxed">
                        You have successfully mastered all objectives for <strong>{currentTopic}</strong>. Keep up the momentum!
                    </p>
                </>
            )}
            
            <button 
              onClick={exitSession}
              className="w-full py-4 bg-primary dark:bg-white text-white dark:text-primary rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform"
            >
              Back to Topics
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <MobileNav />
    </div>
  );
};

export default Flashcards;