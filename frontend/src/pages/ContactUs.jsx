import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  MapPin, Phone, Mail, Clock, MessageCircle,
  Instagram, Send, User, Home, Package,
  CheckCircle, ArrowRight, Shield, Globe, Award
} from "lucide-react";

const ContactUs = () => {
  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #ffffff 0%, #ffffff 100%)",
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

  const contactInfo = {
    businessName: "Salon Aesthetic Solution",
    owner: "Salon Aesthetic",
    location: "Lahore, Pakistan",
    website: "https://www.facebook.com/SalonAestheticsolution",
    facebook: "https://www.facebook.com/SalonAestheticsolution",
    whatsapp: "https://wa.me/923210939988",
    instagram: "https://www.instagram.com/salon_aesthetics_solutions?fbclid=IwY2xjawSJaOJleHRuA2FlbQIxMABicmlkETFBdGM2Vk1rWEJncTFrNzg1c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHjHl-lYGZPS-QC0adOrRIoXLZkAkh1Tv-_2yz7lfwLlQsXcagCMLyijNmU4O_aem_a-2vKyjxcM9q_ddUckmQCg",
    tiktok: "https://www.facebook.com/SalonAestheticsolution",
  };

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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
        duration: 0.6
      }
    }
  };

  const sectionVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    })
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const quickQuestions = [
    { q: "How long does production take?", a: "Standard production time is 2-3 weeks depending on order size." },
    { q: "Do you offer installation?", a: "Yes, we provide professional installation services across Pakistan." },
    { q: "What's your warranty policy?", a: "We offer 3 years foam warranty and 5 years mechanical warranty." },
    { q: "Can I customize dimensions?", a: "Absolutely. All our furniture can be tailored to your salon space." }
  ];

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      style={{ background: colors.bgGradient }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Removed decorative blobs */}
      </div>

      {/* Header */}
      <motion.div
        className="bg-white border-b"
        style={{ borderColor: colors.border }}
        variants={headerVariants}
      >
        <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-16', 'px-6 py-20', 'px-8 py-24')} text-center`}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40 text-stone-500"
          >
            GET IN TOUCH
          </motion.span>
          <motion.h1
            className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter leading-tight mb-8`}
            style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}
          >
            Connect With <span className="text-blue-600 font-serif italic">Salon Aesthetic Solution</span>
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 mx-auto mb-10"
            style={{ backgroundColor: colors.accent, ...{opacity: 0.8} }}
          />
          <motion.p className={`${getTextSize('text-lg', 'text-xl', 'text-2xl')} text-gray-600 max-w-3xl mx-auto leading-relaxed font-light italic opacity-60`}>
            Planning a new salon or upgrading your space? We're here to bring your vision to life.
            Connect with us on Facebook for the latest updates and design inspiration.
          </motion.p>
        </div>
      </motion.div>

      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-12', 'px-6 py-16', 'px-8 py-20')}`}>
        {/* Contact Overview Cards */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* FAQ Section */}
          <motion.div variants={sectionVariants} custom={1}>
            <motion.span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold block mb-4 opacity-40">
              COMMON QUESTIONS
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-light mb-12 tracking-tighter" style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}>Frequently Asked</h2>

            <div className="space-y-8">
              {quickQuestions.map((item, index) => (
                <motion.div
                  key={index}
                  className="group border-b border-gray-100 pb-8"
                  variants={sectionVariants}
                  custom={index + 2}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all text-blue-600" style={{ borderColor: colors.border }}>
                      <span className="text-xs font-bold">0{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-light mb-3 group-hover:translate-x-1 transition-transform tracking-tight text-blue-600">{item.q}</h4>
                      <p className="leading-relaxed font-light opacity-80" style={{ color: colors.textSecondary }}>{item.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 p-8 text-white rounded-[2rem] text-center shadow-xl relative overflow-hidden"
              style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, #38bdf8)` }}
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="text-lg font-light mb-4 relative z-10">Still have questions?</h4>
              <p className="text-blue-200 text-sm mb-8 font-light leading-relaxed relative z-10">
                Visit our Facebook page for the latest updates and direct support.
              </p>
              <a
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-5 bg-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-blue-50 transition-colors rounded-full relative z-10 shadow-lg"
                style={{ color: colors.accent }}
              >
                <MessageCircle className="w-4 h-4" /> Visit Facebook
              </a>
            </motion.div>
          </motion.div>

          {/* Social Presence Card */}
          <motion.div variants={sectionVariants} custom={2} className="relative">
            <div className="sticky top-24">
              <motion.div
                className="bg-white border rounded-lg overflow-hidden"
                style={{ borderColor: colors.border }}
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="p-12 text-center">
                  <Award className="w-12 h-12 mx-auto mb-8 opacity-40 text-blue-500" />
                  <h2 className="text-3xl font-light mb-6 tracking-tight" style={{ color: colors.textPrimary }}>Our Digital Studio</h2>
                    Follow our latest studio updates and design inspirations on Facebook.
                  <div className="grid grid-cols-2 gap-4">
                    <motion.a
                      href={contactInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-5 border-2 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all rounded-full"
                      style={{ borderColor: colors.accent, color: colors.accent }} onMouseEnter={(e) => e.target.style.backgroundColor = colors.accent} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      whileHover={{ y: -2 }}
                    >
                      <Instagram className="w-4 h-4" /> Facebook
                    </motion.a>
                    <motion.a
                      href={contactInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 p-5 text-white font-bold text-[10px] uppercase tracking-widest transition-all rounded-full"
                      style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, #38bdf8)` }}
                      whileHover={{ y: -2, opacity: 0.9 }}
                    >
                      Facebook
                    </motion.a>
                  </div>
                </div>

                <div className="aspect-square flex items-center justify-center border-t" style={{ borderColor: colors.border, backgroundColor: colors.surface }}>
                  <div className="text-center p-12">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-3" style={{ color: colors.accent }}>CONSULTATION HOURS</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50" style={{ color: colors.textSecondary }}>Site Visits & Design Sessions</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="border-t mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderColor: colors.border }}
          variants={headerVariants}
        >
          <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} SALOON INTERIOR STUDIO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <Globe className="w-5 h-5 text-gray-200" />
            <Shield className="w-5 h-5 text-gray-200" />
          </div>
        </motion.div>
      </div>
    </motion.div >
  );
};

export default ContactUs;

