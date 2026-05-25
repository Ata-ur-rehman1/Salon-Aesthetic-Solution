import { motion } from "framer-motion";
import React from "react";
import Slider from "react-slick";
import { useNavigate, Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductCarousel.css";
import Saloon1 from "../Auth/saloon1.png"
import Saloon2 from "../Auth/saloon2.png"
import Saloon3 from "../Auth/saloon3.png"
import Logo from "../Auth/logo.png"
import Saloon7 from "../Auth/saloon7.png"
import Saloon9 from "../Auth/saloon9.png"

const CATEGORIES = [
  { name: "Chairs", route: "/chairs" },
  { name: "Massage Bed", route: "/massage-bed" },
  { name: "Head Wash Unit", route: "/head-wash-unit" },
  { name: "Manicure & Pedicure", route: "/menicure-pedicure" },
  { name: "Trolleys", route: "/trolleys" },
  { name: "Hydra Machines", route: "/hydra-machines" },
  { name: "Electronic Equipment", route: "/electronic-equipment" },
];

const ProductCarousel = () => {
  const navigate = useNavigate();

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <motion.button
        onClick={onClick}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 bg-white/95 backdrop-blur-sm border border-blue-300 hover:border-blue-500 transition-colors"
      >
        <FaChevronRight className="text-blue-600 text-sm md:text-base hover:text-blue-700" />
      </motion.button>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <motion.button
        onClick={onClick}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-30 bg-white/95 backdrop-blur-sm border border-blue-300 hover:border-blue-500 transition-colors"
      >
        <FaChevronLeft className="text-blue-600 text-sm md:text-base hover:text-blue-700" />
      </motion.button>
    );
  };


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    touchThreshold: 100, // Makes vertical scrolling easier
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <motion.div
        className="absolute bottom-5 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <ul className="flex items-center gap-1 md:gap-2">{dots}</ul>
      </motion.div>
    ),
  };

  // Define slides array with explicit routing and text overlays
  const slides = [
    { id: 1, image: Saloon1, route: "/chairs", title: "Premium Styling Chairs" },
    { id: 1, image: Saloon2, route: "/", title: "Saloon Interior Store Setup" },
    { id: 3, image: Saloon3, route: "/head-wash-unit", title: "Ergonomic Wash Units" },
    { id: 7, image: Saloon7, route: "/electronic-equipment", title: "High-Tech Electronics" },
    { id: 9, image: Saloon9, route: "/", title: "Discover Complete Setup" },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full py-8 md:py-12">
        <motion.div
          className="text-center mb-8 md:mb-16 lg:mb-20 max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center w-full mb-6">
            <img
              src={Logo}
              alt="Saloon Interior Logo"
              className="w-[180px] md:w-[240px] lg:w-[320px] h-auto object-contain"
            />
          </div>
          <motion.h1
            className="text-lg md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 tracking-tight text-gray-800"
          >
            The Complete Saloon, Aesthetic &amp; Electronic Equipment
          </motion.h1>
          <motion.div
            className="h-1 w-12 md:w-20 lg:w-32 mx-auto mb-6 md:mb-8 bg-blue-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          ></motion.div>
          <motion.p
            className="text-xs md:text-lg lg:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Elevate your workspace with meticulously crafted professional equipment designed for the modern saloon interior.
          </motion.p>
        </motion.div>

        <div className="relative group touch-pan-y w-full shadow-[0_0_100px_rgba(0,0,0,0.05)]">
          <Slider {...settings}>
            {slides.map((slide) => (
              <div key={slide.id} className="w-full touch-pan-y">
                <Link
                  to={slide.route}
                  className="relative block w-full h-[45vh] md:h-[80vh] overflow-hidden shadow-2xl transition-all duration-700 touch-pan-y"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable="false"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-10 space-y-3 md:space-y-4">
                    <h2 className="text-white text-2xl md:text-4xl lg:text-6xl font-light tracking-wide drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <div className="flex items-center gap-3 text-blue-200 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold drop-shadow-md">
                      <span>Explore Collection</span> <FaChevronRight size={12} className="text-blue-400" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        {/* Category Navigation Strip */}
        <motion.div
          className="mt-10 md:mt-14 max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-center text-[8px] md:text-[11px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-4 md:mb-7">
            Shop By Category
          </p>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-3 max-w-4xl mx-auto">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.route}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={cat.route}
                  className="group flex items-center justify-center gap-1 p-1 md:p-4 border rounded-lg hover:border-gray-300 transition-all duration-300 hover:bg-gray-50 text-center h-full min-h-[50px] md:min-h-0"
                  style={{ borderColor: "#f3f4f6" }}
                >
                  <span className="text-[6.5px] md:text-[11px] uppercase tracking-tighter md:tracking-widest font-semibold leading-none text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                    {cat.name}
                  </span>
                  <FaChevronRight className="text-[6px] md:text-[8px] text-blue-500 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ProductCarousel;