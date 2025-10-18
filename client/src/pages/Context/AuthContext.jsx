// src/pages/Context/AuthContext.js (Final and Improved Version)

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { adminApiClient } from '../frontend-admin/services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://shaheenexpresscr.crmgcc.net/api';

    const mergeLocalCartWithServer = async (userToken) => {
        try {
            const localCartData = localStorage.getItem('cart');
            const localCartItems = localCartData ? JSON.parse(localCartData) : [];

            if (localCartItems.length === 0) {
                return;
            }

            console.log('Merging local cart with server...', localCartItems);

            const mergePromises = localCartItems.map(item => {
                const config = { headers: { 'Authorization': `Bearer ${userToken}` } };
                return axios.post(`${API_URL}/cart`, {
                    productId: item.id,
                    quantity: item.quantity,
                    productTable: item.productTable,
                }, config);
            });

            await Promise.allSettled(mergePromises);
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Failed to merge cart:", error);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        
        await mergeLocalCartWithServer(data.token);
        
        const config = { headers: { Authorization: `Bearer ${data.token}` } };
        const { data: userData } = await axios.get(`${API_URL}/auth/me`, config);
        setUser(userData);
    };
    const loginAdmin = (token) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
      };
    
      const logoutAdmin = () => {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
      };
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    useEffect(() => {
        const storedAdminToken = localStorage.getItem('adminToken');
        if (storedAdminToken) {
            adminApiClient.defaults.headers.common['Authorization'] = `Bearer ${storedAdminToken}`;
        }
    }, []);
     useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get(`${API_URL}/auth/me`, config);
                    setUser(data);
                } catch (error) {
                    console.error("Session expired or invalid token", error);
                    logout();
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    // --- YEH CHANGE HAI (THIS IS THE CHANGE) ---
    const value = { 
      token, 
      adminToken, 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated: !!token,
      loginAdmin,      
      logoutAdmin   
  };

  return (
      <AuthContext.Provider value={value}>
         
          {children}
      </AuthContext.Provider>
  );
};