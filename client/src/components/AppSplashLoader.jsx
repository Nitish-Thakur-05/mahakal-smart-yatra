import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/custom.module.css";

const SACRED_MANTRAS = [
  { hi: "ॐ नमः शिवाय", desc: "पवित्र पंचाक्षर मंत्र जाप" },
  { hi: "जय श्री महाकाल", desc: "उज्जैन अवंतिकापुरी ज्योतिर्लिंग" },
  { hi: "कालेश्वर नमस्तुभ्यं", desc: "प्रातः भस्म आरती एवं दर्शन सेवा" },
  { hi: "हर हर महादेव", desc: "शिप्रा तट एवं महाकाल लोक" },
  { hi: "ॐ नमः पार्वती पतये", desc: "हर हर महादेव शंभो" },
];

const LOADING_STEPS = [
  "Connecting to Shri Mahakaleshwar Sanctum...",
  "Fetching Live Aarti & Bhasma Aarti Timings...",
  "Loading Mahakal Lok Corridor & Dharamshala Stays...",
  "Syncing AI Pilgrimage Route Planner...",
  "Welcome to Mahakal Smart Yatra Portal!",
];

// Handcrafted Traditional Trishul, Tripundra & Damru Emblem (Not Generic AI Icon)
function TraditionalMahakalCrest() {
  return (
    <svg viewBox="0 0 120 120" className="w-100 h-100" style={{ filter: "drop-shadow(0 4px 12px rgba(217, 119, 6, 0.4))" }}>
      <defs>
        <radialGradient id="crestGoldBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id="trishulGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Temple Sunburst Rays */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="60"
          x2={60 + 54 * Math.cos((i * 30 * Math.PI) / 180)}
          y2={60 + 54 * Math.sin((i * 30 * Math.PI) / 180)}
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="2 4"
          opacity="0.6"
        />
      ))}

      {/* Outer Decorative Brass Ring */}
      <circle cx="60" cy="60" r="52" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="6 3" />
      <circle cx="60" cy="60" r="47" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

      {/* Tripundra Sacred Ash Lines (Handcrafted 3 Horizontal Curved Bands) */}
      <path d="M30 42 Q60 38 90 42" stroke="#fffbeb" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M28 50 Q60 46 92 50" stroke="#fffbeb" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M30 58 Q60 54 90 58" stroke="#fffbeb" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.9" />

      {/* Sacred Red Kumkum Tilak Bindu */}
      <circle cx="60" cy="50" r="6" fill="#dc2626" filter="url(#glowGold)" />
      <circle cx="60" cy="50" r="2.5" fill="#fef08a" />

      {/* Handcrafted Sacred Trishul (Trident) Artwork */}
      {/* Center Shaft */}
      <line x1="60" y1="18" x2="60" y2="102" stroke="url(#trishulGold)" strokeWidth="4" strokeLinecap="round" />
      {/* Center Prong Blade */}
      <path d="M60 14 L55 28 L65 28 Z" fill="url(#trishulGold)" />
      {/* Left Curved Prong */}
      <path d="M60 48 Q34 45 34 24 Q44 26 52 35" fill="none" stroke="url(#trishulGold)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M34 24 L30 32 L38 30 Z" fill="url(#trishulGold)" />
      {/* Right Curved Prong */}
      <path d="M60 48 Q86 45 86 24 Q76 26 68 35" fill="none" stroke="url(#trishulGold)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M86 24 L82 30 L90 32 Z" fill="url(#trishulGold)" />

      {/* Handcrafted Damru (Sacred Drum in Center) */}
      <path d="M50 72 L70 72 L52 86 L68 86 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
      <circle cx="60" cy="79" r="2.5" fill="#fffbeb" />
      {/* Damru Strings */}
      <line x1="50" y1="72" x2="68" y2="86" stroke="#fbbf24" strokeWidth="1" opacity="0.8" />
      <line x1="70" y1="72" x2="52" y2="86" stroke="#fbbf24" strokeWidth="1" opacity="0.8" />
    </svg>
  );
}

