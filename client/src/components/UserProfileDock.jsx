import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Ticket, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import styles from "../styles/custom.module.css";

export function UserProfileDock({ user, onLogout }) {
  const location = useLocation();

  // Hide dock if user is not logged in OR if user is an Admin OR on Admin page
  if (
    !user ||
    user.role === "admin" ||
    user.role === "official" ||
    location.pathname === "/admin"
  )
    return null;

  return (
    <div
      className="position-fixed"
      style={{ top: "85px", right: "20px", zIndex: 1060 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-black bg-opacity-95 border border-warning border-opacity-50 rounded-pill p-1.5 pe-3 shadow-2xl d-flex align-items-center gap-2 backdrop-blur"
        style={{
          backdropFilter: "blur(16px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
        }}
      >
        {/* Direct Profile Badge */}
        <Link
          to="/profile"
          className="d-flex align-items-center gap-2 text-decoration-none px-3 py-1.5 rounded-pill bg-dark border border-warning border-opacity-40 hover-gold transition-all"
        >
          <div
            className="rounded-circle bg-warning text-dark p-1 d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 26, height: 26, fontSize: "0.78rem" }}
          >
            {user.name ? user.name[0].toUpperCase() : "U"}
          </div>
          <span
            className="text-white fw-bold small"
            style={{ fontSize: "0.84rem" }}
          >
            {user.name}
          </span>
        </Link>

        {/* Passes Quick Link */}
        <Link
          to="/profile"
          className="btn btn-outline-warning btn-sm rounded-pill px-2.5 py-1 d-none d-sm-inline-flex align-items-center gap-1 small text-nowrap"
          style={{ fontSize: "0.78rem" }}
          title="My Booked Aarti Passes"
        >
          <Ticket size={13} /> Passes
        </Link>

        {/* Admin Panel Quick Link for Officials */}
        {(user.role === "official" || user.role === "admin") && (
          <Link
            to="/admin"
            className="btn btn-warning btn-sm text-dark font-bold rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1 small text-nowrap shadow"
            style={{ fontSize: "0.78rem" }}
            title="Mahakal Admin Dashboard"
          >
            <ShieldCheck size={13} /> Admin Panel
          </Link>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="btn btn-danger btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 font-semibold text-nowrap shadow-sm"
          style={{ fontSize: "0.78rem" }}
          title="Sign Out of Session"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </motion.div>
    </div>
  );
}
