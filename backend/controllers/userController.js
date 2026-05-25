import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";
import { OAuth2Client } from "google-auth-library"; // Import Google Auth Library
import nodemailer from "nodemailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

import os from "os";

// Google Login Controller
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // 1. Enforce Gmail Restriction
    if (!email.endsWith("@gmail.com")) {
      res.status(400);
      throw new Error("Only @gmail.com accounts are allowed.");
    }

    // 2. Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - Log them in
      // If they didn't have a googleId before (e.g. signed up with email/pass), update it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      const jwtToken = createToken(res, user._id);

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: jwtToken,
      });
    } else {
      // 3. Create new user
      // Generate a random password since they use Google
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        username: name,
        email,
        password: hashedPassword,
        googleId,
        profileImage: picture,
        isVerified: true, // Google users are automatically verified
      });

      const jwtToken = createToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: jwtToken,
      });
    }
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(400).json({ message: error.message || "Google Login Failed" });
  }
});

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // Store images in the system temp folder for Vercel
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });


// Nodemailer Transporter (Placeholder - Needs User Credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createUser = asyncHandler(async (req, res) => {
  // Log incoming body for debugging on deployed environment
  console.log('createUser request body:', req.body);

  const { username, email, password } =
    req.body;

  if (
    !username ||
    !email ||
    !password
  ) {
    throw new Error("Please fill all the inputs.");
  }

  if (!email.endsWith("@gmail.com")) {
    res.status(400);
    throw new Error("Only @gmail.com accounts are allowed.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate 6-digit Verification Code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    verificationCode,
    isVerified: false, // Not verified yet
  });

  try {
    await newUser.save();

    // Send Verification Email
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@estore.com",
      to: email,
      subject: "Verify your E-Store Account",
      text: `Your verification code is: ${verificationCode}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // We don't fail the registration, but user won't get the code.
      // In production, you might want to handle this better.
    }

    res.status(201).json({
      message: "Registration successful. Please check your email for verification code.",
      email: newUser.email,
    });

  } catch (error) {
    console.error('createUser save error:', error && error.stack ? error.stack : error);
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  if (user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = undefined; // Clear code
    await user.save();

    const token = createToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid verification code");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.password && !existingUser.isVerified) { // Check verification only for manual users
      res.status(401);
      throw new Error("Please verify your email address first.");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordValid) {
      const token = createToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        profileImage: existingUser.profileImage,
        token: token,
      });
      return;
    }
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "strict",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
});



const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getUserProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    // user.isAdmin = Boolean(req.body.isAdmin); // Only admin can update isAdmin via separate route

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    const token = createToken(res, updatedUser._id);

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profileImage: updatedUser.profileImage,
      createdAt: updatedUser.createdAt,
      token: token,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update Profile Image
const updateUserProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || !req.file) {
    res.status(404);
    throw new Error("User not found or image upload failed");
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: process.env.CLOUDINARY_PROFILE_FOLDER || "dot-nk/profile_images",
    });

    // delete local file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("Unable to delete local profile image:", e.message);
    }

    user.profileImage = result.secure_url;
    // Optionally store public_id: user.profileImageId = result.public_id;
    await user.save();

    res.json({
      message: "Profile image updated",
      profileImage: user.profileImage,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Profile image upload error:", err);
    res.status(500);
    throw new Error("Failed to upload profile image");
  }
});

// Delete Profile Image
const deleteUserProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.profileImage = null;
    await user.save();
    res.json({ message: "Profile image deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  getUserProfileById,
  updateUserProfileImage,
  deleteUserProfileImage,
  upload,
  googleLogin,
  verifyEmail,
};
