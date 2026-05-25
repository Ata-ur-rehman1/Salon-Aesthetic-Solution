import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
} from "react-icons/fi";

const OrderList2 = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 tracking-tight"
          style={{
            background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Order Management
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-blue-600/80 max-w-2xl mx-auto px-4">
          View and manage all customer orders in real-time
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 rounded-full bg-blue-50">
              <FiPackage className="text-lg sm:text-xl lg:text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-600/70">Total Orders</p>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {orders?.length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 rounded-full bg-cyan-50">
              <FiDollarSign className="text-lg sm:text-xl lg:text-2xl text-cyan-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-600/70">Revenue</p>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                $
                {orders
                  ?.reduce((sum, order) => sum + order.totalPrice, 0)
                  .toFixed(2) || "0.00"}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 rounded-full bg-emerald-50">
              <FiCheck className="text-lg sm:text-xl lg:text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-600/70">Paid Orders</p>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {orders?.filter((order) => order.isPaid).length || 0}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-2 sm:p-3 rounded-full bg-amber-50">
              <FiClock className="text-lg sm:text-xl lg:text-2xl text-amber-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-600/70">Pending</p>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {orders?.filter((order) => !order.isDelivered).length || 0}
              </h3>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-8">
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 bg-blue-50 border-b border-blue-200">
              <div className="col-span-2 font-medium text-blue-700 uppercase text-sm">
                ITEMS
              </div>
              <div className="col-span-2 font-medium text-blue-700 uppercase text-sm">
                ORDER ID
              </div>
              <div className="col-span-2 font-medium text-blue-700 uppercase text-sm">
                USER
              </div>
              <div className="col-span-1 font-medium text-blue-700 uppercase text-sm">
                DATE
              </div>
              <div className="col-span-1 font-medium text-blue-700 uppercase text-sm">
                TOTAL
              </div>
              <div className="col-span-1 font-medium text-blue-700 uppercase text-sm">
                PAID
              </div>
              <div className="col-span-1 font-medium text-blue-700 uppercase text-sm">
                STATUS
              </div>
              <div className="col-span-2 font-medium text-blue-700 uppercase text-sm text-right">
                ACTIONS
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {orders?.map((order) => (
                <motion.div
                  key={order._id}
                  variants={item}
                  className="grid grid-cols-12 gap-4 p-6 hover:bg-blue-50/50 transition-all duration-300"
                >
                  {/* ITEMS */}
                  <div className="col-span-2 flex items-center">
                    <img
                      src={order.orderItems[0]?.image || "/placeholder-image.jpg"}
                      alt={order._id}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-300 shadow-sm"
                    />
                  </div>

                  {/* ORDER ID */}
                  <div className="col-span-2 flex items-center text-gray-800 font-mono text-sm">
                    #{order._id.slice(-8)}
                  </div>

                  {/* USER */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <FiUser className="text-blue-600 text-sm" />
                      </div>
                      <span className="text-gray-800 text-sm">
                        {order.user ? order.user.username : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="col-span-1 flex items-center text-gray-600">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-blue-400 text-sm" />
                      <span className="text-sm">
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="col-span-1 flex items-center text-gray-800 font-medium text-sm">
                    ${order.totalPrice.toFixed(2)}
                  </div>

                  {/* PAID */}
                  <div className="col-span-1 flex items-center">
                    {order.isPaid ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center">
                        <FiCheck className="mr-1" /> Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 flex items-center">
                        <FiClock className="mr-1" /> Pending
                      </span>
                    )}
                  </div>

                  {/* STATUS */}
                  <div className="col-span-1 flex items-center">
                    {order.isDelivered ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        Shipping
                      </span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="col-span-2 flex items-center justify-end">
                    <Link to={`/order/${order._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 text-white hover:shadow-md"
                        style={{
                          background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                        }}
                      >
                        <span>Details</span>
                        <FiArrowRight className="ml-1" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {orders?.map((order) => (
              <motion.div
                key={order._id}
                variants={item}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={order.orderItems[0]?.image || "/placeholder-image.jpg"}
                      alt={order._id}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-300"
                    />
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        #{order._id.slice(-8)}
                      </p>
                      <p className="text-blue-600/60 text-xs">
                        {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-bold text-lg">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <div className="flex justify-end mt-1">
                      {order.isPaid ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-1.5 rounded-full bg-blue-100">
                    <FiUser className="text-blue-600 text-sm" />
                  </div>
                  <span className="text-gray-800 text-sm">
                    {order.user ? order.user.username : "N/A"}
                  </span>
                </div>

                {/* Status and Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div>
                    {order.isDelivered ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center">
                        <FiCheck className="mr-1" /> Delivered
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center">
                        <FiTruck className="mr-1" /> Shipping
                      </span>
                    )}
                  </div>
                  <Link to={`/order/${order._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 text-white hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                      }}
                    >
                      <span>Details</span>
                      <FiArrowRight className="ml-1" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-blue-100">
              <FiShoppingBag className="text-4xl text-blue-600/70" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
          <p className="text-blue-600/80 max-w-sm mx-auto">
            There are no orders to display at the moment. Orders will appear here once customers start placing orders.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OrderList2;