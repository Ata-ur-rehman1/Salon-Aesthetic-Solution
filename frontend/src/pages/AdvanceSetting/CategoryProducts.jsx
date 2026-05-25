import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProductsQuery } from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
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
  FaArrowLeft,
  FaQuoteLeft,
  FaCheckCircle,
  FaChartLine,
  FaUsers,
  FaTrophy
} from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination, Navigation, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Massage1 from "./MassageSPABed1.jpg"
import Massage2 from "./MassageSPABed2.jpg"
import Massage6 from "./MassageSPABed6.jpg"
import Massage4 from "./MassageSPABed4.jpg"
import Massage3 from "./MassageSPABed3.jpg"
import Massage5 from "./MassageSPABed5.jpg"
import Chairs3 from "./Chairs3.png"
import Chairs6 from "./Chairs6.png"
import Chairs2 from "./Chairs2.png"
import Chairs1 from "./Chairs.png"
import Chairs5 from "./Chairs5.png"
import ElectronicEquipment1 from "./ElectronicEquipment1.jpg"
import ElectronicEquipment2 from "./ElectronicEquipment2.jpg"
import ElectronicEquipment3 from "./ElectronicEquipment3.jpg"
import ElectronicEquipment4 from "./ElectronicEquipment4.jpg"
import HeadWashUnit1 from "./HeadWashUnit1.jpg";
import HeadWashUnit2 from "./HeadWashUnit2.jpg";
import HeadWashUnit3 from "./HeadWashUnit3.jpg";
import HeadWashUnit6 from "./HeadWashUnit6.jpg";
import HeadWashUnit4 from "./HeadWashUnit4.jpg";
import HeadWashUnit5 from "./HeadWashUnit5.jpg";
import ManicurePedicure1 from "./MenicureandpedicureSofasetup1.webp";
import ManicurePedicure2 from "./MenicureandpedicureSofasetup2.jpg";
import ManicurePedicure5 from "./MenicureandpedicureSofasetup5.jpg";
import ManicurePedicure6 from "./MenicureandpedicureSofasetup6.jpg";
import Trolleys1 from "./Trolleys1.jpg"
import Trolleys2 from "./Trolleys2.png"
import Trolleys3 from "./Trolleys3.png"
import Trolleys4 from "./Trolleys4.png"
import Trolley6 from "./Trolleys6.png"
import Trolleys5 from "./Trolleys5.jpg"
import HydraMachines1 from "./HydraMachines1.png"
import HydraMachines2 from "./HydraMachines2.png"
import HydraMachines3 from "./HydraMachines3.png"
import HydraMachines4 from "./HydraMachines4.png"
import HydraMachines5 from "./HydraMachines5.png"
import HydraMachines6 from "./HydraMachines6.png"
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

// Spectacular Hero Section
const SpectacularHero = () => {
  const slides = [
    {
      title: "Elevate Your Salon",
      subtitle: "Experience",
      description: "Premium equipment for the modern professional",
      bgGradient: "from-blue-600 to-indigo-900"
    },
    {
      title: "Luxury Redefined",
      subtitle: "Collection",
      description: "Where elegance meets functionality",
      bgGradient: "from-cyan-600 to-blue-900"
    },
    {
      title: "Innovation",
      subtitle: "Unleashed",
      description: "Cutting-edge technology for superior results",
      bgGradient: "from-sky-500 to-indigo-800"
    }
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={{ nextEl: '.swiper-button-next-custom', prevEl: '.swiper-button-prev-custom' }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`relative h-full w-full bg-gradient-to-br ${slide.bgGradient}`}>
              {/* Animated background patterns */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-white/10 to-transparent rounded-full filter blur-2xl"></div>
              </div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")` }}></div>

              <div className="relative h-full flex items-center justify-center px-4">
                <div className="text-center max-w-5xl">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6"
                  >
                    <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium tracking-wider border border-white/30">
                      Since 2010
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="overflow-hidden"
                  >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
                      {slide.title}
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                        {slide.subtitle}
                      </span>
                    </h1>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-5 justify-center"
                  >
                    <Link to="/shop" className="group relative px-8 py-4 bg-white text-blue-900 rounded-full font-semibold text-lg overflow-hidden shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                      <span className="relative z-10 flex items-center gap-2">
                        Explore Collection
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white group-hover:scale-x-100 transition-transform duration-500 scale-x-0 origin-left"></div>
                    </Link>
                    <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white/50 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm">
                      Get Quote
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group">
        <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button className="swiper-button-next-custom absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group">
        <FaArrowRight className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>
    </div >
  );
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-full">
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
        </div>
      </div>
    </div>
  );
};

