import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Loader = ({ loadingText = "Loading..." }) => {
  // Ultra-Modern Monochrome Palette
  const colors = {
    background: "#ffffff",
    surface: "#f9f9f9",
    textPrimary: "#000000",
    textSecondary: "#6b6b6b",
    accent: "#333333",
    border: "#f0f0f0",
    shadow: "rgba(0, 0, 0, 0.06)"
  };

  // Responsive State
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  const ringVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  const textVariants = {
    animate: {
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  // Responsive styling
  const ringSize = isMobile ? "w-12 h-12" : "w-16 h-16";
  const dotSize = isMobile ? "w-1.5 h-1.5" : "w-2 h-2";
  const textSize = isMobile ? "text-[10px]" : "text-xs";
  const headingSize = isMobile ? "text-sm" : "text-base";

  return (
    <motion.div
      className="flex flex-col justify-center items-center min-h-screen font-sans bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="relative mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {/* Main Ring */}
        <motion.div
          className={`${ringSize} rounded-full border-2`}
          style={{ 
            borderColor: colors.border,
            borderTopColor: colors.accent
          }}
          variants={ringVariants}
          animate="animate"
        />
        
        {/* Inner Dot */}
        <motion.div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${dotSize} rounded-full`}
          style={{ backgroundColor: colors.accent }}
          variants={dotVariants}
          animate="animate"
          whileHover={{ scale: 1.3 }}
        />
      </motion.div>

      <motion.div 
        className="text-center"
        variants={textVariants}
        animate="animate"
        whileHover={{ scale: 1.02 }}
      >
        <motion.span 
          className={`${textSize} uppercase tracking-wider text-gray-500 block mb-1`}
          whileHover={{ scale: 1.02 }}
        >
          Salon Aesthetic Solution
        </motion.span>
        <motion.h2 
          className={`${headingSize} font-medium text-black`}
          whileHover={{ scale: 1.02 }}
        >
          {loadingText}
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};

// Minimal button loader
export const ButtonLoader = () => {
  const colors = {
    accent: "#333333"
  };

  return (
    <motion.div
      className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
    />
  );
};

export default Loader;