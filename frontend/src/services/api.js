/**
 * Frontend API Service Layer
 * Connects the React application to the Node.js Express backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --------------------------------------------------------------------------
// Auth Session LocalStorage Helpers
// --------------------------------------------------------------------------

export const getAuthToken = () => {
  return localStorage.getItem('civic_token');
};

export const getAuthUser = () => {
  const stored = localStorage.getItem('civic_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to parse stored user:', err);
    return null;
  }
};

export const setAuthSession = (token, user) => {
  if (token) localStorage.setItem('civic_token', token);
  if (user) localStorage.setItem('civic_user', JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem('civic_token');
  localStorage.removeItem('civic_user');
};

// --------------------------------------------------------------------------
// Generic API Request Wrapper
// --------------------------------------------------------------------------

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend is completely offline/unreachable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const offlineError = new Error('Cannot connect to backend server. Make sure the backend is running on http://localhost:5000.');
      offlineError.status = 503;
      throw offlineError;
    }
    throw error;
  }
};

// --------------------------------------------------------------------------
// Authentication Services
// --------------------------------------------------------------------------

export const login = async ({ email, password }) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (data.token && data.user) {
    setAuthSession(data.token, data.user);
  }

  return data;
};

export const register = async (userData) => {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

  if (data.token && data.user) {
    setAuthSession(data.token, data.user);
  }

  return data;
};

export const getMe = async () => {
  const data = await apiRequest('/auth/me');
  if (data.user) {
    const token = getAuthToken();
    setAuthSession(token, data.user);
  }
  return data;
};

export const logout = () => {
  clearAuthSession();
};
