import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaShieldAlt, FaCreditCard, FaLock, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// ELEGANT WHITE & PINK COLOR SCHEME
const colors = {
  background: "#ffffff",      // Pure white
  textPrimary: "#333333",     // Soft dark gray
  textSecondary: "#888888",   // Lighter gray
  textTertiary: "#999999",
  accent: "#ec4899",          // Beautiful Pink (Tailwind pink-500)
  border: "#f3f4f6",          // Neutral light gray borders
  surface: "#fafafa",         // Neutral surface
  surfaceHover: "#f5f5f5",    // Light gray hover state
  shadow: "rgba(0, 0, 0, 0.05)", // Soft gray shadow
  success: "#10b981",
  error: "#ef4444"
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};
// Custom hook for responsive breakpoints
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: typeof window !== 'undefined' ? window.innerWidth : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Security Badge Component
const SecurityBadge = ({ icon, title, subtitle }) => (
  <motion.div
    className="flex items-center gap-2 md:gap-3"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <motion.div
      className="text-sm md:text-base lg:text-lg"
      style={{ color: colors.accent }}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      {icon}
    </motion.div>
    <div>
      <div className="text-[6px] md:text-[8px] lg:text-[9px] font-medium uppercase tracking-[0.2em]" style={{ color: colors.textPrimary }}>
        {title}
      </div>
      <div className="text-[5px] md:text-[7px] lg:text-[8px] uppercase opacity-50 tracking-[0.1em]" style={{ color: colors.textSecondary }}>
        {subtitle}
      </div>
    </div>
  </motion.div>
);

