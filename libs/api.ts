import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Ensure this is set in your environment variables
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token.access_token}`;
  }
  return config;
});

export default api;