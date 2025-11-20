import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://smart-notes-kz6i.onrender.com/', // ← replace this with your Render URL
});

// Automatically add the Token to every request if it exists
instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;
