import { useGetUserDetailsQuery } from "../../redux/api/usersApiSlice";
import {
  FiUser,
  FiX,
  FiMenu,
  FiShoppingCart,
  FiSearch,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";

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

// Custom hook for cart items count
const useCartItemsCount = () => {
  return useSelector((state) =>
    state.cart?.cartItems?.reduce((total, item) => total + (item.qty || 0), 0) || 0
  );
};

// Enhanced Cart Icon Component
const CartIconWithBadge = memo(({ size = 20 }) => {
  const totalItems = useCartItemsCount();

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <FiShoppingCart size={size} style={{ color: colors.textPrimary }} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 text-white text-[8px] font-medium rounded-full w-4 h-4 flex items-center justify-center"
            style={{ backgroundColor: colors.accent }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {totalItems > 9 ? "9+" : totalItems}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

import Logo1 from "./logo.png"

const SaloonLogo = () => (
  <Link to="/" className="flex items-center">
    <motion.div
      className="font-serif font-bold"
      style={{ color: colors.textPrimary }}
      whileHover={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <img
        src={Logo1}
        alt="Saloon Logo"
        className="h-8 sm:h-12 md:h-16 lg:h-20 w-auto object-contain"
      />
    </motion.div>
  </Link>
);

const Navigation = () => {
  const location = useLocation();
  const { data: products } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem("searchHistory");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });
  const [suggestions, setSuggestions] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

  // Auto-close all menus on route change (when clicking any page link)
  useEffect(() => {
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchModalOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const { data: user } = useGetUserDetailsQuery("profile");
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const cartItemCount = useCartItemsCount();

  // Animation variants
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

  const mobileMenuVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  // Refs
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const userSectionRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const searchModalRef = useRef(null);

  // Saloon Equipment Categories
  const saloonCategories = [
    { name: "Chairs", link: "/chairs" },
    { name: "Massage Bed", link: "/massage-bed" },
    { name: "Head wash unit", link: "/head-wash-unit" },
    { name: "Menicure and Pedicure", link: "/menicure-pedicure" },
    { name: "Trolleys", link: "/trolleys" },
    { name: "Hydra Machines", link: "/hydra-machines" },
    { name: "Electronic Equipment", link: "/electronic-equipment" },
  ];

  // Admin menu items for saloon
  const adminItems = [
    { label: "Category", path: "/admin/category-list" },
    { label: "Products", path: "/admin/product-list" },
    { label: "All Products", path: "/admin/all-products-list" },
    { label: "Order List", path: "/admin/order-list" },
    { label: "Your Order", path: "/user-orders" },
  ];

  // Responsive state
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search history management
  const saveSearchHistory = useCallback(
    debounce((history) => {
      try {
        localStorage.setItem("searchHistory", JSON.stringify(history));
      } catch (error) {
        console.error("Error saving search history:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    saveSearchHistory(searchHistory);
    return () => saveSearchHistory.cancel?.();
  }, [searchHistory, saveSearchHistory]);

  // Filter suggestions
  const filterSuggestions = useCallback(
    debounce((term, products, history) => {
      if (term.trim() === "") {
        setFilteredHistory(history);
        setSuggestions([]);
      } else {
        const lower = term.toLowerCase();
        const historyMatch = Array.isArray(history)
          ? history.filter((h) => h?.toLowerCase().includes(lower))
          : [];

        const productMatch = Array.isArray(products)
          ? products.filter((p) => p?.name?.toLowerCase().includes(lower))
          : [];

        setFilteredHistory(historyMatch);
        setSuggestions(productMatch);
      }
    }, 200),
    []
  );

  useEffect(() => {
    filterSuggestions(searchTerm, products?.products || products, searchHistory);
    return () => filterSuggestions.cancel?.();
  }, [searchTerm, products, searchHistory, filterSuggestions]);

  // Handler functions
  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const closeSearchModal = useCallback(() => {
    setIsSearchModalOpen(false);
    setSearchTerm("");
    setShowDropdown(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const handleMobileNavigation = useCallback((link, categoryName) => {
    navigate(link);
    setActiveCategory(categoryName);
    closeMobileMenu();
    closeSearchModal();
    setShowDropdown(false);
  }, [navigate, closeMobileMenu, closeSearchModal]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchModalRef.current &&
        !searchModalRef.current.contains(e.target) &&
        !e.target.closest('[data-search-button]')) {
        closeSearchModal();
      }

      if (userSectionRef.current &&
        !userSectionRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }

      if (isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(e.target)) {
        closeMobileMenu();
      }

      if (dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        isSearchModalOpen) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen, isSearchModalOpen, closeMobileMenu, closeSearchModal]);

  // Search handlers
  const handleSearch = useCallback(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    const newHistory = [
      trimmed,
      ...searchHistory.filter((h) => h !== trimmed),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    navigate(`/search-input-page?searchTerm=${encodeURIComponent(trimmed)}`);
    setSearchTerm("");
    setShowDropdown(false);
    closeSearchModal();
    closeMobileMenu();
  }, [searchTerm, searchHistory, navigate, closeSearchModal, closeMobileMenu]);

  const handleSuggestionClick = useCallback((name) => {
    if (!name) return;
    navigate(`/search-input-page?searchTerm=${encodeURIComponent(name)}`);
    setSearchTerm("");
    setShowDropdown(false);
    closeSearchModal();
    closeMobileMenu();
  }, [navigate, closeSearchModal, closeMobileMenu]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() && !showDropdown) {
      setShowDropdown(true);
    }
  }, [showDropdown]);

  const handleInputFocus = useCallback(() => {
    setShowDropdown(true);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      closeMobileMenu();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // User Dropdown Component
  const UserDropdown = () => (
    <motion.div
      className="absolute right-0 mt-2 z-50 w-56 border bg-white"
      style={{ borderColor: colors.border }}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: colors.border }}>
            <img
              src={userInfo?.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          </div>
          <div>
            <h3 className="text-sm font-light tracking-tight" style={{ color: colors.textPrimary }}>{userInfo.username}</h3>
            <p className="text-[10px] font-light tracking-wide text-gray-500">{userInfo.email}</p>
          </div>
        </div>

        <div className="space-y-1 border-t pt-3" style={{ borderColor: colors.border }}>
          <Link
            to="/profile"
            className="flex items-center gap-2 p-2 text-[11px] uppercase tracking-widest font-medium hover:bg-gray-50"
            style={{ color: colors.textPrimary }}
            onClick={() => setDropdownOpen(false)}
          >
            <FiUser size={14} />
            <span>Profile</span>
          </Link>

          {userInfo.isAdmin && (
            <>
              <div className="text-[9px] uppercase tracking-[0.3em] px-2 py-2 mt-2 font-bold opacity-40" style={{ color: colors.textSecondary }}>
                Management
              </div>
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 p-2 text-[11px] uppercase tracking-widest font-medium hover:bg-gray-50"
                  style={{ color: colors.textPrimary }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiChevronRight size={10} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </>
          )}

          <motion.button
            onClick={logoutHandler}
            className="flex items-center gap-2 p-2 text-[11px] uppercase tracking-widest font-bold w-full text-left hover:bg-gray-50 mt-2 border-t"
            style={{ color: colors.textPrimary, borderColor: colors.border }}
            whileHover={{ x: 4 }}
          >
            <FiLogOut size={14} />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Render categories for desktop/tablet
  const renderCategories = () => {
    if (isMobile) return null;

    const categoriesToShow = isTablet
      ? saloonCategories.slice(0, 5)
      : saloonCategories;

    return (
      <motion.div
        className="flex items-center justify-center gap-1 mx-auto overflow-x-auto hide-scrollbar w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categoriesToShow.map((category, index) => {
          const isActive = activeCategory === category.name;

          return (
            <Link
              to={category.link}
              key={category.name}
              className="flex-shrink-0"
            >
              <motion.div
                className="relative px-2 md:px-3 py-1.5"
                variants={itemVariants}
                whileHover={{ y: -2 }}
              >
                <motion.span
                  className={`text-[8px] md:text-[9px] lg:text-[14px] font-medium whitespace-nowrap`}
                  style={{ color: isActive ? colors.accent : colors.textSecondary }}
                  animate={{ color: isActive ? colors.accent : colors.textSecondary }}
                  transition={{ duration: 0.2 }}
                >
                  {category.name}
                </motion.span>

                {/* Active Underline */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: colors.accent }}
                    layoutId="activeCategory"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    );
  };

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-[35px] left-0 right-0 h-[50px] md:h-[90px] z-40 w-full border-b bg-white"
      style={{ borderColor: colors.border }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 30 }}
    >
      <div className="w-full px-4 md:px-8 py-2 md:py-3">
        <motion.div
          className="flex items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo Section */}
          <motion.div
            className="flex items-center flex-shrink-0"
            variants={itemVariants}
          >
            <SaloonLogo />
          </motion.div>

          {/* Center Section: Categories */}
          <motion.div
            className="flex-1 mx-2 md:mx-4 overflow-hidden hidden md:block"
            variants={itemVariants}
          >
            {renderCategories()}
          </motion.div>

          {/* Right Section: Actions */}
          <motion.div
            className="flex items-center gap-2 md:gap-3 flex-shrink-0"
            variants={itemVariants}
          >
            {/* Cart Icon */}
            <motion.button
              className="relative p-1.5 md:p-2"
              onClick={() => navigate("/cart")}
              aria-label="Cart"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CartIconWithBadge size={isMobile ? 18 : 20} />
            </motion.button>

            {/* Search Button */}
            {!isSearchModalOpen && (
              <motion.button
                onClick={openSearchModal}
                className="p-1.5 md:p-2 border"
                style={{ borderColor: colors.border }}
                data-search-button="true"
                aria-label="Search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSearch size={isMobile ? 16 : 20} style={{ color: colors.textPrimary }} />
              </motion.button>
            )}

            {/* User Section */}
            <motion.div
              ref={userSectionRef}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              {userInfo ? (
                <>
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center focus:outline-none"
                    aria-label="User menu"
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border"
                      style={{ borderColor: colors.border }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={user?.profileImage || "/default-avatar.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && <UserDropdown />}
                  </AnimatePresence>
                </>
              ) : (
                <motion.div
                  className="flex items-center gap-1 md:gap-2"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/login"
                      className="px-2 md:px-4 py-1.5 text-[8px] md:text-[10px] border font-bold uppercase tracking-[0.2em]"
                      style={{
                        borderColor: colors.accent,
                        color: colors.accent
                      }}
                      whileHover={{ backgroundColor: colors.accent, color: colors.background }}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/register"
                      className="px-2 md:px-4 py-1.5 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.background
                      }}
                      whileHover={{ backgroundColor: colors.background, color: colors.accent, border: `1px solid ${colors.accent}` }}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            {isMobile && !isSearchModalOpen && (
              <motion.button
                ref={mobileMenuButtonRef}
                onClick={toggleMobileMenu}
                className="p-1.5 border"
                style={{ borderColor: colors.border }}
                aria-label="Menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMenu size={16} style={{ color: colors.textPrimary }} />
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={closeSearchModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              ref={searchModalRef}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[95%] md:w-[600px] z-50 bg-white/90 backdrop-blur-xl border rounded-[2rem] overflow-hidden"
              style={{
                borderColor: colors.border,
                boxShadow: colors.ultraShadow
              }}
              initial={{ y: -50, opacity: 0, scale: 0.9, x: "-50%" }}
              animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
              exit={{ y: -50, opacity: 0, scale: 0.9, x: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center p-6 md:p-8" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <FiSearch size={24} className="mr-4" style={{ color: colors.accent }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyPress}
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent outline-none text-lg md:text-xl font-light tracking-tight"
                  style={{ color: colors.textPrimary }}
                />
                <motion.button
                  onClick={closeSearchModal}
                  className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close search"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={20} style={{ color: colors.textSecondary }} />
                </motion.button>
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showDropdown && (filteredHistory.length > 0 || suggestions.length > 0) && (
                  <motion.div
                    ref={dropdownRef}
                    className="max-h-[60vh] overflow-y-auto bg-white/50 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredHistory.length > 0 && (
                      <div className="p-4 md:p-6">
                        <div className="mb-4">
                          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold opacity-30" style={{ color: colors.textPrimary }}>
                            Recent Discoveries
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filteredHistory.slice(0, 4).map((term, index) => (
                            <motion.button
                              key={index}
                              className="px-4 py-2 rounded-full border text-[10px] md:text-xs font-medium transition-all"
                              style={{ borderColor: colors.border, backgroundColor: colors.background }}
                              onClick={() => handleSuggestionClick(term)}
                              whileHover={{ scale: 1.05, borderColor: colors.accent, color: colors.accent }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {term}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestions.length > 0 && (
                      <div className="p-4 md:p-6 border-t" style={{ borderColor: colors.border }}>
                        <div className="mb-4">
                          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold opacity-30" style={{ color: colors.textPrimary }}>
                            Product Suggestions ({suggestions.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {suggestions.slice(0, 6).map((product) => (
                            <motion.div
                              key={product._id}
                              className="flex items-center gap-4 p-3 rounded-2xl border cursor-pointer transition-all"
                              style={{ borderColor: colors.border, backgroundColor: colors.background }}
                              onClick={() => handleSuggestionClick(product.name)}
                              whileHover={{ y: -2, boxShadow: colors.softShadow, borderColor: colors.accent }}
                            >
                              <div className="w-12 h-12 rounded-xl overflow-hidden border shrink-0" style={{ borderColor: colors.border }}>
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs md:text-sm font-medium text-black truncate">{product.name}</div>
                                <div className="text-[10px] text-gray-400">Rs. {product.price.toLocaleString()}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="mt-3 flex justify-end p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="px-4 md:px-6 py-2 text-[8px] md:text-xs uppercase tracking-[0.2em] font-medium"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.background,
                    opacity: !searchTerm.trim() ? 0.5 : 1
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              ref={mobileMenuRef}
              className="fixed inset-y-0 right-0 w-64 z-50 overflow-y-auto bg-white border-l"
              style={{ borderColor: colors.border }}
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <SaloonLogo />
                  <motion.button
                    onClick={closeMobileMenu}
                    className="p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiX size={16} style={{ color: colors.textPrimary }} />
                  </motion.button>
                </div>

                {/* User Info */}
                {userInfo && (
                  <div className="mb-4 p-3 border" style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: colors.border }}>
                        <img
                          src={userInfo?.profileImage || "/default-avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{userInfo.username}</div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>{userInfo.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart Quick Access */}
                <div className="mb-4">
                  <Link
                    to="/cart"
                    className="flex items-center justify-between p-3 border"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border
                    }}
                    onClick={closeMobileMenu}
                  >
                    <div className="flex items-center gap-3">
                      <FiShoppingCart size={18} style={{ color: colors.textPrimary }} />
                      <span className="text-sm" style={{ color: colors.textPrimary }}>Shopping Cart</span>
                    </div>
                    <div className="text-xs px-2 py-1" style={{
                      backgroundColor: colors.accent,
                      color: colors.background
                    }}>
                      {cartItemCount}
                    </div>
                  </Link>
                </div>

                {/* Categories */}
                <div className="mb-4">
                  <div className="text-[8px] uppercase tracking-[0.2em] mb-3 font-medium" style={{ color: colors.textSecondary }}>
                    Categories
                  </div>
                  <div className="space-y-1">
                    {saloonCategories.map((category) => {
                      const isActive = activeCategory === category.name;
                      return (
                        <motion.button
                          key={category.name}
                          onClick={() => handleMobileNavigation(category.link, category.name)}
                          className={`flex items-center justify-between w-full p-3 text-left`}
                          style={{
                            backgroundColor: isActive ? colors.surface : 'transparent'
                          }}
                          whileHover={{ backgroundColor: colors.surface }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xs" style={{ color: colors.textPrimary }}>{category.name}</span>
                          <FiChevronRight size={12} style={{ color: colors.textSecondary }} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t my-4" style={{ borderColor: colors.border }} />

                {/* Menu Links */}
                <div className="space-y-2">
                  {userInfo ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 p-3 text-sm hover:bg-gray-50"
                        style={{ color: colors.textPrimary }}
                        onClick={closeMobileMenu}
                      >
                        <FiUser size={16} />
                        <span>Profile</span>
                      </Link>

                      {userInfo.isAdmin && (
                        <>
                          <div className="text-[8px] uppercase tracking-[0.2em] p-3 font-medium" style={{ color: colors.textSecondary }}>
                            Admin Panel
                          </div>
                          {adminItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="flex items-center gap-3 p-3 text-xs hover:bg-gray-50"
                              style={{ color: colors.textPrimary }}
                              onClick={closeMobileMenu}
                            >
                              <FiChevronRight size={12} />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </>
                      )}

                      <motion.button
                        onClick={logoutHandler}
                        className="flex items-center gap-3 p-3 text-sm w-full text-left hover:bg-gray-50"
                        style={{ color: colors.textPrimary }}
                      >
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 p-3 text-sm hover:bg-gray-50"
                        style={{ color: colors.textPrimary }}
                        onClick={closeMobileMenu}
                      >
                        <FiUser size={16} />
                        <span>Login</span>
                      </Link>

                      <Link
                        to="/register"
                        className="block p-3 text-sm text-center border"
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.background,
                          borderColor: colors.accent
                        }}
                        onClick={closeMobileMenu}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-12 md:h-14" />
    </motion.nav>
  );
};

export default memo(Navigation);