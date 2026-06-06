import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAllProductsQuery } from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useGetTotalOrdersQuery } from "../../redux/api/orderApiSlice";
import { setCategories } from "../../redux/features/shop/shopSlice";
import {
  FaChevronRight,
  FaStar,
  FaHeart,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaClock,
  FaCrown,
  FaGem,
  FaLeaf,
  FaAward,
  FaRuler,
  FaSmile,
  FaMicrophone,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaTrophy
} from "react-icons/fa";
import ProductCarousel from "../Products/ProductCarousel.jsx";
import { NextArrow, PrevArrow } from "../Products/CustomArrows.jsx";
import Meta from "../../components/Meta.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const increment = value / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={countRef}>{count}+</span>;
};



// Premium Features Showcase
const PremiumFeatures = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Premium Quality",
      desc: "Engineered with precision using the finest materials for unparalleled durability and performance.",
      stat: "ISO 9001",
      color: "blue"
    },
    {
      icon: <FaClock />,
      title: "24/7 Expert Support",
      desc: "Round-the-clock professional assistance and technical support for seamless operations.",
      stat: "Instant Response",
      color: "cyan"
    },
    {
      icon: <FaCrown />,
      title: "Industry Leader",
      desc: "Trusted by 5000+ premium salons worldwide for our innovative solutions and excellence.",
      stat: "Global Presence",
      color: "indigo"
    }
  ];

  return (
    <div className="relative py-28 md:py-40 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-cyan-100 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-5">
              <FaGem className="text-xs" />
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">SalonPro</span> Advantage
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Discover what makes us the preferred choice for salon professionals worldwide
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="group relative"
              variants={{
                hidden: { opacity: 0, y: 40 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 18 } }
              }}
              whileHover={{ y: -12, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full transition-all duration-300">
                {/* Animated gradient border */}
                <div className={`absolute inset-0 bg-gradient-to-r from-${f.color}-400 to-${f.color}-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                <div className="p-8 md:p-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${f.color}-500 to-${f.color}-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-2xl text-white">{f.icon}</div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-6">{f.desc}</p>

                  <div className="flex items-center gap-2 text-sm">
                    <FaCheckCircle className={`text-${f.color}-500`} />
                    <span className="text-gray-600">{f.stat}</span>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-gray-50 to-transparent rounded-tl-2xl"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Advanced Stats Section with Animations
const AdvancedStats = ({ stats, loading }) => {
  return (
    <div className="relative py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* Particle background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {loading ? (
          <div className="py-20 text-center text-white">
            <p className="text-lg">Loading live stats...</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 18 } }
                }}
                className="relative group p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg"
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Light reflection glow on card */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="text-4xl text-blue-300 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-serif">
                  {typeof stat.value === "number" ? (
                    <AnimatedCounter value={stat.value} />
                  ) : (
                    stat.value
                  )}
                  {stat.suffix}
                </div>
                <div className="text-xs text-blue-200/80 tracking-wide uppercase font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};



// Enhanced Product Card with 3D Tilt & Glow
const EnhancedProductCard = ({ product, collectionTitle, index }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [showGlow, setShowGlow] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * 8, y: x * 8 });
    
    // Calculate glow position
    const glowX = e.clientX - rect.left;
    const glowY = e.clientY - rect.top;
    setGlowPos({ x: glowX, y: glowY });
    setShowGlow(true);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShowGlow(false);
  };

  // Resolve properties for both real-time database products and mock products
  const route = product.route || `/product/${product._id}`;
  const imageUrl = product.image || product.imageUrl;
  const name = product.name || `Premium ${collectionTitle}`;
  const description = product.description || "Professional grade equipment with premium finish and ergonomic design";
  const price = product.price || (25000 + (product.id * 1234) % 50000);
  const rating = (product.rating !== undefined && product.rating !== null) ? product.rating : 4.8;

  return (
    <motion.div
      ref={cardRef}
      className="group relative rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100, damping: 20 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
        {/* Cursor following interactive glow */}
        {showGlow && (
          <div
            className="absolute pointer-events-none rounded-2xl opacity-40 transition-opacity duration-300 mix-blend-screen"
            style={{
              inset: 0,
              background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(37, 99, 235, 0.15), transparent 85%)`,
              zIndex: 1
            }}
          />
        )}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">
          <Link to={route}>
            <img
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              src={imageUrl}
              alt={name}
              loading={index < 4 ? "eager" : "lazy"}
            />
          </Link>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
            <Link to={route} className="px-4 py-2 bg-white rounded-full text-blue-600 text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              Quick View
            </Link>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {collectionTitle}
            </span>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs text-gray-600">{rating}</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-1 line-clamp-1" title={name}>
            {name}
          </h3>

          <p className="text-gray-400 text-xs mb-3 line-clamp-2" title={description}>
            {description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xs text-gray-400">Starting from</span>
              <div className="text-lg font-bold text-gray-900">
                ${price.toLocaleString()}
              </div>
            </div>
            <Link to={route} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              Shop <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Dynamic Collection Section - UPDATED with product limit (max 7 products)
const DynamicCollection = ({ title, collectionKey, products }) => {
  const formattedTitle = collectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  // Limit products to maximum 7 (less than 8)
  const limitedProducts = products.slice(0, 7);

  const sliderSettings = {
    dots: true,
    infinite: limitedProducts.length > 4,
    speed: 800,
    slidesToShow: Math.min(4, limitedProducts.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: Math.min(3, limitedProducts.length) } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, limitedProducts.length), arrows: false } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } }
    ]
  };

  // Don't render if no products
  if (limitedProducts.length === 0) return null;

  return (
    <motion.section
      className="py-20 md:py-28 border-b border-gray-100 last:border-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-3"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
            >
              <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Collection</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {formattedTitle}
            </motion.h2>
            {products.length > 7 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {limitedProducts.length} of {products.length} products
              </p>
            )}
          </div>
          <motion.div
            className="mt-4 md:mt-0"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to={`/${collectionKey}`} className="group inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
              View All
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <Slider {...sliderSettings}>
          {limitedProducts.map((product, idx) => (
            <div key={`${collectionKey}-${product.id || product._id}`} className="px-2">
              <EnhancedProductCard
                product={product}
                collectionTitle={formattedTitle}
                index={idx}
              />
            </div>
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};





const CategoryProducts = () => {
  const { data: realTimeProducts, isLoading: productsLoading } = useAllProductsQuery();
  const { data: totalOrdersData, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const dispatch = useDispatch();
  const categoriesQuery = useFetchCategoriesQuery();

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Helper to extract category name from a product
  const getProductCategoryName = (product, categoriesList) => {
    if (!product.category) return "";
    if (typeof product.category === "object" && product.category.name) {
      return product.category.name.toLowerCase();
    }
    const categoryId = product.category.toString();
    const matchedCat = categoriesList?.find(c => c._id.toString() === categoryId);
    return matchedCat ? matchedCat.name.toLowerCase() : "";
  };

  // Group real-time database products dynamically
  const groupedRealTimeProducts = {
    chairs: [],
    massageBeds: [],
    headWashUnits: [],
    manicurePedicure: [],
    trolleys: [],
    hydraMachines: [],
    electronicEquipment: []
  };

  if (realTimeProducts) {
    realTimeProducts.forEach(product => {
      const catName = getProductCategoryName(product, categoriesQuery.data);
      const prodName = product.name ? product.name.toLowerCase() : "";

      if (catName.includes("massage") || catName.includes("bed") || prodName.includes("massage") || prodName.includes("bed")) {
        groupedRealTimeProducts.massageBeds.push(product);
      } else if (catName.includes("chair") || catName.includes("stool") || catName.includes("seat") || prodName.includes("chair") || prodName.includes("stool")) {
        groupedRealTimeProducts.chairs.push(product);
      } else if (catName.includes("hydra") || catName.includes("facial") || catName.includes("machine") || prodName.includes("hydra") || prodName.includes("machine")) {
        groupedRealTimeProducts.hydraMachines.push(product);
      } else if (catName.includes("head") || catName.includes("wash") || catName.includes("shampoo") || prodName.includes("head wash") || prodName.includes("shampoo")) {
        groupedRealTimeProducts.headWashUnits.push(product);
      } else if (catName.includes("manicure") || catName.includes("pedicure") || catName.includes("nail") || catName.includes("sofa") || prodName.includes("manicure") || prodName.includes("pedicure") || prodName.includes("nail")) {
        groupedRealTimeProducts.manicurePedicure.push(product);
      } else if (catName.includes("trolley") || catName.includes("cart") || prodName.includes("trolley") || prodName.includes("cart")) {
        groupedRealTimeProducts.trolleys.push(product);
      } else if (catName.includes("electronic") || catName.includes("appliance") || catName.includes("steamer") || prodName.includes("electronic") || prodName.includes("steamer")) {
        groupedRealTimeProducts.electronicEquipment.push(product);
      }
    });
  }

  const totalOrders = totalOrdersData?.totalOrders ?? 0;
  const totalProducts = realTimeProducts?.length ?? 0;
  const totalCategories = categoriesQuery.data?.length ?? 0;
  const averageRating = totalProducts
    ? (realTimeProducts.reduce((sum, product) => sum + (product.rating ?? 0), 0) / totalProducts).toFixed(1)
    : 0;

  const stats = [
    { value: totalOrders, label: "Orders Completed", icon: <FaUsers />, suffix: "" },
    { value: totalProducts, label: "Products Available", icon: <FaGem />, suffix: "" },
    { value: averageRating ? `${averageRating}/5` : "N/A", label: "Avg Rating", icon: <FaSmile />, suffix: "" },
    { value: totalCategories, label: "Categories", icon: <FaTrophy />, suffix: "" },
  ];

  const statsLoading = productsLoading || categoriesQuery.isLoading || ordersLoading;

  // Map real-time products with their category routes
  const mapWithRoute = (realProducts, categoryRoute) =>
    (realProducts || []).map(p => ({ ...p, route: categoryRoute }));

  const salonEquipmentCollections = {
    chairs: mapWithRoute(groupedRealTimeProducts.chairs, "/chairs"),
    massageBeds: mapWithRoute(groupedRealTimeProducts.massageBeds, "/massage-bed"),
    headWashUnits: mapWithRoute(groupedRealTimeProducts.headWashUnits, "/head-wash-unit"),
    manicurePedicure: mapWithRoute(groupedRealTimeProducts.manicurePedicure, "/menicure-pedicure"),
    trolleys: mapWithRoute(groupedRealTimeProducts.trolleys, "/trolleys"),
    hydraMachines: mapWithRoute(groupedRealTimeProducts.hydraMachines, "/hydra-machines"),
    electronicEquipment: mapWithRoute(groupedRealTimeProducts.electronicEquipment, "/electronic-equipment"),
  };

  // Only render collections that have at least one real product
  const activeCollections = Object.fromEntries(
    Object.entries(salonEquipmentCollections).filter(([, products]) => products.length > 0)
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Meta
        title="SalonPro | Premium Salon Equipment & Furniture"
        description="Discover world-class salon equipment, massage beds, hydra machines, and professional furniture for modern salons and spas."
      />

      {/* Product Carousel */}
      <div className="w-full bg-white">
        <div className="w-full min-h-[400px] md:min-h-[600px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1)_0%,transparent_100%)] opacity-70 pointer-events-none" />
          <ProductCarousel />
        </div>
      </div>

      {/* Premium Features */}
      <PremiumFeatures />

      {/* Advanced Stats */}
      <AdvancedStats stats={stats} loading={statsLoading} />

      {/* Products Collections from Database */}
      <main className="bg-white">
        <div className="max-w-7xl mx-auto">
          {productsLoading ? (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-lg">Loading products...</p>
            </div>
          ) : Object.keys(activeCollections).length > 0 ? (
            Object.entries(activeCollections).map(([key, products]) => (
              <DynamicCollection
                key={key}
                collectionKey={key}
                products={products}
              />
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add required styles for animations */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5 !important;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: white !important;
        }
      `}</style>
    </div>
  );
};

export default CategoryProducts;