import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: 'http://192.168.1.228:8000/api/v1', // 🔁 replace with your API base URL
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  console.log(token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;