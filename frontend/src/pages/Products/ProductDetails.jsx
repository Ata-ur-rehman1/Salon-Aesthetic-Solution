import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Ratings from "./Ratings";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMessageSquare,
  FiShoppingCart,
  FiTruck,
  FiPhone,
  FiArrowLeft,
  FiArrowRight,
  FiLayers
} from "react-icons/fi";
import { FaMinus, FaPlus } from "react-icons/fa";
import Meta from "../../components/Meta.jsx";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [zoomImage, setZoomImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);



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

  // Responsive State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

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

  // Blur background when image is zoomed
  useEffect(() => {
    const wrapper = document.getElementById('main-content-wrapper');
    if (zoomImage) {
      wrapper?.classList.add('blur-[10px]');
      // Prevent body scroll when zoomed
      document.body.style.overflow = 'hidden';
    } else {
      wrapper?.classList.remove('blur-[10px]');
      document.body.style.overflow = 'auto';
    }
    return () => {
      wrapper?.classList.remove('blur-[10px]');
      document.body.style.overflow = 'auto';
    };
  }, [zoomImage]);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
    }
  }, [product]);

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
        damping: 20
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25
      }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  const specVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    })
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("🎉 Review created successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success(`🛒 Added ${qty} × ${product.name} to cart!`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    navigate("/cart");
  };

  const getTextSize = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getPadding = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  const getGap = (mobile, tablet, desktop) => {
    return isMobile ? mobile : isTablet ? tablet : desktop;
  };

  if (isLoading) return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Loader />
    </motion.div>
  );

  if (error) return (
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
          Error Loading Product
        </motion.h3>
        <motion.p className="text-sm mb-8" style={{ color: colors.textSecondary }} variants={itemVariants}>
          {error?.data?.message || error.message}
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
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: colors.bgGradient }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Removed decorative blobs */}
      </div>

      <div className="relative z-10">
        <Meta
          title={product ? `${product.name} | Saloon Interior` : "Product Details | Saloon Interior"}
          description={product ? product.description : "Premium saloon interior equipment."}
        />

        {/* Zoom Overlay - Rendered via Portal */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {zoomImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setZoomImage(false)}
              >
                <div className="relative max-w-6xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                  <motion.button
                    onClick={() => setZoomImage(false)}
                    className="absolute -top-12 right-0 text-white text-3xl p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-[10000]"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                  >
                    <FiX />
                  </motion.button>
                  <motion.div
                    className="relative group flex items-center justify-center w-full h-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <motion.img
                      src={selectedImage || product?.image}
                      alt={product.name}
                      className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    />
                    {/* Subtle Rose Gold Border around the zoomed image */}
                    <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Breadcrumb / Back */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold mb-10 transition-colors duration-300"
            style={{ color: colors.textTertiary }}
            whileHover={{ color: colors.textPrimary }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <FiArrowLeft size={14} /> Back to selection
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left: Image Section */}
            <div className="lg:col-span-6 xl:col-span-6">
              <motion.div
                className="relative aspect-square rounded-[32px] overflow-hidden group cursor-zoom-in shadow-sm hover:shadow-2xl transition-all duration-700 border"
                style={{ backgroundColor: colors.surfaceHover, borderColor: colors.border }}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                onClick={() => setZoomImage(true)}
              >
                <AnimatePresence>
                  {!imageLoaded && (
                    <motion.div className="absolute inset-0 bg-gray-100 animate-pulse" exit={{ opacity: 0 }} />
                  )}
                </AnimatePresence>
                <motion.img
                  src={selectedImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500" />

                <div className="absolute top-6 left-6 flex flex-col gap-3">
                  {product.countInStock > 0 ? (
                    <div className="relative inline-flex items-center">
                      <div className="absolute inset-0 bg-green-400 blur-md opacity-40 rounded-full" />
                      <span className="relative px-5 py-2 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-[0.25em] shadow-xl border border-white/20" style={{ color: colors.success }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-2 animate-pulse" />
                        In Stock
                      </span>
                    </div>
                  ) : (
                    <div className="relative inline-flex items-center">
                      <div className="absolute inset-0 bg-red-400 blur-md opacity-40 rounded-full" />
                      <span className="relative px-5 py-2 rounded-full bg-white/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-[0.25em] shadow-xl border border-white/20" style={{ color: colors.error }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block mr-2" />
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.isSpecial && (
                    <div className="relative inline-flex items-center">
                      <div className="absolute inset-0 bg-rose-400 blur-md opacity-40 rounded-full" />
                      <span className="relative px-5 py-2 text-white rounded-full text-[9px] font-bold uppercase tracking-[0.25em] shadow-xl backdrop-blur-md border border-white/20"
                        style={{ background: `linear-gradient(135deg, ${colors.roseGoldLight} 0%, ${colors.roseGold} 100%)` }}>
                        ★ Limited Edition
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Thumbnails */}
              {(product.image2 || product.image3) && (
                <motion.div
                  className="flex gap-4 mt-6 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {[product.image, product.image2, product.image3].filter(Boolean).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] overflow-hidden border-2 transition-all duration-300 ${(selectedImage || product.image) === img
                          ? 'border-blue-600 scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                    >
                      <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Right: Info Section */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-start">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div variants={itemVariants} className="flex items-center gap-4">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em]" style={{ color: colors.textSecondary }}>
                      {product.brand}
                    </span>
                    <div className="h-[1px] w-12" style={{ backgroundColor: colors.border }} />
                    <Ratings value={product.rating} text={`(${product.numReviews} Reviews)`} />
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-tight leading-[1.1]"
                    style={{ color: colors.textPrimary }}
                    variants={itemVariants}
                  >
                    {product.name}
                  </motion.h1>

                  <motion.div variants={itemVariants} className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-5">
                      <span className="text-3xl lg:text-[40px] font-light" style={{ color: colors.textPrimary }}>
                        ${product.price.toLocaleString()}
                      </span>

                      {product.discount > 0 && (
                        <span className="text-lg line-through font-light" style={{ color: colors.textTertiary }}>
                          ${(product.price + product.discount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-8 border-t" style={{ borderColor: colors.border }}>
                  <p className="leading-relaxed font-light text-lg" style={{ color: colors.textSecondary }}>
                    {product.description}
                  </p>
                </motion.div>

                {/* Purchase Actions */}
                <motion.div variants={itemVariants} className="space-y-6 pt-8 border-t" style={{ borderColor: colors.border }}>
                  {product.countInStock > 0 && (
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="flex items-center w-full sm:w-auto border rounded-full px-4 py-2 h-14 transition-colors duration-300 bg-white/60 backdrop-blur-md shadow-sm hover:shadow-md"
                        style={{ borderColor: colors.border }}>
                        <button
                          onClick={() => qty > 1 && setQty(qty - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors hover:shadow-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="w-12 text-center text-lg font-medium" style={{ color: colors.textPrimary }}>{qty}</span>
                        <button
                          onClick={() => qty < product.countInStock && setQty(qty + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors hover:shadow-sm"
                          style={{ color: colors.textSecondary }}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      <button
                        onClick={addToCartHandler}
                        className="w-full sm:flex-1 h-14 text-white rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-blue-600/30 active:scale-[0.98]"
                        style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)` }}
                      >
                        <FiShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Info Strip */}
                <motion.div
                  className="grid grid-cols-3 gap-3 pt-8 border-t"
                  style={{ borderColor: colors.border }}
                  variants={itemVariants}
                >
                  {[
                    { icon: <FiTruck size={16} />, label: "Nationwide", sub: "Delivery available" },
                    { icon: <FiPhone size={16} />, label: "Order via", sub: "WhatsApp / Call" },
                    { icon: <FiLayers size={16} />, label: "Custom", sub: "Orders accepted" },
                  ].map((item, i) => (
                    <div key={i} className="group flex flex-col items-center text-center border gap-3 p-5 rounded-[24px] hover:bg-white hover:shadow-lg transition-all duration-500"
                      style={{ backgroundColor: colors.surfaceHover, borderColor: colors.border }}>
                      <div className="w-10 h-10 rounded-full text-white flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundColor: colors.textPrimary }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: colors.textPrimary }}>{item.label}</h4>
                        <p className="text-[10px] mt-1" style={{ color: colors.textSecondary }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Specifications Section */}
          <div className="mt-24 pt-24 border-t relative" style={{ borderColor: colors.border }}>
            {/* Subtle background element for the whole section */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />

            <div className="flex flex-col md:flex-row gap-16 lg:gap-24 relative z-10">
              <div className="md:w-1/3 relative">
                <div className="sticky top-32">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border mb-8 shadow-sm bg-white/80 backdrop-blur-md"
                      style={{ borderColor: colors.border }}>
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-3 h-3 rounded-full bg-blue-500 animate-ping opacity-40" />
                        <span className="relative w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>
                      <span className="text-blue-700 font-extrabold tracking-[0.3em] uppercase text-[9px]">
                        Engineering
                      </span>
                    </div>

                    <h2 className="text-5xl lg:text-[64px] font-light tracking-tight mb-8 leading-[1.1]" style={{ color: colors.textPrimary }}>
                      Technical<br />
                      <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-rose-400">
                        Specifications
                      </span>
                    </h2>

                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-rose-300 rounded-full mb-8" />

                    <p className="text-base leading-relaxed max-w-sm font-light" style={{ color: colors.textSecondary }}>
                      Discover the meticulous craftsmanship and precision engineering that makes this piece a cornerstone of any high-end saloon environment. Every detail is optimized for professional performance and enduring luxury.
                    </p>
                  </motion.div>
                </div>
              </div>

              <div className="md:w-2/3">
                <motion.div
                  className="overflow-hidden rounded-[32px] border bg-white/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(236,72,153,0.04)] hover:shadow-[0_8px_40px_rgb(236,72,153,0.08)] transition-shadow duration-700 relative"
                  style={{ borderColor: colors.border }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {/* Subtle top glare effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

                  <table className="w-full text-left border-collapse relative z-10 block md:table">
                    <tbody className="block md:table-row-group">
                      {Array.from({ length: 13 }, (_, i) => i + 2).map((idx) => {
                        const nameKey = `pdName${idx === 1 ? '' : idx}`;
                        const descKey = `description${idx === 1 ? '' : idx}`;
                        if (product[nameKey]) {
                          return (
                            <tr
                              key={idx}
                              className="group border-b last:border-b-0 transition-colors duration-500 flex flex-col md:table-row"
                              style={{ borderColor: colors.border, backgroundColor: 'transparent' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceHover}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <th className="block md:table-cell py-5 md:py-8 px-6 md:px-12 align-top md:w-2/5 font-normal pb-2 md:pb-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 group-hover:scale-150 group-hover:bg-rose-400 transition-all duration-500 shadow-sm shrink-0" />
                                  <span className="text-[10px] md:text-[11px] uppercase font-bold tracking-[0.25em] transition-colors duration-500 group-hover:text-blue-700 leading-tight"
                                    style={{ color: colors.textSecondary }}>
                                    {product[nameKey]}
                                  </span>
                                </div>
                              </th>
                              <td className="block md:table-cell pt-0 md:pt-8 pb-6 md:pb-8 px-6 md:px-12 align-top">
                                <span className="text-lg md:text-xl font-light leading-relaxed tracking-tight block md:inline-block pl-5 md:pl-0" style={{ color: colors.textPrimary }}>
                                  {product[descKey]}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 pt-16 border-t" style={{ borderColor: colors.border }}>
            <div className="flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/3 space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-700 font-bold tracking-[0.25em] uppercase text-[9px]">
                    Verified Ratings
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-light tracking-tight leading-none" style={{ color: colors.textPrimary }}>Community<br />Feedback</h2>
                <div className="p-8 md:p-12 rounded-[40px] text-white space-y-6 shadow-2xl relative overflow-hidden group"
                  style={{ background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 100%)` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-6xl font-light">{product.rating.toFixed(1)}</h3>
                    <Ratings value={product.rating} text={`${product.numReviews} Total Reviews`} />
                  </div>
                  {!userInfo ? (
                    <p className="text-white/60 text-xs leading-relaxed">
                      Please <Link to="/login" className="text-white underline underline-offset-4 hover:text-white/80">login</Link> to share your review with the community.
                    </p>
                  ) : (
                    <button
                      onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full py-4 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                    >
                      Write a review
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:w-2/3 space-y-12">
                {product.reviews.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-[40px]"
                    style={{ borderColor: colors.border, backgroundColor: colors.surfaceHover }}>
                    <FiMessageSquare size={40} className="mb-4" style={{ color: colors.textTertiary }} />
                    <p className="text-sm font-medium tracking-wide" style={{ color: colors.textTertiary }}>No reviews yet for this selection</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {product.reviews.map((review, i) => (
                      <motion.div
                        key={review._id}
                        className="p-8 md:p-10 rounded-[32px] border hover:bg-white transition-all duration-500 shadow-sm"
                        style={{ backgroundColor: colors.surfaceHover, borderColor: colors.border }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-4 items-center">
                            {review.user?.profileImage ? (
                              <img
                                src={review.user.profileImage}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-md"
                                style={{ backgroundColor: colors.textPrimary }}>
                                {review.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-bold" style={{ color: colors.textPrimary }}>{review.name}</h4>
                              <p className="text-xs mt-0.5" style={{ color: colors.textTertiary }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Ratings value={review.rating} text="" />
                        </div>
                        <p className="leading-relaxed font-light italic mt-4" style={{ color: colors.textSecondary }}>
                          "{review.comment}"
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {userInfo && (
                  <div id="review-form" className="pt-12">
                    <div className="p-8 md:p-12 rounded-[32px] border space-y-8 transition-colors duration-500"
                      style={{ backgroundColor: colors.surfaceHover, borderColor: colors.border }}>
                      <h3 className="text-3xl font-light tracking-tight" style={{ color: colors.textPrimary }}>Share your Experience</h3>
                      <form onSubmit={submitHandler} className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.textPrimary }}>Rate this selection</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-3xl transition-transform hover:scale-125 ${star <= rating ? 'text-amber-400' : ''}`}
                                style={{ color: star > rating ? colors.border : undefined }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: colors.textPrimary }}>Your Commentary</label>
                          <textarea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-6 rounded-[24px] bg-white border transition-all outline-none resize-none font-light text-lg"
                            style={{ borderColor: colors.border, color: colors.textPrimary }}
                            placeholder="Your professional opinion matters..."
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loadingProductReview}
                          className="px-10 py-5 text-white rounded-full font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all duration-300 disabled:opacity-50 inline-flex items-center gap-3"
                          style={{ backgroundColor: colors.accent }}
                        >
                          {loadingProductReview ? "Submitting..." : "Publish Review"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;