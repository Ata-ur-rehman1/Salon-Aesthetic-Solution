import React from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const NextArrow = (props) => {
  const { onClick, className } = props;
  // If slick injects 'slick-disabled', we can optionally handle it, 
  // but keeping it simple like the main carousel.
  return (
    <motion.button
      onClick={onClick}
      className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 bg-white/95 backdrop-blur-sm border border-blue-300 hover:border-blue-500 transition-colors shadow-lg ${className?.includes('slick-disabled') ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ display: "flex" }} // Override slick's default display block
    >
      <FaChevronRight className="text-blue-600 text-sm md:text-base hover:text-blue-700" />
    </motion.button>
  );
};

const PrevArrow = (props) => {
  const { onClick, className } = props;
  return (
    <motion.button
      onClick={onClick}
      className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 bg-white/95 backdrop-blur-sm border border-blue-300 hover:border-blue-500 transition-colors shadow-lg ${className?.includes('slick-disabled') ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ display: "flex" }} // Override slick's default display block
    >
      <FaChevronLeft className="text-blue-600 text-sm md:text-base hover:text-blue-700" />
    </motion.button>
  );
};

export { NextArrow, PrevArrow };
