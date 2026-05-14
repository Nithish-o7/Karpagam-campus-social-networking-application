import axios from 'axios';
import config from '../config/config';

/**
 * KCE Connect — ServiceNow REST API Client
 *
 * This module creates a pre-configured axios instance for all
 * communication with the Karpagam ServiceNow developer instance.
 * Credentials are NEVER exposed to the frontend.
 *
 * NOTE: The actual API calls (createTicket, getTickets) will be
 * implemented in Phase 3 (ServiceNow Bridge).
 */
export const serviceNowClient = axios.create({
  baseURL: `${config.serviceNow.instanceUrl}/api/now`,
  auth: {
    username: config.serviceNow.username,
    password: config.serviceNow.password,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15s timeout — instance may be sleeping on free tier
});

// Response interceptor: normalize ServiceNow error messages
serviceNowClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('ServiceNow instance is unavailable or sleeping. Please retry shortly.'));
    }
    const snowMessage = error.response?.data?.error?.message || error.message;
    return Promise.reject(new Error(`ServiceNow Error: ${snowMessage}`));
  }
);

export default serviceNowClient;
