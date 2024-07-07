import axios from 'axios';
import useUserAuthStore from './useUserAuthStore';
import { API_BASE_URL } from '../config'

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const { token } = useUserAuthStore.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(token);
  }

  return config;
});



export default api;