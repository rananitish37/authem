import { create } from 'zustand';
import axios from 'axios';

const BASE_API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
const API_BASE_URL = `${BASE_API}/v1/auth`;

const getInitialUser = () => {
  try {
    const stored = localStorage.getItem('user');
    return stored && stored !== 'undefined' && stored !== 'null' ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { user, token } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({ user: user || null, token, isAuthenticated: true });
    }

    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { user, token } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({ user: user || null, token, isAuthenticated: true });
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));