import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // To check current path

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (userInfo) {
      setUser(userInfo);
    } else {
      // --- SECURITY GUARD LOGIC ---
      const path = location.pathname;
      
      // Define Public Routes (Pages you can see without logging in)
      const isPublicPage = 
        path === '/login' || 
        path === '/forgot-password' || 
        path.startsWith('/reset-password');

      // If not logged in AND not on a public page, kick to login
      if (!isPublicPage) {
        navigate('/login');
      }
    }
  }, [navigate, location]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    // Clear Offline Data
    localStorage.removeItem('offlineNotes');
    localStorage.removeItem('offlineTasks');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};