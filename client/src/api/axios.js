import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // Vite proxy redirects this to localhost:5000
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