import OrderList2 from "../User/userOrders2";
import React, { useState, useEffect, useMemo } from "react";
import { FiZap, FiCpu, FiMenu, FiX, FiBarChart2, FiUsers, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import Chart from "react-apexcharts";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useGetTotalSalesByDateQuery } from "../../redux/api/orderApiSlice";
import { useGetTotalSalesQuery } from "../../redux/api/orderApiSlice";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { useGetTotalOrdersQuery } from "../../redux/api/orderApiSlice";
import { Sparklines, SparklinesLine } from "react-sparklines";

const AdminDashBoard = () => {
  // State for mobile navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // API calls
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery();
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetail, isLoading: salesDetailLoading } =
    useGetTotalSalesByDateQuery();

  const formattedSalesData = useMemo(() => {
    if (!salesDetail) return [];
    return salesDetail.map((item) => ({
      x: new Date(item._id),
      y: item.totalSales,
    }));
  }, [salesDetail]);

  const salesSparklineData = useMemo(() => {
    return formattedSalesData.map((item) => item.y);
  }, [formattedSalesData]);

  // Particle.js initialization
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const loading =
    salesLoading || customersLoading || ordersLoading || salesDetailLoading;

  const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 400,
        },
      },
      color: {
        value: ["rgb(3, 10, 20)", "rgb(10, 44, 63)", "rgb(18, 94, 138)"],
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.1,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.05,
          sync: false,
        },
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: "rgb(18, 94, 138)",
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: false,
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 2,
        },
        remove: {
          particles_nb: 1,
        },
      },
    },
    retina_detect: true,
  };

  // Responsive chart config
  const [chartState, setChartState] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: "easeOutExpo",
          speed: 1500,
          animateGradually: { delay: 300 },
        },
        foreColor: "#4b5563",
      },
      colors: ["rgb(3, 10, 20)", "rgb(10, 44, 63)", "rgb(18, 94, 138)"],
      stroke: {
        curve: "smooth",
        width: 3,
        dashArray: [0, 8],
      },
      markers: {
        size: 4,
        hover: { size: 8 },
        strokeColors: "#fff",
        fillOpacity: 1,
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#6b7280",
            fontSize: '10px'
          },
          rotate: -45,
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => `$${val.toFixed(2)}`,
          style: {
            colors: "#6b7280",
            fontSize: '10px'
          },
        },
      },
      tooltip: {
        theme: "light",
        x: { format: "dd MMM yyyy" },
        marker: { show: false },
      },
      grid: {
        borderColor: "rgba(18, 94, 138, 0.1)",
        strokeDashArray: 4,
      },
    },
    series: [{ name: "Sales Revenue", data: [] }],
  });

  // Update chart when data loads
  useEffect(() => {
    if (formattedSalesData.length > 0) {
      setChartState((prev) => ({
        ...prev,
        series: [
          {
            name: "Sales",
            data: formattedSalesData.map((item) => ({ x: item.x, y: item.y })),
          },
        ],
      }));
    }
  }, [formattedSalesData]);

  // Easter egg handler
  const handleTitleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
    }
  };

  // Handle tab change (close mobile menu on tab select)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Stats cards data
  const statsCards = [
    {
      title: "Total Sales",
      value: loading ? (
        <Loader />
      ) : (
        `$${sales?.totalSales?.toFixed(2) || "0.00"}`
      ),
      icon: <FiDollarSign className="w-5 h-5 text-white" />,
      data: salesSparklineData,
      color: "from-blue-600 to-cyan-600",
      gradient: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
    },
    {
      title: "Customers",
      value: loading ? <Loader /> : customers?.length || "0",
      icon: <FiUsers className="w-5 h-5 text-white" />,
      color: "from-blue-500 to-blue-600",
      gradient: "linear-gradient(135deg, rgb(10, 44, 63) 0%, rgb(18, 94, 138) 100%)",
    },
    {
      title: "Orders",
      value: loading ? <Loader /> : orders?.totalOrders || "0",
      icon: <FiShoppingBag className="w-5 h-5 text-white" />,
      color: "from-cyan-500 to-blue-600",
      gradient: "linear-gradient(135deg, rgb(18, 94, 138) 0%, rgb(10, 44, 63) 100%)",
    },
  ];

  return (
    <div className="relative min-h-[80vh] bg-white text-gray-800 overflow-hidden rounded-xl">
      {/* Subtle Particle Background */}
      <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
        <Particles
          id="blue-particles"
          init={particlesInit}
          options={particlesOptions}
        />
      </div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <header className="mb-8 lg:mb-12 text-center relative group">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold inline-block cursor-pointer"
            onClick={handleTitleClick}
            style={{
              background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 50%, rgb(18, 94, 138) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Admin Dashboard
          </h1>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 sm:w-20 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70 group-hover:w-24 sm:group-hover:w-32 transition-all duration-500"></div>
          <p className="mt-2 text-blue-600/80 text-sm sm:text-base">
            Manage your store performance
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 lg:mb-12">
          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-4 overflow-hidden"
              >
                <div className="flex flex-col space-y-2 p-4 rounded-xl bg-white border border-blue-200 shadow-md">
                  {[
                    { id: "overview", label: "Overview", icon: FiBarChart2 },
                    { id: "analytics", label: "Analytics", icon: FiZap },
                    { id: "orders", label: "Orders", icon: FiShoppingBag },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-4 py-3 rounded-lg flex items-center space-x-2 transition-all ${activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-300"
                          : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                        }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center space-x-4">
            {[
              { id: "overview", label: "Overview", icon: FiBarChart2 },
              { id: "analytics", label: "Analytics", icon: FiZap },
              { id: "orders", label: "Orders", icon: FiShoppingBag },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl flex items-center space-x-2 transition-all ${activeTab === tab.id
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                style={activeTab === tab.id ? {
                  background: "linear-gradient(135deg, rgb(3, 10, 20) 0%, rgb(10, 44, 63) 100%)",
                } : {}}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-7xl mx-auto"
          >
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                <OrderList2 />
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {statsCards.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-200 ${hoveredCard === index ? "transform scale-105" : ""
                        }`}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-blue-600/80">{item.title}</p>
                          <h2 className="text-2xl lg:text-3xl font-bold mt-2 text-gray-800">
                            {item.value}
                          </h2>
                        </div>
                        <div
                          className="p-3 rounded-full shadow-sm"
                          style={{
                            background: item.gradient,
                          }}
                        >
                          {item.icon}
                        </div>
                      </div>
                      {item.data && (
                        <div className="mt-6">
                          <Sparklines data={item.data} height={40}>
                            <SparklinesLine
                              style={{
                                stroke: "rgb(18, 94, 138)",
                                strokeWidth: 2,
                                fill: "rgba(18, 94, 138, 0.1)",
                              }}
                            />
                          </Sparklines>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Sales Analytics</h3>
                  <p className="text-sm text-blue-600/80">Revenue trends over time</p>
                </div>
                <Chart
                  options={chartState.options}
                  series={chartState.series}
                  type="line"
                  height={350}
                  width="100%"
                />
              </motion.div>
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4"
          >
            <div className="text-center p-6 rounded-2xl max-w-sm w-full bg-white border border-blue-200 shadow-lg">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-lg text-gray-800">
                You found a hidden feature!
              </p>
              <p className="text-sm text-blue-600/80 mt-2">
                Enjoy the enhanced dashboard experience
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loader component
const Loader = () => (
  <div className="inline-flex items-center space-x-2">
    <div 
      className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
      style={{
        borderColor: "rgb(18, 94, 138)",
        borderTopColor: "transparent",
      }}
    ></div>
    <span className="text-gray-600">Loading...</span>
  </div>
);

export default AdminDashBoard;