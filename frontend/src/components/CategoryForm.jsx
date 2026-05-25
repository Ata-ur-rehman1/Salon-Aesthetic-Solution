import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiTag } from "react-icons/fi";

const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  placeholder = "Enter category name...",
  className = "",
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

  const [isFocused, setIsFocused] = useState(false);

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="mb-4 sm:mb-6">
        <motion.label 
          className="block color-black text-xs sm:text-sm font-medium mb-2 sm:mb-3 uppercase tracking-wider"
          style={{ color: colors.textPrimary }}
          whileHover={{ x: 2 }}
        >
          Category Name
        </motion.label>
        <motion.div 
          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border transition-all duration-300 rounded-lg
            ${isFocused ? 'border-gray-400' : 'border-gray-200'}`}
          style={{ 
            borderColor: isFocused ? colors.accent : colors.border,
            backgroundColor: colors.background
          }}
          whileHover={{ borderColor: colors.accent }}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <FiTag className="w-3 h-3 sm:w-4 sm:h-4" style={{ 
              color: isFocused ? colors.accent : colors.textSecondary 
            }} />
          </motion.div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none font-medium placeholder-gray-400"
            style={{ color: colors.textPrimary }}
            required
          />
        </motion.div>
      </div>

      <motion.button
        type="submit"
        className="w-full py-2 sm:py-3 text-xs uppercase tracking-[0.2em] font-bold rounded-lg transition-colors"
        style={{
          backgroundColor: colors.accent,
          color: colors.background
        }}
        whileHover={{ backgroundColor: colors.textPrimary, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {buttonText}
      </motion.button>
    </form>
  );
};

export default CategoryForm;