// Mobile View Component
const MobileServices = memo(() => {


  return (
    <motion.footer
      className="border-t py-6 px-4 bg-white"
      style={{ borderColor: colors.border }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Secure Payments Section */}
        <motion.section
          className="mb-4"
          variants={itemVariants}
        >
          <motion.h3
            className="text-[8px] uppercase tracking-[0.3em] font-medium mb-2 opacity-50"
            style={{ color: colors.textSecondary }}
          >
            Secure Payments
          </motion.h3>
          <motion.div
            className="grid grid-cols-3 gap-1 mb-4"
            variants={containerVariants}
          >
            {['WhatsApp', 'Credit', 'Debit'].map((method, index) => (
              <motion.div
                key={index}
                className="py-2 border text-center text-[8px] uppercase font-medium"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface
                }}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {method}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Security Badges - Mobile */}
        <motion.div
          className="flex justify-center gap-4 py-4 border-t mb-4"
          style={{ borderColor: colors.border }}
          variants={itemVariants}
        >
          <SecurityBadge icon={<FaLock />} title="Encrypted" subtitle="256-bit SSL" />
          <SecurityBadge icon={<FaCheckCircle />} title="Certified" subtitle="PCI" />
        </motion.div>

        {/* Connect Section */}
        <motion.section
          className="pt-4 border-t mb-4"
          style={{ borderColor: colors.border }}
          variants={itemVariants}
        >
          <motion.h3
            className="text-[7px] uppercase tracking-[0.2em] font-medium mb-2"
            style={{ color: colors.textSecondary }}
          >
            Connect
          </motion.h3>
          <motion.div
            className="text-xs space-y-1 font-light"
            variants={containerVariants}
          >
            <motion.p
              className="flex items-center gap-2"
              variants={itemVariants}
              whileHover={{ x: 4 }}
            >
              <FaWhatsapp style={{ color: colors.success }} />
              <span style={{ color: colors.textPrimary }}>+92 370 1498826</span>
            </motion.p>
            <motion.p
              variants={itemVariants}
              whileHover={{ x: 4 }}
              style={{ color: colors.textPrimary }}
            >
              salooninterior@gmail.com
            </motion.p>
            <motion.div
              className="flex gap-4 mt-2"
              variants={itemVariants}
            >
              <a href="https://www.instagram.com/saloon_interior_?igsh=dnppeDIwMHFld3Vj" target="_blank" rel="noopener noreferrer">
                <FaInstagram style={{ color: colors.accent, fontSize: '16px' }} />
              </a>
              <a href="https://www.tiktok.com/@saloon_interior_?_r=1&_t=ZS-92ecluCYlzL" target="_blank" rel="noopener noreferrer">
                <FaTiktok style={{ color: colors.accent, fontSize: '16px' }} />
              </a>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Quick Links */}
        <motion.div
          className="flex flex-wrap gap-2 text-[9px] mb-4"
          variants={containerVariants}
        >
          {["About Us", "Contact", "Privacy"].map((link, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                to={`/${link.toLowerCase().replace(" ", "-")}`}
                className="hover:underline"
                style={{ color: colors.textSecondary }}
                whileHover={{ color: colors.accent }}
              >
                {link}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="pt-4 border-t text-center"
          style={{ borderColor: colors.border }}
          variants={itemVariants}
        >
          <motion.p
            className="text-[6px] uppercase tracking-[0.2em] opacity-40 mb-0.5"
            style={{ color: colors.textSecondary }}
          >
            &copy; 2025 Saloon Studio
          </motion.p>
          <motion.p
            className="text-[5px] uppercase tracking-[0.3em] opacity-30"
            style={{ color: colors.textSecondary }}
          >
            Luxury Interior Solutions
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
});

// Tablet View Component
const TabletServices = memo(() => {
  return (
    <motion.footer
      className="border-t py-10 px-6 bg-white"
      style={{ borderColor: colors.border }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Payment Methods */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* WhatsApp Card */}
          <motion.div
            className="bg-white border p-6 relative group"
            style={{
              borderColor: colors.border,
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
            }}
            variants={{
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
            }}
            whileHover={{
              y: -8,
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <motion.div
              className="absolute top-0 right-0 text-white text-[8px] tracking-[0.2em] px-3 py-1.5 uppercase"
              style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, #f472b6)` }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Recommended
            </motion.div>
            <motion.div
              className="text-2xl mb-4"
              style={{ color: colors.accent }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaWhatsapp />
            </motion.div>
            <h3 className="text-base font-light tracking-tight mb-2" style={{ color: colors.textPrimary }}>WhatsApp Transfer</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
              Complete your transaction via secure chat with instant verification.
            </p>
            <motion.div
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-medium"
              style={{ color: colors.success }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.success }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Official Business
            </motion.div>
          </motion.div>

          {/* Credit Card Card */}
          <motion.div
            className="bg-white border p-6 group"
            style={{
              borderColor: colors.border,
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
            }}
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: 0.05
                }
              }
            }}
            whileHover={{
              y: -8,
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <motion.div
              className="text-2xl mb-4"
              style={{ color: colors.accent }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaCreditCard />
            </motion.div>
            <h3 className="text-base font-light tracking-tight mb-2" style={{ color: colors.textPrimary }}>Credit / Debit</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
              Global acceptance including VISA and Mastercard with SSL protection.
            </p>
            <motion.div
              className="flex gap-2 text-[9px] font-medium"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="border px-2 py-0.5" style={{ borderColor: colors.border }}>VISA</span>
              <span className="border px-2 py-0.5" style={{ borderColor: colors.border }}>MASTERCARD</span>
            </motion.div>
          </motion.div>

          {/* Protection Card */}
          <motion.div
            className="bg-white border p-6 group"
            style={{
              borderColor: colors.border,
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
            }}
            variants={{
              hidden: { y: 40, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: 0.1
                }
              }
            }}
            whileHover={{
              y: -8,
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            <motion.div
              className="text-2xl mb-4"
              style={{ color: colors.accent }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaShieldAlt />
            </motion.div>
            <h3 className="text-base font-light tracking-tight mb-2" style={{ color: colors.textPrimary }}>Buyer Protection</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
              Your equipment investment is safe with our secure fulfillment process.
            </p>
            <motion.div
              className="text-[9px] uppercase tracking-[0.2em] font-medium"
              style={{ color: colors.accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              PCI DSS Compliant
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Security Badges */}
        <motion.div
          className="flex justify-center gap-6 py-6 border-y mb-10"
          style={{ borderColor: colors.border }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SecurityBadge icon={<FaLock />} title="Encrypted" subtitle="256-bit SSL" />
          <SecurityBadge icon={<FaCheckCircle />} title="Certified" subtitle="PCI Compliant" />
          <SecurityBadge icon={<FaShieldAlt />} title="Protected" subtitle="Fraud Detection" />
        </motion.div>

        {/* Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-4 lg:mb-6 opacity-60" style={{ color: colors.accent }}>
              Saloon Studio
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Curating high-end interiors for the modern professional since 2024.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-4 lg:mb-6 opacity-60" style={{ color: colors.accent }}>
              Contact
            </h4>
            <motion.div
              className="text-sm space-y-1 font-light"
              variants={containerVariants}
            >
              <motion.p
                className="flex items-center gap-2"
                variants={itemVariants}
                whileHover={{ x: 4 }}
              >
                <FaWhatsapp style={{ color: colors.success }} />
                <span style={{ color: colors.textPrimary }}>+92 370 1498826</span>
              </motion.p>
              <motion.p
                variants={itemVariants}
                whileHover={{ x: 4 }}
                style={{ color: colors.textPrimary }}
              >
                salooninterior@gmail.com
              </motion.p>
              <motion.div
                className="flex gap-4 mt-2"
                variants={itemVariants}
              >
                <a href="https://www.instagram.com/saloon_interior_?igsh=dnppeDIwMHFld3Vj" target="_blank" rel="noopener noreferrer">
                  <FaInstagram style={{ color: colors.accent, fontSize: '18px' }} />
                </a>
                <a href="https://www.tiktok.com/@saloon_interior_?_r=1&_t=ZS-92ecluCYlzL" target="_blank" rel="noopener noreferrer">
                  <FaTiktok style={{ color: colors.accent, fontSize: '18px' }} />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-4 lg:mb-6 opacity-60" style={{ color: colors.accent }}>
              Quick Links
            </h4>
            <motion.div
              className="text-sm space-y-1"
              variants={containerVariants}
            >
              {["About Us", "Contact", "Privacy Policy"].map((link, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    to={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="block hover:underline"
                    style={{ color: colors.textSecondary }}
                    whileHover={{
                      x: 4,
                      color: colors.accent,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-10 pt-6 border-t text-center"
          style={{ borderColor: colors.border }}
          variants={itemVariants}
        >
          <motion.p
            className="text-[7px] uppercase tracking-[0.3em] opacity-40 mb-0.5"
            style={{ color: colors.textSecondary }}
          >
            &copy; 2025 Saloon Studio
          </motion.p>
          <motion.p
            className="text-[6px] uppercase tracking-[0.4em] opacity-30"
            style={{ color: colors.textSecondary }}
          >
            Luxury Interior Solutions
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
});

// Desktop View Component
const DesktopServices = memo(() => {
  return (
    <motion.footer
      className="border-t py-16 lg:py-20 bg-white"
      style={{ borderColor: colors.border }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Payment Methods Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 lg:mb-20"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {/* WhatsApp Card */}
          <motion.div
            className="bg-white border p-8 relative group cursor-pointer"
            style={{
              borderColor: colors.border,
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
            }}
            variants={{
              hidden: { y: 60, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 20
                }
              }
            }}
            whileHover={{
              y: -12,
              boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
              transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            <motion.div
              className="absolute top-0 right-0 text-white text-[8px] tracking-[0.3em] px-4 py-2 uppercase"
              style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, #f472b6)` }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              Recommended
            </motion.div>
            <motion.div
              className="text-3xl mb-6"
              style={{ color: colors.accent }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <FaWhatsapp />
            </motion.div>
            <h3 className="text-2xl font-light mb-4" style={{ color: colors.textPrimary }}>WhatsApp Transfer</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
              Complete your transaction via secure chat with instant verification.
            </p>
            <motion.div
              className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium"
              style={{ color: colors.success }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.success }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Official Business Account
            </motion.div>
          </motion.div>

          {/* Credit Card Card */}
          <motion.div
            className="bg-white border p-8 group cursor-pointer"
            style={{
              borderColor: colors.border,
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
            }}
            variants={{
              hidden: { y: 60, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: 0.1
                }
              }
            }}
            whileHover={{
              y: -12,
              boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
              transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            <motion.div
              className="text-3xl mb-6"
              style={{ color: colors.accent }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <FaCreditCard />
            </motion.div>
            <h3 className="text-2xl font-light mb-4" style={{ color: colors.textPrimary }}>Credit / Debit</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
              Global acceptance including VISA and Mastercard with SSL protection.
            </p>
            <motion.div
              className="flex gap-3 text-[9px] font-medium"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="border px-3 py-1" style={{ borderColor: colors.border }}>VISA</span>
              <span className="border px-3 py-1" style={{ borderColor: colors.border }}>MASTERCARD</span>
            </motion.div>
          </motion.div>

          {/* Protection Card */}
          <motion.div
            className="bg-white border p-8 group"
            style={{
              borderColor: colors.border,
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)"
            }}
            variants={{
              hidden: { y: 60, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: 0.2
                }
              }
            }}
            whileHover={{
              y: -12,
              boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
              transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
          >
            <motion.div
              className="text-3xl mb-6"
              style={{ color: colors.accent }}
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <FaShieldAlt />
            </motion.div>
            <h3 className="text-2xl font-light mb-4" style={{ color: colors.textPrimary }}>Buyer Protection</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
              Your equipment investment is safe with our fraud monitoring and secure fulfillment process.
            </p>
            <motion.div
              className="text-[10px] uppercase tracking-[0.2em] font-medium"
              style={{ color: colors.accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              PCI DSS Compliant
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Security Badges */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-6 lg:gap-16 py-8 border-y mb-12 lg:mb-16"
          style={{ borderColor: colors.border }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SecurityBadge icon={<FaLock />} title="Encrypted" subtitle="256-bit SSL" />
          <SecurityBadge icon={<FaCheckCircle />} title="Certified" subtitle="PCI Compliant" />
          <SecurityBadge icon={<FaShieldAlt />} title="Protected" subtitle="Fraud Detection" />
        </motion.div>

        {/* Footer Links & Contact */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-6 opacity-60" style={{ color: colors.accent }}>
              Saloon Studio
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Curating high-end interiors for the modern professional since 2024.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-6 opacity-60" style={{ color: colors.accent }}>
              Contact
            </h4>
            <motion.div
              className="text-sm space-y-2 lg:space-y-3 font-light"
              variants={containerVariants}
            >
              <motion.p
                className="flex items-center gap-2"
                variants={itemVariants}
                whileHover={{ x: 4 }}
              >
                <FaWhatsapp style={{ color: colors.success }} />
                <span style={{ color: colors.textPrimary }}>+92 370 1498826</span>
              </motion.p>
              <motion.p
                variants={itemVariants}
                whileHover={{ x: 4 }}
                style={{ color: colors.textPrimary }}
              >
                salooninterior@gmail.com
              </motion.p>
              <motion.div
                className="flex gap-4 mt-2"
                variants={itemVariants}
              >
                <a href="https://www.instagram.com/saloon_interior_?igsh=dnppeDIwMHFld3Vj" target="_blank" rel="noopener noreferrer">
                  <FaInstagram style={{ color: colors.accent, fontSize: '20px' }} />
                </a>
                <a href="https://www.tiktok.com/@saloon_interior_?_r=1&_t=ZS-92ecluCYlzL" target="_blank" rel="noopener noreferrer">
                  <FaTiktok style={{ color: colors.accent, fontSize: '20px' }} />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-6 opacity-60" style={{ color: colors.accent }}>
              Quick Links
            </h4>
            <motion.div
              className="text-sm space-y-2"
              variants={containerVariants}
            >
              {["About Us", "Contact Us", "Privacy Policy"].map((link, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Link
                    to={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="block hover:underline"
                    style={{ color: colors.textSecondary }}
                  >
                    {link}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t text-center"
          style={{ borderColor: colors.border }}
          variants={itemVariants}
        >
          <motion.p
            className="text-[8px] uppercase tracking-[0.3em] opacity-40 mb-1"
            style={{ color: colors.textSecondary }}
          >
            &copy; 2025 Saloon Studio
          </motion.p>
          <motion.p
            className="text-[7px] uppercase tracking-[0.4em] opacity-30"
            style={{ color: colors.textSecondary }}
          >
            Luxury Interior Solutions
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
});

// Main Component
const Services = memo(() => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  if (isMobile) return <MobileServices />;
  if (isTablet) return <TabletServices />;
  return <DesktopServices />;
});

export default Services;
