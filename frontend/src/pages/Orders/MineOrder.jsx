import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,

  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import {
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";

const MineOrder = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #fffcfd 0%, #ffffff 100%)",
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

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
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-rose-200/30 rounded-full blur-3xl opacity-60" />
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12 relative z-10"
        >
          {/* Order Header */}
          <motion.div
            className="mb-10 md:mb-16 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40 text-stone-500"
            >
              Order Specification
            </motion.span>
            <motion.h1
              className="text-2xl md:text-5xl lg:text-7xl font-light tracking-tighter text-black"
              style={{ letterSpacing: '-0.02em' }}
            >
              Order Details
            </motion.h1>
            <motion.div
              className="h-1 w-12 md:w-24 bg-pink-500 mx-auto mt-6" style={{ opacity: 0.8 }}
            />
            <p className="text-[10px] md:text-xs text-stone-400 font-mono mt-4 uppercase tracking-[0.4em]">
              Reference: <span className="font-bold text-stone-600">{order._id}</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div
                className="rounded-[2rem] border overflow-hidden bg-white/60 backdrop-blur-md shadow-sm"
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              >
                <div className="p-6 border-b border-black border-opacity-5 flex items-center">
                  <FiPackage className="text-xl mr-3 text-stone-400" />
                  <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-black opacity-40">
                    Purchased Selection
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-stone-400 uppercase text-[10px] tracking-[0.2em] font-bold opacity-40">
                        <th className="px-6 py-4">Piece</th>
                        <th className="px-6 py-4">Valuation</th>
                        <th className="px-6 py-4">Qty</th>
                        <th className="px-6 py-4">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black divide-opacity-5">
                      {order.orderItems.map((item, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white hover:bg-opacity-5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border border-white border-opacity-10"
                              />
                              <Link
                                to={`/product/${item.product}`}
                                className="text-black font-light tracking-tight hover:opacity-60 transition-opacity"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-black font-light">
                            Rs. {item.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-stone-500 font-light">{item.qty.toString().padStart(2, '0')}</td>
                          <td className="px-6 py-4 text-black font-medium tracking-tight">
                            Rs. {(item.qty * item.price).toLocaleString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Order Details */}
            <div className="space-y-6">
              {/* Shipping Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-[2rem] border overflow-hidden bg-white/60 backdrop-blur-md shadow-sm"
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              >
                <div className="p-5 border-b border-black/5 flex items-center">
                  <FiTruck className="text-xl mr-3 text-stone-400" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-black opacity-40">
                    Logistics Registry
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4 text-stone-500">
                    <div className="flex items-center gap-2">
                      <FiUser className="opacity-40" />
                      <span className="text-[10px] uppercase tracking-wider font-bold">{order.user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPackage className="opacity-0" /> {/* Spacer */}
                      <span className="text-[10px] uppercase tracking-wider font-bold opacity-30">{order.user.email}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-black/5">
                      <p className="text-[8px] uppercase tracking-[0.2em] font-bold mb-2 opacity-30">Destination Profile</p>
                      <p className="text-sm font-light text-black leading-relaxed">{order.shippingAddress.address}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold mt-1">
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment & Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-[2rem] border overflow-hidden bg-white/60 backdrop-blur-md shadow-sm mt-6"
                style={{ borderColor: colors.border, boxShadow: colors.softShadow }}
              >
                <div className="p-5 border-b border-black/5 flex items-center">
                  <FiCreditCard className="text-xl mr-3 text-stone-400" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-black opacity-40">
                    Settlement Summary
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Method</span>
                      <span className="text-sm font-light tracking-tight text-black italic">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Status</span>
                      {order.isPaid ? (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          Manifested
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded">
                          Pending Verification
                        </span>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-black/5 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Selection Items</span>
                        <span className="text-sm font-light text-black">Rs. {order.itemsPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Logistics</span>
                        <span className="text-sm font-light text-black">
                          Complimentary
                        </span>
                      </div>
                      <div className="flex justify-between text-xl font-light pt-4 border-t border-black/10">
                        <span className="tracking-tighter text-stone-400">Total</span>
                        <span className="tracking-tighter text-black">
                          Rs. {order.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment/Delivery Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >


                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#db2777' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={deliverHandler}
                      disabled={loadingDeliver}
                      className="w-full py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)`, boxShadow: colors.softShadow }}
                    >
                      {loadingDeliver ? 'Synchronizing...' : 'Authorize Delivery'}
                    </motion.button>
                  )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MineOrder;
