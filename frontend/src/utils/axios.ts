import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // send cookies if needed
});

// Browser-only toast helper to avoid SSR imports
const toastError = async (message: string) => {
  if (typeof window === 'undefined') return;
  try {
    const mod = await import('react-hot-toast');
    mod.toast.error(message);
  } catch {}
};

// Request interceptor: attach token if available
api.interceptors.request.use(
  (config) => {
    // Example: attach JWT from localStorage (customize as needed)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBrowser = typeof window !== 'undefined';
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized (token expired/invalid)
      if (status === 401) {
        if (isBrowser) {
          toastError('Session expired. Please log in again.');
          // Optionally remove token and redirect
          try { localStorage.removeItem('token'); } catch {}
          window.location.href = '/login';
        }
      }
      // Handle 403 Forbidden
      else if (status === 403) {
        if (isBrowser) toastError('You do not have permission to perform this action.');
      }
      // Handle 5xx Server Errors
      else if (status >= 500) {
        if (isBrowser) toastError('A server error occurred. Please try again later.');
      }
      // Optionally handle other status codes (400, 404, etc.)
    } else if (error.request) {
      if (typeof window !== 'undefined') toastError('No response from server. Please check your connection.');
    } else {
      if (typeof window !== 'undefined') toastError('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;
