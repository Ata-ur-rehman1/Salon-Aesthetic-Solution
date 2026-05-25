import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import {
  useGetUserDetailsQuery,
  useUploadProfileImageMutation,
  useProfileMutation,
} from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, Camera, User, Mail, MapPin, Building, Globe, Hash } from "lucide-react";

// Reusable components
const ParticleBackground = React.memo(({ particleCount = 15 }) => {
  const particles = useMemo(() => 
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      size: Math.random() * 60 + 20,
      duration: Math.random() * 20 + 10,
    })), [particleCount]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="rounded-full bg-blue-500/10"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            width: particle.size,
            height: particle.size,
            opacity: Math.random() * 0.2 + 0.05,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, Math.random() * 0.5 + 0.75, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

ParticleBackground.displayName = 'ParticleBackground';

const InputField = React.memo(({ 
  field, 
  index, 
  activeField, 
  onFocus, 
  onBlur,
  isDarkMode = true 
}) => {
  const Icon = useMemo(() => {
    const icons = {
      Username: User,
      Email: Mail,
      Address: MapPin,
      City: Building,
      Country: Globe,
      "Postal Code": Hash,
    };
    return icons[field.label] || User;
  }, [field.label]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      <div
        className={`p-4 rounded-xl transition-all duration-300 ${
          activeField === index
            ? "bg-white/20 shadow-lg"
            : "bg-white/5 hover:bg-white/10"
        }`}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            className={`p-3 rounded-lg ${
              activeField === index
                ? "bg-blue-500/30 text-blue-300"
                : "bg-white/10 text-white/70"
            }`}
            animate={{
              rotate: activeField === index ? [0, 10, -10, 0] : 0,
              scale: activeField === index ? 1.05 : 1,
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <div className="flex-1">
            <label className="text-sm font-medium text-white/60 block mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              onFocus={() => onFocus(index)}
              onBlur={onBlur}
              className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 focus:ring-0"
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              aria-label={field.label}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

InputField.displayName = 'InputField';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery("profile");
  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        postalCode: user.postalCode || "",
      });
      setProfileImage(user.profileImage || "");
    }
  }, [user]);

  const handleImageChange = useCallback((e) => {
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
    setProfileImage(imageUrl);
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);
      
      const res = await uploadProfileImage(formData).unwrap();
      setProfileImage(res.profileImage);
      dispatch(setCredentials({ ...userInfo, profileImage: res.profileImage }));
      toast.success("Profile image uploaded successfully");
      setImageFile(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Upload failed");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        ...formData,
        profileImage,
      }).unwrap();
      
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
      refetch();
      navigate("/profile");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field.toLowerCase()]: value,
    }));
  }, []);

  const formFields = useMemo(() => [
    {
      label: "Username",
      value: formData.username,
      setter: (value) => handleInputChange("username", value),
      type: "text",
    },
    {
      label: "Email",
      value: formData.email,
      setter: (value) => handleInputChange("email", value),
      type: "email",
    },
    {
      label: "Address",
      value: formData.address,
      setter: (value) => handleInputChange("address", value),
      type: "text",
    },
    {
      label: "City",
      value: formData.city,
      setter: (value) => handleInputChange("city", value),
      type: "text",
    },
    {
      label: "Country",
      value: formData.country,
      setter: (value) => handleInputChange("country", value),
      type: "text",
    },
    {
      label: "Postal Code",
      value: formData.postalCode,
      setter: (value) => handleInputChange("postalCode", value),
      type: "text",
    },
  ], [formData, handleInputChange]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-8 max-w-md">
          <p className="text-red-400 text-lg font-semibold text-center">
            Error: {error?.data?.message || error?.error || "Failed to load profile"}
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => refetch()}
              className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Retry
            </button>
            <Link
              to="/profile"
              className="block w-full px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg hover:bg-gray-500/30 transition-colors text-center"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <ParticleBackground />
      
      {/* Back button */}
      <motion.div
        className="fixed top-4 left-4 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/profile"
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white/80 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Profile</span>
        </Link>
      </motion.div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full">
            <motion.div
              className="relative px-4 sm:px-6 md:px-8 py-8 sm:py-10 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900/30 backdrop-blur-xl border border-white/20 shadow-2xl"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div className="space-y-8">
                {/* Title */}
                <motion.div className="text-center">
                  <motion.h1
                    className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-blue-300"
                    animate={{
                      backgroundPosition: ["0% center", "200% center"],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ backgroundSize: "200% auto" }}
                  >
                    Update Profile
                  </motion.h1>
                </motion.div>

                {/* Profile image upload */}
                <motion.div
                  className="flex flex-col items-center space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative group">
                    <div className="relative">
                      {profileImage && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
                            animate={{
                              rotate: 360,
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 4, repeat: Infinity, repeatType: "reverse" },
                            }}
                          />
                          <motion.img
                            src={profileImage}
                            alt="Profile"
                            className="relative z-10 rounded-full w-32 h-32 sm:w-36 sm:h-36 object-cover border-4 border-white/90 shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          />
                        </>
                      )}
                      <motion.label
                        htmlFor="image-upload"
                        className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Change profile picture"
                      >
                        <Camera className="h-4 w-4 text-white" />
                      </motion.label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        aria-label="Upload profile image"
                      />
                    </div>
                  </div>

                  {imageFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4"
                    >
                      <button
                        onClick={handleImageUpload}
                        disabled={isUploading}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 backdrop-blur-sm hover:bg-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="font-medium">
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setProfileImage(user?.profileImage || "");
                        }}
                        className="px-6 py-3 bg-gray-500/20 text-gray-300 rounded-full hover:bg-gray-500/30 transition-colors"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </motion.div>

                {/* Form */}
                <motion.form
                  onSubmit={submitHandler}
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                  }}
                >
                  <AnimatePresence>
                    {formFields.map((field, index) => (
                      <InputField
                        key={index}
                        field={field}
                        index={index}
                        activeField={activeField}
                        onFocus={setActiveField}
                        onBlur={() => setActiveField(null)}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || loadingUpdateProfile}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                      isSubmitting || loadingUpdateProfile
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-xl active:scale-95"
                    } bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg`}
                    whileHover={!isSubmitting && !loadingUpdateProfile ? { scale: 1.02 } : {}}
                  >
                    {isSubmitting || loadingUpdateProfile ? (
                      <span className="flex items-center justify-center">
                        <Loader small />
                        <span className="ml-2">Updating...</span>
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </motion.button>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(UpdateProfile);