import React, { createContext, useState, useContext, useEffect } from 'react';

const TimeTrackerContext = createContext();

export const useTimeTracker = () => useContext(TimeTrackerContext);

export const TimeTrackerProvider = ({ children }) => {
  // Initial State: Load from local storage or start at 0
  const [weeklyStats, setWeeklyStats] = useState(() => {
    const saved = localStorage.getItem('studyStats');
    return saved ? JSON.parse(saved) : {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };
  });

  // The "Stopwatch" Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"...

      setWeeklyStats(prev => {
        const updated = {
          ...prev,
          [dayName]: (prev[dayName] || 0) + 1 // Add 1 second
        };
        
        // Save to storage (Debouncing this in prod is better, but this is fine for now)
        localStorage.setItem('studyStats', JSON.stringify(updated));
        return updated;
      });

    }, 1000); // Run every second

    return () => clearInterval(interval);
  }, []);

  // Helper: Get total hours for the week
  const getTotalHours = () => {
    const totalSeconds = Object.values(weeklyStats).reduce((a, b) => a + b, 0);
    return (totalSeconds / 3600).toFixed(1); // Convert to hours
  };

  return (
    <TimeTrackerContext.Provider value={{ weeklyStats, getTotalHours }}>
      {children}
    </TimeTrackerContext.Provider>
  );
};