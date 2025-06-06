import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:5000';
  
  // Set token in axios headers when it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user data on initial load or when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/user/profile');
        setCurrentUser(res.data);
      } catch (error) {
        console.error('Error loading user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setCurrentUser(res.data.user);
    return res.data;
  };

  // Register function
  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    return res.data;
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    const res = await axios.put('/api/user/profile', profileData);
    setCurrentUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};