export function AppSplashLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [mantraIdx, setMantraIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);

    // Paced progress over 5 seconds (5000ms)
    const startTime = Date.now();
    const duration = 5000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 20) setStepIdx(0);
      else if (pct < 45) setStepIdx(1);
      else if (pct < 70) setStepIdx(2);
      else if (pct < 90) setStepIdx(3);
      else setStepIdx(4);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => onComplete && onComplete(), 300);
      }
    }, 30);

    const mantraInterval = setInterval(() => {
      setMantraIdx((prev) => (prev + 1) % SACRED_MANTRAS.length);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(mantraInterval);
    };
  }, [onComplete]);

  const isLight = theme === "light";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center overflow-hidden"
      style={{
        zIndex: 99999,
        background: isLight
          ? "radial-gradient(circle at center, #fffdf5 0%, #fef3c7 50%, #f4f3ea 100%)"
          : "radial-gradient(circle at center, #1c1200 0%, #0d0800 55%, #030303 100%)",
        color: isLight ? "#111827" : "#ffffff",
      }}
    >
      {/* Background Subtle Temple Arc Motif */}
      <div className="position-absolute top-50 start-50 translate-middle pointer-events-none" style={{ width: 500, height: 500 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-100 h-100 rounded-circle position-absolute top-0 start-0"
          style={{
            border: "1.5px dashed rgba(217, 119, 6, 0.25)",
          }}
        />
      </div>

      {/* Main Hand-Crafted Sanctum Shield Container */}
      <div className="position-relative d-flex flex-column align-items-center text-center p-4 z-2" style={{ maxWidth: 440 }}>
        {/* Traditional Embossed Crest */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.96, 1.04, 0.96], opacity: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-circle p-3 mb-4 position-relative d-flex align-items-center justify-content-center shadow-2xl"
          style={{
            width: 140,
            height: 140,
            background: isLight
              ? "linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #fde68a 100%)"
              : "linear-gradient(135deg, #2a1a00 0%, #472d00 100%)",
            border: "3px solid #d97706",
            boxShadow: isLight
              ? "0 12px 40px rgba(217, 119, 6, 0.35), inset 0 2px 8px rgba(255, 255, 255, 0.9)"
              : "0 15px 50px rgba(245, 158, 11, 0.45), inset 0 2px 8px rgba(251, 191, 36, 0.3)",
          }}
        >
          <TraditionalMahakalCrest />
        </motion.div>

        {/* Traditional Hindi Banner Badge */}
        <div className="mb-2 px-3 py-1 rounded-pill bg-warning bg-opacity-15 border border-warning border-opacity-40">
          <span className="fw-bold small font-monospace" style={{ color: isLight ? "#92400e" : "#fbbf24", letterSpacing: "1px", fontSize: "0.78rem" }}>
            🚩 श्री महाकालेश्वर ज्योतिर्लिंग उज्जैन 🚩
          </span>
        </div>

        {/* Brand Name */}
        <h1
          className={`fw-bold mb-1 display-5 ${styles.playfairFont}`}
          style={{
            color: isLight ? "#78350f" : "#fef3c7",
            letterSpacing: "2px",
            textShadow: isLight ? "none" : "0 2px 12px rgba(245, 158, 11, 0.4)",
          }}
        >
          MAHAKAL SMART YATRA
        </h1>

        {/* Subtitle */}
        <p
          className="text-uppercase fw-semibold mb-4"
          style={{
            fontSize: "0.72rem",
            color: isLight ? "#b45309" : "#fbbf24",
            letterSpacing: "2.5px",
          }}
        >
          Official Pilgrim Portal &amp; Aarti Booking
        </p>

        {/* Rotating Sacred Devanagari Mantra Card */}
        <div className="w-100 p-3 rounded-4 mb-4 border transition-all" style={{
          backgroundColor: isLight ? "#ffffff" : "rgba(255, 255, 255, 0.04)",
          borderColor: isLight ? "#fcd34d" : "rgba(245, 158, 11, 0.25)",
          boxShadow: isLight ? "0 4px 20px rgba(217, 119, 6, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.4)",
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={mantraIdx}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="d-flex flex-column align-items-center"
            >
              <span className="fw-bold fs-4 mb-0" style={{ color: isLight ? "#92400e" : "#fbbf24" }}>
                {SACRED_MANTRAS[mantraIdx].hi}
              </span>
              <span className="small opacity-80 mt-1" style={{ fontSize: "0.75rem", color: isLight ? "#4b5563" : "#d1d5db" }}>
                {SACRED_MANTRAS[mantraIdx].desc}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Paced Golden Progress Bar & Percentage */}
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-center mb-1.5 px-1 font-monospace small">
            <span className="text-truncate me-2" style={{ fontSize: "0.75rem", color: isLight ? "#4b5563" : "#d1d5db" }}>
              {LOADING_STEPS[stepIdx]}
            </span>
            <span className="fw-bold flex-shrink-0" style={{ color: isLight ? "#b45309" : "#fbbf24" }}>
              {progress}%
            </span>
          </div>

          <div
            className="w-100 rounded-pill overflow-hidden position-relative"
            style={{
              height: 8,
              backgroundColor: isLight ? "rgba(217, 119, 6, 0.15)" : "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            <motion.div
              className="h-100 rounded-pill"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #fbbf24 100%)",
                boxShadow: "0 0 14px rgba(245, 158, 11, 0.9)",
                transition: "width 0.12s linear",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
