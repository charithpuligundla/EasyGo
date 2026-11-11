import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, remove Content-Type so the browser sets multipart/form-data with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with automatic port fallback (5000 <-> 5001) if connection refused
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) &&
      originalRequest &&
      !originalRequest._retryPort
    ) {
      originalRequest._retryPort = true;
      const currentUrl = originalRequest.baseURL || originalRequest.url || '';
      let altBaseURL = '';
      if (currentUrl.includes('5001')) {
        altBaseURL = currentUrl.replace('5001', '5000');
      } else if (currentUrl.includes('5000')) {
        altBaseURL = currentUrl.replace('5000', '5001');
      }
      if (altBaseURL) {
        console.log(`[API Port Fallback] Retrying request on ${altBaseURL}...`);
        originalRequest.baseURL = altBaseURL;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
