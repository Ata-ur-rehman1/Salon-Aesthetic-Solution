import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { FaBox, FaMapMarkerAlt, FaReceipt, FaWhatsapp, FaArrowLeft, FaShieldAlt, FaCreditCard } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Message from "../../components/Message";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Responsive State Management
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #fffcfd 0%, #ffffff 100%)",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",
    accent: "#2563eb", // Primary Pink
    accentLight: "#dbeafe",
    accentDeep: "#1d4ed8",
    roseGold: "#b76e79", // Elegant rose gold
    roseGoldLight: "#e0bfb8",
    border: "rgba(219, 234, 254, 0.8)",
    glass: "rgba(255, 255, 255, 0.85)",
    ultraShadow: "0 40px 80px -15px rgba(37, 99, 235, 0.15), 0 20px 40px -20px rgba(0, 0, 0, 0.1)",
    softShadow: "0 15px 35px -5px rgba(37, 99, 235, 0.08)",
    surface: "#ffffff",
    surfaceHover: "#eff6ff",
    success: "#10b981",
    error: "#ef4444"
  };

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: 0.2
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

  const placeOrderHandler = async () => {
    try {
      setIsProcessing(true);
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      toast.success("Reservation confirmed", { theme: "dark" });
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error.data?.message || "Finalization failed");
      setIsProcessing(false);
    }
  };

  const itemsTotal = cart.cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0);

  return (
    <motion.div
      className="min-h-screen pb-24 font-sans relative overflow-hidden"
      style={{ background: colors.bgGradient }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Editorial Header - CENTERED */}
      <motion.div className="border-b border-black/5 relative z-10" variants={headerVariants}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getPadding('py-6', 'py-10', 'py-12')} text-center`}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.mediumGray }}
          >
            Final Review
          </motion.span>
          <motion.h1 className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter text-black`} style={{ letterSpacing: '-0.02em' }}>
            Verify Details
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 bg-blue-600 mx-auto mt-6" style={{ opacity: 0.8 }}
          />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {cart.cartItems.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className={`text-center ${getPadding('py-16', 'py-24', 'py-32')} bg-white/60 backdrop-blur-md border rounded-[2rem]`}
            style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
          >
            <motion.div
              className="mx-auto mb-6 md:mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <FaBox className={`${getTextSize('text-3xl', 'text-4xl', 'text-6xl')}`} style={{ color: colors.mediumGray }} />
            </motion.div>
            <motion.h2
              className="text-xl md:text-3xl font-light tracking-tighter mb-4"
              style={{ color: colors.deepOnyx, letterSpacing: '-0.02em' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {isMobile ? 'Collection Empty' : 'Selection Empty'}
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
                className={`inline-block ${getPadding('px-4 py-2', 'px-6 py-3', 'px-8 py-4')} text-white ${getTextSize('text-xs', 'text-sm', 'text-base')} uppercase tracking-[0.3em] font-medium rounded-full shadow-lg hover:-translate-y-1 transition-all duration-300`}
                style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)`, boxShadow: colors.softShadow }}
                whileHover={{ scale: 1.05 }}
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
            {/* Left Column: Items and Logistics Summary */}
            <motion.div
              className={`${isDesktop ? 'lg:col-span-8' : ''} space-y-6 ${getGap('gap-6', 'gap-8', 'gap-10')}`}
              variants={itemVariants}
            >
              {/* Items List */}
              <motion.section
                variants={itemVariants}
                className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
              >
                <motion.h2
                  className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 pb-4 border-b"
                  style={{ color: colors.deepOnyx, borderColor: colors.lightGray, opacity: 0.4 }}
                  variants={itemVariants}
                >
                  <FaBox className="inline mr-3" /> Selected Pieces ({cart.cartItems.length.toString().padStart(2, '0')})
                </motion.h2>

                <div className="divide-y" style={{ borderColor: colors.lightGray }}>
                  <AnimatePresence mode="popLayout">
                    {cart.cartItems.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={cartItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`flex ${isMobile ? 'flex-col gap-3 p-3' : isTablet ? 'flex-row gap-4 p-4' : 'flex-row gap-6 p-6'} items-center`}
                        whileHover={!isMobile ? { scale: 1.01 } : {}}
                      >
                        <motion.div
                          className={`${isMobile ? 'w-56 h-64 mx-auto rounded-xl' : isTablet ? 'w-28 h-48 rounded-xl' : 'w-40 h-64 rounded-xl'} flex-shrink-0 overflow-hidden relative shadow-sm`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <motion.img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ filter: "grayscale(0.05)" }}
                          />
                        </motion.div>

                        <motion.div className="flex-1 min-w-0" variants={containerVariants}>
                          <Link to={`/product/${item.product}`} className="block">
                            <motion.span
                              className={`${getTextSize('text-[8px]', 'text-[10px]', 'text-xs')} uppercase tracking-[0.2em] font-medium mb-1 block`}
                              style={{ color: colors.mediumGray }}
                              variants={itemVariants}
                            >
                              {item.brand || "Exclusive Design"}
                            </motion.span>
                            <motion.h3
                              className="text-base md:text-lg font-light tracking-tight truncate"
                              style={{ color: colors.deepOnyx }}
                              variants={itemVariants}
                              whileHover={{ opacity: 0.6 }}
                            >
                              {item.name}
                            </motion.h3>
                          </Link>

                          <motion.div
                            className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row'} ${isMobile ? '' : 'justify-between'} ${isMobile ? '' : 'items-end'} mt-3`}
                            variants={itemVariants}
                          >
                            <motion.span
                              className={`${getTextSize('text-xs', 'text-sm', 'text-sm')} font-light`}
                              style={{ color: colors.mediumGray }}
                            >
                              Quantity: <span className="font-medium">{item.qty.toString().padStart(2, '0')}</span>
                            </motion.span>
                            <motion.span
                              className="text-lg md:text-xl font-light tracking-tighter"
                              style={{ color: colors.deepOnyx }}
                              whileHover={{ scale: 1.05 }}
                            >
                              Rs. {(item.qty * item.price).toLocaleString()}
                            </motion.span>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>

              {/* Shipping & Payment Summary */}
              <motion.div
                className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-2' : ''} ${getGap('gap-4', 'gap-6', 'gap-8')}`}
                variants={containerVariants}
              >
                {/* Shipping Address */}
                <motion.section
                  variants={itemVariants}
                  className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                  style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                  whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
                >
                  <motion.h3
                    className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 pb-4 border-b opacity-40"
                    style={{ color: colors.deepOnyx, borderColor: colors.lightGray }}
                    variants={itemVariants}
                  >
                    <FaMapMarkerAlt className="inline mr-3" /> Destination
                  </motion.h3>

                  <motion.div
                    className="space-y-2"
                    variants={containerVariants}
                  >
                    <motion.p
                      className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-light`}
                      style={{ color: colors.deepOnyx }}
                      variants={itemVariants}
                    >
                      {cart.shippingAddress.address}
                    </motion.p>
                    <motion.p
                      className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30"
                      style={{ color: colors.mediumGray }}
                      variants={itemVariants}
                    >
                      {cart.shippingAddress.city}, {cart.shippingAddress.country}
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-3 pt-2"
                      variants={itemVariants}
                    >
                      <motion.div
                        className={`${getPadding('p-2', 'p-3', 'p-3')} bg-blue-600 text-white`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <FaWhatsapp className={getTextSize('text-base', 'text-lg', 'text-xl')} />
                      </motion.div>
                      <motion.span
                        className={`${getTextSize('text-sm', 'text-base', 'text-base')} font-mono`}
                        style={{ color: colors.deepOnyx }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {cart.shippingAddress.postalCode}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.section>

                {/* Payment Method */}
                <motion.section
                  variants={itemVariants}
                  className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                  style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                  whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
                >
                  <motion.h3
                    className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 pb-4 border-b opacity-40"
                    style={{ color: colors.deepOnyx, borderColor: colors.lightGray }}
                    variants={itemVariants}
                  >
                    <FaCreditCard className="inline mr-3" /> Settlement
                  </motion.h3>

                  <motion.div variants={itemVariants}>
                    <motion.p
                      className="text-base md:text-lg font-light tracking-tight italic mb-2"
                      style={{ color: colors.deepOnyx }}
                    >
                      WhatsApp Concierge
                    </motion.p>
                    <motion.p
                      className="text-[10px] uppercase tracking-wider font-bold opacity-30 leading-relaxed"
                      style={{ color: colors.mediumGray }}
                    >
                      Secure manual payment processing with priority logistics.
                    </motion.p>
                  </motion.div>
                </motion.section>
              </motion.div>
            </motion.div>

            {/* Right Column: Order Total & Execution */}
            <motion.div
              className={`${isDesktop ? 'lg:col-span-4 mt-8 lg:mt-0' : 'mt-8'} ${isDesktop ? 'lg:sticky lg:top-4' : ''}`}
              variants={itemVariants}
            >
              <motion.div
                className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
              >
                <motion.h2
                  className="text-sm md:text-base font-light tracking-widest mb-4 pb-4 border-b"
                  style={{ color: colors.deepOnyx, borderColor: colors.lightGray }}
                  variants={itemVariants}
                >
                  <FaReceipt className="inline mr-3" style={{ color: colors.mediumGray }} /> Summary
                </motion.h2>

                <motion.div
                  className="space-y-3 pb-4 mb-4 border-b"
                  style={{ borderColor: colors.lightGray }}
                  variants={containerVariants}
                >
                  <motion.div
                    className="flex justify-between"
                    variants={itemVariants}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
                      Subtotal
                    </span>
                    <motion.span
                      className="text-sm font-light tracking-tight"
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Rs. {itemsTotal.toLocaleString()}
                    </motion.span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between"
                    variants={itemVariants}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
                      Artisan Logistics
                    </span>
                    <motion.span
                      className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30"
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Standard Rate
                    </motion.span>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex justify-between items-baseline pb-6"
                  variants={itemVariants}
                >
                  <motion.div>
                    <motion.span
                      className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40"
                      style={{ color: colors.deepOnyx }}
                    >
                      Est. Total
                    </motion.span>
                  </motion.div>
                  <motion.span
                    className="text-2xl md:text-3xl font-light tracking-tighter"
                    style={{ color: colors.deepOnyx }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Rs. {itemsTotal.toLocaleString()}
                  </motion.span>
                </motion.div>

                <motion.button
                  onClick={placeOrderHandler}
                  disabled={isLoading || isProcessing}
                  className={`w-full ${getPadding('px-4 py-3', 'px-6 py-4', 'px-8 py-5')} text-white text-[10px] uppercase tracking-[0.3em] font-bold rounded-full shadow-lg hover:-translate-y-1 transition-all`}
                  style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)`, boxShadow: colors.softShadow }}
                  whileHover={!isLoading && !isProcessing ? {
                    backgroundColor: colors.deepOnyx,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  } : {}}
                  whileTap={!isLoading && !isProcessing ? { scale: 0.98 } : {}}
                  variants={itemVariants}
                >
                  {isLoading || isProcessing ? (
                    'Finalizing...'
                  ) : (
                    'Request Reservation'
                  )}
                </motion.button>

                {error && (
                  <motion.div
                    className="mt-4"
                    variants={itemVariants}
                  >
                    <Message variant="danger">{error.data?.message}</Message>
                  </motion.div>
                )}

                <motion.div
                  className={`mt-6 ${getPadding('p-4', 'p-6', 'p-6')} border rounded-[2rem] bg-white/40 backdrop-blur-sm`}
                  style={{ borderColor: colors.border }}
                  variants={itemVariants}
                >
                  <div className="flex items-center gap-3 mb-4 opacity-40">
                    <FaWhatsapp className={isMobile ? 'text-lg' : 'text-xl'} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Settlement</span>
                  </div>
                  
                  <h4 className="text-[13px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.textPrimary }}>WhatsApp Concierge</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-light mb-4">
                    Secure manual payment processing with priority logistics. Our team will contact you for settlement details.
                  </p>

                  <div className="flex items-center gap-2 py-2 border-t" style={{ borderColor: colors.border }}>
                    <FaShieldAlt className="text-xs opacity-30" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-medium opacity-30">
                      Buyer Protection Active
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-6 text-center"
                  variants={itemVariants}
                >
                  <Link
                    to="/shipping"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold opacity-30"
                    whileHover={{
                      gap: "0.5rem",
                      opacity: 1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <FaArrowLeft className="text-[10px]" /> Back to Logistics
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaceOrder;