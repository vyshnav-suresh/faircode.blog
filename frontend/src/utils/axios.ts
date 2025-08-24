import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // send cookies if needed
});

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
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized (token expired/invalid)
      if (status === 401) {
        toast.error('Session expired. Please log in again.');
        // Optionally remove token and redirect
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Handle 403 Forbidden
      else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      }
      // Handle 5xx Server Errors
      else if (status >= 500) {
        toast.error('A server error occurred. Please try again later.');
      }
      // Optionally handle other status codes (400, 404, etc.)
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default api;
