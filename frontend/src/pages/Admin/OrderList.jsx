import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useGetOrdersQuery, useDeliverOrderMutation } from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { 
  FiPackage, FiDollarSign, FiCheckCircle, FiClock, FiUser,
  FiCalendar, FiEye, FiFilter, FiShoppingCart, FiTruck,
  FiTrendingUp, FiPercent, FiActivity, FiBarChart2, FiX
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import Loader from "../../components/Loader";

const OrderList = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Ultra-Modern Monochrome Palette
  const colors = {
    background: "#ffffff",
    surface: "#f9f9f9",
    textPrimary: "#000000",
    textSecondary: "#6b6b6b",
    accent: "#333333",
    border: "#f0f0f0",
    shadow: "rgba(0, 0, 0, 0.06)",
    success: "#10b981",
    error: "#ef4444"
  };

  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
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
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
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
      icon: FiShoppingCart,
      label: "Total Orders",
      value: totalOrders,
    },
    {
      icon: FiDollarSign,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
    },
    {
      icon: FiCheckCircle,
      label: "Paid Orders",
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
    { key: "pending", label: "Pending", count: pendingOrders }
  ];

  // Handlers
  const handleDeliverOrder = async (orderId) => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  if (isLoading) return <Loader />;

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
            Please try again later
          </motion.p>
          <motion.button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-xs uppercase tracking-wider font-medium border hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
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
      className="min-h-screen bg-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={`max-w-7xl mx-auto ${getPadding('px-4 py-6', 'px-6 py-8', 'px-8 py-12')}`}>
        {/* Header */}
        <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
          <motion.span
            className={`${getTextSize('text-xs tracking-[0.3em]', 'text-sm tracking-[0.4em]', 'text-sm tracking-[0.4em]')} text-gray-500 font-bold block mb-2`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Order Management
          </motion.span>
          <motion.h1 className={`${getTextSize('text-2xl', 'text-4xl', 'text-6xl')} font-light tracking-tighter text-black`}>
            Client Orders
          </motion.h1>
          <motion.p className={`${getTextSize('text-sm', 'text-base', 'text-base')} text-gray-600 mt-2`}>
            Manage saloon interior product orders and deliveries
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} ${getGap('gap-4', 'gap-6', 'gap-6')} mb-8`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white border rounded-lg p-4"
              style={{ borderColor: colors.border, backgroundColor: colors.background }}
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
                    whileHover={{ scale: 1.2 }}
                  >
                    <stat.icon className="text-gray-600" />
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="text-2xl font-serif font-medium"
                  style={{ color: colors.textPrimary }}
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.value}
                </motion.div>
              </motion.div>
              <motion.div 
                className="text-xs uppercase tracking-wider font-medium"
                style={{ color: colors.textPrimary }}
                variants={itemVariants}
              >
                {stat.label}
              </motion.div>
              <motion.div 
                className="text-xs text-gray-500"
                variants={itemVariants}
              >
                Saloon Interior
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Orders Table */}
        <motion.div
          className="bg-white border rounded-lg"
          style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)"}}
          variants={itemVariants}
        >
          {/* Table Header with Filters */}
          <motion.div 
            className="border-b p-6"
            style={{ borderColor: colors.border }}
            variants={itemVariants}
          >
            <motion.div 
              className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row'} ${isMobile ? '' : 'items-center'} justify-between mb-4`}
              variants={itemVariants}
            >
              <motion.div variants={itemVariants}>
                <motion.h2 className="text-lg font-light mb-1" style={{ color: colors.textPrimary }}>
                  Order Collection
                </motion.h2>
                <motion.p 
                  className="text-xs text-gray-500"
                  variants={itemVariants}
                >
                  Manage client orders and deliveries
                </motion.p>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                variants={itemVariants}
              >
                <FiFilter className="text-gray-500" />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: colors.textPrimary }}>
                  Filter By
                </span>
              </motion.div>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div 
              className={`flex ${isMobile ? 'flex-wrap' : ''} ${getGap('gap-2', 'gap-3', 'gap-3')}`}
              variants={containerVariants}
            >
              {filters.map((filterItem, index) => (
                <motion.button
                  key={filterItem.key}
                  onClick={() => setFilter(filterItem.key)}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors ${
                    filter === filterItem.key 
                      ? 'text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: filter === filterItem.key ? colors.accent : colors.surface,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {filterItem.label} ({filterItem.count})
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Orders List */}
          <motion.div 
            className={getPadding('p-4', 'p-6', 'p-8')}
            variants={containerVariants}
          >
            {/* <AnimatePresence mode="wait"> */}
              {isLoading ? (
                <motion.div 
                  className="flex justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader />
                </motion.div>
              ) : error ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="text-4xl mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ⚠️
                  </motion.div>
                  <motion.h3 className="text-xl font-light mb-2" style={{ color: colors.textPrimary }}>
                    Error Loading Orders
                  </motion.h3>
                  <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }}>
                    Please try again later
                  </motion.p>
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 text-xs uppercase tracking-wider font-medium border hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Refresh Page
                  </motion.button>
                </motion.div>
              ) : filteredOrders.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: colors.surface }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FiShoppingCart className="text-2xl text-gray-400" />
                  </motion.div>
                  <motion.h3 className="text-lg font-light mb-2" style={{ color: colors.textPrimary }}>
                    No orders found
                  </motion.h3>
                  <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }}>
                    {filter === "all" 
                      ? "No orders have been placed for saloon interior products yet."
                      : `No ${filter} orders found.`
                    }
                  </motion.p>
                  <Link to="/">
                    <motion.button
                      className="px-6 py-3 text-xs uppercase tracking-wider font-medium border hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
                      style={{ borderColor: colors.accent, color: colors.accent }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Products
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div 
                  className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-6')}`}
                  variants={containerVariants}
                >
                  {filteredOrders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div
                        className="border rounded-lg p-4"
                        style={{ borderColor: colors.border, backgroundColor: colors.background }}
                        whileHover="hover"
                      >
                        <motion.div 
                          className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row'} ${isMobile ? '' : 'items-center'} justify-between`}
                          variants={containerVariants}
                        >
                          {/* Order Info */}
                          <motion.div 
                            className="flex-1"
                            variants={itemVariants}
                          >
                            <motion.div 
                              className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row'} ${isMobile ? '' : 'items-start'} justify-between mb-4`}
                              variants={itemVariants}
                            >
                              <motion.div className="flex-1 min-w-0" variants={itemVariants}>
                                <motion.div 
                                  className={`flex ${isMobile ? 'items-start' : 'items-center'} gap-3 mb-3`}
                                  variants={itemVariants}
                                >
                                  <motion.div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: colors.surface }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  >
                                    <span className="text-sm font-medium" style={{ color: colors.accent }}>
                                      #{index + 1}
                                    </span>
                                  </motion.div>
                                  <motion.div className="min-w-0" variants={itemVariants}>
                                    <motion.div 
                                      className="text-xs uppercase tracking-wider font-medium mb-1"
                                      style={{ color: colors.textSecondary }}
                                    >
                                      Order ID
                                    </motion.div>
                                    <motion.div 
                                      className="text-sm font-light truncate"
                                      style={{ color: colors.textPrimary }}
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      {order._id.substring(0, 10)}...
                                    </motion.div>
                                  </motion.div>
                                </motion.div>
                                
                                <motion.div 
                                  className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} ${getGap('gap-3', 'gap-4', 'gap-4')}`}
                                  variants={containerVariants}
                                >
                                  {[
                                    { label: "Client", value: order.user?.username || "N/A", icon: FiUser },
                                    { label: "Date", value: formatDate(order.createdAt), icon: FiCalendar },
                                    { label: "Items", value: `${order.orderItems.length} items`, icon: FiShoppingCart }
                                  ].map((detail, i) => (
                                    <motion.div 
                                      key={i}
                                      className="flex items-center gap-2"
                                      variants={itemVariants}
                                      whileHover={{ x: 2 }}
                                    >
                                      <detail.icon className="text-gray-500" />
                                      <motion.div className="min-w-0" variants={itemVariants}>
                                        <motion.div 
                                          className="text-xs uppercase tracking-wider font-medium"
                                          style={{ color: colors.textSecondary }}
                                        >
                                          {detail.label}
                                        </motion.div>
                                        <motion.div 
                                          className="text-xs font-light"
                                          style={{ color: colors.textPrimary }}
                                          whileHover={{ scale: 1.02 }}
                                        >
                                          {detail.value}
                                        </motion.div>
                                      </motion.div>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </motion.div>
                              
                              {/* Amount & Status */}
                              <motion.div 
                                className="flex flex-col items-start sm:items-end gap-3"
                                variants={itemVariants}
                              >
                                <motion.div 
                                  className="text-left sm:text-right"
                                  variants={itemVariants}
                                >
                                  <motion.div 
                                    className="text-xs uppercase tracking-wider font-medium mb-1"
                                    style={{ color: colors.textSecondary }}
                                    variants={itemVariants}
                                  >
                                    Total Amount
                                  </motion.div>
                                  <motion.div 
                                    className="text-lg font-serif font-light"
                                    style={{ color: colors.textPrimary }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    ${order.totalPrice.toLocaleString()}
                                  </motion.div>
                                </motion.div>
                                
                                <motion.div 
                                  className={`flex ${getGap('gap-2', 'gap-3', 'gap-3')}`}
                                  variants={itemVariants}
                                >
                                  <motion.span 
                                    className={`px-2 py-1 text-xs uppercase tracking-wider rounded ${
                                      order.isPaid ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {order.isPaid ? 'Paid' : 'Pending'}
                                  </motion.span>
                                  <motion.span 
                                    className={`px-2 py-1 text-xs uppercase tracking-wider rounded ${
                                      order.isDelivered ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {order.isDelivered ? 'Delivered' : 'Shipping'}
                                  </motion.span>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                            
                            {/* Products Preview */}
                            <motion.div 
                              className="pt-4 border-t"
                              style={{ borderColor: colors.border }}
                              variants={itemVariants}
                            >
                              <motion.div 
                                className="flex items-center gap-2 mb-3"
                                variants={itemVariants}
                              >
                                <FiPackage className="text-gray-500" />
                                <motion.div 
                                  className="text-xs uppercase tracking-wider font-medium"
                                  style={{ color: colors.textSecondary }}
                                  variants={itemVariants}
                                >
                                  Products
                                </motion.div>
                              </motion.div>
                              <motion.div 
                                className={`flex ${isMobile ? 'flex-wrap' : ''} ${getGap('gap-2', 'gap-3', 'gap-3')}`}
                                variants={containerVariants}
                              >
                                {order.orderItems.slice(0, 3).map((item, itemIndex) => (
                                  <motion.div
                                    key={itemIndex}
                                    className="flex items-center gap-2 px-3 py-2 border rounded-lg"
                                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <FiPackage className="text-gray-500" />
                                    <motion.span 
                                      className="text-xs font-light truncate"
                                      style={{ color: colors.textPrimary }}
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      {item.name}
                                    </motion.span>
                                    <motion.span 
                                      className="text-xs text-gray-500"
                                      variants={itemVariants}
                                    >
                                      ×{item.qty}
                                    </motion.span>
                                  </motion.div>
                                ))}
                                {order.orderItems.length > 3 && (
                                  <motion.div 
                                    className="px-3 py-2 border rounded-lg"
                                    style={{ borderColor: colors.border, backgroundColor: colors.surface }}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <motion.span 
                                      className="text-xs text-gray-600"
                                      variants={itemVariants}
                                    >
                                      +{order.orderItems.length - 3} more
                                    </motion.span>
                                  </motion.div>
                                )}
                              </motion.div>
                            </motion.div>
                          </motion.div>
                          
                          {/* Actions */}
                          <motion.div 
                            className={`${isMobile ? 'w-full' : 'w-40'} flex flex-col gap-2`}
                            variants={itemVariants}
                          >
                            <Link to={`/order/${order._id}`}>
                              <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs uppercase tracking-wider font-medium rounded-lg"
                                style={{ backgroundColor: colors.accent, color: colors.background }}
                              >
                                <FiEye className="text-sm" />
                                View Order
                              </motion.button>
                            </Link>
                            
                            <a 
                              href={`mailto:${order.user?.email}`}
                              className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs uppercase tracking-wider font-medium rounded-lg border"
                              style={{ borderColor: colors.border, color: colors.textSecondary }}
                              whileHover={{ backgroundColor: colors.surface, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Contact Client
                            </a>

                            {userInfo?.isAdmin && !order.isDelivered && (
                              <motion.button
                                onClick={() => handleDeliverOrder(order._id)}
                                disabled={loadingDeliver}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs uppercase tracking-wider font-medium rounded-lg"
                                style={{ backgroundColor: colors.success, color: colors.background }}
                              >
                                {loadingDeliver ? (
                                  <div className="flex items-center gap-2">
                                    <FaSpinner className="animate-spin" />
                                    Updating...
                                  </div>
                                ) : 'Mark Delivered'}
                              </motion.button>
                            )}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Table Footer */}
            {filteredOrders.length > 0 && (
              <motion.div 
                className="border-t p-4"
                style={{ borderColor: colors.border }}
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className={`flex ${isMobile ? 'flex-col gap-3' : 'flex-row'} items-center justify-between`}
                  variants={itemVariants}
                >
                  <motion.div 
                    className="text-xs text-gray-500"
                    variants={itemVariants}
                  >
                    <span className="uppercase tracking-wider">Showing</span> {filteredOrders.length} of {totalOrders} orders
                  </motion.div>
                  <motion.div 
                    className="text-xs"
                    variants={itemVariants}
                  >
                    <span className="uppercase tracking-wider text-gray-500">Filtered Revenue:</span>{' '}
                    <motion.span 
                      className="font-medium"
                      style={{ color: colors.textPrimary }}
                      whileHover={{ scale: 1.05 }}
                    >
                      ${filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Summary Section */}
          <motion.div 
            className="bg-white border rounded-lg mt-8"
            style={{ borderColor: colors.border, boxShadow: "0 2px 12px rgba(0,0,0,0.02)" }}
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)"}}
            variants={itemVariants}
          >
            <motion.div 
              className={getPadding('p-6', 'p-8', 'p-10')}
              variants={containerVariants}
            >
              <motion.h3 className="text-lg font-light mb-6" style={{ color: colors.textPrimary }} variants={itemVariants}>
                Order Analytics
              </motion.h3>
              <motion.div 
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} ${getGap('gap-4', 'gap-6', 'gap-8')}`}
                variants={containerVariants}
              >
                {[
                  { 
                    icon: FiTrendingUp, 
                    title: "Average Order Value", 
                    value: totalOrders > 0 ? `$${(totalRevenue / totalOrders).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "$0.00",
                    sub: "Revenue per order"
                  },
                  { 
                    icon: FiPercent, 
                    title: "Completion Rate", 
                    value: `${totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}%`,
                    sub: "Orders delivered"
                  },
                  { 
                    icon: FiActivity, 
                    title: "Payment Rate", 
                    value: `${totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0}%`,
                    sub: "Orders paid"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ backgroundColor: colors.surface }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="text-gray-600" />
                    </motion.div>
                    <motion.h4 
                      className="text-xs uppercase tracking-wider font-medium mb-1"
                      style={{ color: colors.textPrimary }}
                    >
                      {item.title}
                    </motion.h4>
                    <motion.div 
                      className="text-lg font-serif font-light mb-1"
                      style={{ color: colors.textPrimary }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.value}
                    </motion.div>
                    <motion.p 
                      className="text-xs text-gray-500"
                      variants={itemVariants}
                    >
                      {item.sub}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    // </motion.div>
  );
};

export default OrderList;