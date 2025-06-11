
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios to set default headers

// Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // To store user details

  const setAuthHeaders = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const login = async (token, userDetails) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userDetails));
      setUserToken(token);
      setUserInfo(userDetails);
      setAuthHeaders(token); // Set auth header for future requests
    } catch (e) {
      console.error('Login error:', e);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setUserToken(null);
      setUserInfo(null);
      setAuthHeaders(null); // Clear auth header
    } catch (e) {
      console.error('Logout error:', e);
    }
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userDetailsString = await AsyncStorage.getItem('userInfo');
      if (token) {
        setUserToken(token);
        setAuthHeaders(token); // Set auth header if token exists
        if (userDetailsString) {
          setUserInfo(JSON.parse(userDetailsString));
        }
      }
    } catch (e) {
      console.error('isLoggedIn error:', e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, userToken, userInfo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
