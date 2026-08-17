import React from "react";
import { Search, Map, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import styles from "../Navigation.module.css";

export function NavigationControls({
  currentLocationName,
  isMapOpen,
  onToggleMap,
  onOpenLandmarks,
}) {
  return (
    <div className="text-center mb-4 pb-2">
      {/* Page Main Title */}
      <h1 className="display-6 fw-bold text-white mb-2 font-playfair">
        Shri Mahakaleshwar 360° Exploration
      </h1>

      {/* Description */}
      <p className="text-secondary small max-w-2xl mx-auto mb-4 leading-relaxed" style={{ maxWidth: "620px" }}>
        Immersive 360° virtual navigation of Shri Mahakaleshwar Temple premises, Mahakal Lok 108 Shiva Corridor, Koti Tirth Kunda & holy Shipra riverfront.
      </p>

      {/* Action Buttons */}
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
        {/* Landmarks Directory Button */}
        <button
          onClick={onOpenLandmarks}
          className="btn btn-warning rounded-pill px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2 shadow-lg transition-all"
          style={{ fontSize: "0.9rem" }}
        >
          <Search size={17} />
          <span>Explore Temple Landmarks</span>
        </button>

        {/* Toggle Interactive Map Button */}
        <button
          onClick={onToggleMap}
          className="btn btn-outline-warning rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 transition-all"
          style={{ fontSize: "0.9rem" }}
        >
          <Map size={17} />
          <span>{isMapOpen ? "Hide Temple Map" : "Open Temple Map"}</span>
          {isMapOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  );
}
