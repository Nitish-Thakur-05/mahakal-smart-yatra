import React, { useState, useEffect } from "react";
import { Megaphone, X, Bell } from "lucide-react";
import axios from "axios";

export function SiteAlertTicker() {
  const [alert, setAlert] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  const fetchAlert = async () => {
    try {
      const res = await axios.get("/api/admin/alert-public");
      if (res.data) setAlert(res.data);
    } catch (err) {
      // Silently ignore
    }
  };

  useEffect(() => {
    fetchAlert();
    const handleUpdate = () => fetchAlert();
    window.addEventListener("site-alert-updated", handleUpdate);
    return () => window.removeEventListener("site-alert-updated", handleUpdate);
  }, []);

  useEffect(() => {
    // Dynamically adjust fixed navbar top position when alert bar is active
    const nav = document.querySelector(".navbar.fixed-top");
    if (nav) {
      if (alert?.isActive && alert?.message && !dismissed) {
        nav.style.top = "38px";
      } else {
        nav.style.top = "0px";
      }
    }
    return () => {
      if (nav) nav.style.top = "0px";
    };
  }, [alert, dismissed]);

  if (!alert || !alert.isActive || dismissed || !alert.message) {
    return null;
  }

  const themeConfig = {
    warning: {
      bg: "linear-gradient(90deg, #180e00 0%, #361f00 25%, #6e3009 50%, #361f00 75%, #180e00 100%)",
      border: "rgba(251, 191, 36, 0.45)",
      glow: "rgba(251, 191, 36, 0.25)",
      badgeBg: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
      badgeText: "#180e00",
      textColor: "#ffffff",
    },
    danger: {
      bg: "linear-gradient(90deg, #1a0505 0%, #450a0a 25%, #7f1d1d 50%, #450a0a 75%, #1a0505 100%)",
      border: "rgba(248, 113, 113, 0.5)",
      glow: "rgba(248, 113, 113, 0.25)",
      badgeBg: "linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)",
      badgeText: "#1a0505",
      textColor: "#ffffff",
    },
    info: {
      bg: "linear-gradient(90deg, #06152b 0%, #172554 25%, #1e40af 50%, #172554 75%, #06152b 100%)",
      border: "rgba(96, 165, 250, 0.5)",
      glow: "rgba(96, 165, 250, 0.25)",
      badgeBg: "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)",
      badgeText: "#06152b",
      textColor: "#ffffff",
    },
    success: {
      bg: "linear-gradient(90deg, #022018 0%, #064e3b 25%, #047857 50%, #064e3b 75%, #022018 100%)",
      border: "rgba(52, 211, 153, 0.5)",
      glow: "rgba(52, 211, 153, 0.25)",
      badgeBg: "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)",
      badgeText: "#022018",
      textColor: "#ffffff",
    },
  };

  const style = themeConfig[alert.alertType] || themeConfig.warning;

  return (
    <div
      className="site-alert-marquee-bar position-fixed top-0 start-0 w-100"
      style={{
        zIndex: 1050,
        background: style.bg,
        borderBottom: `1px solid ${style.border}`,
        height: "38px",
        overflow: "hidden",
        color: style.textColor,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: `0 4px 20px ${style.glow}`,
      }}
    >
      <div className="d-flex align-items-center h-100 px-3 position-relative">
        {/* Marquee Text Container */}
        <div className="flex-grow-1 overflow-hidden position-relative h-100 d-flex align-items-center">
          <div
            className="marquee-track d-flex align-items-center gap-5"
            style={{
              whiteSpace: "nowrap",
              animation: `marqueeScroll ${alert.speed || 25}s linear infinite`,
              fontSize: "0.88rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              textShadow: "0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            <span className="d-inline-flex align-items-center gap-2">
              <Megaphone size={14} className="text-warning flex-shrink-0" />{" "}
              {alert.message}
            </span>
            <span className="text-warning opacity-75 fs-6">🔱</span>
            <span className="d-inline-flex align-items-center gap-2">
              <Megaphone size={14} className="text-warning flex-shrink-0" />{" "}
              {alert.message}
            </span>
            <span className="text-warning opacity-75 fs-6">🔱</span>
            <span className="d-inline-flex align-items-center gap-2">
              <Megaphone size={14} className="text-warning flex-shrink-0" />{" "}
              {alert.message}
            </span>
          </div>
        </div>

        {/* Right Close Button */}
        <button
          onClick={() => setDismissed(true)}
          className="btn btn-link p-1 text-white text-opacity-75 hover-text-white ms-3 flex-shrink-0 rounded-circle"
          style={{ textDecoration: "none", transition: "all 0.2s ease" }}
          title="Dismiss Announcement Bar"
        >
          <X size={16} />
        </button>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .pulse-dot {
          animation: pulseGlow 1.5s infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
}
