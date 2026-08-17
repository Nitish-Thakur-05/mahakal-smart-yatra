import React from "react";
import { AlertTriangle, MapPin, Compass, RotateCcw, Key } from "lucide-react";
import styles from "../Navigation.module.css";

export function NoCoverage({ onSelectLocation, onResetToTemple, locationName }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isKeyPlaceholder =
    !apiKey || apiKey === "AIzaSy_demo_google_maps_key_placeholder";

  const coveredPoints = [
    {
      name: "Bada Ganesh & Mahakal North Gate",
      lat: 23.1843,
      lng: 75.7691,
    },
    {
      name: "Mahakal Temple Entrance Road",
      lat: 23.1838,
      lng: 75.768,
    },
    {
      name: "Ram Ghat & Shipra River Banks",
      lat: 23.1865,
      lng: 75.7632,
    },
    {
      name: "Harsiddhi Mata Shaktipeeth Marg",
      lat: 23.1821,
      lng: 75.7654,
    },
  ];

  return (
    <div className={styles.loaderOverlay}>
      <div
        className={`${styles.glassCard} p-4 p-md-5 text-center shadow-2xl max-w-lg mx-auto m-3`}
        style={{ maxWidth: "540px" }}
      >
        <div className="rounded-circle bg-warning bg-opacity-15 text-warning p-3 d-inline-flex align-items-center justify-content-center mb-3 border border-warning border-opacity-30">
          <AlertTriangle size={36} />
        </div>

        <h3 className="h4 fw-bold text-white mb-2">
          360° Imagery Status
        </h3>

        {isKeyPlaceholder ? (
          <div className="p-3 mb-4 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-30 text-start">
            <div className="d-flex align-items-center gap-2 text-warning fw-bold mb-1 small">
              <Key size={16} /> Google Maps API Key Setup Required
            </div>
            <p className="text-light small mb-0 leading-relaxed" style={{ fontSize: "0.82rem" }}>
              Your <code className="text-warning">client/.env</code> file is currently set to the demo key:
              <br />
              <code className="text-white font-monospace">VITE_GOOGLE_MAPS_API_KEY=AIzaSy_demo_google_maps_key_placeholder</code>
              <br /><br />
              To enable live Google Street View 360° rendering for Mahakaleshwar Temple, replace this placeholder in your <code className="text-warning">.env</code> file with an active Google Maps API Key.
            </p>
          </div>
        ) : (
          <p className="text-secondary small mb-4 leading-relaxed">
            {locationName ? (
              <>
                Google Street View 360° coverage is currently unavailable directly
                at <strong className="text-warning">{locationName}</strong>.
              </>
            ) : (
              <>
                360° street view imagery is not currently available at this exact
                coordinate.
              </>
            )}
            <br />
            Due to sanctum security & sacred sanctuary rules, 360° street view coverage is concentrated around outer entrance gates, corridors & riverfronts.
          </p>
        )}

        <div className="mb-4 text-start">
          <div className="text-warning small fw-bold text-uppercase mb-2.5 d-flex align-items-center gap-1.5" style={{ letterSpacing: "0.05em" }}>
            <Compass size={14} /> Explore Nearby 360° Locations:
          </div>
          <div className="d-flex flex-column gap-2">
            {coveredPoints.map((pt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectLocation(pt.lat, pt.lng, pt.name)}
                className="btn btn-outline-warning btn-sm text-start rounded-3 p-2.5 d-flex align-items-center justify-content-between transition-all border-opacity-30"
                style={{ fontSize: "0.85rem" }}
              >
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={15} className="text-warning flex-shrink-0" />
                  <span className="text-white fw-semibold">{pt.name}</span>
                </div>
                <span className="badge bg-warning text-dark font-bold">
                  Try 360°
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-2 pt-2 border-top border-secondary border-opacity-25">
          <button
            onClick={onResetToTemple}
            className="btn btn-warning btn-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
          >
            <RotateCcw size={15} /> Return to Mahakal Plaza
          </button>
        </div>
      </div>
    </div>
  );
}
