import React from "react";
import { Outlet } from "react-router-dom";
import TopTicker from "./components/TopTicker";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Services from "./pages/Services";
const App = () => {
  return (
    <div className="min-h-screen">
      <TopTicker />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="text-white"
        progressClassName="bg-gradient-to-r from-black to-white"
      />
      <div className="relative mx-auto overflow-hidden mt-[85px] md:mt-[125px]">
        <div className="w-full h-full overflow-y-auto scroll-smooth">
          <div id="main-content-wrapper" className="relative z-10 transition-all duration-500">

            <Navigation
              className="sticky top-[35px] z-40 backdrop-blur-md bg-black/30 border-b border-cyan-500/20"
            />

            <main className="py-6 lg:py-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Services />
    </div>
  );
};

export default React.memo(App);