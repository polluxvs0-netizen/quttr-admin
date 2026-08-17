import axios from 'axios';
import toast from 'react-hot-toast';

// ═══════════════════════════════════════════════════
// QUTTR ADMIN — API CLIENT
// Axios instance with JWT auth + interceptors
// ═══════════════════════════════════════════════════

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quttr-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Get token from storage ───────────────────────
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('quttr_admin_token');
};

// ─── Set token ────────────────────────────────────
export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('quttr_admin_token', token);
  } else {
    localStorage.removeItem('quttr_admin_token');
  }
};

// ─── Get admin data ───────────────────────────────
export const getAdminData = () => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('quttr_admin_data');
  return data ? JSON.parse(data) : null;
};

// ─── Set admin data ───────────────────────────────
export const setAdminData = (data) => {
  if (typeof window === 'undefined') return;
  if (data) {
    localStorage.setItem('quttr_admin_data', JSON.stringify(data));
  } else {
    localStorage.removeItem('quttr_admin_data');
  }
};

// ═══════════════════════════════════════════════════
// REQUEST INTERCEPTOR — Add JWT to every request
// ═══════════════════════════════════════════════════
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ═══════════════════════════════════════════════════
// RESPONSE INTERCEPTOR — Handle errors globally
// ═══════════════════════════════════════════════════
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || 'Something went wrong';
    const status = error?.response?.status;

    // Auto-logout on 401
    if (status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && !currentPath.includes('/auth')) {
        setAuthToken(null);
        setAdminData(null);
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }

    // Show error toast for non-auth pages
    if (status !== 401 && !error?.config?.suppressToast) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
