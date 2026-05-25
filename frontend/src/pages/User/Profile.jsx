import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import {
  useGetUserDetailsQuery,
  useUploadProfileImageMutation,
  useProfileMutation,
} from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { FaUser, FaEnvelope, FaCamera, FaEdit, FaCheck, FaArrowLeft, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  // ELEGANT WHITE & PINK COLOR SCHEME
  const colors = {
    background: "#ffffff",      // Pure white
    textPrimary: "#333333",     // Soft dark gray
    textSecondary: "#888888",   // Lighter gray
    accent: "#ec4899",          // Beautiful Pink (Tailwind pink-500)
    border: "#fce7f3",          // Very light pink borders
    surface: "#fdf2f8",         // Surface pink
    surfaceHover: "#fdf2f8",    // Light pink hover state
    shadow: "rgba(236, 72, 153, 0.1)", // Soft pink shadow
    success: "#10b981",
    error: "#ef4444"
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery("profile");
  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  const [formData, setFormData] = useState({
    profileImage: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [imageFile, setImageFile] = useState(null);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  const formFieldVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 25
      }
    })
  };

  const uploadAreaVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  // Initialize form data
  useEffect(() => {
    if (user) {
      setFormData({
        profileImage: user.profileImage || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profileImage: imageUrl }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image.");
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("profileImage", imageFile);

      const res = await uploadProfileImage(formDataObj).unwrap();
      setFormData(prev => ({ ...prev, profileImage: res.profileImage }));
      dispatch(setCredentials({ ...userInfo, profileImage: res.profileImage }));
      toast.success("Profile image uploaded successfully");
      setImageFile(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Upload failed");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const updateData = {
        _id: userInfo._id,
        username: formData.username,
        email: formData.email
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await updateProfile(updateData).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      refetch();
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-3xl md:text-6xl mb-4 md:mb-8"
            variants={itemVariants}
          >
            <div className="text-6xl mb-4">😕</div>
          </motion.div>
          <motion.h3
            className="text-sm md:text-2xl font-light mb-2 md:mb-4"
            style={{ color: colors.textPrimary }}
            variants={itemVariants}
          >
            Error Loading Profile
          </motion.h3>
          <motion.p
            className="text-[7px] md:text-sm mb-6 md:mb-8"
            style={{ color: colors.textSecondary }}
            variants={itemVariants}
          >
            {error?.data?.message || "Failed to load profile"}
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className="inline-block px-4 md:px-8 py-2 md:py-3 text-[7px] md:text-xs uppercase tracking-[0.2em] font-medium border hover:bg-pink-500 hover:text-white transition-all shadow-sm"
            style={{
              borderColor: colors.accent,
              color: colors.accent
            }}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-8 lg:py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          variants={itemVariants}
        >
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.textSecondary }}
          >
            Account Identity
          </motion.span>
          <motion.h1
            className="text-2xl md:text-5xl lg:text-7xl font-light tracking-tighter text-black"
            style={{ letterSpacing: '-0.02em' }}
          >
            Profile Archive
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 bg-pink-500 mx-auto mt-6" style={{ opacity: 0.8 }}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8"
          variants={containerVariants}
        >
          {/* Profile Image Section */}
          <motion.div
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <motion.div
              className="bg-white border rounded-md p-3 md:p-6 lg:p-8 h-full"
              style={{
                borderColor: colors.border,
                boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
              }}
              whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                className="text-center"
                variants={containerVariants}
              >
                {/* Profile Image */}
                <motion.div
                  className="relative inline-block mb-3 md:mb-6"
                  variants={uploadAreaVariants}
                  whileHover="hover"
                >
                  <motion.div
                    className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border mx-auto mb-2 md:mb-4"
                    style={{ borderColor: colors.border }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={formData.profileImage || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      style={{ filter: "grayscale(0.05)" }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </motion.div>

                  <motion.label
                    htmlFor="image-upload"
                    className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-5 h-5 md:w-7 md:h-7 rounded-full bg-white border flex items-center justify-center cursor-pointer shadow-lg"
                    style={{ borderColor: colors.border }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCamera className="text-[8px] md:text-xs" style={{ color: colors.accent }} />
                  </motion.label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </motion.div>

                <motion.h3
                  className="text-sm md:text-base lg:text-xl font-light tracking-tight mb-1"
                  style={{ color: colors.textPrimary }}
                  variants={itemVariants}
                >
                  {formData.username}
                </motion.h3>
                <motion.p
                  className="text-[10px] uppercase tracking-wider font-bold opacity-30 mb-3 md:mb-6 truncate px-2"
                  variants={itemVariants}
                >
                  {formData.email}
                </motion.p>

                {/* Upload Button */}
                <AnimatePresence>
                  {imageFile && (
                    <motion.button
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="inline-flex items-center justify-center gap-1 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold px-4 md:px-6 py-2 md:py-3 border mb-4 md:mb-6"
                      style={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        backgroundColor: isUploading ? colors.surface : colors.background
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      whileHover={{ scale: 1.05, gap: "0.5rem" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isUploading ? (
                        'Uploading...'
                      ) : (
                        'Update Asset'
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Edit Button */}
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center justify-center gap-1 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold border px-3 md:px-4 py-3 md:py-4 w-full"
                  style={{
                    borderColor: colors.accent,
                    color: isEditing ? colors.accent : 'white',
                    backgroundColor: isEditing ? 'white' : colors.accent,
                    boxShadow: isEditing ? '' : '0 4px 14px 0 rgba(236, 72, 153, 0.39)'
                  }}
                  whileHover={{
                    scale: 1.02,
                    gap: "0.5rem"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isEditing ? 'Cancel Entry' : 'Modify Registry'}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <motion.div
              className="bg-white border rounded-md p-3 md:p-6 lg:p-8"
              style={{
                borderColor: colors.border,
                boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
              }}
              whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.h2
                className="text-lg md:text-2xl font-light tracking-tighter mb-6 md:mb-8"
                style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}
                variants={itemVariants}
              >
                Personal Registry
              </motion.h2>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    onSubmit={handleUpdateProfile}
                    className="space-y-3 md:space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                  >
                    {/* Username */}
                    <motion.div
                      custom={0}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.label
                        className="block text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-40"
                        style={{ color: colors.textPrimary }}
                        whileHover={{ x: 2 }}
                      >
                        Identifier
                      </motion.label>
                      <motion.div
                        className="relative"
                        whileFocusWithin={{ scale: 1.01 }}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaUser className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} />
                        </motion.div>
                        <motion.input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          className="w-full pl-6 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border text-[8px] md:text-xs focus:outline-none"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }}
                          whileFocus={{
                            borderColor: colors.accent,
                            transition: { duration: 0.2 }
                          }}
                          placeholder="Enter username"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      custom={1}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.label
                        className="block text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-40"
                        style={{ color: colors.textPrimary }}
                        whileHover={{ x: 2 }}
                      >
                        Electronic Mail
                      </motion.label>
                      <motion.div
                        className="relative"
                        whileFocusWithin={{ scale: 1.01 }}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaEnvelope className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} />
                        </motion.div>
                        <motion.input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full pl-6 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border text-[8px] md:text-xs focus:outline-none"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }}
                          whileFocus={{
                            borderColor: colors.accent,
                            transition: { duration: 0.2 }
                          }}
                          placeholder="Enter email"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Password */}
                    <motion.div
                      custom={2}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.label
                        className="block text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-40"
                        style={{ color: colors.textPrimary }}
                        whileHover={{ x: 2 }}
                      >
                        Security Key
                      </motion.label>
                      <motion.div
                        className="relative"
                        whileFocusWithin={{ scale: 1.01 }}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaLock className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} />
                        </motion.div>
                        <motion.input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full pl-6 md:pl-10 pr-8 md:pr-12 py-2 md:py-3 border text-[8px] md:text-xs focus:outline-none"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }}
                          whileFocus={{
                            borderColor: colors.accent,
                            transition: { duration: 0.2 }
                          }}
                          placeholder="Enter new password"
                        />
                        <motion.button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-2 md:pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ?
                            <FaEyeSlash className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} /> :
                            <FaEye className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} />
                          }
                        </motion.button>
                      </motion.div>
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div
                      custom={3}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.label
                        className="block text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-40"
                        style={{ color: colors.textPrimary }}
                        whileHover={{ x: 2 }}
                      >
                        Verify Key
                      </motion.label>
                      <motion.div
                        className="relative"
                        whileFocusWithin={{ scale: 1.01 }}
                      >
                        <motion.div
                          className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaLock className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} />
                        </motion.div>
                        <motion.input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full pl-6 md:pl-10 pr-8 md:pr-12 py-2 md:py-3 border text-[8px] md:text-xs focus:outline-none"
                          style={{
                            borderColor: colors.border,
                            color: colors.textPrimary
                          }}
                          whileFocus={{
                            borderColor: colors.accent,
                            transition: { duration: 0.2 }
                          }}
                          placeholder="Confirm new password"
                        />
                        <motion.button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-2 md:pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ?
                            <FaEyeSlash className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} /> :
                            <FaEye className="text-[8px] md:text-xs" style={{ color: colors.textSecondary }} />
                          }
                        </motion.button>
                      </motion.div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      className="pt-3 md:pt-4 border-t"
                      style={{ borderColor: colors.border }}
                      custom={4}
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.button
                        type="submit"
                        disabled={loadingUpdateProfile}
                        className="flex items-center justify-center gap-1 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold px-3 md:px-6 py-4 md:py-5 border w-full"
                        style={{
                          borderColor: colors.accent,
                          color: 'white',
                          backgroundColor: colors.accent,
                          backgroundImage: 'linear-gradient(135deg, #ec4899, #f472b6)',
                          boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.39)'
                        }}
                        whileHover={{
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loadingUpdateProfile ? 'Updating Registry...' : 'Authorize Changes'}
                      </motion.button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    className="space-y-3 md:space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants}>
                        <motion.div
                          className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-40"
                          style={{ color: colors.textSecondary }}
                          whileHover={{ x: 2 }}
                        >
                          Identifier
                        </motion.div>
                        <motion.div
                          className="text-[8px] md:text-sm lg:text-base font-light"
                          style={{ color: colors.textPrimary }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {formData.username}
                        </motion.div>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <motion.div
                          className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold mb-2 opacity-40"
                          style={{ color: colors.textSecondary }}
                          whileHover={{ x: 2 }}
                        >
                          Registry Email
                        </motion.div>
                        <motion.div
                          className="text-[8px] md:text-sm lg:text-base font-light"
                          style={{ color: colors.textPrimary }}
                          whileHover={{ scale: 1.02 }}
                        >
                          {formData.email}
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="pt-2 md:pt-4 border-t"
                      style={{ borderColor: colors.border }}
                      variants={itemVariants}
                    >
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div variants={itemVariants}>
                          <motion.div
                            className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] font-medium mb-0.5 md:mb-1"
                            style={{ color: colors.textSecondary }}
                            whileHover={{ x: 2 }}
                          >
                            Account Status
                          </motion.div>
                          <motion.div
                            className="text-[8px] md:text-sm font-medium flex items-center gap-1"
                            style={{ color: colors.textPrimary }}
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <motion.div
                              className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                              style={{ backgroundColor: colors.success }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            Active Account
                          </motion.div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                          <motion.div
                            className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] font-medium mb-0.5 md:mb-1"
                            style={{ color: colors.textSecondary }}
                            whileHover={{ x: 2 }}
                          >
                            Member Since
                          </motion.div>
                          <motion.div
                            className="text-[8px] md:text-sm font-light"
                            style={{ color: colors.textPrimary }}
                            whileHover={{ scale: 1.02 }}
                          >
                            {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'N/A'}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;