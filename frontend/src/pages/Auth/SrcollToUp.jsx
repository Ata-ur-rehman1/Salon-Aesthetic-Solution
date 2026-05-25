// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use setTimeout to ensure this runs after the DOM update
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });

      // Also focus on the main content area
      const main = document.querySelector("main");
      if (main) {
        main.focus();
      }
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
