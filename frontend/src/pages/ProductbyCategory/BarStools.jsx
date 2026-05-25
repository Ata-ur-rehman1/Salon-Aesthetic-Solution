import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaChevronRight, FaShoppingCart, FaChair, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

const BarStools = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState({});

  const dispatch = useDispatch();
  const [hoveredProduct, setHoveredProduct] = useState(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/category/69e54656f5f270d5d903c105/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Our bar stool collection is currently being updated.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const toggleFavorite = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Added to cart");
  };

  if (loading) return (
    <Loader />
  );

  return (
    <div className="min-h-screen font-sans relative overflow-hidden" style={{ background: colors.bgGradient }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Removed decorative blobs */}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative z-10"
          >
            {/* Main Title */}
            <motion.span
              className="text-[8px] md:text-[10px] lg:text-xs uppercase tracking-[0.4em] font-bold mb-3 block opacity-40"
              style={{ color: colors.textSecondary }}
            >
              Collection
            </motion.span>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tighter mb-4" style={{ color: colors.textPrimary, letterSpacing: '-0.02em' }}>
              Bar Stools
            </h1>
            <motion.div
              className="h-1 w-12 md:w-24 bg-blue-600 mx-auto mt-6" style={{ opacity: 0.8 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-4 pb-16 sm:pb-24 lg:pb-32">
        {error ? (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex items-center gap-3 px-6 py-4 border rounded-lg" style={{ borderColor: colors.border }}>
              <div className="w-3 h-3 rounded-full bg-blue-600 opacity-80"></div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>{error}</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 border-t border-b" style={{ borderColor: colors.border }}>
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-dashed rounded-full flex items-center justify-center"
                style={{ borderColor: colors.border }}>
                <FaChair className="text-xl" style={{ color: colors.textTertiary }} />
              </div>
              <div>
                <p className="text-lg font-light mb-2" style={{ color: colors.textPrimary }}>
                  Curating New Arrivals
                </p>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Our premium collection is being updated
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative"
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Card */}
                  <div className="relative">
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden mb-4 transition-all duration-500 rounded-[2rem] shadow-md hover:shadow-2xl"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: '1px'
                      }}>
                      <Link to={`/product/${product._id}`} className="block w-full h-full">
                        {/* Product Image */}
                        <motion.div
                          className="relative w-full h-full overflow-hidden"
                          animate={{
                            scale: hoveredProduct === product._id ? 1.08 : 1
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <img
                            className="w-full h-full object-cover"
                            src={product.image}
                            alt={product.name}
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/0 group-hover:to-black/5 transition-all duration-500"></div>
                        </motion.div>

                        {/* Quick View Button (Desktop) */}
                        <motion.div
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 
                                   transition-opacity duration-300 hidden sm:block"
                          initial={{ y: 10 }}
                          animate={{ y: hoveredProduct === product._id ? 0 : 10 }}
                        >
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/product/${product._id}`}
                              className="flex items-center gap-2 px-3 py-2 bg-white text-xs uppercase tracking-widest 
                                       whitespace-nowrap border"
                              style={{
                                color: colors.textPrimary,
                                borderColor: colors.border
                              }}
                            >
                              Quick View
                              <FaChevronRight className="text-xs" />
                            </Link>
                          </div>
                        </motion.div>
                      </Link>

                      {/* Product Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono tracking-widest px-2 py-1 border rounded-sm"
                          style={{
                            color: colors.textTertiary,
                            borderColor: colors.border,
                            backgroundColor: colors.background
                          }}>
                          {product._id?.slice(-5).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3 px-1">
                      {/* Brand & Rating */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-[0.15em] font-medium truncate max-w-[60%]"
                          style={{ color: colors.textSecondary }}>
                          {product.brand || 'Professional Spa'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="text-[10px] text-[#D4AF37]" />
                          ))}
                        </div>
                      </div>

                      {/* Product Name */}
                      <Link to={`/product/${product._id}`} className="block">
                        <h3 className="text-[13px] md:text-base font-light tracking-tight leading-tight line-clamp-2 mb-2 
                                     group-hover:opacity-70 transition-opacity duration-300"
                          style={{ color: colors.textPrimary }}>
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex justify-between items-end">
                        <span className="text-xl md:text-2xl font-light tracking-tighter"
                          style={{ color: colors.textPrimary }}>
                          Rs. {product.price?.toLocaleString()}
                        </span>
                        <motion.button
                          onClick={() => addToCartHandler(product)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs uppercase tracking-widest whitespace-nowrap border-none hover:bg-blue-700 transition-all shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #2563eb, #38bdf8)', boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaShoppingCart className="text-xs" />
                        </motion.button>
                      </div>

                      {/* Price & CTA */}
                      <div className="pt-3 border-t" style={{ borderColor: colors.border }}>
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/product/${product._id}`}
                            className="group/cta inline-flex items-center gap-2"
                          >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40
                                          transition-all duration-300 group-hover/cta:opacity-100"
                              style={{ color: colors.textPrimary }}>
                              Explore
                            </span>
                            <motion.div
                              animate={{ x: hoveredProduct === product._id ? 3 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FaChevronRight
                                className="text-xs transition-transform duration-300 group-hover/cta:translate-x-1"
                                style={{ color: colors.textPrimary }}
                              />
                            </motion.div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Collection Summary */}
            {products.length > 0 && (
              <motion.div
                className="mt-12 sm:mt-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 border rounded-full"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border
                  }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-xs uppercase tracking-[0.2em] font-medium"
                      style={{ color: colors.textSecondary }}>
                      Showing {products.length}  Bar Stools
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t sm:hidden z-50"
        style={{ borderColor: colors.border }}>
        <div className="flex justify-around items-center py-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest mb-1"
              style={{ color: colors.textSecondary }}>
              Total Models
            </div>
            <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              {products.length}
            </div>
          </div>
          <div className="h-6 w-px" style={{ backgroundColor: colors.border }}></div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest mb-1"
              style={{ color: colors.textSecondary }}>
              Starting From
            </div>
            <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
              Rs. {products.length > 0 ? Math.min(...products.map(p => p.price || 0)).toLocaleString() : '0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarStools;