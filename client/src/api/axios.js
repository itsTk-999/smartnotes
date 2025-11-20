

import axios from 'axios';

// --- THE MASTER CONNECTION ---
const instance = axios.create({
  // We hardcode the live Render URL here. 
  // This fixes Notes, Tasks, Flashcards, and Library all at once.
  baseURL: 'https://smart-notes-kz6i.onrender.com/api', 
});

// Automatically add the Token to every request if the user is logged in
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;