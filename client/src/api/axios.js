import axios from 'axios';

const instance = axios.create({
  // DIRECT CONNECTION: We are pasting the Render URL here explicitly.
  // This bypasses Vercel's routing logic completely.
  baseURL: 'https://smart-notes-kz6i.onrender.com/api', 
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;