// Use Vite env var VITE_API_BASE_URL in production (set to your backend URL),
// fall back to empty string for local development where frontend and backend are proxied.
// In dev mode, vite.config.js proxies /api/* to http://localhost:5000
export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();
export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const CATEGORY_NAME_URL = `${BASE_URL}/api/categories`;
export const VIDEO_URL = `${BASE_URL}/api/videos`;
export const UPLOAD_URL = `${BASE_URL}/api/upload`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
