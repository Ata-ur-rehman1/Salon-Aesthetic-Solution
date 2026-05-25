import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye, FiEdit, FiPackage, FiDollarSign, FiTrendingUp, FiGrid, FiStar,
  FiArrowRight, FiShoppingCart, FiArchive, FiPercent, FiTag
} from "react-icons/fi";

const AllProducts = () => {
  // ELEGANT WHITE & PINK COLOR SCHEME
  const colors = {
    background: "#ffffff",      // Pure white
    textPrimary: "#333333",     // Soft dark gray
    textSecondary: "#888888",   // Lighter gray
    accent: "#ec4899",          // Beautiful Pink (Tailwind pink-500)
    border: "#fce7f3",          // Very light pink borders
    surface: "#fdf2f8",         // Surface pink
    surfaceHover: "#fdf2f8",    // Light pink hover state
    shadow: "rgba(236, 72, 153, 0.1)", // Soft pink shadow
    success: "#10b981"
  };

  const { data: products, isLoading, isError } = useAllProductsQuery();

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

  // Responsive Helpers
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
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.6
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25
      }
    },
    hover: {
      y: -4,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 25,
        duration: 0.4
      }
    },
    hover: {
      y: -6,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-4xl mb-6" variants={itemVariants}>⚠️</motion.div>
          <motion.h3 className="text-xl font-light mb-2" style={{ color: colors.textPrimary }} variants={itemVariants}>
            Error Loading Products
          </motion.h3>
          <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }} variants={itemVariants}>
            Please try again later
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-xs uppercase tracking-wider font-medium border hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-colors"
            style={{ borderColor: colors.accent, color: colors.accent }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.countInStock > 0).length;
  const discountedProducts = products.filter(p => p.isDiscounted).length;
  const specialProducts = products.filter(p => p.isSpecial).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.countInStock), 0);

  const stats = [
    {
      icon: <FiPackage />,
      label: "Total Products",
      value: totalProducts,
      color: colors.textPrimary
    },
    {
      icon: <FiShoppingCart />,
      label: "In Stock",
      value: inStockProducts,
      color: colors.accent
    },
    {
      icon: <FiPercent />,
      label: "Discounted",
      value: discountedProducts,
      color: colors.textSecondary
    },
    {
      icon: <FiStar />,
      label: "Special Offers",
      value: specialProducts,
      color: colors.accent
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-6', 'px-6 py-8', 'px-8 py-12')}`}>
        {/* Header */}
        <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.textSecondary }}
          >
            Inventory Management
          </motion.span>
          <motion.h1 className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter text-black`} style={{ letterSpacing: '-0.02em' }}>
            Product Collection
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 bg-pink-500 mx-auto mt-6" style={{ opacity: 0.8 }}
          />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className={`grid ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-2' : 'grid-cols-4'} ${getGap('gap-4', 'gap-6', 'gap-6')} mb-8 sm:mb-12`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              className="bg-white border rounded-lg p-4"
              style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            >
              <motion.div
                className="flex items-center justify-between mb-3"
                variants={itemVariants}
              >
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.div
                    style={{ color: stat.color }}
                    whileHover={{ scale: 1.3 }}
                  >
                    {stat.icon}
                  </motion.div>
                </motion.div>
                <motion.div
                  className="text-2xl font-light tracking-tighter"
                  style={{ color: colors.textPrimary }}
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
              </motion.div>
              <motion.div
                className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40"
                style={{ color: colors.textPrimary }}
                variants={itemVariants}
              >
                {stat.label}
              </motion.div>
              <motion.div
                className="text-xs text-gray-500 mt-1"
                variants={itemVariants}
              >
                Salon Interior
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Products Table */}
        <motion.div variants={itemVariants}>
          <motion.div
            className="bg-white border rounded-lg"
            style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          >
            {/* Table Header */}
            <motion.div
              className={`flex flex-col md:flex-row md:items-center justify-between ${getPadding('p-4', 'p-6', 'p-8')} border-b`}
              style={{ borderColor: colors.border }}
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <motion.h2 className="text-xl md:text-3xl font-light tracking-tighter" style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}>
                  Catalog Overview
                </motion.h2>
                <motion.p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mt-1" style={{ color: colors.textSecondary }}>
                  Refined Salon Essentials
                </motion.p>
              </motion.div>
              <motion.div
                className="flex items-center gap-3 mt-4 md:mt-0"
                variants={itemVariants}
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  whileHover={{ scale: 1.1 }}
                >
                  <FiGrid className="text-gray-600" />
                </motion.div>
                <div>
                  <div className="text-[8px] uppercase tracking-[0.4em] font-bold opacity-40">Products</div>
                  <motion.div
                    className="text-2xl md:text-4xl font-light tracking-tighter"
                    style={{ color: colors.textPrimary }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {totalProducts}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              className={`grid ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'} ${getGap('gap-3', 'gap-4', 'gap-6')} ${getPadding('p-3', 'p-4', 'p-8')}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.length === 0 ? (
                <motion.div
                  className="col-span-full text-center py-16"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <FiPackage className="text-2xl text-gray-400" />
                  </motion.div>
                  <motion.h3 className="text-lg font-light mb-2" style={{ color: colors.textPrimary }} variants={itemVariants}>
                    No Products Found
                  </motion.h3>
                  <motion.p className="text-sm text-gray-500 mb-6" variants={itemVariants}>
                    Add salon interior products to your premium collection
                  </motion.p>
                  <Link
                    to="/admin/productlist"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-medium rounded-lg"
                    style={{ backgroundColor: colors.accent, color: colors.background }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus className="text-sm" />
                    Add First Product
                  </Link>
                </motion.div>
              ) : (
                products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="group border rounded-lg overflow-hidden"
                    style={{ borderColor: colors.border, backgroundColor: colors.background }}
                  >
                    {/* Product Image */}
                    <motion.div
                      className="relative aspect-square overflow-hidden bg-gray-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ filter: "grayscale(0.05)" }}
                      />

                      {/* Status Badges */}
                      <AnimatePresence>
                        {product.countInStock === 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute top-2 left-2 px-2 py-1 text-[8px] uppercase tracking-wider font-bold text-white rounded"
                            style={{ backgroundColor: colors.error }}
                          >
                            Out of Stock
                          </motion.div>
                        )}
                        {product.isSpecial && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`absolute top-2 left-2 px-2 py-1 text-[8px] uppercase tracking-wider font-bold text-white rounded`}
                            style={{ backgroundColor: colors.accent }}
                          >
                            Special
                          </motion.div>
                        )}
                        {product.isDiscounted && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="absolute top-2 right-2 px-2 py-1 text-[8px] uppercase tracking-wider font-bold text-white rounded"
                            style={{ backgroundColor: colors.textPrimary }}
                          >
                            {product.discount}% OFF
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                      className={`${getPadding('p-3', 'p-4', 'p-4')} flex flex-col`}
                      variants={containerVariants}
                    >
                      <motion.div variants={itemVariants}>
                        <motion.span
                          className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40"
                          style={{ color: colors.accent }}
                        >
                          {product.brand || "Studio"}
                        </motion.span>
                        <motion.h3
                          className="text-sm md:text-base font-light tracking-tight leading-tight line-clamp-1 mt-2"
                          style={{ color: colors.textPrimary }}
                        >
                          {product.name}
                        </motion.h3>
                        <motion.p
                          className="text-xl md:text-2xl font-light tracking-tighter mt-2"
                          style={{ color: colors.textPrimary }}
                        >
                          Rs. {product.price.toLocaleString()}
                        </motion.p>
                      </motion.div>

                      <motion.div
                        className={`flex items-center justify-between ${getPadding('pt-2 mt-2 border-t', 'pt-3 mt-3 border-t', 'pt-3 mt-3 border-t')}`}
                        style={{ borderColor: colors.border }}
                        variants={itemVariants}
                      >
                        <motion.div
                          className="flex items-center gap-1 opacity-40"
                          variants={itemVariants}
                        >
                          <FiArchive className="text-[10px]" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{product.countInStock} Units</span>
                        </motion.div>
                        <motion.div
                          className="flex gap-2"
                          variants={containerVariants}
                        >
                          <motion.div variants={itemVariants}>
                            <Link
                              to={`/product/${product._id}`}
                              className="h-10 w-10 flex items-center justify-center border rounded-lg"
                              style={{ borderColor: colors.border }}
                              whileHover={{ scale: 1.1, backgroundColor: colors.surface }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiEye className="text-gray-600" />
                            </Link>
                          </motion.div>
                          <motion.div variants={itemVariants}>
                            <Link
                              to={`/admin/product/update/${product._id}`}
                              className="h-10 w-10 flex items-center justify-center rounded-lg"
                              style={{ backgroundColor: colors.accent }}
                              whileHover={{ scale: 1.1, backgroundColor: colors.textPrimary }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FiEdit className="text-white" />
                            </Link>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Footer */}
            {products.length > 0 && (
              <motion.div
                className={`flex flex-col md:flex-row md:items-center justify-between ${getPadding('p-4', 'p-6', 'p-6')} border-t`}
                style={{ borderColor: colors.border }}
                variants={itemVariants}
              >
                <motion.div
                  className="text-sm text-gray-500"
                  variants={itemVariants}
                >
                  <span className="uppercase tracking-wider">Showing</span> {products.length} of {products.length} products
                </motion.div>
                <motion.div
                  className="text-[10px] md:text-sm"
                  variants={itemVariants}
                >
                  <span className="uppercase tracking-[0.2em] font-bold opacity-40">Total Value</span>
                  <motion.span
                    className="text-xl md:text-2xl font-light tracking-tighter ml-3"
                    style={{ color: colors.textPrimary }}
                  >
                    Rs. {totalValue.toLocaleString()}
                  </motion.span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AllProducts;