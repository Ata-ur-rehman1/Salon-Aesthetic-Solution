// Use Vite env var VITE_API_BASE_URL in production (set to your backend URL),
// fall back to empty string for local development where frontend and backend are proxied.
// Fallback to deployed backend if VITE_API_BASE_URL wasn't provided at build time.
// NOTE: Vite env vars are baked into the build. Prefer setting VITE_API_BASE_URL in Vercel.
// Use same-origin by default; rely on Vercel rewrites to forward /api
// Prefer VITE_API_BASE_URL (baked at build time). If it's not set, fall back to
// the known backend deployment so RTK Query (which reads these constants) and
// code using `BASE_URL` will still contact the live backend.
export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://store-salon-aesthetic-solution.vercel.app').trim();
export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const CATEGORY_NAME_URL = `${BASE_URL}/api/categories`;
export const VIDEO_URL = `${BASE_URL}/api/videos`;
export const UPLOAD_URL = `${BASE_URL}/api/upload`;
export const ORDERS_URL = `${BASE_URL}/api/orders`;
