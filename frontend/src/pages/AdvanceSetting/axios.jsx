import axios from 'axios';

const API_BASE_URL = '/api';

const Axios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default Axios;
