import React, { useState } from "react";
import { KEY_TEMPLE_GATES } from "../../TempleMap";
import {
  MapPin,
  Search,
  Compass,
  X,
  Footprints,
} from "lucide-react";
import styles from "../Navigation.module.css";

export function LocationPanel({
  onSelectLandmark,
  onCalculateRoute,
  activeLandmark,
  onClose,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredLandmarks = KEY_TEMPLE_GATES.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameHi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "gates") return item.type === "inside" || item.category.includes("Gate");
    if (filter === "shrines") return item.type === "outside" || item.category.includes("Shrine");
    return true;
  });

  return (
    <div className="d-flex flex-column h-100 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-bottom border-warning border-opacity-25 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Compass size={18} className="text-warning" />
          <h2 className="h6 fw-bold mb-0 text-white">Temple Landmarks</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-warning text-warning p-1 rounded-circle border-0"
            aria-label="Close Landmark Directory"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search Input & Category Filters */}
      <div className="p-3 border-bottom border-secondary border-opacity-20">
        <div className="position-relative mb-2.5">
          <Search
            size={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-warning"
          />
          <input
            type="text"
            className="form-control form-control-sm bg-black bg-opacity-20 text-white border-warning border-opacity-30 rounded-pill ps-5 pe-3"
            placeholder="Search gates, shrines, facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`btn btn-xs rounded-pill px-2.5 py-1 font-semibold ${
              filter === "all"
                ? "btn-warning text-dark font-bold"
                : "btn-outline-secondary text-light border-opacity-30"
            }`}
            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            All ({KEY_TEMPLE_GATES.length})
          </button>
          <button
            onClick={() => setFilter("gates")}
            className={`btn btn-xs rounded-pill px-2.5 py-1 font-semibold ${
              filter === "gates"
                ? "btn-warning text-dark font-bold"
                : "btn-outline-secondary text-light border-opacity-30"
            }`}
            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            Gates & Premises
          </button>
          <button
            onClick={() => setFilter("shrines")}
            className={`btn btn-xs rounded-pill px-2.5 py-1 font-semibold ${
              filter === "shrines"
                ? "btn-warning text-dark font-bold"
                : "btn-outline-secondary text-light border-opacity-30"
            }`}
            style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            Shrines
          </button>
        </div>
      </div>

      {/* Landmark Directory List */}
      <div className={styles.landmarkList}>
        {filteredLandmarks.map((gate) => {
          const parts = gate.coordinates.split(",");
          const lat = parseFloat(parts[0]?.trim());
          const lng = parseFloat(parts[1]?.trim());
          const isActive = activeLandmark?.id === gate.id;

          return (
            <div
              key={gate.id}
              onClick={() => onSelectLandmark(gate, lat, lng)}
              className={`${styles.landmarkItem} ${
                isActive ? styles.landmarkActive : ""
              }`}
            >
              <div className="d-flex align-items-start justify-content-between mb-1">
                <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-40 rounded-pill px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
                  {gate.category}
                </span>
                <span className="text-warning small font-monospace" style={{ fontSize: "0.72rem" }}>
                  {gate.distance}
                </span>
              </div>

              <h3 className="fw-bold text-white mb-0.5" style={{ fontSize: "0.88rem" }}>
                {gate.name}
              </h3>
              <div className="text-warning small font-semibold mb-2" style={{ fontSize: "0.76rem" }}>
                {gate.nameHi}
              </div>

              <p className="text-secondary small mb-2.5 leading-snug line-clamp-2" style={{ fontSize: "0.76rem" }}>
                {gate.desc}
              </p>

              <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLandmark(gate, lat, lng);
                  }}
                  className="btn btn-warning btn-xs rounded-pill px-3 py-1 fw-bold text-dark d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "0.74rem" }}
                >
                  <MapPin size={12} /> Explore 360°
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCalculateRoute(lat, lng, gate.name);
                  }}
                  className="btn btn-outline-warning btn-xs rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "0.74rem" }}
                  title="Get Route Directions"
                >
                  <Footprints size={12} className="text-warning" /> Route
                </button>
              </div>
            </div>
          );
        })}

        {filteredLandmarks.length === 0 && (
          <div className="text-center text-secondary py-5">
            <Search size={28} className="opacity-40 mb-2" />
            <p className="small mb-0">No landmarks match your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
