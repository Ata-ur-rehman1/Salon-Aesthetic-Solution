import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
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
  FaCrown
} from "react-icons/fa";
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


const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Premium Quality",
      desc: "Durable and meticulously crafted salon equipment."
    },
    {
      icon: <FaClock />,
      title: "Expert Support",
      desc: "Professional guidance for your salon setup."
    },
    {
      icon: <FaCrown />,
      title: "Industry Leader",
      desc: "Trusted by thousands of professional salons."
    }
  ];

  return (
    <div className="py-12 md:py-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Removed decorative blobs */}
      </div>
      <div className="max-w-7xl mx-auto px-2 md:px-12 relative z-10">
        <div className="grid grid-cols-3 gap-2 md:gap-16">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="group relative p-3 md:p-12 rounded-xl md:rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white hover:bg-white text-center"
              style={{
                boxShadow: "0 20px 40px rgba(236, 72, 153, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.8)"
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -10 }}
            >
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-xl md:rounded-[2rem] bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/5 group-hover:to-transparent transition-all duration-700 pointer-events-none" />

              <motion.div
                className="w-8 h-8 md:w-24 md:h-24 mx-auto mb-2 md:mb-8 rounded-full bg-gradient-to-br from-pink-100 to-white flex items-center justify-center shadow-inner relative"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 rounded-full border border-pink-200/50 group-hover:scale-110 transition-transform duration-700" />
                <div className="text-sm md:text-5xl text-pink-500 drop-shadow-md">
                  {f.icon}
                </div>
              </motion.div>

              <h3 className="text-[9px] md:text-2xl font-bold tracking-tight text-gray-900 mb-1 md:mb-4 leading-tight">
                {f.title}
              </h3>
              <p className="text-[7px] md:text-base text-gray-500 leading-tight md:leading-relaxed font-light">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryProducts = () => {
  // ULTRA PREMIUM WHITE & PINK DESIGN SYSTEM WITH ROSE GOLD ACCENTS
  const colors = {
    background: "#ffffff",
    bgGradient: "linear-gradient(to bottom, #ffffff, #ffffff)",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    accent: "#ec4899", // Primary Pink
    accentLight: "#fdf2f8",
    accentDeep: "#be185d",
    roseGold: "#b76e79", // Elegant rose gold
    roseGoldLight: "#e0bfb8",
    border: "rgba(252, 231, 243, 1)",
    glass: "rgba(255, 255, 255, 0.9)",
    ultraShadow: "0 40px 80px -15px rgba(236, 72, 153, 0.2), 0 20px 40px -20px rgba(0, 0, 0, 0.1)",
    softShadow: "0 15px 35px -5px rgba(236, 72, 153, 0.12)"
  };

  const { keyword } = useParams();
  const { isLoading, isError, error } = useGetProductsQuery({ keyword });
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const categoriesQuery = useFetchCategoriesQuery();

  const categoryDescriptions = {
    chairs: "Indulge your clients in the ultimate luxury with our ergonomically designed salon chairs. Crafted from premium, stain-resistant eco-leather with high-density memory foam, these pieces offer the perfect balance of sophisticated rose gold aesthetics and long-lasting professional durability for high-end boutique environments.",
    massageBeds: "Elevate your spa treatments with our elite collection of massage beds. Each unit features multi-zone electronic adjustment, integrated heating elements, and a whispering-quiet motor system. The plush, cloud-soft upholstery ensures maximum client immersion during long therapeutic sessions and facial treatments.",
    headWashUnits: "Experience the art of the perfect hair wash with our Italian-inspired washing stations. Designed with high-back lumbar support and deep ceramic basins, these units prevent splash-back while providing a relaxing neck-contour experience. Perfect for high-traffic luxury salons that prioritize guest comfort and sleek plumbing integration.",
    manicurePedicure: "Our manicure and pedicure stations are masterpieces of efficiency and elegance. Each setup includes vibration massage functions, pipeless whirlpool technology, and adjustable LED task lighting. The compact, minimalist footprint allows for versatile salon floor planning without compromising on the deep-spa experience.",
    trolleys: "Keep your professional tools organized with our whisper-glide salon trolleys. Featuring silent silicone wheels, chemical-resistant surfaces, and modular storage compartments, these trolleys are designed for the fast-paced stylist who demands precision and a clean, clutter-free workstation aesthetic.",
    hydraMachines: "Integrate clinical-grade skincare technology into your salon with our flagship Hydra-Dermabrasion machines. These all-in-one systems offer deep exfoliation, vacuum extraction, and nutrient infusion with a user-friendly touch-screen interface, allowing you to provide state-of-the-art non-invasive facial rejuvenation.",
    electronicEquipment: "Our professional electronic suite provides the essential high-performance tools for modern styling. From digital hair processors to ultra-lightweight ionic dryers, every piece is engineered for consistent heat distribution and quiet operation, ensuring your salon remains a sanctuary of calm and professional excellence."
  };

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setIsMobile(width < 768);
        setIsTablet(width >= 768 && width < 1024);
        setIsDesktop(width >= 1024);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  const ProductCard = ({ product, index, collectionTitle, collectionKey, priority }) => {
    return (
      <div className="group relative flex flex-col w-full h-full">
        {/* Unified Minimalist Image Card */}
        <div className="relative aspect-square overflow-hidden rounded-lg md:rounded-[2rem] bg-white mb-2 md:mb-4 shadow-sm md:shadow-md hover:shadow-2xl hover:shadow-pink-500/10 border border-pink-50/80 md:border md:border-pink-50 hover:border-pink-200 transform md:hover:-translate-y-2 transition-all duration-700">
          <Link to={product.route} className="block w-full h-full relative z-0 cursor-pointer bg-pink-50/50">
            <img
              className="w-full h-full object-cover origin-center transition-transform duration-1000 ease-out group-hover:scale-110"
              src={product.imageUrl}
              alt={product.title || "Salon Equipment"}
              loading={priority ? "eager" : "lazy"}
            />
            {/* Elegant glass overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-pink-900/10 to-transparent backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-2 md:p-8">
              <div className="w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                <button className="w-full py-1.5 md:py-4 bg-white/90 backdrop-blur-md rounded-full text-pink-600 font-semibold text-[6px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-1 md:gap-2 hover:bg-pink-500 hover:text-white transition-colors">
                  Quick View
                  <FaArrowRight className="text-[5px] md:text-sm" />
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Amazing Structure Info Section (Left Aligned, Clean) */}
        <div className="pt-2 md:pt-4 px-1 md:px-3 pb-2 md:pb-4 flex-grow flex flex-col gap-1 md:gap-2">
          {/* Category Label */}
          <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-[0.25em] text-pink-400">
            {collectionTitle}
          </span>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-[12px] md:text-lg ${i < 4 ? 'text-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-[9px] md:text-xs text-gray-400">({15 + (product.id * 7) % 85})</span>
          </div>

          {/* Dynamic Descriptions */}
          <p className="text-[9px] md:text-xs text-gray-500 font-normal leading-snug md:leading-relaxed line-clamp-1 md:line-clamp-2">
            {collectionTitle === "Chairs" && "Ergonomic eco-leather with memory foam for all-day salon comfort."}
            {collectionTitle === "Massage Beds" && "Multi-zone heating & silent motors for deep therapeutic sessions."}
            {collectionTitle === "Head Wash Units" && "Italian-designed ceramic basins with contoured neck-support."}
            {collectionTitle === "Manicure Pedicure" && "Pipeless whirlpool tech with integrated LED task lighting."}
            {collectionTitle === "Trolleys" && "Silent silicone wheels with chemical-resistant modular storage."}
            {collectionTitle === "Hydra Machines" && "Clinical dermabrasion with one-touch touchscreen control."}
            {collectionTitle === "Electronic Equipment" && "High-performance tools for the precision-focused modern stylist."}
            {!["Chairs", "Massage Beds", "Head Wash Units", "Manicure Pedicure", "Trolleys", "Hydra Machines", "Electronic Equipment"].includes(collectionTitle) && "Premium salon equipment for luxury boutique environments."}
          </p>

          {/* Subtle Divider */}
          <div className="hidden md:block h-[1px] w-full bg-pink-50 my-1" />

          {/* Price & Action Row */}
          <div className="mt-auto flex items-center justify-between gap-1 pt-1 md:pt-0">
            <div>
              <span className="block text-[5px] md:text-[8px] text-gray-400 uppercase tracking-widest">From</span>
              <span className="text-[10px] md:text-lg font-bold text-gray-900 leading-none block">Rs.&nbsp;{(25000 + (product.id * 1234) % 60000).toLocaleString()}</span>
              <span className="text-[6px] md:text-[8px] text-pink-500 italic mt-0.5 block">* Price negotiable</span>
            </div>
            <Link to={product.route} className="shrink-0 inline-flex items-center gap-0.5 md:gap-1.5 bg-gray-900 hover:bg-pink-500 text-white text-[6px] md:text-[9px] font-bold uppercase tracking-widest px-2 py-1 md:px-3.5 md:py-2 rounded-full transition-colors shadow-sm hover:shadow-md">
              Shop <FaArrowRight className="text-[5px] md:text-[8px]" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const CollectionSection = ({ title, collectionKey, products }) => {
    const formattedTitle = collectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    const isMassageBed = collectionKey === "massageBeds";
    const isHydra = collectionKey === "hydraMachines";
    const isChairs = collectionKey === "chairs";
    const useWideLayout = isHydra || isChairs;

    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: isMassageBed ? 2 : 3,
      slidesToScroll: 1,
      arrows: true,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: isMassageBed ? 2 : 3,
          }
        },
        {
          breakpoint: 1440,
          settings: {
            slidesToShow: isMassageBed ? 2 : 2,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            arrows: false
          }
        }
      ]
    };

    return (
      <motion.section
        id={collectionKey}
        className="py-24 md:py-40 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        {/* Subtle Section Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-50" />

        <div className="max-w-[1800px] mx-auto px-2 md:px-12 relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tighter text-gray-900 leading-[0.8] mb-12 md:mb-20 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {formattedTitle}
          </motion.h2>

          <div className="flex flex-col xl:flex-row gap-12 lg:gap-20 items-center">
            {/* Left Column: Category Story */}
            <div className="hidden xl:block xl:w-[220px] shrink-0 space-y-6 md:space-y-8 py-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-pink-50 border border-pink-100"
              >
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <span className="text-pink-600 font-bold tracking-[0.3em] uppercase text-[9px] md:text-xs">
                  Premium Collection
                </span>
              </motion.div>

              <div className="space-y-4 md:space-y-6">
                <motion.p
                  className="text-gray-500 text-xs md:text-sm font-light italic leading-relaxed max-w-[200px]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  "{categoryDescriptions[collectionKey]}"
                </motion.p>
              </div>

              <motion.div
                className="flex items-center gap-4 text-pink-500 font-bold tracking-[0.3em] text-[10px] uppercase"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="h-[1px] w-12 bg-pink-500" />
                {products.length} Exclusive Pieces
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/shop" className="group inline-flex items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gray-900">
                  View All
                  <span className="w-8 h-[1px] bg-gray-300 group-hover:w-12 group-hover:bg-pink-500" />
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Interactive Showcase */}
            <div className="w-full xl:flex-1 min-w-0">

              <div className={`product-slider-container relative ${useWideLayout ? 'px-0' : 'px-0 md:px-16'}`}>
                <Slider {...sliderSettings} className="product-carousel px-2 sm:px-0">
                  {products.map((product, index) => (
                    <div key={`${collectionKey}-${product.id}-${index}`} className={`px-1 md:px-2 ${useWideLayout ? 'md:px-2' : 'md:px-5'}`}>
                      <ProductCard
                        product={product}
                        index={index}
                        collectionTitle={formattedTitle}
                        collectionKey={collectionKey}
                        priority={collectionKey === "chairs"}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements Removed */}
        <div className="absolute bottom-0 left-1/4 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-30" />
      </motion.section>
    );
  };

  const salonEquipmentCollections = {
    chairs: [
      { id: 1, imageUrl: Chairs5, route: "/chairs", featured: true },
      { id: 2, imageUrl: Chairs3, route: "/chairs", },
      { id: 3, imageUrl: Chairs6, route: "/chairs", featured: true },
      { id: 4, imageUrl: Chairs2, route: "/chairs", },
    ],
    massageBeds: [
      { id: 7, imageUrl: Massage3, route: "/massage-bed", featured: true },
      { id: 8, imageUrl: Massage5, route: "/massage-bed", },
      { id: 6, imageUrl: Massage1, route: "/massage-bed", },
      { id: 5, imageUrl: Massage2, route: "/massage-bed", featured: true },
    ],
    headWashUnits: [
      { id: 9, imageUrl: HeadWashUnit2, route: "/head-wash-unit", featured: true },
      { id: 10, imageUrl: HeadWashUnit4, route: "/head-wash-unit", },
      { id: 11, imageUrl: HeadWashUnit5, route: "/head-wash-unit", },
      { id: 12, imageUrl: HeadWashUnit3, route: "/head-wash-unit", featured: true }
    ],
    manicurePedicure: [
      { id: 23, imageUrl: ManicurePedicure1, route: "/menicure-pedicure", featured: true },
      { id: 24, imageUrl: ManicurePedicure2, route: "/menicure-pedicure", },
      { id: 25, imageUrl: ManicurePedicure6, route: "/menicure-pedicure", featured: true },
      { id: 26, imageUrl: ManicurePedicure5, route: "/menicure-pedicure", }
    ],
    trolleys: [
      { id: 31, imageUrl: Trolleys5, route: "/trolleys", featured: true },
      { id: 32, imageUrl: Trolleys2, route: "/trolleys", },
      { id: 33, imageUrl: Trolleys4, route: "/trolleys", },
      { id: 34, imageUrl: Trolleys1, route: "/trolleys", featured: true },
    ],
    electronicEquipment: [
      { id: 51, imageUrl: ElectronicEquipment1, route: "/electronic-equipment", featured: true },
      { id: 52, imageUrl: ElectronicEquipment2, route: "/electronic-equipment", },
      { id: 53, imageUrl: ElectronicEquipment3, route: "/electronic-equipment", },
      { id: 54, imageUrl: ElectronicEquipment4, route: "/electronic-equipment", featured: true }
    ],
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full selection:bg-pink-200 selection:text-pink-900"
      style={{ background: colors.bgGradient }}>
      <Meta
        title="Saloon Interior | Professional Saloon Equipment & Furniture"
        description="Premium saloon chairs, massage beds, head wash units, and aesthetic machines. Quality equipment for modern saloon interiors."
      />

      <div className="w-full bg-white">
        <div className="w-full min-h-[400px] md:min-h-[600px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1)_0%,transparent_100%)] opacity-70 pointer-events-none" />
          <ProductCarousel />
        </div>
      </div>
      <Features />

      <main className="pb-32">
        {Object.entries(salonEquipmentCollections).map(([key, products]) => (
          <CollectionSection
            key={key}
            collectionKey={key}
            products={products}
          />
        ))}
      </main>
    </div>
  );
};

export default CategoryProducts;