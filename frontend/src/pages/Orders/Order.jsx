import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaBox,
  FaShippingFast,
  FaCheck,
  FaCopy,
  FaWhatsapp,
  FaCreditCard,
  FaCalendarAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // Responsive State Management
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [copiedAccount, setCopiedAccount] = useState(null);

  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #fffcfd 0%, #ffffff 100%)",
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

  const bankAccounts = [
    {
      bankName: "Meezan Bank",
      accountNumber: "02610114500508",
      accountTitle: "Abdullah",
    }
  ];

  const whatsappNumber = "+923701498826";
  const whatsappMessage = `Hello! I have a query about my order #${orderId}.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

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
        staggerChildren: isMobile ? 0.05 : 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: isMobile ? 20 : 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 100 : 80,
        damping: isMobile ? 25 : 20,
        duration: isMobile ? 0.4 : 0.6
      }
    }
  };

  const headerVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30,
        duration: 0.5
      }
    }
  };

  const statusItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.4
      }
    }
  };

  const bankCardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.5
      }
    },
    hover: {
      y: -8,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  const copyToClipboard = (text, accountIndex) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAccount(accountIndex);
      toast.success("Account copied", { theme: "dark" });
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || "Error loading order"}</Message>;

  return (
    <motion.div
      className="min-h-screen pb-24 font-sans relative overflow-hidden"
      style={{ background: colors.bgGradient }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Editorial Header - CENTERED */}
      <motion.div className="border-b border-black/5 relative z-10" variants={headerVariants}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${getPadding('py-6', 'py-10', 'py-12')} text-center`}>
          <motion.span
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
            style={{ color: colors.mediumGray }}
          >
            Transaction Receipt
          </motion.span>
          <motion.h1 className={`${getTextSize('text-3xl', 'text-5xl', 'text-7xl')} font-light tracking-tighter text-black`} style={{ letterSpacing: '-0.02em' }}>
            Order Manifest
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-24 bg-blue-600 mx-auto mt-6" style={{ opacity: 0.8 }}
          />
          <motion.p
            className={`${getTextSize('text-xs', 'text-sm', 'text-base')} font-mono mt-4 text-stone-400 uppercase tracking-[0.4em] break-all px-4 max-w-3xl mx-auto`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Unique Identifier: <span className="font-bold text-stone-600">{order._id}</span>
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <motion.div
          className={`grid grid-cols-1 ${isDesktop ? 'lg:grid-cols-12' : ''} ${getGap('gap-6', 'gap-8', 'gap-12')} items-start`}
          variants={containerVariants}
        >
          {/* Left Side: Summary & Items */}
          <motion.div
            className={`${isDesktop ? 'lg:col-span-8' : ''} space-y-8 ${getGap('gap-8', 'gap-12', 'gap-16')}`}
            variants={itemVariants}
          >
            {/* Items Card */}
            <motion.section
              variants={itemVariants}
              className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
              style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
            >
              <motion.h2
                className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 pb-4 border-b opacity-40"
                style={{ color: colors.deepOnyx, borderColor: colors.lightGray }}
                variants={itemVariants}
              >
                <FaBox className="inline mr-3" /> Purchased Selection
              </motion.h2>

              <div className="divide-y" style={{ borderColor: colors.lightGray }}>
                {order.orderItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${isMobile ? 'flex-col gap-3 p-4' : isTablet ? 'flex-row gap-4 p-6' : 'flex-row gap-6 p-8'} items-center`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className={`${isMobile ? 'w-56 h-64 mx-auto rounded-xl' : isTablet ? 'w-28 h-48 rounded-xl' : 'w-40 h-64 rounded-xl'} flex-shrink-0 overflow-hidden relative shadow-sm`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        style={{ filter: "grayscale(0.05)" }}
                      />
                    </motion.div>

                    <motion.div className="flex-1 min-w-0" variants={containerVariants}>
                      <Link to={`/product/${item.product}`} className="block">
                        <motion.span
                          className={`${getTextSize('text-[8px]', 'text-[10px]', 'text-xs')} uppercase tracking-[0.2em] font-medium mb-1 block`}
                          style={{ color: colors.mediumGray }}
                          variants={itemVariants}
                        >
                          Digital Signature: {item.product.substring(0, 12)}
                        </motion.span>
                        <motion.h3
                          className="text-base md:text-lg font-light tracking-tight truncate"
                          style={{ color: colors.deepOnyx }}
                          variants={itemVariants}
                          whileHover={{ opacity: 0.6 }}
                        >
                          {item.name}
                        </motion.h3>
                      </Link>

                      <motion.div
                        className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row'} ${isMobile ? '' : 'justify-between'} ${isMobile ? '' : 'items-end'} mt-3`}
                        variants={itemVariants}
                      >
                        <motion.span
                          className={`${getTextSize('text-xs', 'text-sm', 'text-sm')} font-light`}
                          style={{ color: colors.mediumGray }}
                        >
                          Quantity: {item.qty.toString().padStart(2, '0')}
                        </motion.span>
                        <motion.span
                          className="text-lg md:text-xl font-light tracking-tighter"
                          style={{ color: colors.deepOnyx }}
                          whileHover={{ scale: 1.05 }}
                        >
                          ${(item.qty * item.price).toLocaleString()}
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Delivery Info */}
            <motion.section
              variants={itemVariants}
              className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
              style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
            >
              <motion.h2
                className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 pb-4 border-b opacity-40"
                style={{ color: colors.deepOnyx, borderColor: colors.lightGray }}
                variants={itemVariants}
              >
                <FaShippingFast className="inline mr-3" /> Logistics Profile
              </motion.h2>

              <motion.div
                className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-2' : ''} ${getGap('gap-4', 'gap-6', 'gap-8')}`}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <motion.p
                    className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-[0.2em] font-medium mb-2`}
                    style={{ color: colors.mediumGray }}
                  >
                    Destination Registry
                  </motion.p>
                  <motion.p
                    className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-light`}
                    style={{ color: colors.deepOnyx }}
                  >
                    {order.shippingAddress.address}
                  </motion.p>
                  <motion.span
                    className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-[0.2em] font-medium mt-2 inline-block`}
                    style={{ color: colors.mediumGray }}
                  >
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </motion.span>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <motion.p
                    className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-[0.2em] font-medium mb-2`}
                    style={{ color: colors.mediumGray }}
                  >
                    Concierge Uplink
                  </motion.p>
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className={`${getPadding('p-2', 'p-3', 'p-4')} bg-blue-600 text-white`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FaWhatsapp className={getTextSize('text-base', 'text-lg', 'text-xl')} />
                    </motion.div>
                    <motion.span
                      className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-mono`}
                      style={{ color: colors.deepOnyx }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {order.shippingAddress.postalCode}
                    </motion.span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.section>

            {/* Bank Transfer Details - Only shown if unpaid */}
            {!order.isPaid && (
              <motion.section
                variants={itemVariants}
                className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
              >
                <motion.h2
                  className="text-[10px] uppercase tracking-[0.4em] font-bold mb-4 pb-4 border-b opacity-40"
                  style={{ color: colors.deepOnyx, borderColor: colors.lightGray }}
                  variants={itemVariants}
                >
                  <FaCreditCard className="inline mr-3" /> Secure Settlement
                </motion.h2>

                <motion.p
                  className={`${getTextSize('text-xs', 'text-sm', 'text-base')} font-light mb-6`}
                  style={{ color: colors.mediumGray }}
                  variants={itemVariants}
                >
                  To finalize your acquisition, please transfer the total amount to a verified account below. Submit your confirmation via WhatsApp for prioritized processing.
                </motion.p>

                <motion.div
                  className={`grid grid-cols-1 ${isDesktop ? 'md:grid-cols-2' : ''} ${getGap('gap-4', 'gap-6', 'gap-8')}`}
                  variants={containerVariants}
                >
                  {bankAccounts.map((account, index) => (
                    <motion.div
                      key={index}
                      variants={bankCardVariants}
                      whileHover={!isMobile ? "hover" : {}}
                      className="border rounded-md p-4"
                      style={{ borderColor: colors.lightGray }}
                    >
                      <motion.div
                        className="flex justify-between items-start mb-4"
                        variants={itemVariants}
                      >
                        <motion.h4
                          className={`${getTextSize('text-xs', 'text-sm', 'text-sm')} font-medium uppercase tracking-[0.2em]`}
                          style={{ color: colors.deepOnyx }}
                        >
                          {account.bankName}
                        </motion.h4>
                        <motion.button
                          onClick={() => copyToClipboard(account.accountNumber, index)}
                          className={`${getPadding('p-2', 'p-3', 'p-3')} border`}
                          style={{ borderColor: colors.lightGray }}
                          whileHover={{ scale: 1.1, backgroundColor: colors.ivory }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {copiedAccount === index ? (
                            <FaCheck className={getTextSize('text-sm', 'text-base', 'text-base')} style={{ color: colors.success }} />
                          ) : (
                            <FaCopy className={getTextSize('text-sm', 'text-base', 'text-base')} style={{ color: colors.mediumGray }} />
                          )}
                        </motion.button>
                      </motion.div>

                      <motion.div
                        className="space-y-3"
                        variants={containerVariants}
                      >
                        <motion.div variants={itemVariants}>
                          <motion.p
                            className={`${getTextSize('text-[8px]', 'text-[10px]', 'text-xs')} uppercase tracking-[0.2em] font-medium mb-1`}
                            style={{ color: colors.mediumGray }}
                          >
                            Account Designation
                          </motion.p>
                          <motion.p
                            className={`${getTextSize('text-sm', 'text-base', 'text-base')} font-medium uppercase tracking-[0.2em]`}
                            style={{ color: colors.deepOnyx }}
                          >
                            {account.accountTitle}
                          </motion.p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <motion.p
                            className={`${getTextSize('text-[8px]', 'text-[10px]', 'text-xs')} uppercase tracking-[0.2em] font-medium mb-1`}
                            style={{ color: colors.mediumGray }}
                          >
                            Digital Account Number
                          </motion.p>
                          <motion.p
                            className={`${getTextSize('text-sm', 'text-base', 'text-lg')} font-mono tracking-tighter`}
                            style={{ color: colors.deepOnyx, wordBreak: "break-all" }}
                            whileHover={{ scale: 1.02 }}
                          >
                            {account.accountNumber}
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}
          </motion.div>

          {/* Right Side: Status & Actions */}
          <motion.div
            className={`${isDesktop ? 'lg:col-span-4 mt-8 lg:mt-0' : 'mt-8'} space-y-6 ${getGap('gap-6', 'gap-8', 'gap-8')}`}
            variants={itemVariants}
          >
            {/* Pricing Panel */}
            <motion.div
              variants={itemVariants}
              className={`${getPadding('p-4', 'p-6', 'p-8')} text-white rounded-[2rem]`}
              style={{ background: `linear-gradient(135deg, ${colors.accentDeep} 0%, ${colors.accent} 100%)`, boxShadow: colors.softShadow }}
              whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
            >
              <motion.h3
                className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 opacity-40"
                style={{ color: colors.white }}
                variants={itemVariants}
              >
                Valuation Metrics
              </motion.h3>

              <motion.div
                className="space-y-3 pb-4 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                variants={containerVariants}
              >
                <motion.div
                  className="flex justify-between"
                  variants={itemVariants}
                >
                  <motion.span
                    className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-[0.2em]`}
                    style={{ color: colors.white, opacity: 0.4 }}
                  >
                    Base Subtotal
                  </motion.span>
                  <motion.span
                    className={`${getTextSize('text-sm', 'text-sm', 'text-base')} font-medium tracking-[0.2em]`}
                    style={{ color: colors.white }}
                    whileHover={{ scale: 1.05 }}
                  >
                    ${order.itemsPrice.toLocaleString()}
                  </motion.span>
                </motion.div>

                <motion.div
                  className="flex justify-between"
                  variants={itemVariants}
                >
                  <motion.span
                    className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} uppercase tracking-[0.2em]`}
                    style={{ color: colors.white, opacity: 0.4 }}
                  >
                    Logistics
                  </motion.span>
                  <motion.span
                    className={`${getTextSize('text-xs', 'text-xs', 'text-sm')} font-medium uppercase tracking-[0.2em] px-2 py-1`}
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.white }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Complimentary
                  </motion.span>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-between items-baseline pt-4"
                variants={itemVariants}
              >
                <motion.div variants={itemVariants}>
                  <motion.span
                    className={`${getTextSize('text-sm', 'text-sm', 'text-base')} uppercase tracking-[0.3em] font-medium`}
                    style={{ color: colors.white, opacity: 0.4 }}
                  >
                    Total
                  </motion.span>
                  <motion.p
                    className={`${getTextSize('text-xs', 'text-xs', 'text-xs')} uppercase tracking-[0.2em] mt-1`}
                    style={{ color: colors.white, opacity: 0.2 }}
                  >
                    Dues payable in PKR
                  </motion.p>
                </motion.div>
                <motion.span
                  className="text-2xl md:text-3xl font-light tracking-tighter"
                  style={{ color: colors.white }}
                  whileHover={{ scale: 1.05 }}
                >
                  ${order.itemsPrice.toLocaleString()}
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Status Tracking */}
            <motion.div
              variants={itemVariants}
              className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
              style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
            >
              <motion.h3
                className="text-[10px] uppercase tracking-[0.3em] font-bold mb-4 opacity-40"
                style={{ color: colors.mediumGray }}
                variants={itemVariants}
              >
                Lifecycle Status
              </motion.h3>

              <motion.div
                className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-6')}`}
                variants={containerVariants}
              >
                <StatusItem
                  icon={<FaCalendarAlt className={getTextSize('text-sm', 'text-base', 'text-lg')} />}
                  label="Acquisition Date"
                  value={new Date(order.createdAt).toLocaleDateString()}
                  done={true}
                  colors={colors}
                  isMobile={isMobile}
                  variants={statusItemVariants}
                />

                <StatusItem
                  icon={<FaCreditCard className={getTextSize('text-sm', 'text-base', 'text-lg')} />}
                  label="Financial Verification"
                  value={order.isPaid ? "Authenticated" : "Awaiting Transaction"}
                  done={order.isPaid}
                  colors={colors}
                  isMobile={isMobile}
                  variants={statusItemVariants}
                />

                <StatusItem
                  icon={<FaCheck className={getTextSize('text-sm', 'text-base', 'text-lg')} />}
                  label="Artisan Delivery"
                  value={order.isDelivered ? "Manifested" : "Hand-Crafting in Progress"}
                  done={order.isDelivered}
                  colors={colors}
                  isMobile={isMobile}
                  variants={statusItemVariants}
                />
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className={`space-y-4 ${getGap('gap-4', 'gap-6', 'gap-6')}`}
              variants={containerVariants}
            >
              {/* Settlement & Concierge */}
              <motion.div
                variants={itemVariants}
                className={`bg-white/60 backdrop-blur-md border rounded-[2rem] ${getPadding('p-4', 'p-6', 'p-8')}`}
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
                whileHover={{ boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
              >
                <motion.h3
                  className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6 opacity-40"
                  style={{ color: colors.mediumGray }}
                  variants={itemVariants}
                >
                  Settlement
                </motion.h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-200">
                      <FaWhatsapp className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-widest mb-1">WhatsApp Concierge</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-light">
                        Secure manual payment processing with priority logistics coordination.
                      </p>
                    </div>
                  </div>

                  <motion.a
                    href={`https://wa.me/+923701498826?text=Order%20Update%20Request:%20${order._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 w-full ${getPadding('px-4 py-3', 'px-6 py-4', 'px-8 py-4')} bg-blue-600 text-white ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-[0.3em] font-bold rounded-xl shadow-lg`}
                    style={{ backgroundImage: 'linear-gradient(135deg, #2563eb, #38bdf8)' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Message Concierge
                  </motion.a>
                </div>
              </motion.div>

              {userInfo?.isAdmin && !order.isDelivered && (
                <motion.button
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  className={`w-full ${getPadding('px-4 py-3', 'px-6 py-3', 'px-8 py-4')} bg-gray-800 text-white ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-[0.2em] font-medium`}
                  whileHover={{ backgroundColor: colors.black, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variants={itemVariants}
                >
                  {loadingDeliver ? 'Updating...' : 'Authorize Delivery'}
                </motion.button>
              )}

              <motion.div variants={itemVariants}>
                <Link
                  to="/user-orders"
                  className={`block text-center w-full ${getPadding('px-4 py-3', 'px-6 py-3', 'px-8 py-4')} border ${getTextSize('text-xs', 'text-sm', 'text-sm')} uppercase tracking-[0.2em] font-medium`}
                  style={{ color: colors.mediumGray, borderColor: colors.lightGray }}
                  whileHover={{ color: colors.accent, borderColor: colors.accent, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Personal Order Archive
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatusItem = ({ icon, label, value, done, colors, isMobile }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      className="flex items-start gap-3"
      variants={itemVariants}
    >
      <motion.div
        className={`${isMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} flex items-center justify-center border ${done ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg' : 'border-blue-300 text-blue-400'}`}
        whileHover={{ scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <motion.div className="flex-1 min-w-0">
        <motion.p
          className={`${isMobile ? 'text-[8px]' : 'text-[10px]'} uppercase tracking-[0.2em] font-medium mb-1`}
          style={{ color: colors.mediumGray }}
        >
          {label}
        </motion.p>
        <motion.p
          className={`${isMobile ? 'text-xs' : 'text-sm'} font-light tracking-tight truncate ${done ? 'text-black' : 'text-gray-500'}`}
          style={{ color: done ? colors.deepOnyx : colors.mediumGray }}
        >
          {value}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Order;