// Advanced Stats Section with Animations
const AdvancedStats = () => {
  const stats = [
    { value: 5000, label: "Happy Clients", icon: <FaUsers />, suffix: "+" },
    { value: 2500, label: "Projects Completed", icon: <FaGem />, suffix: "+" },
    { value: 98, label: "Satisfaction Rate", icon: <FaSmile />, suffix: "%" },
    { value: 15, label: "Years Excellence", icon: <FaTrophy />, suffix: "+" }
  ];

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            >
              <div className="text-4xl text-blue-300 mb-3 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm text-blue-200/80 tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
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

// Interactive Category Grid
const InteractiveCategories = () => {
  const categories = [
    { name: "Massage Beds", image: Massage3, items: 12, color: "blue", description: "Ultimate comfort & therapeutic luxury" },
    { name: "Salon Chairs", image: Chairs5, items: 15, color: "cyan", description: "Ergonomic design meets elegance" },
    { name: "Hydra Machines", image: HydraMachines1, items: 8, color: "indigo", description: "Advanced skincare technology" },
    { name: "Head Wash Units", image: HeadWashUnit4, items: 10, color: "sky", description: "Relaxing wash experience" },
    { name: "Manicure Stations", image: ManicurePedicure1, items: 7, color: "blue", description: "Precision & style combined" },
    { name: "Trolleys", image: Trolleys5, items: 6, color: "cyan", description: "Mobile organization solutions" }
  ];

  return (
    <div className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              Browse Categories
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Explore Our Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Discover premium equipment tailored for every salon need
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link to={`/shop?category=${cat.name.toLowerCase().replace(' ', '-')}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-sm mb-3">{cat.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {cat.items} Products
                    </span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Shop Now <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 border-2 border-${cat.color}-400/0 rounded-2xl group-hover:border-${cat.color}-400/50 transition-all duration-500 pointer-events-none`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Product Card with 3D Tilt
const EnhancedProductCard = ({ product, collectionTitle, index }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * 10, y: x * 10 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">
          <Link to={product.route}>
            <img
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              src={product.imageUrl}
              alt={product.title}
              loading={index < 4 ? "eager" : "lazy"}
            />
          </Link>

          {/* Quick action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors">
              <FaHeart />
            </button>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
            <Link to={product.route} className="px-4 py-2 bg-white rounded-full text-blue-600 text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
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
              <span className="text-xs text-gray-600">4.8</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">
            Premium {collectionTitle}
          </h3>

          <p className="text-gray-400 text-xs mb-3 line-clamp-2">
            Professional grade equipment with premium finish and ergonomic design
          </p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xs text-gray-400">Starting from</span>
              <div className="text-lg font-bold text-gray-900">
                Rs. {(25000 + (product.id * 1234) % 50000).toLocaleString()}
              </div>
            </div>
            <Link to={product.route} className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
              Shop <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Dynamic Collection Section
const DynamicCollection = ({ title, collectionKey, products }) => {
  const formattedTitle = collectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, arrows: false } },
      { breakpoint: 640, settings: { slidesToShow: 1, arrows: false } }
    ]
  };

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
          </div>
          <motion.div
            className="mt-4 md:mt-0"
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to={`/shop?category=${collectionKey}`} className="group inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium">
              View All
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <Slider {...sliderSettings}>
          {products.map((product, idx) => (
            <div key={`${collectionKey}-${product.id}`} className="px-2">
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

// Testimonial Section
const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Salon Owner, Luxe Studio",
      quote: "The quality of equipment from SalonPro is unmatched. Our client satisfaction has increased significantly since upgrading.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "Spa Director, Serenity Spa",
      quote: "Professional support and premium products. The hydra machines are game-changers for our facial treatments.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Emma Williams",
      role: "Salon Consultant",
      quote: "I recommend SalonPro to all my clients. Their range is comprehensive and the quality is consistently excellent.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">
              Testimonials
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Trusted by salon professionals worldwide
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <FaQuoteLeft className="absolute top-6 right-6 text-4xl text-blue-100" />

              <div className="flex items-center gap-4 mb-6">
                <img src={test.image} alt={test.name} className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">{test.name}</h4>
                  <p className="text-sm text-gray-500">{test.role}</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">"{test.quote}"</p>

              <div className="flex gap-1">
                {[...Array(test.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Powerful CTA Banner
const PowerfulCTA = () => {
  return (
    <div className="relative py-24 md:py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")` }}></div>
      </div>

      <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Salon Experience?</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
        >
          Get expert consultation and exclusive deals tailored for your salon's needs
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <Link to="/contact" className="group px-8 py-4 bg-white text-blue-900 rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center gap-2 justify-center">
            Get Free Consultation
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/shop" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
            Browse Collection
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-center gap-6 text-sm text-blue-200"
        >
          <span className="flex items-center gap-2"><FaCheckCircle /> Free Shipping</span>
          <span className="flex items-center gap-2"><FaCheckCircle /> 1 Year Warranty</span>
          <span className="flex items-center gap-2"><FaCheckCircle /> Expert Support</span>
        </motion.div>
      </div>
    </div >
  );
};

const CategoryProducts = () => {
  const { keyword } = useParams();
  const { isLoading, isError, error } = useGetProductsQuery({ keyword });
  const dispatch = useDispatch();
  const categoriesQuery = useFetchCategoriesQuery();

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  const salonEquipmentCollections = {
    chairs: [
      { id: 1, imageUrl: Chairs5, route: "/chairs" },
      { id: 2, imageUrl: Chairs3, route: "/chairs" },
      { id: 3, imageUrl: Chairs6, route: "/chairs" },
      { id: 4, imageUrl: Chairs2, route: "/chairs" },
      { id: 5, imageUrl: Chairs1, route: "/chairs" },
    ],
    massageBeds: [
      { id: 7, imageUrl: Massage3, route: "/massage-bed" },
      { id: 8, imageUrl: Massage5, route: "/massage-bed" },
      { id: 6, imageUrl: Massage1, route: "/massage-bed" },
      { id: 5, imageUrl: Massage2, route: "/massage-bed" },
      { id: 9, imageUrl: Massage4, route: "/massage-bed" },
    ],
    headWashUnits: [
      { id: 9, imageUrl: HeadWashUnit2, route: "/head-wash-unit" },
      { id: 10, imageUrl: HeadWashUnit4, route: "/head-wash-unit" },
      { id: 11, imageUrl: HeadWashUnit5, route: "/head-wash-unit" },
      { id: 12, imageUrl: HeadWashUnit3, route: "/head-wash-unit" },
      { id: 13, imageUrl: HeadWashUnit6, route: "/head-wash-unit" },
    ],
    manicurePedicure: [
      { id: 23, imageUrl: ManicurePedicure1, route: "/menicure-pedicure" },
      { id: 24, imageUrl: ManicurePedicure2, route: "/menicure-pedicure" },
      { id: 25, imageUrl: ManicurePedicure6, route: "/menicure-pedicure" },
      { id: 26, imageUrl: ManicurePedicure5, route: "/menicure-pedicure" },
    ],
    trolleys: [
      { id: 31, imageUrl: Trolleys5, route: "/trolleys" },
      { id: 32, imageUrl: Trolleys2, route: "/trolleys" },
      { id: 33, imageUrl: Trolleys4, route: "/trolleys" },
      { id: 34, imageUrl: Trolleys1, route: "/trolleys" },
      { id: 35, imageUrl: Trolleys3, route: "/trolleys" },
    ],
    hydraMachines: [
      { id: 41, imageUrl: HydraMachines1, route: "/hydra-machines" },
      { id: 42, imageUrl: HydraMachines2, route: "/hydra-machines" },
      { id: 43, imageUrl: HydraMachines4, route: "/hydra-machines" },
      { id: 44, imageUrl: HydraMachines5, route: "/hydra-machines" },
    ],
    electronicEquipment: [
      { id: 51, imageUrl: ElectronicEquipment1, route: "/electronic-equipment" },
      { id: 52, imageUrl: ElectronicEquipment2, route: "/electronic-equipment" },
      { id: 53, imageUrl: ElectronicEquipment3, route: "/electronic-equipment" },
      { id: 54, imageUrl: ElectronicEquipment4, route: "/electronic-equipment" },
    ],
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Meta
        title="SalonPro | Premium Salon Equipment & Furniture"
        description="Discover world-class salon equipment, massage beds, hydra machines, and professional furniture for modern salons and spas."
      />

      <div className="w-full bg-white">
        <div className="w-full min-h-[400px] md:min-h-[600px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1)_0%,transparent_100%)] opacity-70 pointer-events-none" />
          <ProductCarousel />
        </div>
      </div>
      {/* Premium Features */}
      <PremiumFeatures />

      {/* Advanced Stats */}
      <AdvancedStats />

      {/* Interactive Categories */}
      <InteractiveCategories />

      {/* Products Collections */}
      <main className="bg-white">
        <div className="max-w-7xl mx-auto">
          {Object.entries(salonEquipmentCollections).map(([key, products]) => (
            <DynamicCollection
              key={key}
              collectionKey={key}
              products={products}
            />
          ))}
        </div>
      </main>

      {/* Testimonials */}
      <Testimonials />

      {/* Powerful CTA */}
      <PowerfulCTA />

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