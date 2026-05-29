import React from "react";
import { Outlet } from "react-router-dom";
import TopTicker from "./components/TopTicker";
import Navigation from "./components/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Services from "./pages/Services";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopTicker />
      <Navigation />
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
      <div id="main-content-wrapper" className="flex-grow mt-[85px] md:mt-[125px] transition-all duration-500 flex flex-col">
        <main className="flex-grow py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
      <Services />
    </div>
  );
};

export default React.memo(App);