/**
 * KCE Connect — API Client (Hybrid Era)
 *
 * The interceptor reads the unified KCE Connect JWT from localStorage.
 * This token is issued for both Email/Password login and Google SSO sync.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Inject KCE Session Token into every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('kce_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('Cannot reach KCE Connect server. Please check your connection.'));
    }
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
