import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Sparkles,
  Calendar,
  BookOpen,
  Hotel,
  Compass,
  LogOut,
  ShieldCheck,
  Building,
  Megaphone,
  ChevronDown,
  ChevronRight,
  MapPin,
  HelpCircle,
  MoreHorizontal,
  Crown,
  QrCode,
  Sun,
  Moon,
} from "lucide-react";
import styles from "../styles/custom.module.css";

export function Navbar({ onOpenAuth, onOpenPassPortal, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();

  // Global Theme Switcher State (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("mahakal_theme") || "dark";
  });

  const [isAnimatingTheme, setIsAnimatingTheme] = useState(false);
  const [themeOrigin, setThemeOrigin] = useState({ x: "90%", y: "30px" });
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("mahakal_theme", theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const clickX = e?.clientX || window.innerWidth * 0.9;
    const clickY = e?.clientY || 30;
    setThemeOrigin({ x: `${clickX}px`, y: `${clickY}px` });

    // Sparkle Particle Burst
    const newSparkles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      angle: (i * 60 * Math.PI) / 180,
      distance: Math.random() * 26 + 18,
      symbol: nextTheme === "light" ? "✨" : "⭐",
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 650);

    const applyThemeUpdate = () => {
      setTheme(nextTheme);
    };

    // Use native View Transitions API if supported
    if (document.startViewTransition) {
      document.documentElement.style.setProperty("--theme-x", `${clickX}px`);
      document.documentElement.style.setProperty("--theme-y", `${clickY}px`);
      document.startViewTransition(applyThemeUpdate);
    } else {
      setIsAnimatingTheme(true);
      applyThemeUpdate();
      setTimeout(() => setIsAnimatingTheme(false), 650);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close More dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const navLinks = [
    {
      to: "/entry-pass",
      icon: QrCode,
      label: "E-Pass Booking",
      isPortal: true,
    },
    { to: "/aarties", icon: Calendar, label: "Sacred Aartis" },
    { to: "/events", icon: Calendar, label: "Local Events" },
    { to: "/planner", icon: Sparkles, label: "AI Planner" },
  ];

  const moreDropdownItems = [
    {
      to: "/temple-view",
      icon: Compass,
      label: "360° Temple View",
    },
    {
      to: "/vip-darshan",
      icon: Crown,
      label: "VIP Darshan",
    },
    {
      to: "/hotels",
      icon: Hotel,
      label: "Stays & Hotels",
    },
    {
      to: "/announcements",
      icon: Megaphone,
      label: "Notices & Alerts",
    },
    {
      to: "/map",
      icon: MapPin,
      label: "Map & Gates",
    },
    {
      to: "/support",
      icon: HelpCircle,
      label: "24/7 Support",
    },
  ];

  const isMoreActive = [
    "/temple-view",
    "/navigation",
    "/hotels",
    "/announcements",
    "/vip-darshan",
    "/map",
    "/support",
  ].includes(location.pathname);
  const isHomePage = location.pathname === "/";

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top py-2.5 ${
        isHomePage ? "is-home-page" : "is-inner-page"
      } ${scrolled || mobileOpen ? "bg-black shadow-lg" : "bg-transparent"}`}
      style={{
        backdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled || mobileOpen ? "blur(16px)" : "none",
        transition:
          "background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease",
        zIndex: 1040,
      }}
    >
      <div className="container-fluid max-w-7xl mx-auto px-3 px-md-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2 me-3"
        >
          <div
            className="rounded-circle bg-warning text-dark p-2 d-flex align-items-center justify-content-center fw-bold shadow-sm"
            style={{ width: 38, height: 38, fontSize: "1.1rem" }}
          >
            🕉️
          </div>
          <div>
            <span
              className={`h5 mb-0 text-white fw-bold ${styles.playfairFont}`}
              style={{ whiteSpace: "nowrap" }}
            >
              MAHAKAL <span className="text-warning">SMART YATRA</span>
            </span>
            <small
              className="d-block text-warning text-uppercase"
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                whiteSpace: "nowrap",
              }}
            >
              Ujjain Portal
            </small>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-warning p-1"
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Nav Links & Single Primary User Actions */}
        <div
          className={`collapse navbar-collapse ${
            mobileOpen
              ? "show bg-black p-3 rounded-4 mt-2 border border-warning border-opacity-25 shadow-2xl"
              : ""
          }`}
        >
          <ul
            className="navbar-nav ms-auto align-items-lg-center gap-lg-1 gap-md-2 gap-2 flex-nowrap"
            style={{ whiteSpace: "nowrap" }}
          >
            {navLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = location.pathname === link.to;

              if (link.isPortal) {
                return (
                  <li key={link.to} className="nav-item">
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        if (onOpenPassPortal) onOpenPassPortal();
                      }}
                      className={`nav-link px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-2 transition-all small fw-semibold border-0 bg-transparent ${
                        isActive
                          ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-30"
                          : "text-light text-opacity-90 hover-text-warning"
                      }`}
                      style={{
                        fontSize: "0.84rem",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      <IconComp
                        size={16}
                        className={`flex-shrink-0 ${
                          isActive ? "text-warning" : "text-warning opacity-75"
                        }`}
                      />
                      <span className="lh-1 d-inline-block">{link.label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={link.to} className="nav-item">
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-2 transition-all small fw-semibold ${
                      isActive
                        ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-30"
                        : "text-light text-opacity-90 hover-text-warning"
                    }`}
                    style={{ fontSize: "0.84rem", whiteSpace: "nowrap" }}
                  >
                    <IconComp
                      size={16}
                      className={`flex-shrink-0 ${
                        isActive ? "text-warning" : "text-warning opacity-75"
                      }`}
                    />
                    <span className="lh-1 d-inline-block">{link.label}</span>
                  </Link>
                </li>
              );
            })}

            {/* MORE DROPDOWN MENU */}
            <li className="nav-item position-relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`nav-link px-3 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 transition-all small fw-semibold border-0 bg-transparent ${
                  moreOpen || isMoreActive
                    ? "text-warning bg-warning bg-opacity-10 border border-warning border-opacity-30"
                    : "text-light text-opacity-90 hover-text-warning"
                }`}
                style={{
                  fontSize: "0.84rem",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                <MoreHorizontal
                  size={16}
                  className="text-warning flex-shrink-0"
                />
                <span className="lh-1 d-inline-block">More</span>
                <ChevronDown
                  size={14}
                  className={`text-warning opacity-75 transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Dropdown Popover */}
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="navbar-more-popover position-absolute end-0 mt-2 p-2 rounded-4 shadow-2xl z-3 overflow-hidden"
                    style={{
                      width: "235px",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      backgroundColor: "rgba(12, 12, 12, 0.98)",
                      boxShadow:
                        "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(245, 158, 11, 0.15)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                    }}
                  >
                    {/* Dropdown List Items */}
                    <div className="d-flex flex-column gap-1.5">
                      {moreDropdownItems.map((item, idx) => {
                        const ItemIcon = item.icon;
                        const isCurrentRoute = location.pathname === item.to;
                        const itemContent = (
                          <motion.div
                            whileHover={{
                              x: 4,
                              backgroundColor: "rgba(245, 158, 11, 0.14)",
                            }}
                            transition={{ duration: 0.15 }}
                            className={`d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 transition-all ${
                              isCurrentRoute
                                ? "bg-warning bg-opacity-15 text-warning fw-bold"
                                : "text-white"
                            }`}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-3 p-1.5 bg-warning bg-opacity-10 border border-warning border-opacity-25 text-warning d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ width: 32, height: 32 }}
                              >
                                <ItemIcon size={16} />
                              </div>
                              <span
                                className="fw-semibold text-white transition-colors"
                                style={{ fontSize: "0.88rem" }}
                              >
                                {item.label}
                              </span>
                            </div>
                            <ChevronRight
                              size={14}
                              className="text-warning opacity-50 flex-shrink-0 ms-2"
                            />
                          </motion.div>
                        );

                        return (
                          <Link
                            key={idx}
                            to={item.to}
                            onClick={() => {
                              setMoreOpen(false);
                              setMobileOpen(false);
                            }}
                            className="text-decoration-none d-block rounded-3"
                          >
                            {itemContent}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* SINGLE UNIFIED USER AUTH / ACTION CONTROLS */}
            <li className="nav-item ms-lg-2 ps-lg-2 border-start-lg border-secondary border-opacity-25">
              {user ? (
                <div
                  className="d-flex align-items-center gap-2 flex-nowrap"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {/* For Admin Users: Show ONLY Admin Panel button (No Profile button) */}
                  {user.role === "official" || user.role === "admin" ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="btn btn-warning btn-sm text-dark rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-bold text-decoration-none shadow-sm"
                      style={{
                        fontSize: "0.82rem",
                        height: "36px",
                        whiteSpace: "nowrap",
                      }}
                      title="Mahakal Admin Panel"
                    >
                      <ShieldCheck size={15} className="flex-shrink-0" />
                      <span className="lh-1">Admin Panel</span>
                    </Link>
                  ) : (
                    <>
                      {/* User Profile Badge Button for Devotees / Hotel Partners */}
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-semibold text-decoration-none shadow-sm"
                        style={{
                          fontSize: "0.82rem",
                          height: "36px",
                          whiteSpace: "nowrap",
                        }}
                        title="View Profile & Booked Passes"
                      >
                        <User
                          size={15}
                          className="text-warning flex-shrink-0"
                        />
                        <span className="lh-1">{user.name}</span>
                      </Link>

                      {/* Hotel Dashboard for Hotel Partners */}
                      {user.role === "hotel" && (
                        <Link
                          to="/hotel-dashboard"
                          onClick={() => setMobileOpen(false)}
                          className="btn btn-warning btn-sm text-dark rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-bold text-decoration-none shadow-sm"
                          style={{
                            fontSize: "0.82rem",
                            height: "36px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Building size={15} className="flex-shrink-0" />
                          <span className="lh-1">Hotel Dashboard</span>
                        </Link>
                      )}
                    </>
                  )}

                  {/* Single Sign Out Button */}
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="btn btn-danger btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center justify-content-center gap-2 font-semibold shadow-sm"
                    style={{
                      fontSize: "0.82rem",
                      height: "36px",
                      whiteSpace: "nowrap",
                    }}
                    title="Sign Out of Session"
                  >
                    <LogOut size={15} className="flex-shrink-0" />
                    <span className="lh-1">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div
                  className="d-flex align-items-center gap-2 flex-nowrap"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <button
                    className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all d-inline-flex align-items-center justify-content-center"
                    style={{
                      fontSize: "0.82rem",
                      height: "36px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAuth("login");
                    }}
                  >
                    <span className="lh-1">Sign In</span>
                  </button>
                  <button
                    className="btn btn-warning btn-sm text-dark rounded-pill px-3 py-1.5 fw-bold transition-all shadow-sm d-inline-flex align-items-center justify-content-center"
                    style={{
                      fontSize: "0.82rem",
                      height: "36px",
                      whiteSpace: "nowrap",
                      background:
                        "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
                      border: "none",
                    }}
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAuth("signup");
                    }}
                  >
                    <span className="lh-1">Register</span>
                  </button>
                </div>
              )}
            </li>

            {/* GLOBAL LIGHT/DARK THEME SWITCHER */}
            <li className="nav-item ms-lg-2 me-lg-1 position-relative d-flex align-items-center">
              {/* Sparkle Particle Explosions */}
              {sparkles.map((sp) => (
                <motion.span
                  key={sp.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                  animate={{
                    x: Math.cos(sp.angle) * sp.distance,
                    y: Math.sin(sp.angle) * sp.distance,
                    opacity: [1, 1, 0],
                    scale: [0.6, 1.2, 0.4],
                  }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-8px",
                    marginLeft: "-8px",
                    pointerEvents: "none",
                    fontSize: "12px",
                    zIndex: 100,
                  }}
                >
                  {sp.symbol}
                </motion.span>
              ))}

              {/* Previous Circular Button Design */}
              <motion.button
                whileHover={{ scale: 1.12, rotate: 15 }}
                whileTap={{ scale: 0.88, rotate: -30 }}
                onClick={toggleTheme}
                className="btn btn-outline-warning btn-sm rounded-circle p-0 d-inline-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "38px",
                  height: "38px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(0, 0, 0, 0.4)"
                      : "rgba(255, 255, 255, 0.9)",
                  boxShadow:
                    theme === "dark"
                      ? "0 0 15px rgba(251, 191, 36, 0.35)"
                      : "0 0 15px rgba(217, 119, 6, 0.25)",
                  border: "1px solid rgba(251, 191, 36, 0.5)",
                }}
                title={
                  theme === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                }
                aria-label="Toggle Global Theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -12, opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ y: 12, opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.22, ease: "backOut" }}
                  >
                    {theme === "dark" ? (
                      <Sun size={20} className="text-warning" />
                    ) : (
                      <Moon size={20} className="text-warning" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </li>
          </ul>
        </div>
      </div>

      {/* FULL-SCREEN RADIAL CELESTIAL THEME SWEEP OVERLAY */}
      <AnimatePresence>
        {isAnimatingTheme && (
          <motion.div
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: 3, opacity: [0.95, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: themeOrigin.y,
              left: themeOrigin.x,
              width: "120vmax",
              height: "120vmax",
              marginTop: "-60vmax",
              marginLeft: "-60vmax",
              borderRadius: "50%",
              pointerEvents: "none",
              zIndex: 9999,
              background:
                theme === "light"
                  ? "radial-gradient(circle, rgba(254,243,199,0.98) 0%, rgba(251,191,36,0.7) 35%, rgba(247,246,240,0.98) 100%)"
                  : "radial-gradient(circle, rgba(30,27,75,0.98) 0%, rgba(15,23,42,0.9) 45%, rgba(0,0,0,0.98) 100%)",
              boxShadow:
                theme === "light"
                  ? "0 0 100px rgba(251, 191, 36, 0.8)"
                  : "0 0 100px rgba(124, 58, 237, 0.8)",
            }}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
