import { useGetUserDetailsQuery } from "../redux/api/usersApiSlice";
import {
  FiUser,
  FiX,
  FiMenu,
  FiShoppingCart,
  FiSearch,
  FiLogOut,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/usersApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import { useAllProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import Logo1 from "../pages/Auth/logo.png";

// ULTRA PREMIUM WHITE, GLASS & ROYAL BLUE DESIGN THEME
const colors = {
  background: "#ffffff",
  textPrimary: "#0f172a", // slate-900
  textSecondary: "#475569", // slate-600
  textTertiary: "#94a3b8", // slate-400
  accent: "#2563eb", // Premium Blue-600
  accentLight: "#eff6ff", // blue-50
  accentDeep: "#1d4ed8", // blue-700
  border: "rgba(226, 232, 240, 0.8)", // slate-200
  glassBg: "rgba(255, 255, 255, 0.80)",
  glassBorder: "rgba(255, 255, 255, 0.60)",
  shadow: "0 10px 30px -10px rgba(37, 99, 235, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.05)",
  ultraShadow: "0 30px 60px -15px rgba(37, 99, 235, 0.12), 0 15px 30px -20px rgba(0, 0, 0, 0.08)",
  surface: "#ffffff",
  surfaceHover: "#f8fafc", // slate-50
  success: "#10b981",
  error: "#ef4444"
};

// Custom hook for cart items count
const useCartItemsCount = () => {
  return useSelector((state) =>
    state.cart?.cartItems?.reduce((total, item) => total + (item.qty || 0), 0) || 0
  );
};

// Helper to map backend category name to exact page routes
const getCategoryRoute = (name) => {
  const normalized = name.toLowerCase().trim();
  if (normalized.includes("chair")) return "/chairs";
  if (normalized.includes("massage") || normalized.includes("bed")) return "/massage-bed";
  if (normalized.includes("head wash") || normalized.includes("headwash") || normalized.includes("wash unit")) return "/head-wash-unit";
  if (normalized.includes("menicure") || normalized.includes("pedicure") || normalized.includes("manicure")) return "/menicure-pedicure";
  if (normalized.includes("trolley")) return "/trolleys";
  if (normalized.includes("steamer")) return "/steamer";
  if (normalized.includes("hydra")) return "/hydra-machines";
  if (normalized.includes("stool") || normalized.includes("bar")) return "/bar-stools";
  if (normalized.includes("electronic") || normalized.includes("electrical")) return "/electronic-equipment";

  // Dynamic fallback to the search input page with the category name
  return `/search-input-page?searchTerm=${encodeURIComponent(name)}`;
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
            className="absolute -top-2 -right-2 text-white text-[9px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center shadow-sm"
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

const SalonLogo = () => (
  <Link to="/" className="flex items-center">
    <motion.div
      className="font-serif font-bold"
      style={{ color: colors.textPrimary }}
      whileHover={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <img
        src={Logo1}
        alt="Salon Logo"
        className="h-7 sm:h-9 md:h-12 w-auto object-contain"
      />
    </motion.div>
  </Link>
);

// Stable module-level constant — must NOT be inside the component
// (inside the component it creates a new array reference every render,
//  which causes the useEffect([location.pathname, categories]) to fire
//  on every render and instantly close the dropdown)
const DEFAULT_CATEGORIES = [
  { name: "Chairs" },
  { name: "Massage Bed" },
  { name: "Head wash unit" },
  { name: "Menicure and Pedicure" },
  { name: "Trolleys" },
  { name: "Hydra Machines" },
  { name: "Steamers" },
  { name: "Bar Stools" },
  { name: "Electronic Equipment" },
];

const Navigation = ({ className }) => {
  const location = useLocation();
  const { data: products } = useAllProductsQuery();
  const { data: backendCategories, isLoading: isCategoriesLoading } = useFetchCategoriesQuery();

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


  // Resolve dynamic categories combined with fallbacks
  const categories = backendCategories && backendCategories.length > 0
    ? backendCategories
    : DEFAULT_CATEGORIES;

  // Auto-close all menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchModalOpen(false);
    setShowDropdown(false);

    // Try highlighting active category based on current pathname
    const activeCat = categories.find(cat => {
      const route = getCategoryRoute(cat.name);
      return location.pathname === route;
    });
    if (activeCat) {
      setActiveCategory(activeCat.name);
    } else {
      setActiveCategory("");
    }
  }, [location.pathname, categories]);

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
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 25
      }
    }
  };

  const mobileMenuVariants = {
    closed: { x: "100%", opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 30 } },
  };

  const mobileExitTransition = { duration: 0.15, ease: "easeOut" };

  // Refs
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const userSectionRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const searchModalRef = useRef(null);

  // Admin menu items
  const adminItems = [
    { label: "Category", path: "/admin/category-list" },
    { label: "Products", path: "/admin/product-list" },
    { label: "All Products", path: "/admin/all-products-list" },
    { label: "Order List", path: "/admin/order-list" },
    { label: "Your Order", path: "/user-orders" },
  ];

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

  // Filter search suggestions
  const filterSuggestions = useCallback(
    debounce((term, productsData, history) => {
      if (term.trim() === "") {
        setFilteredHistory(history);
        setSuggestions([]);
      } else {
        const lower = term.toLowerCase();
        const historyMatch = Array.isArray(history)
          ? history.filter((h) => h?.toLowerCase().includes(lower))
          : [];

        const prodList = productsData?.products || productsData;
        const productMatch = Array.isArray(prodList)
          ? prodList.filter((p) => p?.name?.toLowerCase().includes(lower))
          : [];

        setFilteredHistory(historyMatch);
        setSuggestions(productMatch);
      }
    }, 200),
    []
  );

  useEffect(() => {
    filterSuggestions(searchTerm, products, searchHistory);
    return () => filterSuggestions.cancel?.();
  }, [searchTerm, products, searchHistory, filterSuggestions]);

  // Handlers
  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
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

  // Close mobile menu synchronously then navigate
  const handleMobileNavigation = useCallback((link, categoryName) => {
    flushSync(() => {
      setActiveCategory(categoryName);
      setIsMobileMenuOpen(false);
      setIsSearchModalOpen(false);
      setShowDropdown(false);
    });
    navigate(link);
  }, [navigate]);

  // Generic mobile nav (for non-category links)
  const handleMobileNav = useCallback((path) => {
    flushSync(() => {
      setIsMobileMenuOpen(false);
      setIsSearchModalOpen(false);
      setShowDropdown(false);
    });
    navigate(path);
  }, [navigate]);

  // Click outside listener
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
  }, [searchTerm, searchHistory, navigate, closeSearchModal]);

  const handleSuggestionClick = useCallback((name) => {
    if (!name) return;
    navigate(`/search-input-page?searchTerm=${encodeURIComponent(name)}`);
    setSearchTerm("");
    setShowDropdown(false);
    closeSearchModal();
  }, [navigate, closeSearchModal]);

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

  // Navigate and close dropdown — flushSync forces DOM update before navigation
  const handleDropdownNav = useCallback((path) => {
    flushSync(() => {
      setDropdownOpen(false);
    });
    navigate(path);
  }, [navigate]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`fixed left-0 right-0 h-[50px] md:h-[90px] z-[50] w-full border-b backdrop-blur-lg flex items-center ${className || ""}`}
        style={{
          backgroundColor: colors.glassBg,
          borderColor: colors.border,
          boxShadow: colors.shadow
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <div className="flex-shrink-0">
              <SalonLogo />
            </div>

            {/* Categories - Desktop Only */}
            <div className="hidden md:flex flex-1 items-center justify-center max-w-3xl overflow-x-auto hide-scrollbar">
              <motion.div
                className="flex items-center gap-1.5 lg:gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {categories.map((category) => {
                  const isActive = activeCategory === category.name;
                  const route = getCategoryRoute(category.name);

                  return (
                    <Link
                      to={route}
                      key={category.name}
                      className="flex-shrink-0 relative py-2"
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveCategory(category.name);
                      }}
                    >
                      <motion.div
                        className="px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                      >
                        <span
                          className="text-[10px] lg:text-[12px] xl:text-[13px] font-semibold uppercase tracking-wider transition-colors duration-200"
                          style={{ color: isActive ? colors.accent : colors.textSecondary }}
                        >
                          {category.name}
                        </span>

                        {/* Active Indicator Underline */}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-2 right-2 h-0.75 rounded-full"
                            style={{ backgroundColor: colors.accent }}
                            layoutId="activeTabIndicator"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">

              {/* Search Trigger */}
              <motion.button
                onClick={openSearchModal}
                className="p-2 border rounded-full hover:bg-slate-50 transition-colors"
                style={{ borderColor: colors.border }}
                data-search-button="true"
                aria-label="Search Products"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSearch size={16} className="text-slate-700" />
              </motion.button>

              {/* Cart */}
              <motion.button
                className="p-2 border rounded-full hover:bg-slate-50 transition-colors"
                style={{ borderColor: colors.border }}
                onClick={() => navigate("/cart")}
                aria-label="View Shopping Cart"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CartIconWithBadge size={16} />
              </motion.button>

              {/* User Profile / Access */}
              <div ref={userSectionRef} className="relative">
                {userInfo ? (
                  <>
                    <motion.button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center focus:outline-none"
                      aria-label="User Account"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden border bg-white flex items-center justify-center"
                        style={{ borderColor: colors.border }}
                      >
                        <img
                          src={user?.profileImage || "/default-avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          className="absolute right-0 mt-2 z-50 w-56 bg-white border rounded-2xl shadow-xl overflow-hidden"
                          style={{ borderColor: colors.border }}
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.12, ease: "easeOut" }}
                        >
                          <div className="p-4 bg-slate-50 border-b" style={{ borderColor: colors.border }}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border bg-white" style={{ borderColor: colors.border }}>
                                <img
                                  src={userInfo?.profileImage || "/default-avatar.png"}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/default-avatar.png";
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-xs font-semibold truncate text-slate-800">{userInfo.username}</h3>
                                <p className="text-[10px] text-slate-500 truncate">{userInfo.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => handleDropdownNav("/profile")}
                              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
                            >
                              <FiUser size={14} />
                              <span>Profile</span>
                            </button>

                            {userInfo.isAdmin && (
                              <>
                                <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400 px-3 pt-2 pb-1">
                                  Admin Panel
                                </div>
                                {adminItems.map((item) => (
                                  <button
                                    key={item.path}
                                    onClick={() => handleDropdownNav(item.path)}
                                    className="flex items-center gap-2.5 w-full text-left px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                  >
                                    <FiChevronRight size={12} className="opacity-50" />
                                    <span>{item.label}</span>
                                  </button>
                                ))}
                              </>
                            )}

                            <div className="border-t my-1" style={{ borderColor: colors.border }} />

                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                logoutHandler();
                              }}
                              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              <FiLogOut size={14} />
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                      to="/login"
                      className="px-3.5 py-1.5 text-[9px] sm:text-[10px] border font-bold uppercase tracking-widest rounded-full hover:shadow-sm transition-all"
                      style={{
                        borderColor: colors.accent,
                        color: colors.accent
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="hidden sm:inline-block px-3.5 py-1.5 text-[9px] sm:text-[10px] text-white font-bold uppercase tracking-widest rounded-full hover:shadow-md transition-all"
                      style={{
                        backgroundColor: colors.accent,
                      }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle button */}
              <div className="md:hidden">
                <motion.button
                  ref={mobileMenuButtonRef}
                  onClick={toggleMobileMenu}
                  className="p-2 border rounded-full hover:bg-slate-50 transition-colors"
                  style={{ borderColor: colors.border }}
                  aria-label="Toggle Mobile Menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMenu size={16} className="text-slate-700" />
                </motion.button>
              </div>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* Dynamic Search Modal Backdrop & Panel */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
              onClick={closeSearchModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              ref={searchModalRef}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-xl z-[100] bg-white border rounded-3xl shadow-2xl overflow-hidden"
              style={{
                borderColor: colors.border
              }}
              initial={{ y: -30, opacity: 0, scale: 0.95, x: "-50%" }}
              animate={{ y: 0, opacity: 1, scale: 1, x: "-50%" }}
              exit={{ y: -30, opacity: 0, scale: 0.95, x: "-50%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              {/* Search Inputs */}
              <div className="flex items-center p-5 border-b" style={{ borderColor: colors.border }}>
                <FiSearch size={20} className="mr-3" style={{ color: colors.accent }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyPress}
                  placeholder="Search premium salon equipment..."
                  className="w-full bg-transparent outline-none text-sm md:text-base font-medium text-slate-800 placeholder-slate-400"
                />
                <motion.button
                  onClick={closeSearchModal}
                  className="ml-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  aria-label="Close search panel"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX size={18} className="text-slate-500" />
                </motion.button>
              </div>

              {/* Suggestions Panel */}
              <AnimatePresence>
                {showDropdown && (filteredHistory.length > 0 || suggestions.length > 0) && (
                  <motion.div
                    ref={dropdownRef}
                    className="max-h-[50vh] overflow-y-auto bg-slate-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Recent Search History */}
                    {filteredHistory.length > 0 && (
                      <div className="p-4 border-b bg-white" style={{ borderColor: colors.border }}>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-2.5">
                          Recent Searches
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {filteredHistory.slice(0, 5).map((term, index) => (
                            <motion.button
                              key={index}
                              className="px-3.5 py-1.5 rounded-full border text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                              onClick={() => handleSuggestionClick(term)}
                              whileHover={{ y: -1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {term}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions list */}
                    {suggestions.length > 0 && (
                      <div className="p-4 bg-white">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-2.5">
                          Product Suggestions ({suggestions.length})
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestions.slice(0, 5).map((product) => (
                            <motion.div
                              key={product._id}
                              className="flex items-center gap-3 p-2 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all duration-200"
                              style={{ borderColor: colors.border }}
                              onClick={() => handleSuggestionClick(product.name)}
                              whileHover={{ x: 2 }}
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden border bg-white flex-shrink-0" style={{ borderColor: colors.border }}>
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-grow">
                                <div className="text-xs font-semibold text-slate-800 truncate">{product.name}</div>
                                <div className="text-[10px] text-slate-400">${product.price.toLocaleString()}</div>
                              </div>
                              <FiChevronRight size={14} className="text-slate-300" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action trigger footer */}
              <div className="p-3 bg-slate-50 border-t flex justify-end" style={{ borderColor: colors.border }}>
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="px-5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg text-white transition-all hover:shadow-sm"
                  style={{
                    backgroundColor: colors.accent,
                    opacity: !searchTerm.trim() ? 0.5 : 1
                  }}
                >
                  Search
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Responsive Slide-out Sidebar Drawer Menu (Mobile & Tablet) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar drawer panel */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed inset-y-0 right-0 w-72 max-w-sm z-[100] bg-white shadow-2xl flex flex-col h-full overflow-hidden"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 30 } }}
              exit={{ x: "100%", opacity: 0, transition: mobileExitTransition }}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
                <SalonLogo />
                <motion.button
                  onClick={closeMobileMenu}
                  className="p-2 border rounded-full hover:bg-slate-50 transition-colors"
                  style={{ borderColor: colors.border }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX size={16} className="text-slate-800" />
                </motion.button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">

                {/* User Info Quick View inside Mobile Drawer */}
                {userInfo && (
                  <div className="p-3.5 border rounded-2xl bg-slate-50" style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border bg-white" style={{ borderColor: colors.border }}>
                        <img
                          src={userInfo?.profileImage || "/default-avatar.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold truncate text-slate-800">{userInfo.username}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart Access */}
                <button
                  onClick={() => handleMobileNav("/cart")}
                  className="flex items-center justify-between w-full p-3 border.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  style={{
                    backgroundColor: colors.accentLight,
                    borderColor: "rgba(37, 99, 235, 0.15)"
                  }}
                >
                  <div className="flex items-center gap-3">
                    <FiShoppingCart size={16} className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Shopping Cart</span>
                  </div>
                  <div className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.accent }}>
                    {cartItemCount}
                  </div>
                </button>

                {/* Categories */}
                <div className="space-y-2">
                  <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 px-1">
                    Categories
                  </div>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const isActive = activeCategory === category.name;
                      const route = getCategoryRoute(category.name);

                      return (
                        <motion.button
                          key={category.name}
                          onClick={() => handleMobileNavigation(route, category.name)}
                          className="flex items-center justify-between w-full p-2.5 text-left rounded-xl transition-all"
                          style={{
                            backgroundColor: isActive ? colors.accentLight : "transparent"
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: isActive ? colors.accent : colors.textPrimary }}
                          >
                            {category.name}
                          </span>
                          <FiChevronRight size={14} style={{ color: isActive ? colors.accent : colors.textSecondary }} />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t my-4" style={{ borderColor: colors.border }} />

                {/* Authentication & User Panel Settings */}
                <div className="space-y-1">
                  {userInfo ? (
                    <>
                      <button
                        onClick={() => handleMobileNav("/profile")}
                        className="flex items-center gap-3 w-full text-left p-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <FiUser size={16} />
                        <span>Profile Settings</span>
                      </button>

                      {userInfo.isAdmin && (
                        <>
                          <div className="text-[9px] uppercase tracking-widest font-bold text-slate-400 px-1 pt-3 pb-1">
                            Management Controls
                          </div>
                          {adminItems.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => handleMobileNav(item.path)}
                              className="flex items-center gap-3 w-full text-left p-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              <FiChevronRight size={14} className="opacity-50" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </>
                      )}

                      <button
                        onClick={() => {
                          flushSync(() => setIsMobileMenuOpen(false));
                          logoutHandler();
                        }}
                        className="flex items-center gap-3 p-2.5 w-full text-left text-xs font-bold uppercase tracking-wider text-rose-600 rounded-xl hover:bg-rose-50 transition-colors mt-4"
                      >
                        <FiLogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                      <button
                        onClick={() => handleMobileNav("/login")}
                        className="flex items-center justify-center gap-2 w-full p-3 text-xs font-bold uppercase tracking-wider border rounded-xl hover:bg-slate-50 transition-all text-center"
                        style={{
                          borderColor: colors.accent,
                          color: colors.accent
                        }}
                      >
                        <FiUser size={14} />
                        <span>Login</span>
                      </button>

                      <button
                        onClick={() => handleMobileNav("/register")}
                        className="p-3 w-full text-xs font-bold uppercase tracking-wider text-white text-center rounded-xl hover:shadow-md transition-all"
                        style={{
                          backgroundColor: colors.accent
                        }}
                      >
                        Create Account
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(Navigation);
