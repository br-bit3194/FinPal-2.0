import axios from 'axios';

// Use proxy for development, remote URL for production
const isDevelopment = import.meta.env.DEV;
const baseURL = (import.meta.env.VITE_API_URL || (isDevelopment ? '' : 'https://finpal-genie-8486b960d715.herokuapp.com')) + '/api';

// Debug logging
console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API Base URL:', baseURL);
console.log('Current Origin:', window.location.origin);

// Create axios instance
const api = axios.create({
  baseURL,
  timeout: 60000, // 60 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export { api };