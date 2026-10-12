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
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
      if (response.status === 401) {
        clearAuthSession();
      }
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

export const googleAuth = async (credential, role) => {
  const data = await apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential, role })
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

export const getUserProfile = async () => {
  const data = await apiRequest('/users/me');
  if (data.user) {
    const token = getAuthToken();
    setAuthSession(token, data.user);
  }
  return data;
};

export const updateUserProfile = async (profileData) => {
  const data = await apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  if (data.user) {
    const token = getAuthToken();
    setAuthSession(token, data.user);
  }
  return data;
};

export const logout = () => {
  clearAuthSession();
};

// --------------------------------------------------------------------------
// Complaint Services
// --------------------------------------------------------------------------

export const searchComplaints = async (query, signal) => {
  if (!query || !query.trim()) {
    return { success: true, count: 0, data: [] };
  }
  return apiRequest(`/complaints/search?q=${encodeURIComponent(query.trim())}`, {
    method: 'GET',
    signal
  });
};

export const getComplaintById = async (id) => {
  if (!id) {
    throw new Error('Complaint ID is required');
  }
  return apiRequest(`/complaints/${encodeURIComponent(id)}`, {
    method: 'GET'
  });
};

export const createComplaint = async (complaintData) => {
  const isFormData = typeof FormData !== 'undefined' && complaintData instanceof FormData;
  return apiRequest('/complaints', {
    method: 'POST',
    body: isFormData ? complaintData : JSON.stringify(complaintData)
  });
};

export const getComplaints = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const queryString = query.toString();
  return apiRequest(`/complaints${queryString ? `?${queryString}` : ''}`);
};

export const getAllComplaints = async () => {
  return apiRequest('/complaints', {
    method: 'GET'
  });
};

export const getMyComplaints = async () => {
  return apiRequest('/complaints/my');
};

export const getComplaintStats = async () => {
  return apiRequest('/complaints/stats');
};

export const updateComplaintStatus = async (id, statusData) => {
  const isFormData = typeof FormData !== 'undefined' && statusData instanceof FormData;
  return apiRequest(`/complaints/${encodeURIComponent(id)}/status`, {
    method: 'PUT',
    body: isFormData ? statusData : JSON.stringify(statusData)
  });
};

export const assignComplaint = async (id, assignData) => {
  return apiRequest(`/complaints/${encodeURIComponent(id)}/assign`, {
    method: 'PUT',
    body: JSON.stringify(assignData)
  });
};

export const submitComplaintFeedback = async (id, feedbackData) => {
  return apiRequest(`/complaints/${encodeURIComponent(id)}/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedbackData)
  });
};

// --------------------------------------------------------------------------
// Notification Services
// --------------------------------------------------------------------------

export const getNotifications = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/notifications${query ? `?${query}` : ''}`);
};

export const markNotificationRead = async (id) => {
  return apiRequest(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PUT'
  });
};

export const markAllNotificationsRead = async () => {
  return apiRequest('/notifications/read-all', {
    method: 'PUT'
  });
};

// --------------------------------------------------------------------------
// Department & User Services
// --------------------------------------------------------------------------

export const getDepartments = async () => {
  return apiRequest('/departments', { method: 'GET' });
};

export const createDepartment = async (deptData) => {
  return apiRequest('/departments', {
    method: 'POST',
    body: JSON.stringify(deptData)
  });
};

export const getUsers = async () => {
  return apiRequest('/users', { method: 'GET' });
};

export const createUser = async (userData) => {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};
