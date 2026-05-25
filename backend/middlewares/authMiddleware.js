import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Prefer JWT from httpOnly cookie
  token = req.cookies.jwt;
  console.log('Auth check - Cookie jwt:', token ? 'present' : 'not found');

  // Fallback: Authorization Bearer header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    console.log('Auth check - Using Authorization header token');
  }

  if (token) {
    try {
      const tokenPreview = `${token.substring(0, 5)}...${token.substring(token.length - 5)}`;
      console.log(`Auth check - Verifying token [len: ${token.length}, preview: ${tokenPreview}] with JWT_SECRET...`);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth check - Token verified, userId:', decoded.userId);

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        console.error('Auth check - User not found for userId:', decoded.userId);
        res.status(401);
        throw new Error("User not found");
      }

      console.log('Auth check - User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('Auth check - JWT verification failed:', error.message);
      if (error.message === "invalid signature") {
        console.error('Auth check - Hint: Check if JWT_SECRET matches on all backend instances.');
      }
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    console.error('Auth check - No token provided (no cookie, no Authorization header)');
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };
