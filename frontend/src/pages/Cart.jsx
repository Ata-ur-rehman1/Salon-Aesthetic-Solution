
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaArrowLeft, FaShoppingBag, FaWhatsapp, FaPlus, FaMinus } from "react-icons/fa";
import { FiShield, FiTruck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #fffcfd 0%, #ffffff 100%)",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",
    accent: "#ec4899", // Primary Pink
    accentLight: "#fce7f3",
    accentDeep: "#be185d",
    roseGold: "#b76e79", // Elegant rose gold
    roseGoldLight: "#e0bfb8",
    border: "rgba(252, 231, 243, 0.8)",
    glass: "rgba(255, 255, 255, 0.85)",
    ultraShadow: "0 40px 80px -15px rgba(236, 72, 153, 0.15), 0 20px 40px -20px rgba(0, 0, 0, 0.1)",
    softShadow: "0 15px 35px -5px rgba(236, 72, 153, 0.08)",
    surface: "#ffffff",
    surfaceHover: "#fdf2f8",
    success: "#10b981",
    error: "#ef4444"
  };

  // Responsive State Management
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

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

  // Responsive Typography & Spacing Helpers (DEFINED HERE)
  const getTextSize = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getPadding = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getGap = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: isMobile ? 0.1 : 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: isMobile ? 20 : 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 100 : 80,
        damping: isMobile ? 25 : 20,
        duration: isMobile ? 0.4 : 0.6
      }
    }
  };

  const headerVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
        duration: 0.5
      }
    }
  };

  const cartItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const emptyStateVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.5
      }
    }
  };

  // Handlers
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id, name) => {
    dispatch(removeFromCart(id));
    toast.dark(`Removed ${name}`, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingCost = 299;
  const tax = subtotal * 0.08;
  const total = subtotal;

  return (
    <motion.div
      className="min-h-screen pb-24 font-sans mt-10 relative overflow-hidden"
      style={{ background: colors.bgGradient }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Editorial Header - FIXED: Centered text */}
      <motion.div className="border-b border-black/5 relative z-10" variants={headerVariants}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getPadding('py-6', 'py-10', 'py-12')} text-center`}>
          <motion.span
            className="text-[8px] md:text-[10px] lg:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.mediumGray }}
          >
            Curated Shopping Bag
          </motion.span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tighter mb-4" style={{ color: colors.deepOnyx, letterSpacing: '-0.02em' }}>
            Your Selection
          </h1>
          <motion.div
            className="h-1 w-12 md:w-24 mx-auto mt-6"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-16 sm:py-24 lg:py-32 bg-white border rounded-lg"
              style={{ borderColor: colors.lightGray }}
            >
              <motion.div
                className="flex justify-center mb-6 md:mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <FaShoppingBag className={`${getTextSize('text-3xl', 'text-4xl', 'text-6xl')}`} style={{ color: colors.mediumGray }} />
              </motion.div>
              <motion.h2
                className="text-xl md:text-3xl font-light uppercase tracking-[0.2em] mb-4"
                style={{ color: colors.deepOnyx }}
              >
                {isMobile ? 'Your bag is empty' : 'Your curated collection awaits'}
              </motion.h2>
              <motion.p
                className={`${getTextSize('text-xs', 'text-sm', 'text-base')} mb-6 md:mb-8 text-stone-600 leading-relaxed italic font-light max-w-2xl mx-auto`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Explore our ultra-modern furniture and salon essentials to find pieces that resonate with your vision.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, type: isMobile ? "easeOut" : "spring" }}
              >
                <Link
                  to="/"
                  className={`inline-block ${getPadding('px-6 py-3', 'px-8 py-4', 'px-10 py-5')} text-white text-xs uppercase tracking-[0.3em] font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                  style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)` }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discover Collections
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className={`grid grid-cols-1 ${isDesktop ? 'lg:grid-cols-12' : ''} ${getGap('gap-6', 'gap-8', 'gap-12')} items-start`}
              variants={containerVariants}
            >
              {/* ITEM LIST */}
              <motion.div
                className={`${isDesktop ? 'lg:col-span-8' : ''}`}
                variants={itemVariants}
              >
                <motion.div
                  className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-8')}`}
                  variants={containerVariants}
                >
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        variants={cartItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white/60 backdrop-blur-md border-b last:border-0 overflow-hidden"
                        style={{ borderColor: colors.border }}
                      >
                        <div className={`flex ${isMobile ? 'flex-col gap-3 p-4' : isTablet ? 'flex-row gap-4 p-6' : 'flex-row gap-6 p-8'}`}>
                          {/* Image */}
                          <motion.div
                            className={`${isMobile ? 'w-56 h-64 mx-auto rounded-xl' : isTablet ? 'w-28 h-48 rounded-xl' : 'w-40 h-64 rounded-xl'} overflow-hidden relative flex-shrink-0 shadow-sm`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <motion.img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              style={{ filter: "grayscale(0.05)" }}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            />
                          </motion.div>

                          {/* Details */}
                          <motion.div
                            className="flex-1 flex flex-col justify-between min-w-0"
                            variants={containerVariants}
                          >
                            <motion.div className="w-full" variants={itemVariants}>
                              <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row'} ${isMobile ? '' : 'justify-between'} ${isMobile ? '' : 'items-start'} mb-3`}>
                                <div className="min-w-0">
                                  <motion.span
                                    className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] opacity-40"
                                    style={{ color: colors.accent }}
                                  >
                                    {item.brand}
                                  </motion.span>
                                  <motion.h3
                                    className="text-[13px] md:text-base font-light tracking-tight leading-tight line-clamp-2 mt-2"
                                    style={{ color: colors.textPrimary }}
                                  >
                                    {item.name}
                                  </motion.h3>
                                </div>
                                <motion.p
                                  className="text-xl md:text-2xl font-light tracking-tighter"
                                  style={{ color: colors.textPrimary }}
                                >
                                  Rs. {item.price.toLocaleString()}
                                </motion.p>
                              </div>

                              <div className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row'} items-start sm:items-center ${getGap('gap-3', 'gap-4', 'gap-6')}`}>
                                {/* Quantity Controls */}
                                <motion.div
                                  className="flex items-center border rounded-full bg-white/60 backdrop-blur-md shadow-sm"
                                  style={{ borderColor: colors.border }}
                                >
                                  <motion.button
                                    onClick={() => item.qty > 1 && addToCartHandler(item, item.qty - 1)}
                                    className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FaMinus className={isMobile ? 'text-xs' : 'text-sm'} style={{ color: colors.mediumGray }} />
                                  </motion.button>
                                  <motion.span className={`${isMobile ? 'w-8' : 'w-10'} text-center text-sm font-medium`}>
                                    {item.qty}
                                  </motion.span>
                                  <motion.button
                                    onClick={() => item.qty < item.countInStock && addToCartHandler(item, item.qty + 1)}
                                    className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} flex items-center justify-center`}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FaPlus className={isMobile ? 'text-xs' : 'text-sm'} style={{ color: colors.mediumGray }} />
                                  </motion.button>
                                </motion.div>

                                {/* Remove Button */}
                                <motion.button
                                  onClick={() => removeFromCartHandler(item._id, item.name)}
                                  className="text-sm md:text-lg lg:text-xl uppercase tracking-[0.3em] font-bold hover:text-red-500 transition-all text-pink-300 hover:scale-110"
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FaTrash />
                                </motion.button>
                              </div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ x: -4 }}
                  className={`mt-6 sm:mt-8 ${isMobile ? 'p-4 bg-white border-t' : ''}`}
                  style={isMobile ? { borderColor: colors.lightGray } : {}}
                >
                  <Link
                    to="/"
                    className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-opacity"
                    style={{ color: colors.mediumGray }}
                  >
                    ← Continue Exploring
                  </Link>
                </motion.div>
              </motion.div>

              {/* ORDER SUMMARY */}
              <motion.div
                className={`${isDesktop ? 'lg:col-span-4 mt-6 lg:mt-0' : 'mt-8'} ${isDesktop ? 'lg:sticky lg:top-4' : ''}`}
                variants={itemVariants}
              >
                <div
                  className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                  style={{
                    borderColor: colors.border,
                    boxShadow: colors.softShadow
                  }}
                >
                  <motion.h2
                    className="text-[13px] md:text-base font-light tracking-tight pb-4 border-b mb-6"
                    style={{ color: colors.textPrimary, borderColor: colors.lightGray }}
                  >
                    Order Summary
                  </motion.h2>

                  <motion.div
                    className="space-y-3"
                    variants={containerVariants}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40" style={{ color: colors.mediumGray }}>
                        Selection ({cartItems.length})
                      </span>
                      <span className="font-light tracking-tight" style={{ color: colors.textPrimary }}>
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 py-2">
                      <div className="flex items-center gap-2">
                        <FaWhatsapp className="text-pink-500 text-sm" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: colors.accent }}>
                          Settlement WhatsApp Concierge
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-400 font-light leading-tight">
                        Secure manual payment processing with priority logistics.
                      </p>
                    </div>


                    <div
                      className="pt-3 mt-3 border-t-2"
                      style={{ borderColor: colors.lightGray }}
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="text-xl md:text-2xl font-light tracking-tighter" style={{ color: colors.textPrimary }}>
                          Total
                        </span>
                        <span className="text-2xl md:text-3xl font-light tracking-tighter" style={{ color: colors.textPrimary }}>
                          Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => navigate("/shipping")}
                    className={`w-full mt-8 ${getPadding('px-4 py-3', 'px-6 py-4', 'px-8 py-5')} text-white text-xs uppercase tracking-[0.3em] font-bold rounded-full shadow-lg hover:-translate-y-1 transition-all`}
                    style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)`, boxShadow: colors.softShadow }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Finalize Purchase
                  </motion.button>

                  {/* Trust Badges */}
                  <motion.div
                    className="mt-4 pt-4 border-t space-y-4"
                    style={{ borderColor: colors.lightGray }}
                  >
                    <div className="flex items-start gap-3 opacity-40">
                      <FiTruck className="text-lg" />
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold leading-tight">
                        Insured Delivery
                      </p>
                    </div>
                    <div className="flex items-start gap-3 opacity-40">
                      <FiShield className="text-lg" />
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold leading-tight">
                        3 years foam warranty <br /> 5 years mechanical warranty
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Cart;