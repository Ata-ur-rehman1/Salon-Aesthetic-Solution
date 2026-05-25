import { useState, useEffect, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation, useGoogleLoginMutation, useVerifyEmailMutation } from "../../redux/api/usersApiSlice";
import { GoogleLogin } from "@react-oauth/google";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, CheckCircle, ArrowRight, Key
} from "lucide-react";
import Loader from "../../components/Loader";

const Register = () => {
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

  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Responsive State
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const fieldVariants = {
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

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          username,
          email,
          password,
        }).unwrap();

        toast.success(res.message);
        setIsVerifying(true);
      } catch (err) {
        toast.error(err.data.message);
      }
    }
  };

  const verifyHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyEmail({ email, code: verificationCode }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Email Verified & Logged In!");
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed");
    }
  };

  // Responsive Typography & Spacing Helpers
  const getTextSize = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getPadding = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getGap = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  return (
    <motion.div 
      className="min-h-screen bg-white flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={`w-full max-w-md ${getPadding('px-4 py-6', 'px-6 py-8', 'px-8 py-12')}`}>
        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className={`bg-white border rounded-lg ${getPadding('p-6', 'p-8', 'p-10')}`}
          style={{ 
            borderColor: colors.border,
            boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
          }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
        >
          {/* Header */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <motion.span 
              className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-[0.3em] text-gray-500 font-bold block mb-2`}
              whileHover={{ scale: 1.05 }}
            >
              {isVerifying ? "Verification Required" : "Join Salon Studio"}
            </motion.span>
            <motion.h1 className={`${getTextSize('text-2xl', 'text-3xl', 'text-4xl')} font-light tracking-tighter text-black`}>
              {isVerifying ? "Verify Email" : "Create Account"}
            </motion.h1>
            <motion.p className={`${getTextSize('text-sm', 'text-base', 'text-base')} text-gray-600 mt-1`}>
              {isVerifying ? `Enter the code sent to ${email}` : "Join our premium shopping community"}
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isVerifying ? (
              <motion.form
                key="register-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={submitHandler}
                className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-6')}`}
              >
                {/* Username Field */}
                <motion.div 
                  custom={0}
                  variants={fieldVariants}
                  className="relative"
                >
                  <motion.div 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all
                      ${activeField === 'username' ? 'border-gray-400' : 'border-gray-200'}`}
                    style={{ 
                      borderColor: activeField === 'username' ? colors.accent : colors.border,
                      backgroundColor: colors.background
                    }}
                    whileHover={{ borderColor: colors.accent }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <User className={`${getTextSize('w-4 h-4', 'w-5 h-5', 'w-5 h-5')}`} style={{ 
                        color: activeField === 'username' ? colors.accent : colors.textSecondary 
                      }} />
                    </motion.div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={username}
                      onFocus={() => setActiveField('username')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: colors.textPrimary }}
                      required
                    />
                  </motion.div>
                </motion.div>

                {/* Email Field */}
                <motion.div 
                  custom={1}
                  variants={fieldVariants}
                  className="relative"
                >
                  <motion.div 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all
                      ${activeField === 'email' ? 'border-gray-400' : 'border-gray-200'}`}
                    style={{ 
                      borderColor: activeField === 'email' ? colors.accent : colors.border,
                      backgroundColor: colors.background
                    }}
                    whileHover={{ borderColor: colors.accent }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <Mail className={`${getTextSize('w-4 h-4', 'w-5 h-5', 'w-5 h-5')}`} style={{ 
                        color: activeField === 'email' ? colors.accent : colors.textSecondary 
                      }} />
                    </motion.div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: colors.textPrimary }}
                      required
                    />
                  </motion.div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  custom={2}
                  variants={fieldVariants}
                  className="relative"
                >
                  <motion.div 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all
                      ${activeField === 'password' ? 'border-gray-400' : 'border-gray-200'}`}
                    style={{ 
                      borderColor: activeField === 'password' ? colors.accent : colors.border,
                      backgroundColor: colors.background
                    }}
                    whileHover={{ borderColor: colors.accent }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <Lock className={`${getTextSize('w-4 h-4', 'w-5 h-5', 'w-5 h-5')}`} style={{ 
                        color: activeField === 'password' ? colors.accent : colors.textSecondary 
                      }} />
                    </motion.div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: colors.textPrimary }}
                      required
                    />
                  </motion.div>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div 
                  custom={3}
                  variants={fieldVariants}
                  className="relative"
                >
                  <motion.div 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all
                      ${activeField === 'confirmPassword' ? 'border-gray-400' : 'border-gray-200'}`}
                    style={{ 
                      borderColor: activeField === 'confirmPassword' ? colors.accent : colors.border,
                      backgroundColor: colors.background
                    }}
                    whileHover={{ borderColor: colors.accent }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <CheckCircle className={`${getTextSize('w-4 h-4', 'w-5 h-5', 'w-5 h-5')}`} style={{ 
                        color: activeField === 'confirmPassword' ? colors.accent : colors.textSecondary 
                      }} />
                    </motion.div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onFocus={() => setActiveField('confirmPassword')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                      style={{ color: colors.textPrimary }}
                      required
                    />
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${getPadding('px-6 py-3', 'px-8 py-4', 'px-8 py-4')} bg-pink-500 text-white ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-[0.2em] font-medium rounded-lg disabled:opacity-50 shadow-lg`}
                  whileHover={{ backgroundColor: colors.textPrimary, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  whileDisabled={{ opacity: 0.6 }}
                  variants={itemVariants}
                >
                  {isLoading ? (
                    <motion.div className="flex items-center justify-center gap-2">
                      <motion.div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Account...
                    </motion.div>
                  ) : (
                    <motion.div className="flex items-center justify-center gap-2" whileHover={{ gap: "0.5rem" }}>
                      <span>Create Account</span>
                      <motion.div whileHover={{ x: 4 }}>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="verify-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={verifyHandler}
                className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-6')}`}
              >
                {/* Verification Field */}
                <motion.div 
                  custom={0}
                  variants={fieldVariants}
                  className="relative"
                >
                  <motion.div 
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all
                      ${activeField === 'code' ? 'border-gray-400' : 'border-gray-200'}`}
                    style={{ 
                      borderColor: activeField === 'code' ? colors.accent : colors.border,
                      backgroundColor: colors.background
                    }}
                    whileHover={{ borderColor: colors.accent }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      <Key className={`${getTextSize('w-5 h-5', 'w-6 h-6', 'w-6 h-6')}`} style={{ 
                        color: activeField === 'code' ? colors.accent : colors.textSecondary 
                      }} />
                    </motion.div>
                    <input
                      type="text"
                      placeholder="Enter 6-Digit Code"
                      value={verificationCode}
                      onFocus={() => setActiveField('code')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full bg-transparent focus:outline-none font-bold tracking-widest text-center"
                      style={{ color: colors.textPrimary }}
                      maxLength={6}
                      required
                    />
                  </motion.div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isVerifyingEmail}
                  className={`w-full ${getPadding('px-6 py-3', 'px-8 py-4', 'px-8 py-4')} bg-pink-500 text-white ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-[0.2em] font-medium rounded-lg`}
                  whileHover={{ backgroundColor: colors.textPrimary, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  whileDisabled={{ opacity: 0.6 }}
                  variants={itemVariants}
                >
                  {isVerifyingEmail ? (
                    <motion.div className="flex items-center justify-center gap-2">
                      <motion.div 
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Verifying...
                    </motion.div>
                  ) : (
                    "Verify & Continue"
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Google Login & Footer - Hidden during verification */}
          <AnimatePresence>
            {!isVerifying && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Divider */}
                <motion.div className="mt-6" variants={itemVariants}>
                  <div className="flex items-center">
                    <div className="flex-1" style={{ borderTop: `1px solid ${colors.border}` }}></div>
                    <span className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} px-4 uppercase tracking-wider text-gray-500`}>
                      Or continue with
                    </span>
                    <div className="flex-1" style={{ borderTop: `1px solid ${colors.border}` }}></div>
                  </div>
                </motion.div>

                {/* Google Login */}
                <motion.div 
                  className="flex justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`${isMobile ? 'w-full max-w-xs' : 'w-full max-w-sm'}`}>
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          const res = await googleLogin({
                            token: credentialResponse.credential,
                          }).unwrap();
                          dispatch(setCredentials({ ...res }));
                          navigate(redirect);
                          toast.success("Registered with Google");
                        } catch (err) {
                          toast.error(err?.data?.message || err.error);
                        }
                      }}
                      onError={() => toast.error("Google Sign Up Failed")}
                      theme="outline"
                      shape="pill"
                      text="signup_with"
                      width="320"
                      size="medium"
                    />
                  </div>
                </motion.div>

                {/* Login Link */}
                <motion.div 
                  className="pt-6 border-t"
                  style={{ borderColor: colors.border }}
                  variants={itemVariants}
                >
                  <p className={`${getTextSize('text-xs', 'text-sm', 'text-base')} text-center text-gray-600`}>
                    Already have an account?{" "}
                    <Link
                      to={redirect ? `/login?redirect=${redirect}` : "/login"}
                      className="font-medium hover:underline"
                      style={{ color: colors.accent }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default memo(Register);