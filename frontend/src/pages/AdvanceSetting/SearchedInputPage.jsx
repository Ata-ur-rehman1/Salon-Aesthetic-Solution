import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Loader from "../../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaSlidersH, FaStar, FaShoppingCart, FaChevronRight, FaTimes } from "react-icons/fa";

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

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 30
      }
    }
  };

const SearchInputPage = () => {
  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "radial-gradient(circle at 50% 0%, #ffffff 0%, #ffffff 100%)",
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

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm");
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const dispatch = useDispatch();

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    if (products && searchTerm) {
      let filtered = products.filter((product) =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Apply sorting
      filtered = sortProducts(filtered, sortOption);

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products, sortOption]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sortProducts = (products, option) => {
    const sorted = [...products];
    switch (option) {
      case "priceLow":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceHigh":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return sorted;
    }
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Added to cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500,
    });
  };

  if (isLoading) return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loader />
    </motion.div>
  );

  if (isError) return <ErrorMessage message="Error loading products" colors={colors} />;
  if (!searchTerm) return <EmptySearchState colors={colors} />;

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

      {/* Animated Header */}
      <motion.div 
        className="bg-white border-b"
        style={{ borderColor: colors.border }}
        variants={headerVariants}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-12 py-4 md:py-6 lg:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <motion.div variants={itemVariants}>
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tighter text-black"
                style={{ letterSpacing: '-0.02em' }}
              >
                Search Results
              </motion.h1>
              <div className="flex items-center gap-2">
                <p className="text-[8px] md:text-sm" style={{ color: colors.textSecondary }}>
                  Results for:
                </p>
                <motion.span 
                  className="text-[8px] md:text-sm uppercase tracking-[0.2em] font-medium"
                  style={{ color: colors.accent }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  "{searchTerm}"
                </motion.span>
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              variants={itemVariants}
            >
              <motion.select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border text-[8px] md:text-xs px-3 md:px-4 py-2 focus:outline-none cursor-pointer"
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ec4899' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1em'
                }}
                whileHover={{ borderColor: colors.accent }}
                transition={{ duration: 0.2 }}
              >
                <option value="featured" className="text-[8px] md:text-xs">Sort by: Featured</option>
                <option value="priceLow" className="text-[8px] md:text-xs">Price: Low to High</option>
                <option value="priceHigh" className="text-[8px] md:text-xs">Price: High to Low</option>
                <option value="rating" className="text-[8px] md:text-xs">Customer Rating</option>
                <option value="newest" className="text-[8px] md:text-xs">Newest Arrivals</option>
              </motion.select>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="max-w-7xl mx-auto px-3 md:px-6 lg:px-12 py-4 md:py-8 lg:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Results Summary */}
        <motion.div
          className="p-6 md:p-10 border bg-white/60 backdrop-blur-md rounded-[2rem]"
          style={{
            borderColor: colors.border,
            boxShadow: colors.softShadow
          }}
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: colors.ultraShadow, transition: { duration: 0.3 } }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <motion.p 
              className="text-[8px] md:text-sm"
              style={{ color: colors.textSecondary }}
              variants={itemVariants}
            >
              Showing <span className="text-xs md:text-lg font-medium" style={{ color: colors.textPrimary }}>{filteredProducts.length}</span> results
              {searchTerm && (
                <> for "<span className="font-medium">{searchTerm}</span>"</>
              )}
            </motion.p>
            <motion.div 
              className="px-2 md:px-4 py-1 md:py-2 border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface
              }}
              variants={itemVariants}
            >
              <p className="text-[6px] md:text-[8px] lg:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: colors.textSecondary }}>
                Sorted by: <span style={{ color: colors.accent }}>
                  {sortOption === 'featured' ? 'Featured' :
                    sortOption === 'priceLow' ? 'Price: Low to High' :
                      sortOption === 'priceHigh' ? 'Price: High to Low' :
                        sortOption === 'rating' ? 'Customer Rating' : 'Newest'}
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-8"
          variants={containerVariants}
        >
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div 
                className="col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NoResultsFound searchTerm={searchTerm} colors={colors} />
              </motion.div>
            ) : (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={`${product._id}-${index}`}
                  product={product}
                  onAddToCart={addToCartHandler}
                  colors={colors}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Footer */}
        {filteredProducts.length > 0 && (
          <motion.div 
            className="mt-6 md:mt-12 pt-4 md:pt-8 border-t text-center"
            style={{ borderColor: colors.border }}
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[6px] md:text-[8px] lg:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: colors.textSecondary }}>
              Showing all {filteredProducts.length} premium products
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart, colors, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.08,
        type: "spring",
        stiffness: 80,
        damping: 20
      }}
      whileHover={{ 
        y: -8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      <div className="space-y-2 md:space-y-4">
        {/* Image Container */}
        <motion.div 
          className="relative aspect-[4/5] overflow-hidden bg-white border rounded-[1.5rem]"
          style={{ 
            borderColor: colors.border,
            boxShadow: isHovered ? colors.ultraShadow : colors.softShadow,
          }}
        >
          <Link to={`/product/${product._id}`} className="block h-full">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              onLoad={() => setImageLoaded(true)}
            />
          </Link>

          {/* Quick Add Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-pink-100"
                  whileHover={{ scale: 1.1, backgroundColor: colors.accent, color: "#fff" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                >
                  <FaShoppingCart className="text-lg" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>


        {/* Product Info */}
        <div className="space-y-1 md:space-y-2 px-0.5">
          <motion.div 
            className="flex flex-col gap-0.5"
            variants={itemVariants}
          >
            <span className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] font-medium" style={{ color: colors.accent }}>
              {product.brand || "Salon Premium"}
            </span>
            <Link to={`/product/${product._id}`}>
              <motion.h3 
                className="text-[8px] md:text-sm lg:text-base font-light hover:opacity-70 transition-opacity"
                style={{ color: colors.textPrimary }}
                whileHover={{ x: 2 }}
              >
                {product.name}
              </motion.h3>
            </Link>
          </motion.div>

          <motion.p 
            className="text-[7px] md:text-[10px] lg:text-xs text-black/60 font-light leading-relaxed line-clamp-2"
            variants={itemVariants}
          >
            {product.description}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 md:pt-2 border-t gap-1 md:gap-2"
            style={{ borderColor: colors.border }}
            variants={itemVariants}
          >
            <motion.span 
              className="text-[8px] md:text-sm lg:text-lg font-light"
              style={{ color: colors.textPrimary }}
              whileHover={{ scale: 1.02 }}
            >
              Rs. {product.price.toLocaleString()}
            </motion.span>

            <motion.button
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-1 text-[6px] md:text-[8px] uppercase tracking-[0.15em] font-medium border py-1.5 px-2 hover:bg-pink-600 hover:text-white transition-all hover:border-pink-600 text-pink-500 border-pink-200"
              style={{ borderColor: colors.border, color: colors.accent, backgroundColor: colors.surface }}
              whileHover={{ scale: 1.05, gap: "0.5rem" }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart className="text-[6px] md:text-[8px]" />
              Add
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const NoResultsFound = ({ searchTerm, colors }) => (
  <motion.div 
    className="border bg-white p-6 md:p-12 text-center"
    style={{
      borderColor: colors.border,
      boxShadow: `0 4px 20px ${colors.shadow}`
    }}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 80, damping: 20 }}
  >
    <div className="max-w-md mx-auto">
      <motion.div 
        className="text-3xl md:text-6xl mb-4 md:mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <FaSearch className="mx-auto" style={{ color: colors.textSecondary }} />
      </motion.div>
      <motion.h3 
        className="text-xs md:text-xl font-light mb-2 md:mb-4"
        style={{ color: colors.textPrimary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        No results found for "<span style={{ color: colors.accent }}>{searchTerm}</span>"
      </motion.h3>
      <motion.p 
        className="text-[7px] md:text-sm mb-6 md:mb-8"
        style={{ color: colors.textSecondary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Try checking your spelling or use more general terms
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <Link
          to="/shop"
          className="inline-block px-4 md:px-8 py-2 md:py-3 text-[7px] md:text-xs uppercase tracking-[0.2em] font-medium border hover:bg-pink-600 hover:text-white transition-all hover:border-pink-600 text-pink-500 border-pink-200 shadow-sm"
          style={{
            borderColor: colors.border,
            color: colors.accent,
            backgroundColor: colors.surface
          }}
        >
          Browse All Products
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

const EmptySearchState = ({ colors }) => (
  <motion.div 
    className="min-h-[60vh] flex items-center justify-center bg-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="text-center max-w-md mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-3xl md:text-6xl mb-4 md:mb-8"
        variants={itemVariants}
      >
        <FaSearch className="mx-auto" style={{ color: colors.textSecondary }} />
      </motion.div>
      <motion.h1 
        className="text-sm md:text-2xl font-light mb-2 md:mb-4"
        style={{ color: colors.textPrimary }}
        variants={itemVariants}
      >
        Start Your Search Journey
      </motion.h1>
      <motion.p 
        className="text-[7px] md:text-sm mb-6 md:mb-8"
        style={{ color: colors.textSecondary }}
        variants={itemVariants}
      >
        Enter a product name, brand, or category in the search bar to discover amazing products
      </motion.p>
      <motion.div variants={itemVariants}>
        <Link
          to="/shop"
          className="inline-block px-4 md:px-8 py-2 md:py-3 text-[7px] md:text-xs uppercase tracking-[0.2em] font-medium border hover:bg-pink-600 hover:text-white transition-all hover:border-pink-600 text-pink-500 border-pink-200 shadow-sm"
          style={{
            borderColor: colors.border,
            color: colors.accent,
            backgroundColor: colors.surface
          }}
        >
          Explore Products
        </Link>
      </motion.div>
    </motion.div>
  </motion.div>
);

const ErrorMessage = ({ message, colors }) => (
  <motion.div 
    className="min-h-[60vh] flex items-center justify-center bg-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="text-center max-w-md mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-3xl md:text-6xl mb-4 md:mb-8"
        variants={itemVariants}
      >
        <FaTimes className="mx-auto" style={{ color: "#ef4444" }} />
      </motion.div>
      <motion.h3 
        className="text-sm md:text-2xl font-light mb-2 md:mb-4"
        style={{ color: colors.textPrimary }}
        variants={itemVariants}
      >
        {message}
      </motion.h3>
      <motion.p 
        className="text-[7px] md:text-sm mb-6 md:mb-8"
        style={{ color: colors.textSecondary }}
        variants={itemVariants}
      >
        Please try again or contact support if the problem persists
      </motion.p>
      <motion.button
        onClick={() => window.location.reload()}
        className="inline-block px-4 md:px-8 py-2 md:py-3 text-[7px] md:text-xs uppercase tracking-[0.2em] font-medium border hover:bg-pink-600 hover:text-white transition-all hover:border-pink-600 text-pink-500 border-pink-200"
        style={{
          borderColor: colors.border,
          color: colors.accent,
          backgroundColor: colors.surface
        }}
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Retry
      </motion.button>
    </motion.div>
  </motion.div>
);

export default SearchInputPage;
