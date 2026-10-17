import axios from 'axios';

// Base API client configured for LostLink backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for authorization tokens (ready for future JWT auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lostlink_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standard error logging without crashing UI
    const customError = {
      message: error.response?.data?.message || error.message || 'Network request failed',
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default api;
