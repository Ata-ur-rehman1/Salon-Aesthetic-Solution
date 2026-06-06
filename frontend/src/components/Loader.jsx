import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Main Page Loader ───────────────────────────────────────────────────────
const Loader = ({ loadingText = "Loading" }) => {
  const [dots, setDots] = useState("");

  // Animated ellipsis
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 450);
    return () => clearInterval(id);
  }, []);

  const bars = [0.3, 0.6, 1, 0.7, 0.4, 0.8, 0.5];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #f0f6ff 0%, #ffffff 60%, #e8f0fe 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Decorative background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
            top: "-10%",
            left: "-10%",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
            bottom: "-5%",
            right: "-5%",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* ── Logo mark ── */}
      <motion.div
        className="relative mb-10"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.1 }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "transparent",
            boxShadow: "0 0 0 0 rgba(37,99,235,0.4)",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0px rgba(37,99,235,0.4)",
              "0 0 0 18px rgba(37,99,235,0)",
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Circle badge */}
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
          }}
        >
          {/* Scissors SVG — salon icon */}
          <motion.svg
            viewBox="0 0 48 48"
            fill="none"
            className="w-12 h-12"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Handle left */}
            <circle cx="10" cy="38" r="6" fill="white" fillOpacity="0.9" />
            {/* Handle right */}
            <circle cx="38" cy="38" r="6" fill="white" fillOpacity="0.9" />
            {/* Blade left */}
            <line x1="14" y1="35" x2="28" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* Blade right */}
            <line x1="34" y1="35" x2="20" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* Pivot */}
            <circle cx="24" cy="22" r="2.5" fill="white" />
          </motion.svg>
        </div>
      </motion.div>

      {/* ── Equalizer bars ── */}
      <motion.div
        className="flex items-end gap-[5px] mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        {bars.map((base, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full"
            style={{
              background: `linear-gradient(to top, #2563eb, #38bdf8)`,
              originY: 1,
            }}
            animate={{
              scaleY: [base, base * 2.2 + 0.2, base],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.11,
            }}
            initial={{ height: 28 }}
          />
        ))}
      </motion.div>

      {/* ── Brand name ── */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Shimmer title */}
        <motion.h1
          className="text-lg font-bold uppercase tracking-[0.35em] mb-1 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 40%, #38bdf8 60%, #1e3a8a 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        >
          Salon Aesthetic Solution
        </motion.h1>

        {/* Loading text with dots */}
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-medium select-none">
          {loadingText}
          <span className="inline-block w-6 text-left">{dots}</span>
        </p>
      </motion.div>

      {/* ── Progress bar ── */}
      <motion.div
        className="mt-8 w-48 h-[2px] rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(37,99,235,0.12)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #2563eb, #38bdf8)" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

// ─── Minimal inline button loader ───────────────────────────────────────────
export const ButtonLoader = () => (
  <motion.div
    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

export default Loader;