import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const BASE_URL = "https://smart-notes-kz6i.onrender.com/api/tasks";

  const getHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
      'Content-Type': 'application/json',
      'Authorization': userInfo ? `Bearer ${userInfo.token}` : ''
    };
  };

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('offlineTasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // --- WATCHER FOR NOTIFICATIONS ---
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
        if (diff <= 0 && diff > -60000) {
          new Notification(`Reminder: ${task.text}`, {
            body: "This task is due now!",
            icon: '/vite.svg'
          });
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // --- DIRECT API CALLS ---

  const fetchTasks = async () => {
    try {
      const response = await fetch(BASE_URL, { method: 'GET', headers: getHeaders() });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setTasks(data);
      localStorage.setItem('offlineTasks', JSON.stringify(data));
    } catch (error) {
      console.log("Offline mode: Using cached tasks.");
    }
  };

  const addTask = async (text, urgency, dueDate) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text, urgency, dueDate })
      });

      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      
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
      await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ completed: updatedTasks[taskIndex].completed })
      });
    } catch (error) {
      console.error("Failed to sync task status");
    }
  };

  const deleteTask = async (id) => {
    const filteredTasks = tasks.filter(t => t._id !== id);
    setTasks(filteredTasks);
    localStorage.setItem('offlineTasks', JSON.stringify(filteredTasks));
    
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
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