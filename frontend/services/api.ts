import axios, { AxiosInstance } from 'axios';
import { mockApi } from './mockApi';

const useMockApi = true; // Set to false to connect to a real backend

const api = useMockApi ? mockApi : axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// FIX: `axios.isAxiosInstance` is not a reliable type guard and can cause errors.
// The check on `!useMockApi` is sufficient for TypeScript to narrow the type of `api` to `AxiosInstance`.
if (!useMockApi) {
  (api as AxiosInstance).interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - logging out");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
}

export const setAuthToken = (token: string | null) => {
  // FIX: `axios.isAxiosInstance` is not a reliable type guard and can cause errors.
  // The check on `!useMockApi` is sufficient for TypeScript to narrow the type of `api` to `AxiosInstance`.
  if (!useMockApi) {
    if (token) {
      (api as AxiosInstance).defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete (api as AxiosInstance).defaults.headers.common['Authorization'];
    }
  }
};


export default api;
export { mockApi };