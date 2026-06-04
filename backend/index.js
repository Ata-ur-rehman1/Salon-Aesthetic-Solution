// Vercel Serverless Function wrapper for Express app
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from local .env or system environment variables (Vercel)
dotenv.config();
// Fallback to .env.production if it exists in root
dotenv.config({ path: path.resolve(__dirname, "../.env.production") });

// Import database connection
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import cjRoutes from "./routes/cjRoutes.js";

// Initialize Express app
const app = express();

// ==================== CORS FIX ====================
// Single source of truth for allowed origins
const allowedOrigins = [
  'https://e-store-salon-aesthetic-solution.vercel.app',
  'https://store-abdullah-nadeem.vercel.app',
  'https://salonaestheticsolution.com',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

// CORS configuration - FIXED VERSION
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Remove trailing slash if present
    const cleanOrigin = origin.replace(/\/$/, '');

    // Log for debugging (remove in production if needed)
    console.log('CORS Request from origin:', cleanOrigin);

    // Check if origin is allowed
    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', cleanOrigin);
      callback(new Error(`Origin ${cleanOrigin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Security header for popup opener policy
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Middleware
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ extended: true, limit: "1gb" }));
app.use(cookieParser());

// Connect to DB (Safe wrapper for serverless)
let dbError = null;
let dbConnectionPromise = null;

// Function to connect to database with retry logic
async function connectToDatabase() {
  if (dbConnectionPromise) {
    return dbConnectionPromise;
  }

  dbConnectionPromise = connectDB()
    .then((result) => {
      dbError = null;
      return result;
    })
    .catch((err) => {
      console.error("Initial DB connection failed:", err.message);
      dbError = err;
      dbConnectionPromise = null; // allow retry on the next request
      throw err;
    });

  return dbConnectionPromise;
}

// Await DB connection before handling API routes
app.use(async (req, res, next) => {
  try {
    // Skip database connection for health check
    if (req.path === '/api/health') {
      return next();
    }

    await connectToDatabase();
    if (dbError) throw dbError;
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(503).json({
      message: "Database connection unavailable. Please try again later.",
      error: process.env.NODE_ENV === "production" ? undefined : err.message
    });
  }
});

// ==================== ROUTES ====================
// Health check endpoint (no DB connection required)
app.get("/api/health", async (req, res) => {
  let dbStatus = 'not connected';
  let readyState = 0;

  try {
    if (mongoose.connection) {
      readyState = mongoose.connection.readyState;
      const statusMessages = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
        99: "uninitialized"
      };
      dbStatus = statusMessages[readyState] || "unknown";
    }
  } catch (err) {
    console.error("Health check error:", err);
  }

  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: {
      status: dbStatus,
      readyState: readyState
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use("/api/videos", videoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cj", cjRoutes);

// Base route
app.get("/", (req, res) => {
  res.json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
    cors: "CORS is configured properly"
  });
});

// Static files (development only)
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
}

// ==================== ERROR HANDLING ====================
// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.url} not found`,
    availableEndpoints: [
      "/api/health",
      "/api/users",
      "/api/category",
      "/api/products",
      "/api/upload",
      "/api/orders",
      "/api/videos"
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message);

  // Handle CORS errors specifically
  if (err.message && err.message.includes('Not allowed by CORS')) {
    return res.status(403).json({
      message: "CORS policy violation: Origin not allowed.",
      allowedOrigins: allowedOrigins
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value entered",
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// ==================== SERVER STARTUP ====================
const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== "1") {
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 CORS allowed origins:`, allowedOrigins);
  });
  server.setTimeout(30 * 60 * 1000); // 30 minute timeout
}

// Export for Vercel
export default app;