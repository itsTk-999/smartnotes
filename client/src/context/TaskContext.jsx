import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  // 1. LOAD FROM LOCAL STORAGE
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('offlineTasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // --- NEW: NOTIFICATION WATCHER ---
  // Checks every minute if a task is due
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      
      tasks.forEach(task => {
        if (task.completed || !task.dueDate) return;
        
        const taskDate = new Date(task.dueDate);
        const diff = taskDate - now;

        // If task is due within the last 60 seconds (so we don't notify twice)
        // and it hasn't passed significantly yet
        if (diff <= 0 && diff > -60000) {
          new Notification(`Reminder: ${task.text}`, {
            body: "This task is due now! Let's get it done.",
            icon: '/vite.svg'
          });
          
          // Optional: Play a subtle sound
          const audio = new Audio('https://cdn.freesound.org/previews/536/536774_11648529-lq.mp3'); // Zen Bell
          audio.play().catch(e => console.log(e));
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
      localStorage.setItem('offlineTasks', JSON.stringify(data));
    } catch (error) {
      console.log("Offline mode: Using cached tasks.");
    }
  };

  // --- UPDATED ADD TASK (Accepts dueDate) ---
  const addTask = async (text, urgency, dueDate) => {
    try {
      const { data } = await api.post('/tasks', { text, urgency, dueDate });
      
      const updatedTasks = [data, ...tasks];
      setTasks(updatedTasks);
      localStorage.setItem('offlineTasks', JSON.stringify(updatedTasks));

    } catch (error) {
      alert("You are offline. Task cannot be created.");
    }
  };

  const toggleTask = async (id) => {
    const taskIndex = tasks.findIndex(t => t._id === id);
    if (taskIndex === -1) return;

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
    
    setTasks(updatedTasks);
    localStorage.setItem('offlineTasks', JSON.stringify(updatedTasks));

    try {
      await api.put(`/tasks/${id}`, { completed: updatedTasks[taskIndex].completed });
    } catch (error) {
      console.error("Failed to sync task status");
    }
  };

  const deleteTask = async (id) => {
    const filteredTasks = tasks.filter(t => t._id !== id);
    
    setTasks(filteredTasks);
    localStorage.setItem('offlineTasks', JSON.stringify(filteredTasks));
    
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error("Failed to sync delete");
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};