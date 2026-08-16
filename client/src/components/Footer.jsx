import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Globe, Heart } from "lucide-react";
import styles from "../styles/custom.module.css";

export function Footer() {
  return (
    <footer className="bg-black text-light border-top border-warning border-opacity-25 pt-5 pb-4">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Description */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle bg-warning text-dark p-2 d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 36, height: 36 }}
              >
                🕉️
              </div>
              <span
                className={`h4 mb-0 fw-bold ${styles.playfairFont}`}
              >
                <span className="footer-brand-name">MAHAKAL</span>{" "}
                <span className="text-warning">SMART YATRA</span>
              </span>
            </div>
            <p className="text-secondary small">
              Official Digital Pilgrimage & Heritage Experience Portal for Shri
              Mahakaleshwar Jyotirlinga, Shri Mahakal Lok Corridor, and Sacred
              Temples of Ujjain.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-warning text-uppercase fw-semibold mb-3 small">
              Quick Links
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>
                <Link
                  to="/temples"
                  className="text-secondary text-decoration-none hover-warning"
                >
                  Shrines & 360°
                </Link>
              </li>
              <li>
                <Link
                  to="/vip-darshan"
                  className="text-secondary text-decoration-none hover-warning"
                >
                  VIP Darshan Passes
                </Link>
              </li>
              <li>
                <Link
                  to="/aarties"
                  className="text-secondary text-decoration-none hover-warning"
                >
                  Sacred Aartis
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-secondary text-decoration-none hover-warning"
                >
                  Local Events
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="text-secondary text-decoration-none hover-warning"
                >
                  Pilgrimage Stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Shrines */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-warning text-uppercase fw-semibold mb-3 small">
              Sacred Avantika Shrines
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>Shri Mahakaleshwar Jyotirlinga</li>
              <li>Kal Bhairav Temple</li>
              <li>Harsiddhi Mata Shaktipeeth</li>
              <li>Chintaman Ganesh Temple</li>
              <li>Mangalnath Temple</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-warning text-uppercase fw-semibold mb-3 small">
              Pilgrimage Assistance
            </h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <MapPin size={16} className="text-warning" /> Mahakal Marg,
                Ujjain MP 456001
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-warning" /> Helpline:
                0734-2550563
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-warning" />{" "}
                support@mahakalsmartyatra.org
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-secondary small">
          <p className="mb-0">
            © 2026 Mahakal Smart Yatra Pilgrimage Portal. Dedicated to Lord Shri
            Mahakaleshwar.
          </p>
          <p className="mb-0">
            Designed with devotion for Avantika Kshetra Pilgrims.
          </p>
        </div>
      </div>
    </footer>
  );
}
