import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = "max-w-xs sm:max-w-sm md:max-w-md",
  showCloseButton = true
}) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed text-black inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} z-10`}
          >
            {showCloseButton && (
              <motion.button
                onClick={onClose}
                className="absolute -top-8 sm:-top-10 right-0 p-2 text-black hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            )}
            
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;