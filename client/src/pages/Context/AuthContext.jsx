// src/pages/Context/AuthContext.js (Corrected)

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [user, setUser] = useState(null);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const loginAdmin = (newAdminToken) => {
    localStorage.setItem('adminToken', newAdminToken);
    setAdminToken(newAdminToken);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };
  
  // The `value` object that will be available to consumers
  const value = {
    token,
    user,
    setUser,
    login,
    logout,
    isAuthenticated: !!token, 

    adminToken,
    loginAdmin,
    logoutAdmin,
    isAdminAuthenticated: !!adminToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};