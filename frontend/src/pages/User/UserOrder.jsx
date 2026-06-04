import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import {
  FiPackage, FiDollarSign, FiCheckCircle, FiClock, FiUser,
  FiCalendar, FiEye, FiFilter, FiShoppingCart, FiTruck,
  FiTrendingUp, FiPercent, FiActivity, FiBarChart2, FiX,
  FiShoppingBag, FiArrowRight
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const UserOrder = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

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

  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [filter, setFilter] = useState("all");

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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.05, duration: 0.4, ease: "easeOut" }
    },
    hover: {
      y: -4,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    }
  };

  // Filtered Orders
  const filteredOrders = orders?.filter(order => {
    if (filter === "paid") return order.isPaid;
    if (filter === "delivered") return order.isDelivered;
    if (filter === "pending") return !order.isPaid || !order.isDelivered;
    return true;
  }) || [];

  // Calculations
  const totalOrders = orders?.length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
  const paidOrders = orders?.filter(order => order.isPaid).length || 0;
  const deliveredOrders = orders?.filter(order => order.isDelivered).length || 0;
  const pendingOrders = totalOrders - deliveredOrders;

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = [
    {
      icon: FiShoppingBag,
      label: "My Orders",
      value: totalOrders,
    },
    {
      icon: FiDollarSign,
      label: "Total Spent",
      value: `$${totalSpent.toLocaleString()}`,
    },
    {
      icon: FiCheckCircle,
      label: "Orders Paid",
      value: paidOrders,
    },
    {
      icon: FiTruck,
      label: "Delivered",
      value: deliveredOrders,
    }
  ];

  const filters = [
    { key: "all", label: "All Orders", count: totalOrders },
    { key: "paid", label: "Paid", count: paidOrders },
    { key: "delivered", label: "Delivered", count: deliveredOrders },
    { key: "pending", label: "Processing", count: pendingOrders }
  ];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader /></div>;

  if (error) {
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
            Error Loading Orders
          </motion.h3>
          <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }} variants={itemVariants}>
            {error?.data?.message || "Please try again later"}
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-6 py-2 text-xs uppercase tracking-wider font-medium border hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
            style={{ borderColor: colors.accent }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh Page
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

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

      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-12', 'px-6 py-16', 'px-8 py-20')}`}>
        {/* Header */}
        <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
          <motion.span
            className={`${getTextSize('text-xs tracking-[0.3em]', 'text-sm tracking-[0.4em]', 'text-sm tracking-[0.4em]')} text-gray-500 font-bold block mb-2`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ORDER HISTORY
          </motion.span>
          <motion.h1 className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter text-black`}>
            My Purchases
          </motion.h1>
          <motion.p className={`${getTextSize('text-sm', 'text-base', 'text-base')} text-gray-600 mt-4 max-w-2xl mx-auto font-light`}>
            Track and manage your salon furniture and interior orders from Ultra Salon Aesthetic Solution
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} ${getGap('gap-4', 'gap-6', 'gap-6')} mb-12`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white border rounded-lg p-5"
              style={{ borderColor: colors.border, backgroundColor: colors.background }}
            >
              <motion.div
                className="flex items-center justify-between mb-4"
                variants={itemVariants}
              >
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                  >
                    <stat.icon className="text-gray-800 text-lg" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="text-xl font-serif font-medium"
                  style={{ color: colors.textPrimary }}
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
              </motion.div>
              <motion.div
                className="text-[10px] uppercase tracking-[0.2em] font-bold"
                style={{ color: colors.textPrimary }}
                variants={itemVariants}
              >
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Orders Section */}
        <motion.div
          className="bg-white border rounded-lg overflow-hidden"
          style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
          variants={itemVariants}
        >
          {/* Section Header with Filters */}
          <motion.div
            className="border-b p-6 sm:p-8"
            style={{ borderColor: colors.border }}
            variants={itemVariants}
          >
            <motion.div
              className={`flex ${isMobile ? 'flex-col gap-6' : 'flex-row'} ${isMobile ? '' : 'items-center'} justify-between mb-8`}
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <motion.h2 className="text-xl font-light mb-1" style={{ color: colors.textPrimary }}>
                  My Order Collection
                </motion.h2>
                <motion.p
                  className="text-xs text-gray-500 tracking-wider"
                  variants={itemVariants}
                >
                  VIEW AND TRACK YOUR SHIPMENTS
                </motion.p>
              </motion.div>
              <motion.div
                className="flex items-center gap-3"
                variants={itemVariants}
              >
                <FiFilter className="text-gray-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: colors.textPrimary }}>
                  FILTER BY
                </span>
              </motion.div>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div
              className={`flex ${isMobile ? 'flex-wrap' : ''} ${getGap('gap-2', 'gap-3', 'gap-3')}`}
              variants={containerVariants}
            >
              {filters.map((filterItem) => (
                <motion.button
                  key={filterItem.key}
                  onClick={() => setFilter(filterItem.key)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold rounded-full transition-all border ${filter === filterItem.key
                    ? 'text-white'
                    : 'text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  style={{
                    backgroundColor: filter === filterItem.key ? colors.accent : colors.background,
                    borderColor: filter === filterItem.key ? colors.accent : colors.border
                  }}
                >
                  {filterItem.label} <span className="ml-1 opacity-60">[{filterItem.count}]</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Orders List Container */}
          <motion.div
            className={getPadding('p-5', 'p-8', 'p-10')}
            variants={containerVariants}
          >
            {filteredOrders.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <FiPackage className="text-3xl text-gray-300" />
                </motion.div>
                <motion.h3 className="text-2xl font-light mb-3" style={{ color: colors.textPrimary }}>
                  No orders found
                </motion.h3>
                <motion.p className="text-sm text-gray-500 mb-10 max-w-sm mx-auto font-light">
                  {filter === "all"
                    ? "You haven't placed any orders yet. Explore our luxury salon furniture collection."
                    : `We couldn't find any ${filter} orders in your history.`
                  }
                </motion.p>
                <Link to="/products">
                  <motion.button
                    className="px-8 py-4 text-xs uppercase tracking-[0.3em] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #2563eb, #38bdf8)', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Shopping
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
              >
                {filteredOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="group"
                  >
                    <div
                      className="border rounded-xl p-6 transition-all duration-300 group-hover:shadow-md"
                      style={{ borderColor: colors.border, backgroundColor: colors.background }}
                    >
                      <div className={`flex ${isMobile ? 'flex-col gap-6' : 'flex-row'} items-start justify-between`}>
                        {/* Order Info */}
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-4 mb-6">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                              style={{ backgroundColor: colors.surface }}
                            >
                              <span className="text-xs font-bold" style={{ color: colors.accent }}>
                                #{totalOrders - index}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">
                                ORDER IDENTIFIER
                              </div>
                              <div className="text-sm font-light text-black truncate">
                                {order._id.toUpperCase()}
                              </div>
                            </div>
                          </div>

                          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
                            {[
                              { label: "Placement Date", value: formatDate(order.createdAt), icon: FiCalendar },
                              { label: "Status", value: order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending', icon: FiActivity },
                              { label: "Items Count", value: `${order.orderItems.length} Products`, icon: FiShoppingCart }
                            ].map((detail, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50">
                                  <detail.icon className="text-gray-500 text-sm" />
                                </div>
                                <div>
                                  <div className="text-[10px] uppercase tracking-[0.1em] font-bold text-gray-400">
                                    {detail.label}
                                  </div>
                                  <div className="text-xs font-light text-black">
                                    {detail.value}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Products Mini Preview */}
                          <div className="mt-8 pt-6 border-t border-gray-50">
                            <div className="flex flex-wrap gap-3">
                              {order.orderItems.slice(0, 4).map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full"
                                >
                                  <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="text-[11px] font-light text-gray-700 truncate max-w-[120px]">
                                    {item.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-gray-400">×{item.qty}</span>
                                </div>
                              ))}
                              {order.orderItems.length > 4 && (
                                <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  +{order.orderItems.length - 4} MORE
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Summary & CTA */}
                        <div className={`${isMobile ? 'w-full' : 'w-56'} flex flex-col gap-4 pl-0 md:pl-8 border-l-0 md:border-l border-gray-50`}>
                          <div className="text-left md:text-right">
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">
                              TOTAL INVESTMENT
                            </div>
                            <div className="text-2xl font-serif font-light text-black">
                              ${order.totalPrice.toLocaleString()}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className={`px-4 py-1.5 rounded-full text-center text-[10px] uppercase tracking-widest font-bold ${order.isPaid ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                              {order.isPaid ? 'PAYMENT SUCCESS' : 'PAYMENT PENDING'}
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-center text-[10px] uppercase tracking-widest font-bold ${order.isDelivered ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                              }`}>
                              {order.isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
                            </div>
                            <div className="flex items-center justify-center gap-1.5 py-1 opacity-40">
                              <span className="text-[8px] uppercase tracking-wider font-bold">WhatsApp Settlement</span>
                            </div>
                          </div>

                          <Link to={`/order/${order._id}`} className="mt-2 text-center">
                            <motion.button
                              whileHover={{ scale: 1.02, backgroundColor: colors.background, color: colors.textPrimary }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full flex items-center justify-center gap-2 py-4 text-[11px] uppercase tracking-[0.2em] font-bold rounded-lg border border-blue-600 transition-all bg-blue-600 text-white hover:bg-blue-700" style={{ backgroundImage: 'linear-gradient(135deg, #2563eb, #38bdf8)', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}
                            >
                              VIEW DETAILS <FiArrowRight />
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Table Footer */}
          {filteredOrders.length > 0 && (
            <motion.div
              className="border-t p-6 bg-gray-50/50"
              style={{ borderColor: colors.border }}
              variants={itemVariants}
            >
              <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row'} items-center justify-between`}>
                <div className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.1em]">
                  Displaying {filteredOrders.length} of {totalOrders} results
                </div>
                <div className="text-sm font-light">
                  <span className="text-gray-400 uppercase text-[11px] font-bold tracking-[0.1em] mr-2">TOTAL VALUE:</span>
                  <span className="font-serif">${filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Analytics Section */}
        <motion.div
          className="mt-16 pt-16 border-t border-gray-100"
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            <div className="max-w-md">
              <h3 className="text-2xl font-light mb-4" style={{ color: colors.textPrimary }}>
                Order Insights
              </h3>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Take a look at your purchasing patterns and account activity. We strive to provide the best salon aesthetic solution equipment for your business growth.
              </p>
            </div>

            <div className={`flex-1 grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-12 w-full`}>
              {[
                {
                  label: "Avergate Order Value",
                  value: totalOrders > 0 ? `$${(totalSpent / totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "$0",
                  icon: FiTrendingUp
                },
                {
                  label: "Delivery Fulfillment",
                  value: `${totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}%`,
                  icon: FiTruck
                },
                {
                  label: "Payment Efficiency",
                  value: `${totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0}%`,
                  icon: FiActivity
                }
              ].map((item, i) => (
                <div key={i} className="text-center md:text-left">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 mx-auto md:mx-0">
                    <item.icon className="text-gray-800" />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">
                    {item.label}
                  </div>
                  <div className="text-lg font-serif font-light text-black">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Support */}
        <motion.div
          className="mt-24 text-center"
          variants={itemVariants}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-100 text-xs font-light text-gray-500">
            Need assistance with an order? <Link to="/contact" className="text-black font-bold uppercase tracking-widest text-[10px] hover:underline ml-2">Contact Concierge</Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserOrder;