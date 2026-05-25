import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaMapMarkerAlt, FaCity, FaGlobe, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

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

  const [paymentMethod, setPaymentMethod] = useState("Whatsapp");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [whatsappNumber, setWhatsappNumber] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Responsive Typography Helpers
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

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!address || !city || !whatsappNumber || !country) {
      toast.error("Please fill all fields", { theme: "dark" });
      setIsSubmitting(false);
      return;
    }

    dispatch(saveShippingAddress({ address, city, postalCode: whatsappNumber, country }));
    dispatch(savePaymentMethod(paymentMethod));

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/placeorder");
    }, 800);
  };

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
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Editorial Header - Centered with refined typography */}
      <motion.div className="border-b border-black/5 relative z-10" variants={headerVariants}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getPadding('py-6', 'py-10', 'py-12')} text-center`}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.mediumGray }}
          >
            Logistics & Processing
          </motion.span>
          <motion.h1 className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter text-black`} style={{ letterSpacing: '-0.02em' }}>
            Shipping Details
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 bg-pink-500 mx-auto mt-6" style={{ opacity: 0.8 }}
          />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.div
          className={`grid grid-cols-1 ${isDesktop ? 'lg:grid-cols-12' : ''} ${getGap('gap-6', 'gap-8', 'gap-12')} items-start`}
          variants={containerVariants}
        >
          {/* Form Section */}
          <motion.div
            className={`${isDesktop ? 'lg:col-span-8' : ''}`}
            variants={itemVariants}
          >
            <motion.div
              className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
              style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
            >
              <motion.h2
                className="text-xl md:text-2xl font-light tracking-tighter pb-4 border-b mb-6"
                style={{ color: colors.deepOnyx, borderColor: colors.lightGray, letterSpacing: '-0.02em' }}
                variants={itemVariants}
              >
                Delivery Destination
              </motion.h2>

              <motion.form
                onSubmit={submitHandler}
                className={`space-y-6 ${isMobile ? '' : 'sm:space-y-8'}`}
                variants={containerVariants}
              >
                <div className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-2' : ''} ${getGap('gap-4', 'gap-6', 'gap-8')}`}>
                  {/* Address */}
                  <motion.div
                    className="md:col-span-2"
                    custom={0}
                    variants={formFieldVariants}
                  >
                    <motion.label
                      className={`${getTextSize('text-[10px]', 'text-xs', 'text-xs')} uppercase tracking-[0.4em] font-bold mb-2 block`}
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ x: 2 }}
                    >
                      Street address
                    </motion.label>
                    <motion.div
                      className="relative"
                      whileFocusWithin={{ scale: 1.01 }}
                    >
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        <FaMapMarkerAlt className={getTextSize('text-lg', 'text-xl', 'text-xl')} style={{ color: colors.mediumGray }} />
                      </motion.div>
                      <motion.input
                        type="text"
                        className="w-full border-0 border-b pl-10 py-3 focus:border-black outline-none transition-all"
                        style={{ borderColor: colors.lightGray, color: colors.deepOnyx }}
                        placeholder="Suite or street name"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        whileFocus={{ borderColor: colors.accent, transition: { duration: 0.2 } }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* City */}
                  <motion.div
                    custom={1}
                    variants={formFieldVariants}
                  >
                    <motion.label
                      className={`${getTextSize('text-[10px]', 'text-xs', 'text-xs')} uppercase tracking-[0.4em] font-bold mb-2 block`}
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ x: 2 }}
                    >
                      City
                    </motion.label>
                    <motion.div
                      className="relative"
                      whileFocusWithin={{ scale: 1.01 }}
                    >
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        <FaCity className={getTextSize('text-lg', 'text-xl', 'text-xl')} style={{ color: colors.mediumGray }} />
                      </motion.div>
                      <motion.input
                        type="text"
                        className="w-full border-0 border-b pl-10 py-3 focus:border-black outline-none transition-all"
                        style={{ borderColor: colors.lightGray, color: colors.deepOnyx }}
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                        whileFocus={{ borderColor: colors.accent, transition: { duration: 0.2 } }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Country */}
                  <motion.div
                    custom={2}
                    variants={formFieldVariants}
                  >
                    <motion.label
                      className={`${getTextSize('text-[10px]', 'text-xs', 'text-xs')} uppercase tracking-[0.4em] font-bold mb-2 block`}
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ x: 2 }}
                    >
                      Country
                    </motion.label>
                    <motion.div
                      className="relative"
                      whileFocusWithin={{ scale: 1.01 }}
                    >
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        <FaGlobe className={getTextSize('text-lg', 'text-xl', 'text-xl')} style={{ color: colors.mediumGray }} />
                      </motion.div>
                      <motion.input
                        type="text"
                        className="w-full border-0 border-b pl-10 py-3 focus:border-black outline-none transition-all"
                        style={{ borderColor: colors.lightGray, color: colors.deepOnyx }}
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                        whileFocus={{ borderColor: colors.accent, transition: { duration: 0.2 } }}
                      />
                    </motion.div>
                  </motion.div>

                  {/* WhatsApp */}
                  <motion.div
                    className="md:col-span-2"
                    custom={3}
                    variants={formFieldVariants}
                  >
                    <motion.label
                      className={`${getTextSize('text-[10px]', 'text-xs', 'text-xs')} uppercase tracking-[0.4em] font-bold mb-2 block`}
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ x: 2 }}
                    >
                      WhatsApp contact
                    </motion.label>
                    <motion.div
                      className="relative"
                      whileFocusWithin={{ scale: 1.01 }}
                    >
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        <FaWhatsapp className={getTextSize('text-lg', 'text-xl', 'text-xl')} style={{ color: colors.mediumGray }} />
                      </motion.div>
                      <motion.input
                        type="tel"
                        className="w-full border-0 border-b pl-10 py-3 focus:border-black outline-none transition-all"
                        style={{ borderColor: colors.lightGray, color: colors.deepOnyx }}
                        placeholder="+00 000 000 0000"
                        value={whatsappNumber}
                        required
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        whileFocus={{ borderColor: colors.accent, transition: { duration: 0.2 } }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Payment Method */}
                <motion.div
                  className="pt-6 sm:pt-8"
                  variants={itemVariants}
                >
                  <motion.h3
                    className="text-lg md:text-xl font-light tracking-tighter mb-6"
                    style={{ color: colors.deepOnyx, letterSpacing: '-0.02em' }}
                    variants={itemVariants}
                  >
                    Concierge Payment
                  </motion.h3>
                  <motion.div
                    custom={4}
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setPaymentMethod("Whatsapp")}
                    className="cursor-pointer p-4 sm:p-6 border transition-all"
                    style={{
                      borderColor: paymentMethod === "Whatsapp" ? colors.accent : colors.lightGray,
                      backgroundColor: paymentMethod === "Whatsapp" ? colors.ivory : colors.white,
                      boxShadow: paymentMethod === "Whatsapp" ? "0 20px 40px rgba(0,0,0,0.08)" : "none"
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`border ${paymentMethod === "Whatsapp" ? 'bg-pink-500 text-white border-pink-500' : 'border-pink-200 text-gray-500'} p-3`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <FaWhatsapp className={getTextSize('text-2xl', 'text-3xl', 'text-4xl')} />
                      </motion.div>
                      <div>
                        <p className="text-base md:text-lg font-light tracking-tight text-stone-900 uppercase">
                          Direct WhatsApp Billing
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mt-1">
                          Personal concierge manual handling
                        </p>
                      </div>
                      {paymentMethod === "Whatsapp" && (
                        <FaCheckCircle className={`${getTextSize('text-2xl', 'text-3xl', 'text-4xl')} text-black ml-auto`} />
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-6 ${getPadding('px-4 py-3', 'px-6 py-3', 'px-8 py-4')} text-white hover:opacity-90 transition-colors ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-widest font-medium rounded-full shadow-lg`} style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)`, boxShadow: colors.softShadow }}
                  whileHover={!isSubmitting ? {
                    backgroundColor: colors.deepOnyx,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  variants={itemVariants}
                >
                  {isSubmitting ? (
                    'Securing details...'
                  ) : (
                    'Finalize Logistics'
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          {isDesktop && (
            <motion.div
              className="lg:col-span-4 mt-8 lg:mt-0 space-y-6 lg:sticky lg:top-4"
              variants={itemVariants}
            >
              {/* Progress Track */}
              <motion.div
                className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                variants={itemVariants}
              >
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-40">
                  Purchase Journey
                </h4>
                <div className="space-y-4">
                  {[
                    { step: 1, label: "Selection", status: "complete" },
                    { step: 2, label: "Logistics", status: "current" },
                    { step: 3, label: "Review", status: "pending" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      className="flex items-center gap-4"
                      variants={itemVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div
                        className={`w-10 h-10 flex items-center justify-center border ${item.status === 'complete' ? 'bg-pink-500 text-white border-pink-500' : item.status === 'current' ? 'border-pink-500 text-pink-500 scale-110' : 'border-pink-200 text-pink-300'}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {item.status === 'complete' ? '✓' : item.step}
                      </motion.div>
                      <motion.span
                        className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40"
                        style={{ color: item.status === 'current' ? 'black' : colors.mediumGray }}
                      >
                        {item.label}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Logistics Info */}
              <motion.div
                className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                variants={itemVariants}
                whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
              >
                <motion.div className={getTextSize('text-3xl', 'text-4xl', 'text-5xl')} variants={itemVariants} whileHover={{ scale: 1.1 }}>
                  <FaWhatsapp className="inline mr-3" style={{ color: colors.accent }} />
                </motion.div>
                <motion.h3
                  className="text-lg md:text-xl font-light tracking-tighter mt-4"
                  style={{ color: colors.deepOnyx, letterSpacing: '-0.02em' }}
                  variants={itemVariants}
                >
                  Artisan Delivery
                </motion.h3>
                <motion.p
                  className={`${getTextSize('text-xs', 'text-sm', 'text-base')} font-sans text-stone-600 leading-relaxed mt-2`}
                  variants={itemVariants}
                >
                  Specialized logistics network ensures climate-controlled transport and professional unboxing.
                </motion.p>
              </motion.div>

              {/* Contact */}
              <motion.div
                className={`border-l-4 ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.lightGray }}
                variants={itemVariants}
                whileHover={{ borderColor: colors.accent, transition: { duration: 0.3 } }}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-2">
                  Personal Concierge
                </p>
                <motion.a
                  href="mailto:saloninterior@gmail.com"
                  className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-light`}
                  style={{ color: colors.accent }}
                  whileHover={{ x: 4 }}
                >
                  salooninterior@gmail.com
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Shipping;