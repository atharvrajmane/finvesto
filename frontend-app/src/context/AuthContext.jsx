import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Custom hook so components can easily grab the auth state
export const useAuth = () => useContext(AuthContext);

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, verify the cookie by hitting /auth/me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get('/auth/me');
        if (res.data && res.data.data && res.data.data.user) {
          setUser(res.data.data.user);
        }
      } catch (error) {
        console.log("No valid session found.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login Function (No longer needs to manage raw tokens)
  const login = (userData) => {
    setUser(userData);
  };

  // Logout Function
  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed on server, proceeding to clear local state", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};