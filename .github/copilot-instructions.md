## Purpose

Short, actionable guidance for AI coding agents working on this repo (Dot-NK E-Store).
Focus: how the project is organised, run/debug commands, repository-specific conventions, and quick examples you should follow.

## Quick start (dev)

- Install dependencies (root and frontend):

  ```powershell
  npm install
  npm install --prefix frontend
  ```

- Start backend only:

  ```powershell
  npm run backend
  # (runs nodemon index.js)
  ```

- Start frontend only (Vite):

  ```powershell
  npm run frontend
  ```

- Start both concurrently (recommended for local development):

  ```powershell
  npm run devXpert
  ```

## Big-picture architecture

- Root-level Node/Express app: `index.js` is the server entrypoint. It wires routes from `backend/routes/*` and serves static assets from `/uploads`.
- Backend code under `backend/` contains `controllers/`, `models/`, `routes/`, `middlewares/`, and `config/`.
- Frontend is a Vite React app in `frontend/` (see `frontend/package.json`). Use Vite dev server for local UI testing.
- Media & uploads: static files live in `/uploads` (served by `app.use('/uploads', express.static(...))`). Cloudinary integration is in `backend/config/cloudinaryConfig.js`.

## Important repository-specific conventions & patterns

- Multipart/form-data handling: many controllers (e.g. `backend/controllers/productController.js`) use `req.fields` (not `req.body`) and expect form-parsed fields + files. That means the file-upload middleware (express-formidable or multer) is applied; check `backend/routes/*` and `index.js` order.
- Video routing order matters: `index.js` registers `videoRoutes` before `express.json()` specifically so multipart/form-data routes don't get interfered with. When adding routes that accept multipart data, follow that pattern.
- Database connect/caching: `backend/config/db.js` implements a cached connection and throws helpful, human-readable errors when `MONGO_URI` is missing or contains placeholders. Use that file as canonical behavior for DB connection handling in serverless or dev environments.
- Health endpoint: `GET /api/health` returns MongoDB connection status and basic metadata — use it when debugging deployments or failing DB connections.

## Env and secrets

- Local env file: `.env` (example present at repo root). Key variables:
  - `MONGO_URI` (required) — db.js checks for placeholder tokens like `<db_password>` and errors out.
  - `JWT_SECRET`, `CLOUDINARY_*` (cloudinary config), and `VITE_API_BASE_URL` for frontend build-time base URL.
- Frontend Vite note: only env vars prefixed with `VITE_` (and present in `frontend/` root at build time) are visible to the client. Use `VITE_API_BASE_URL` to configure the API URL for production builds.

## Useful files to inspect (examples)

- Server entry: `index.js` — CORS whitelist, route mounting order, and static file serving.
- DB connection: `backend/config/db.js` — shows timeouts, cached connection, and useful error messages.
- Product controller: `backend/controllers/productController.js` — example of heavy `req.fields` usage and validation style (switch(true) pattern returning JSON errors).
- Cloudinary: `backend/config/cloudinaryConfig.js` — where image/video upload parameters and folder names are configured.
- Routes: `backend/routes/*.js` — see `uploadRoutes.js`, `productRoutes.js`, and `videoRoutes.js` for how multipart data is passed to controllers.

## Debugging & common tasks

- Quick health check (after starting backend):

  ```powershell
  Invoke-RestMethod -Uri http://localhost:5000/api/health
  ```

- If Mongo connection fails, read logs from `backend/config/db.js` — it prints actionable tips for DNS/timeout/auth problems.
- When testing uploads, check that `videoRoutes` or `uploadRoutes` are registered before JSON middleware (follow `index.js`). If uploads fail, ensure `req.fields` is populated by the middleware used in the route.

## When making changes, follow these patterns

- Preserve route mounting order: routes that handle multipart/form-data should be registered before `express.json()` to avoid body-parsing conflicts (see `index.js`).
- Use existing DB connect logic (cached promise) — prefer reusing `connectDB()` instead of creating new mongoose connections.
- For controllers, follow the validation approach shown in `productController.js` (switch(true) returning helpful JSON errors) so frontend expects consistent error shapes.

## Deployment notes

- There are deployment helper scripts (`deploy.ps1`, `deploy.sh`, `deploy-to-vercel.ps1`) and `vercel.json` configuration; read them when preparing CI/CD changes.
- For Vercel: ensure `MONGO_URI` and Cloudinary credentials are set in Vercel secrets/environment variables. The DB code is written with serverless-aware caching.

## If you edit this file

- Preserve concrete examples and commands. Keep the “video routes before JSON” and `req.fields` conventions — they are critical and appear in multiple controllers.

---
If anything in these notes is unclear or missing (for example, you want more example curl requests, or a note about a specific route), tell me which area and I will expand it.
