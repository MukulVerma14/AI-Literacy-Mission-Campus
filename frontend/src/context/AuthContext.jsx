import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('ailmc_token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('ailmc_role') || null);
  const [email, setEmail] = useState(() => localStorage.getItem('ailmc_email') || null);
  const [userId, setUserId] = useState(() => localStorage.getItem('ailmc_userId') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When state changes, synchronize to localStorage
    if (token) {
      localStorage.setItem('ailmc_token', token);
      localStorage.setItem('ailmc_role', role);
      localStorage.setItem('ailmc_email', email);
      localStorage.setItem('ailmc_userId', userId);
    } else {
      localStorage.removeItem('ailmc_token');
      localStorage.removeItem('ailmc_role');
      localStorage.removeItem('ailmc_email');
      localStorage.removeItem('ailmc_userId');
    }
    setLoading(false);
  }, [token, role, email, userId]);

  const loginUser = (authData) => {
    setToken(authData.token);
    setRole(authData.role);
    setEmail(authData.email);
    setUserId(authData.userId);
  };

  const logoutUser = () => {
    setToken(null);
    setRole(null);
    setEmail(null);
    setUserId(null);
    // Explicitly clean up storage
    localStorage.removeItem('ailmc_token');
    localStorage.removeItem('ailmc_role');
    localStorage.removeItem('ailmc_email');
    localStorage.removeItem('ailmc_userId');
  };

  const value = {
    token,
    role,
    email,
    userId,
    loading,
    isAuthenticated: !!token,
    login: loginUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
