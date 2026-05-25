import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Phone, Truck, Shield, Instagram, MessageCircle,
  Star, Users, Package, Award, Clock, Heart, ArrowRight,
  TrendingUp, CheckCircle, Globe
} from "lucide-react";

const AboutUs = () => {
  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #ffffff 0%, #ffffff 100%)",
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

  const salonDetails = {
    businessName: "Saloon Interior",
    owner: "Abdullah Nadeem",
    location: "Lahore, Pakistan",
    phone: "+92 370 1498826",
    whatsapp: "https://wa.me/+923701498826",
    instagram: "https://www.instagram.com/saloon_interior_?igsh=dnppeDIwMHFld3Vj",
    tiktok: "https://www.tiktok.com/@saloon_interior_?_r=1&_t=ZS-92XdfyRzcQc",
    description: "Specializing in premium salon interior solutions with a focus on elegance, functionality, and timeless design.",
    yearEstablished: "1995"
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
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const services = [
    { icon: Package, title: "Premium Furniture", desc: "Curated salon chairs, reception desks, and styling stations" },
    { icon: Truck, title: "Nationwide Delivery", desc: "Careful packaging and insured delivery across Pakistan" },
    { icon: Shield, title: "Quality Assurance", desc: "All products come with 3 years foam and 5 years mechanical warranty" },
    { icon: Users, title: "Design Consultation", desc: "Personalized salon layout and design planning" }
  ];

  const values = [
    { icon: Award, title: "Exceptional Quality", desc: "Only the finest materials and masterful craftsmanship go into every piece we create." },
    { icon: Heart, title: "Stylist Focused", desc: "We design with the professional in mind, balancing ergonomic comfort with elite aesthetics." },
    { icon: TrendingUp, title: "Modern Innovation", desc: "Stay ahead of industry trends with our contemporary designs and functional solutions." }
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

      {/* Hero Section */}
      <motion.div
        className="bg-white border-b"
        style={{ borderColor: colors.border }}
        variants={headerVariants}
      >
        <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-16', 'px-6 py-20', 'px-8 py-24')} text-center`}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40 text-stone-500"
          >
            ESTABLISHED {salonDetails.yearEstablished}
          </motion.span>
          <motion.h1
            className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter leading-tight mb-8`}
            style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}
          >
            <span className="text-pink-500 font-serif italic">Saloon Interior</span> Excellence
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 mx-auto mb-10"
            style={{ backgroundColor: colors.accent, ...{opacity: 0.8} }}
          />
          <motion.p className={`${getTextSize('text-lg', 'text-xl', 'text-2xl')} text-gray-600 max-w-3xl mx-auto leading-relaxed font-light italic opacity-60`}>
            Led by {salonDetails.owner}, we transform ordinary spaces into extraordinary salon experiences.
            Based in {salonDetails.location}, we combine local craftsmanship with global standards.
          </motion.p>
        </div>
      </motion.div>

      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-12', 'px-6 py-16', 'px-8 py-20')}`}>
        {/* Philosophy & Focus */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <motion.div variants={sectionVariants} custom={1}>
            <h2 className="text-4xl md:text-5xl font-light mb-10 tracking-tighter" style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}>Our Philosophy</h2>
            <div className="space-y-6 font-light text-xl leading-relaxed opacity-80" style={{ color: colors.textSecondary }}>
              <p>
                At Saloon Interior, we believe that a saloon's interior should reflect its artistry.
                Every piece we create is designed to enhance both the client experience and the stylist's workflow.
              </p>
              <p>
                With {salonDetails.owner}'s expertise and passion for design, we've been crafting bespoke
                saloon interiors that blend functionality with aesthetic appeal for decades.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 py-10 border-t border-gray-100">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-black mb-2 opacity-40">LOCATION</h4>
                <p className="text-gray-500 font-light text-lg tracking-tight">{salonDetails.location}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-black mb-2 opacity-40">FOUNDER</h4>
                <p className="text-gray-500 font-light text-lg tracking-tight">{salonDetails.owner}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-50 p-12 rounded-lg"
            variants={sectionVariants}
            custom={2}
          >
            <h3 className="text-2xl font-light text-black mb-8 tracking-tighter" style={{ letterSpacing: '-0.02em' }}>What We Deliver</h3>
            <div className="space-y-8">
              {services.map((s, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-6 group p-4 rounded-xl hover:bg-white transition-all hover:shadow-lg"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-pink-100 group-hover:bg-pink-500 transition-all shadow-sm">
                    <s.icon className="w-5 h-5 text-pink-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="mt-1">
                    <h4 className="text-lg font-light mb-1 tracking-tight" style={{ color: colors.textPrimary }}>{s.title}</h4>
                    <p className="text-sm font-light leading-relaxed opacity-90" style={{ color: colors.textSecondary }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          className="text-white p-12 md:p-20 rounded-[3rem] mb-24 text-center shadow-2xl relative overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, #f472b6)` }}
          variants={sectionVariants}
          custom={3}
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          
          <div className="relative z-10">
            <motion.span className="text-[10px] uppercase tracking-[0.4em] text-pink-100 font-bold block mb-6 opacity-80">
              OUR CORE VALUES
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-16" style={{ letterSpacing: '-0.02em' }}>The Saloon Interior Standard</h2>

            <div className="grid md:grid-cols-3 gap-12">
              {values.map((v, i) => (
                <motion.div key={i} className="space-y-6" variants={iconVariants}>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-8 hover:scale-110 transition-all shadow-lg text-pink-500">
                    <v.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-light tracking-tight">{v.title}</h3>
                  <p className="text-pink-100 font-light text-sm leading-relaxed opacity-90">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interaction Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <motion.div
            className="border p-12 text-center flex flex-col items-center justify-center"
            style={{ borderColor: colors.border }}
            variants={sectionVariants}
            custom={4}
            whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
          >
            <Instagram className="w-10 h-10 mb-8 opacity-40 text-pink-400" />
            <h3 className="text-2xl font-light mb-4" style={{ color: colors.textPrimary }}>Social Inspiration</h3>
            <p className="font-light mb-8 max-w-sm" style={{ color: colors.textSecondary }}>Explore our latest projects and behind-the-scenes content on Instagram and TikTok.</p>
            <div className="flex gap-4">
              <a href={salonDetails.instagram} className="px-6 py-3 border-2 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-all rounded-full" style={{ borderColor: colors.accent, color: colors.accent }} onMouseEnter={(e) => e.target.style.backgroundColor = colors.accent} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>Instagram</a>
              <a href={salonDetails.tiktok} className="px-6 py-3 border-2 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-all rounded-full" style={{ borderColor: colors.accent, color: colors.accent }} onMouseEnter={(e) => e.target.style.backgroundColor = colors.accent} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>TikTok</a>
            </div>
          </motion.div>

          <motion.div
            className="p-12 text-center text-white flex flex-col items-center justify-center rounded-[2rem] shadow-xl"
            style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent}, #f472b6)` }}
            variants={sectionVariants}
            custom={5}
            whileHover={{ scale: 1.01 }}
          >
            <MessageCircle className="w-10 h-10 mb-8 opacity-80" />
            <h3 className="text-2xl md:text-3xl font-light mb-4 tracking-tighter">Direct Consultation</h3>
            <p className="text-pink-100 font-light mb-8 max-w-sm opacity-90">Message Abdullah directly on WhatsApp for personalized quotes and design discussions.</p>
            <a href={salonDetails.whatsapp} className="px-10 py-5 bg-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-50 transition-all flex items-center gap-3 rounded-full hover:shadow-lg" style={{ color: colors.accent }}>
              <Phone className="w-4 h-4" /> Direct Console
            </a>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="border-t pt-12 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderColor: colors.border }}
          variants={headerVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }}></div>
            <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: colors.textSecondary }}>
              NATIONWIDE DELIVERY & INSTALLATION
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold" style={{ color: colors.textSecondary }}>
            © {new Date().getFullYear()} SALOON INTERIOR. ALL RIGHTS RESERVED.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;

