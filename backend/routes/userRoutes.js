import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getUserProfileById,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  updateUserProfileImage,
  deleteUserProfileImage,
  upload,
  googleLogin,
  verifyEmail,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
router.post("/auth", loginUser);
router.post("/google", googleLogin); // Google Login Route
router.post("/verify-email", verifyEmail); // Email Verification Route
router.post("/logout", logoutCurrentUser);
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);
router.route("/profile/:id").get(authenticate, getUserProfileById);
// ADMIN ROUTES 👇
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);
router
  .route("/profile/image")
  .put(authenticate, upload.single("profileImage"), updateUserProfileImage)
  .delete(authenticate, deleteUserProfileImage);
export default router;
