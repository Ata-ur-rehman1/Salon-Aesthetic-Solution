import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation, useGoogleLoginMutation } from "../../redux/api/usersApiSlice";
import { GoogleLogin } from "@react-oauth/google";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  // ELEGANT WHITE & PINK COLOR SCHEME
  const colors = {
    background: "#ffffff",      // Pure white
    textPrimary: "#333333",     // Soft dark gray
    textSecondary: "#888888",   // Lighter gray
    accent: "#2563eb",          // Beautiful Pink (Tailwind blue-600)
    border: "#dbeafe",          // Very light pink borders
    surface: "#eff6ff",         // Surface pink
    surfaceHover: "#eff6ff",    // Light pink hover state
    shadow: "rgba(37, 99, 235, 0.1)"  // Soft pink shadow
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeField, setActiveField] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

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

  const googleButtonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin({
        token: credentialResponse.credential,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
      <div className={`w-full max-w-md ${getPadding('px-4', 'px-6', 'px-8')} py-6`}>
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
              Welcome Back
            </motion.span>
            <motion.h1 className={`${getTextSize('text-2xl', 'text-3xl', 'text-4xl')} font-light tracking-tighter text-black`}>
              Sign In
            </motion.h1>
            <motion.p className={`${getTextSize('text-sm', 'text-base', 'text-base')} text-gray-600 mt-1`}>
              Access your exclusive account
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={submitHandler} className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-6')}`} variants={containerVariants}>
            {/* Email Field */}
            <motion.div 
              custom={0}
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
              custom={1}
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full ${getPadding('px-6 py-3', 'px-8 py-4', 'px-8 py-4')} bg-blue-600 text-white ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-[0.2em] font-medium rounded-lg disabled:opacity-50`}
              whileHover={{ backgroundColor: colors.textPrimary, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              whileDisabled={{ opacity: 0.6 }}
            >
              {isLoading ? (
                <motion.div className="flex items-center justify-center gap-2">
                  <motion.div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing In...
                </motion.div>
              ) : (
                <motion.div className="flex items-center justify-center gap-2" whileHover={{ gap: "0.5rem" }}>
                  <span>Sign In</span>
                  <motion.div whileHover={{ x: 4 }}>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div className="mt-6" variants={itemVariants}>
            <div className="flex items-center gap-3">
              <div className="flex-1" style={{ borderTop: `1px solid ${colors.border}` }}></div>
              <span className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-wider text-gray-500`}>
                Or continue with
              </span>
              <div className="flex-1" style={{ borderTop: `1px solid ${colors.border}` }}></div>
            </div>
          </motion.div>

          {/* Google Login */}
          <motion.div
            className="mt-4"
            variants={googleButtonVariants}
          >
            <div className={`${isMobile ? 'w-full' : 'w-full'} flex justify-center`}>
              <div className={`${isMobile ? 'w-full max-w-xs' : 'w-full max-w-sm'}`}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Login Failed")}
                  theme="outline"
                  shape="pill"
                  text="signin_with"
                  width="320"
                  size="medium"
                />
              </div>
            </div>
          </motion.div>

          {/* Register Link */}
          <motion.div 
            className="mt-6 pt-6 border-t"
            style={{ borderColor: colors.border }}
            variants={itemVariants}
          >
            <p className={`${getTextSize('text-xs', 'text-sm', 'text-base')} text-center text-gray-600`}>
              New to Salon Studio?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="font-medium hover:underline"
                style={{ color: colors.accent }}
                whileHover={{ scale: 1.05 }}
              >
                Create an Account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;