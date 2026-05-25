import axios from 'axios';

// Use VITE_API_BASE_URL from environment variables
// In development: uses .env (http://localhost:5000)
// In production: uses .env.production (Vercel backend URL)
const BASE = (import.meta.env.VITE_API_BASE_URL || '').trim();

axios.defaults.baseURL = BASE;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  const token = userInfo ? userInfo.token : null;

  if (token) {
    config.headers = config.headers || {};
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

console.log('Axios baseURL set to', axios.defaults.baseURL);
console.log('Axios withCredentials', axios.defaults.withCredentials);

export default axios;
