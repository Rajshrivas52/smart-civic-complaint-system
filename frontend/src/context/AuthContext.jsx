import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthUser, getAuthToken, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getAuthUser());
  const [token, setToken] = useState(() => getAuthToken());

  useEffect(() => {
    // Sync state if localStorage changes or initialized
    const currentUser = getAuthUser();
    const currentToken = getAuthToken();
    setUser(currentUser);
    setToken(currentToken);
  }, []);

  const loginUser = async (credentials) => {
    const data = await apiLogin(credentials);
    if (data.user) {
      setUser(data.user);
      setToken(data.token);
    }
    return data;
  };

  const registerUser = async (userData) => {
    const data = await apiRegister(userData);
    if (data.user) {
      setUser(data.user);
      setToken(data.token);
    }
    return data;
  };

  const logoutUser = () => {
    apiLogout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loginUser,
    registerUser,
    logoutUser,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback if component is outside provider
    const user = getAuthUser();
    const token = getAuthToken();
    return {
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loginUser: apiLogin,
      registerUser: apiRegister,
      logoutUser: apiLogout,
      setUser: () => {}
    };
  }
  return context;
};

export default AuthContext;
