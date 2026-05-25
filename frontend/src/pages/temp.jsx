const MindBlowingHomepage = () => {
  const containerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = smoothScroll.on("change", (val) => {
      setIsFixed(val > 0.4 && val < 0.6);
      setShouldHide(val > 0.6);
    });
    return () => unsubscribe();
  }, [smoothScroll]);

  const textY = useTransform(smoothScroll, [0, 0.4], ["-100px", "0px"]);
  const textOpacity = useTransform(smoothScroll, [0, 0.3, 0.7], [0, 1, 0]);
  const buttonX = useTransform(smoothScroll, [0, 0.4], ["-100px", "0px"]);
  const buttonOpacity = useTransform(smoothScroll, [0, 0.3, 0.7], [0, 1, 0]);
  const imageX = useTransform(smoothScroll, [0, 0.4], ["100px", "0px"]);
  const imageOpacity = useTransform(smoothScroll, [0, 0.3, 0.7], [0, 1, 0]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <section id="home" className="relative h-screen">
        <AnimatePresence>
          {!shouldHide && (
            <div className="fixed inset-0 grid lg:grid-cols-2 gap-8 items-center justify-center px-4 lg:px-12 max-w-[1800px] mx-auto">
              <motion.div
                className="w-full lg:ml-[100px] xl:ml-[200px] text-center lg:text-left mb-8 lg:mb-0 order-2 lg:order-1"
                style={{
                  y: isFixed ? 0 : textY,
                  opacity: isFixed ? 1 : textOpacity,
                }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 lg:mb-8 mt-8 lg:mt-[-100px]">
                  Discover
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Next-Gen
                  </span>
                  <br />
                  Shopping
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0">
                  Powered by{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Dot NK AI
                  </span>
                  , experience intelligent recommendations.
                </p>
              </motion.div>

              <motion.div
                className="w-full lg:w-full px-4 lg:px-0 mt-8 lg:mt-0 order-1 lg:order-2 lg:mr-[100px] xl:mr-[200px]"
                style={{
                  x: isFixed ? 0 : imageX,
                  opacity: isFixed ? 1 : imageOpacity,
                }}
              >
                <div className="relative group perspective-[1000px]">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
                  <motion.div
                    whileHover={{ 
                      rotateY: 5,
                      rotateX: -5,
                      scale: 1.02,
                      translateZ: 20
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative transform-gpu"
                  >
                    <motion.img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format"
                      alt="Shopping Experience"
                      className="rounded-2xl w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover border-2 border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300"
                      whileHover={{
                        scale: 1.01,
                        filter: "brightness(1.1)"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                className="w-full lg:w-auto mt-6 lg:mt-8 order-3"
                style={{
                  x: isFixed ? 0 : buttonX,
                  opacity: isFixed ? 1 : buttonOpacity,
                }}
              >
                <motion.button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl font-medium shadow-lg flex items-center justify-center mx-auto lg:mx-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/categoryProducts")}
                >
                  Check Category Products Now{" "}
                  <FiChevronRight className="ml-2" />
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      <section className="relative"></section>
    </div>
  );
};