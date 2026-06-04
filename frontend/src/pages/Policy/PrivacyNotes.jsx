import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Lock, Eye, Users, ClipboardCheck, 
  FileText, CreditCard, Mail, Truck, Key
} from "lucide-react";
// Add this definition with the other variants
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
}
const PrivacyPolicy = () => {
  // ELEGANT WHITE & PINK COLOR SCHEME
  const colors = {
    background: "#ffffff",      // Pure white
    textPrimary: "#333333",     // Soft dark gray
    textSecondary: "#888888",   // Lighter gray
    accent: "#2563eb",          // Beautiful Pink (Tailwind blue-600)
    border: "#dbeafe",          // Very light pink borders
    surface: "#eff6ff",         // Surface pink
    surfaceHover: "#eff6ff",    // Light pink hover state
    shadow: "rgba(37, 99, 235, 0.1)", // Soft pink shadow
    success: "#10b981",
    error: "#ef4444"
  };

  const businessInfo = {
    businessName: "Salon Aesthetic Solution",
    owner: "Salon Aesthetic Solution",
    location: "Lahore, Pakistan",
    email: "contact@salonaestheticsolution.com",
    phone: "Salon Aesthetic Solution",
    whatsapp: "https://wa.me/923210939988",
    effectiveDate: "January 1, 2024",
    lastUpdated: "January 1, 2024"
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

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          items: [
            "Name, email address, phone number",
            "Shipping and billing addresses",
            "Business information (if applicable)",
            "Payment details (processed securely)"
          ]
        },
        {
          subtitle: "Transactional Information",
          items: [
            "Order history and preferences",
            "Communication records via WhatsApp",
            "Design consultation notes"
          ]
        }
      ]
    },
    {
      icon: Users,
      title: "How We Use Your Information",
      content: [
        "To process and fulfill your salon aesthetic solution orders",
        "To provide personalized design consultations",
        "To coordinate shipments and delivery",
        "To communicate about your order status",
        "To improve our products and services"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection & Security",
      content: [
        {
          subtitle: "Security Measures",
          items: [
            "Encrypted payment processing",
            "Secure order management system",
            "Limited access to personal data"
          ]
        }
      ]
    },
    {
      icon: Truck,
      title: "Third-Party Sharing",
      content: [
        {
          subtitle: "Service Providers",
          items: [
            "Payment processors",
            "Shipping and logistics partners",
            "Customer support platforms"
          ]
        }
      ]
    },
    {
      icon: ClipboardCheck,
      title: "Your Rights & Choices",
      content: [
        {
          subtitle: "Access & Control",
          items: [
            "Access your personal information",
            "Correct inaccurate data",
            "Request deletion of your data",
            "Opt-out of marketing communications"
          ]
        }
      ]
    },
    {
      icon: Key,
      title: "WhatsApp Communications",
      content: [
        {
          subtitle: "Important Notice",
          items: [
            "Primary communication channel is WhatsApp",
            "Shipment details shared via WhatsApp",
            "Design consultations via WhatsApp"
          ]
        }
      ]
    }
  ];

  const renderContent = (content) => {
    if (Array.isArray(content) && content.length > 0) {
      if (typeof content[0] === 'object' && content[0].subtitle) {
        return content.map((item, index) => (
          <div key={index} className={index > 0 ? "mt-8" : ""}>
            {item.subtitle && (
              <motion.h3 
                className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-medium text-black mb-4 uppercase tracking-wider`}
                variants={itemVariants}
              >
                {item.subtitle}
              </motion.h3>
            )}
            {item.items && (
              <motion.ul 
                className={`space-y-3 ${getGap('gap-2', 'gap-3', 'gap-4')}`}
                variants={containerVariants}
              >
                {item.items.map((listItem, listIndex) => (
                  <motion.li 
                    key={listIndex} 
                    className="flex items-start gap-3"
                    variants={itemVariants}
                    whileHover={{ x: 4 }}
                  >
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                      style={{ backgroundColor: colors.accent }}
                      whileHover={{ scale: 1.5 }}
                    />
                    <motion.span 
                      className="text-gray-600 leading-relaxed"
                      whileHover={{ color: colors.textPrimary }}
                    >
                      {listItem}
                    </motion.span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        ));
      } else {
        return (
          <motion.ul 
            className={`space-y-3 ${getGap('gap-2', 'gap-3', 'gap-4')}`}
            variants={containerVariants}
          >
            {content.map((item, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3"
                variants={itemVariants}
                whileHover={{ x: 4 }}
              >
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                  style={{ backgroundColor: colors.accent }}
                  whileHover={{ scale: 1.5 }}
                />
                <motion.span 
                  className="text-gray-600 leading-relaxed"
                  whileHover={{ color: colors.textPrimary }}
                >
                  {item}
                </motion.span>
              </motion.li>
            ))}
          </motion.ul>
        );
      }
    }
    return null;
  };

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header - FIXED: Centered text */}
      <motion.div 
        className="bg-white border-b"
        style={{ borderColor: colors.border }}
        variants={headerVariants}
      >
        <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-16', 'px-6 py-20', 'px-8 py-24')} text-center`}>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${getTextSize('text-[10px]', 'text-xs', 'text-sm')} uppercase tracking-wider text-gray-500 font-bold block mb-3`}
          >
            Data Protection
          </motion.span>
          <motion.h1 className={`${getTextSize('text-4xl', 'text-5xl', 'text-6xl')} font-light tracking-tighter text-black leading-tight mb-6`}>
            Privacy Policy
          </motion.h1>
          <motion.p className={`${getTextSize('text-base', 'text-lg', 'text-xl')} text-gray-600 max-w-3xl mx-auto leading-relaxed`}>
            How we protect and handle your personal information at {businessInfo.businessName}. 
            This policy outlines our commitment to your privacy and data security.
          </motion.p>
        </div>
      </motion.div>

      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-12', 'px-6 py-16', 'px-8 py-20')}`}>
        {/* Policy Overview */}
        <motion.div 
          className="bg-white border rounded-lg mb-16"
          style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          variants={cardVariants}
        >
          <motion.div 
            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} ${getGap('gap-6', 'gap-8', 'gap-8')} ${getPadding('p-6', 'p-8', 'p-12')} border-b`}
            style={{ borderColor: colors.border }}
            variants={containerVariants}
          >
            {[
              { icon: FileText, title: "Effective Date", content: businessInfo.effectiveDate },
              { icon: Lock, title: "Last Updated", content: businessInfo.lastUpdated },
              { icon: CreditCard, title: "Secure Payments", content: "SSL Encrypted Transactions" }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center p-6 border rounded-lg"
                style={{ borderColor: colors.border }}
                whileHover={{ scale: 1.02 }}
                variants={itemVariants}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.surface }}
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <item.icon className="w-6 h-6" style={{ color: colors.accent }} />
                </motion.div>
                <motion.h3 className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-medium text-black mb-2`} variants={itemVariants}>
                  {item.title}
                </motion.h3>
                <motion.p className="text-gray-600" variants={itemVariants}>
                  {item.content}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className={`${getPadding('p-6', 'p-8', 'p-12')} border-t`} style={{ borderColor: colors.border }} variants={itemVariants}>
            <motion.h2 className={`${getTextSize('text-2xl', 'text-3xl', 'text-4xl')} font-light text-black mb-6`} variants={itemVariants}>
              Introduction
            </motion.h2>
            <motion.div className={`space-y-4 ${getGap('gap-3', 'gap-4', 'gap-4')}`} variants={containerVariants}>
              <motion.p className="text-gray-600 leading-relaxed" variants={itemVariants} whileHover={{ color: colors.textPrimary }}>
                Welcome to {businessInfo.businessName}. We are committed to protecting your privacy and ensuring 
                that your personal information is handled in a safe and responsible manner.
              </motion.p>
              <motion.p className="text-gray-600 leading-relaxed" variants={itemVariants} whileHover={{ color: colors.textPrimary }}>
                By using our services, you agree to the collection and use of information in accordance with 
                this policy. We operate in compliance with applicable data protection laws in Pakistan.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Policy Sections */}
        <motion.div 
          className={`space-y-8 ${getGap('gap-6', 'gap-8', 'gap-8')}`}
          variants={containerVariants}
        >
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              variants={sectionVariants}
              custom={sectionIndex}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="bg-white border rounded-lg overflow-hidden"
              style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            >
              <motion.div 
                className={`${getPadding('p-6', 'p-8', 'p-12')} border-b`} 
                style={{ borderColor: colors.border }}
                variants={itemVariants}
              >
                <motion.div 
                  className={`flex ${isMobile ? 'flex-col items-center gap-4' : 'items-center gap-4'} mb-4`}
                  variants={containerVariants}
                >
                  <motion.div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <section.icon className="w-5 h-5" style={{ color: colors.accent }} />
                  </motion.div>
                  <motion.h2 
                    className={`${getTextSize('text-xl', 'text-2xl', 'text-3xl')} font-light text-black text-center`}
                    variants={itemVariants}
                  >
                    {section.title}
                  </motion.h2>
                </motion.div>
              </motion.div>

              <motion.div 
                className={`${getPadding('p-6', 'p-8', 'p-12')}`}
                variants={itemVariants}
              >
                {renderContent(section.content)}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="bg-white border rounded-lg mt-16"
          style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          variants={cardVariants}
        >
          <motion.div className={`${getPadding('p-6', 'p-8', 'p-12')} text-center border-b`} style={{ borderColor: colors.border }} variants={itemVariants}>
            <motion.span 
              className={`${getTextSize('text-[10px]', 'text-xs', 'text-sm')} uppercase tracking-wider text-gray-500 font-bold block mb-3`}
              whileHover={{ scale: 1.05 }}
            >
              Contact Us
            </motion.span>
            <motion.h2 className={`${getTextSize('text-3xl', 'text-4xl', 'text-5xl')} font-light text-black mb-6`} variants={itemVariants}>
              Privacy Concerns & Questions
            </motion.h2>
            <motion.p className={`${getTextSize('text-base', 'text-lg', 'text-xl')} text-gray-600 max-w-3xl mx-auto leading-relaxed`} variants={itemVariants}>
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please contact our Data Protection Officer.
            </motion.p>
          </motion.div>

          <motion.div 
            className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} ${getGap('gap-6', 'gap-8', 'gap-8')} ${getPadding('p-6', 'p-8', 'p-12')}`}
            variants={containerVariants}
          >
            {[
              { icon: Mail, title: "Email", content: businessInfo.email },
              { icon: null, title: "WhatsApp", content: businessInfo.phone },
              { icon: Users, title: "Data Officer", content: businessInfo.owner }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center p-6 border rounded-lg"
                style={{ borderColor: colors.border }}
                whileHover={{ scale: 1.02 }}
                variants={itemVariants}
              >
                {item.icon && (
                  <motion.div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: colors.surface }}
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <item.icon className="w-6 h-6" style={{ color: colors.accent }} />
                  </motion.div>
                )}
                <motion.h3 className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-medium text-black mb-2`} variants={itemVariants}>
                  {item.title}
                </motion.h3>
                <motion.p className="text-gray-600" variants={itemVariants}>{item.content}</motion.p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className={`${getPadding('p-6', 'p-8', 'p-12')} border-t text-center`} style={{ borderColor: colors.border }} variants={itemVariants}>
            <motion.p className="text-gray-600" variants={itemVariants}>
              We aim to respond to all privacy-related inquiries within 7 business days.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="border-t mt-16"
          style={{ borderColor: colors.border }}
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p className="text-gray-500 text-sm" variants={itemVariants}>
              © {new Date().getFullYear()} {businessInfo.businessName}. All rights reserved.
            </motion.p>
            <motion.div className="flex gap-6" variants={itemVariants}>
              <motion.span 
                className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-wider text-gray-400`}
                whileHover={{ scale: 1.02 }}
              >
                Version 1.0 • Effective {businessInfo.effectiveDate}
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
