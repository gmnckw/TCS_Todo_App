import axios from 'axios';
import { API_BASE_PATH } from '../config/constants';
import { readStoredAuth } from './authStorage';
import { ApiError, toApiError } from './apiError';

const HTTP_UNAUTHORIZED = 401;
const REQUEST_TIMEOUT_MS = 15000;

const apiClient = axios.create({
  baseURL: API_BASE_PATH,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: REQUEST_TIMEOUT_MS,
});

let unauthorizedHandler = () => {};

// Registered by AuthProvider so an expired session signs the user out.
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

apiClient.interceptors.request.use((config) => {
  const { token } = readStoredAuth();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  // The API wraps every payload in { success, message, data }; unwrap to data.
  (response) => response.data?.data ?? response.data,
  (error) => {
    const apiError = toApiError(error);
    if (apiError.status === HTTP_UNAUTHORIZED) {
      unauthorizedHandler();
    }
    return Promise.reject(apiError);
  },
);

export { ApiError };
export default apiClient;
