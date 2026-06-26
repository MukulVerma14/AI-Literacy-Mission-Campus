import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ailmc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Something went wrong';
      const isMyCert404 = status === 404 && error.config?.url?.includes('/api/cert/my');

      if (!isMyCert404) {
        // Global Toast Dispatch
        const event = new CustomEvent('app-toast', {
          detail: { type: 'error', message },
        });
        window.dispatchEvent(event);
      }

      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('ailmc_token');
        localStorage.removeItem('ailmc_role');
        localStorage.removeItem('ailmc_email');
        localStorage.removeItem('ailmc_userId');
        // Redirect to /login
        window.location.href = '/login';
      }
    } else {
      // Network error or no response
      const event = new CustomEvent('app-toast', {
        detail: { type: 'error', message: 'Network error. Please make sure the backend server is running.' },
      });
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default api;
