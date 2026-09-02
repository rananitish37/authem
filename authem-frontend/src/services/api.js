import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Token
API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (!token) {
      try {
        const persisted = JSON.parse(localStorage.getItem('auth-storage'));
        token = persisted?.state?.token;
      } catch (e) {
        // Fallthrough
      }
    }
    if (!token) {
      token = localStorage.getItem('jwt');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;