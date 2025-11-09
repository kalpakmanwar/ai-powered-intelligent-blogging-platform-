import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Set token in axios instance
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      return storedToken;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { token: newToken, user: userData } = response.data;
      
      // Store token and user
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set in axios instance
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/register', { username, email, password });
      const { token: newToken, user: userData } = response.data;
      
      // Store token and user
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set in axios instance
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors
        if (errorData.details) {
          const details = errorData.details;
          const fieldErrors = Object.entries(details)
            .map(([field, message]) => `${field}: ${message}`)
            .join(', ');
          errorMessage = fieldErrors || errorData.error || errorMessage;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove from axios instance
    delete axiosInstance.defaults.headers.common['Authorization'];
    
    // Update state
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

