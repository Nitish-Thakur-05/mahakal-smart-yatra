import React, { useState, useEffect } from "react";
import { KEY_TEMPLE_GATES } from "../../TempleMap";
import {
  MapPin,
  Navigation,
  Footprints,
  Clock,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import styles from "../Navigation.module.css";

// Preset 2D Vector Premises Locations & Corridor Route Paths
const TEMPLE_MAP_NODES = [
  {
    id: "gate_1",
    name: "Gate 1 - Mahakal Lok Plaza",
    shortName: "Gate 1: Mahakal Lok",
    badge: "G1",
    nameHi: "प्रवेश द्वार 1 - महाकाल लोक प्लाजा",
    x: 200,
    y: 390,
    textOffset: { x: 0, y: 24 },
    path: "M 200 390 Q 270 390 340 370 T 410 320 L 450 240",
    distance: "450m • 6 min walk",
    guide: "Enter Gate 1 -> Walk 108 Shiva Corridor Promenade -> Cross Koti Tirth Courtyard -> Garbhagriha Line",
    features: ["Electric Golf Carts", "Shoe Stand 1", "Cloak Room", "Lost & Found"],
    lat: 23.183055,
    lng: 75.768222,
  },
  {
    id: "gate_2",
    name: "Gate 2 - Vikramaditya Plaza Entrance",
    shortName: "Gate 2: Vikramaditya",
    badge: "G2",
    nameHi: "द्वार 2 - विक्रमादित्य उत्तर प्रवेश",
    x: 350,
    y: 80,
    textOffset: { x: 0, y: -18 },
    path: "M 350 80 L 350 130 Q 380 170 420 200 L 450 240",
    distance: "180m • 2.5 min walk",
    guide: "Enter Gate 2 -> Pass Bada Ganesh Entry Lane -> Cross North Courtyard -> Enter Garbhagriha Line",
    features: ["North Queue Line", "Wheelchair Ramp", "Drinking Water Booth"],
    lat: 23.18412,
    lng: 75.76885,
  },
  {
    id: "gate_3",
    name: "Gate 3 - Shankh Gate (East Exit & Rapid Lane)",
    shortName: "Gate 3: Shankh Gate",
    badge: "G3",
    nameHi: "द्वार 3 - शंख द्वार (पूर्व निकास)",
    x: 650,
    y: 240,
    textOffset: { x: 0, y: 24 },
    path: "M 650 240 L 550 240 L 450 240",
    distance: "200m • 3 min walk",
    guide: "Enter Gate 3 -> Pass Prasad & Souvenir Stalls -> East Corridor -> Sanctum Rapid Queue",
    features: ["Rapid Exit Lane", "Trust Prasad Counter", "Water Kiosk"],
    lat: 23.18378,
    lng: 75.76921,
  },
  {
    id: "gate_4",
    name: "Gate 4 - Nandi Hall & Bhasma Aarti Gate",
    shortName: "Gate 4: Nandi Hall",
    badge: "G4",
    nameHi: "द्वार 4 - नंदी हॉल एवं भस्म आरती",
    x: 450,
    y: 350,
    textOffset: { x: 0, y: 24 },
    path: "M 450 350 L 450 240",
    distance: "100m • 1.5 min walk",
    guide: "Enter Gate 4 -> Biometric Pass Scanner -> Change Room Lane -> Direct Entry into Nandi Hall",
    features: ["Bhasma Aarti Pass", "Dress Change Rooms", "Biometric Verification"],
    lat: 23.1835,
    lng: 75.7685,
  },
  {
    id: "gate_5",
    name: "Gate 5 - Protocol, Senior Citizen & Medical Gate",
    shortName: "Gate 5: Protocol",
    badge: "G5",
    nameHi: "द्वार 5 - प्रोटोकॉल एवं वरिष्ठ नागरिक",
    x: 580,
    y: 330,
    textOffset: { x: 0, y: 24 },
    path: "M 580 330 L 510 290 L 450 240",
    distance: "120m • 2 min walk",
    guide: "Enter Gate 5 -> Medical & Protocol Desk -> Elevator Corridor -> Priority Ramp to Sanctum",
    features: ["Elderly Assistance", "Medical First-Aid", "Elevator Ramp"],
    lat: 23.1832,
    lng: 75.769,
  },
  {
    id: "bada_ganesh",
    name: "Bada Ganesh Mandir Plaza",
    shortName: "Bada Ganesh",
    badge: "Shrine",
    nameHi: "श्री बड़ा गणेश मंदिर प्रांगण",
    x: 230,
    y: 90,
    textOffset: { x: 0, y: -18 },
    path: "M 230 90 L 310 130 L 400 190 L 450 240",
    distance: "250m • 3.5 min walk",
    guide: "Bada Ganesh Mandir -> Walk through North Corridor -> Enter Temple Gate 2",
    features: ["Ancient Shrine", "Spiritual Astrologers", "Footwear Counter"],
    lat: 23.1843,
    lng: 75.7684,
  },
  {
    id: "ram_ghat",
    name: "Ram Ghat Riverfront (Shipra River)",
    shortName: "Ram Ghat",
    badge: "Ghat",
    nameHi: "पवित्र रामघाट शिप्रा तट",
    x: 80,
    y: 180,
    textOffset: { x: 0, y: 24 },
    path: "M 80 180 Q 170 180 270 160 T 390 200 L 450 240",
    distance: "750m • 10 min walk",
    guide: "Holy Shipra Ram Ghat -> Walk past Harsiddhi Marg -> Enter Mahakal Lok Corridor Gate 1",
    features: ["Holy Dip Ghat", "Sandhya Aarti", "Boat Rides"],
    lat: 23.1852,
    lng: 75.7628,
  },
];

export function Custom2DTempleMap({
  currentPos,
  activeLandmark,
  onSelectLandmark,
}) {
  const [selectedNode, setSelectedNode] = useState(TEMPLE_MAP_NODES[0]);

  // Sync selected node with activeLandmark or currentPos
  useEffect(() => {
    if (activeLandmark && activeLandmark.id) {
      const match = TEMPLE_MAP_NODES.find((n) => n.id === activeLandmark.id);
      if (match) {
        setSelectedNode(match);
        return;
      }
    }
    if (currentPos && currentPos.name) {
      const match = TEMPLE_MAP_NODES.find(
        (n) =>
          currentPos.name.toLowerCase().includes(n.shortName.toLowerCase()) ||
          n.name.toLowerCase().includes(currentPos.name.toLowerCase())
      );
      if (match) {
        setSelectedNode(match);
      }
    }
  }, [activeLandmark, currentPos]);

  const handleSelectGate = (node) => {
    setSelectedNode(node);
    const gateInfo = KEY_TEMPLE_GATES.find((g) => g.id === node.id) || {
      id: node.id,
      name: node.name,
      nameHi: node.nameHi,
      category: "Premises",
      distance: node.distance,
      desc: node.guide,
      coordinates: `${node.lat}, ${node.lng}`,
    };
    if (onSelectLandmark) {
      onSelectLandmark(gateInfo, node.lat, node.lng);
    }
  };

  return (
    <div className="w-100 position-relative overflow-hidden d-flex flex-column rounded-3 border border-warning border-opacity-30 shadow-lg">
      {/* Sleek Minimal Gate Selector Buttons Bar at Top */}
      <div
        className="p-3 border-bottom border-warning border-opacity-25 d-flex align-items-center gap-2.5 overflow-x-auto"
        style={{
          backgroundColor: "var(--bs-body-bg, #09090f)",
          zIndex: 10,
        }}
      >
        <span
          className="small font-bold me-1 flex-shrink-0 d-flex align-items-center gap-1.5"
          style={{ fontSize: "0.84rem", color: "#f59e0b" }}
        >
          <Navigation size={16} /> Gates & Routes:
        </span>

        {TEMPLE_MAP_NODES.map((node) => {
          const isSelected = selectedNode?.id === node.id;

          return (
            <button
              key={node.id}
              onClick={() => handleSelectGate(node)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-2 transition-all ${
                isSelected ? styles.gateBtnSelected : styles.gateBtn
              }`}
              style={{
                whiteSpace: "nowrap",
                fontSize: "0.8rem",
                flexShrink: 0,
              }}
            >
              <span
                className="badge rounded-pill px-2 py-0.5"
                style={{
                  fontSize: "0.68rem",
                  backgroundColor: isSelected ? "rgba(0,0,0,0.25)" : "rgba(245, 158, 11, 0.25)",
                  color: isSelected ? "currentColor" : "#f59e0b",
                  fontWeight: "bold",
                }}
              >
                {node.badge}
              </span>
              <span className="fw-semibold">
                {node.shortName.split(":")[1] || node.shortName}
              </span>
              {isSelected && <ChevronRight size={14} />}
            </button>
          );
        })}
      </div>

      {/* Main Container: SVG Vector Map + Selected Route Guidance Panel */}
      <div className="d-flex flex-column flex-lg-row w-100">
        {/* SVG Premises Vector Canvas */}
        <div className="flex-grow-1 position-relative" style={{ minHeight: "350px", overflow: "hidden" }}>
          <svg
            viewBox="0 0 760 450"
            preserveAspectRatio="xMidYMid meet"
            className={`w-100 h-100 ${styles.svgPremisesMap}`}
          >
            <defs>
              {/* Grid Pattern */}
              <pattern id="grid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path
                  d="M 38 0 L 0 0 0 38"
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.08)"
                  strokeWidth="1"
                />
              </pattern>

              {/* Glowing Path Gradient */}
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="1" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>

              {/* Pulse Glow Filter */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="760" height="450" fill="url(#grid)" />

            {/* Holy Shipra River (Left Side) */}
            <path
              d="M 15 0 Q 60 225 15 450 L 90 450 Q 135 225 90 0 Z"
              fill="rgba(14, 165, 233, 0.22)"
              stroke="rgba(56, 189, 248, 0.6)"
              strokeWidth="2"
            />
            <text
              x="45"
              y="225"
              fill="#0284c7"
              fontSize="10"
              fontWeight="bold"
              letterSpacing="2"
              transform="rotate(-90 45 225)"
            >
              HOLY SHIPRA RIVER (RAM GHAT)
            </text>

            {/* Temple Outer Boundary Perimeter */}
            <rect
              x="140"
              y="45"
              width="540"
              height="360"
              rx="20"
              fill="none"
              stroke="rgba(245, 158, 11, 0.4)"
              strokeWidth="2"
              strokeDasharray="8 5"
            />
            <text x="160" y="68" className={styles.mapPerimeterText} fontSize="9.5" fontWeight="bold" letterSpacing="1">
              SHRI MAHAKALESHWAR TEMPLE PREMISES PERIMETER
            </text>

            {/* Mahakal Lok 108 Shiva Corridor Promenade */}
            <path
              d="M 170 390 L 310 390 L 400 340"
              fill="none"
              stroke="rgba(245, 158, 11, 0.3)"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <text x="190" y="394" className={styles.mapPerimeterText} fontSize="9.5" fontWeight="bold">
              MAHAKAL LOK 108 SHIVA CORRIDOR PROMENADE
            </text>

            {/* Koti Tirth Kunda Sarovar Water Body */}
            <rect
              x="320"
              y="130"
              width="120"
              height="65"
              rx="12"
              fill="rgba(14, 165, 233, 0.3)"
              stroke="rgba(56, 189, 248, 0.8)"
              strokeWidth="2"
            />
            {/* Water Ripples */}
            <path d="M 335 152 Q 355 148 375 152 T 425 152" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
            <path d="M 335 172 Q 355 168 375 172 T 425 172" fill="none" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" />
            <text x="340" y="166" fill="#0284c7" fontSize="10.5" fontWeight="bold">
              Koti Tirth Kunda
            </text>

            {/* Pedestrian Walking Corridors Lines */}
            <path d="M 350 80 L 350 130" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" strokeDasharray="4 4" />
            <path d="M 650 240 L 450 240" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" strokeDasharray="4 4" />
            <path d="M 450 350 L 450 240" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" strokeDasharray="4 4" />
            <path d="M 580 330 L 450 240" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="4" strokeDasharray="4 4" />

            {/* Animated Glowing Selected Navigation Route */}
            {selectedNode && (
              <g>
                {/* Outer Glow Route */}
                <path
                  d={selectedNode.path}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.5"
                  filter="url(#glow)"
                />
                {/* Animated Dashed Route Line */}
                <path
                  d={selectedNode.path}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="9 6"
                  className="animatedRoute"
                />
              </g>
            )}

            {/* Central Sanctum - Shri Mahakaleshwar Garbhagriha */}
            <g transform="translate(450, 240)" filter="url(#glow)">
              <circle r="34" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2.5" />
              <circle r="22" fill="#f59e0b" />
              <text x="0" y="-2" fill="#000000" fontSize="11" fontWeight="900" textAnchor="middle">
                🕉️
              </text>
              <text x="0" y="9" fill="#000000" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                SANCTUM
              </text>
            </g>
            <text
              x="450"
              y="290"
              className={styles.mapNodeText}
              fontSize="11.5"
              fontWeight="bold"
              textAnchor="middle"
            >
              Shri Mahakaleshwar Garbhagriha
            </text>

            {/* Render Gate Nodes Markers */}
            {TEMPLE_MAP_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleSelectGate(node)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Outer Ring */}
                  <circle
                    r={isSelected ? "17" : "13"}
                    fill={isSelected ? "rgba(239, 68, 68, 0.4)" : "rgba(245, 158, 11, 0.25)"}
                    stroke={isSelected ? "#ef4444" : "#f59e0b"}
                    strokeWidth={isSelected ? "3" : "2"}
                  />
                  {/* Inner Icon Circle */}
                  <circle
                    r={isSelected ? "10" : "7"}
                    fill={isSelected ? "#ef4444" : "#f59e0b"}
                  />

                  {/* Node Label Text */}
                  <text
                    x={node.textOffset?.x || 0}
                    y={node.textOffset?.y || (isSelected ? -22 : -18)}
                    className={isSelected ? styles.mapPerimeterText : styles.mapNodeText}
                    fontSize={isSelected ? "11" : "10"}
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                      transition: "all 0.2s ease",
                    }}
                  >
                    {node.shortName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dedicated Route Guidance Details Side Panel - 100% Crisp White & Gold Text */}
        {selectedNode && (
          <div
            className={`${styles.glassCard} p-3.5 p-md-4 border-start border-warning border-opacity-25 d-flex flex-column justify-content-between`}
            style={{
              width: "100%",
              maxWidth: "380px",
              minWidth: "300px",
            }}
          >
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span
                  className="badge rounded-pill px-3 py-1 text-uppercase font-mono fw-bold"
                  style={{
                    fontSize: "0.72rem",
                    backgroundColor: "#f59e0b",
                    color: "#000000",
                    letterSpacing: "0.5px",
                  }}
                >
                  Route to Sanctum
                </span>
                <span
                  className="fw-bold font-monospace d-flex align-items-center gap-1"
                  style={{ fontSize: "0.84rem", color: "#f59e0b" }}
                >
                  <Clock size={14} style={{ color: "#f59e0b" }} /> {selectedNode.distance}
                </span>
              </div>

              <h3 className="h5 fw-bold mb-1 font-playfair text-body">
                {selectedNode.name}
              </h3>
              <div className="fw-semibold mb-3" style={{ fontSize: "0.82rem", color: "#f59e0b" }}>
                {selectedNode.nameHi}
              </div>

              <div className="p-3 rounded-3 border border-warning border-opacity-30 mb-3" style={{ backgroundColor: "rgba(245, 158, 11, 0.06)" }}>
                <div
                  className="fw-bold d-flex align-items-center gap-1.5 mb-1.5"
                  style={{ fontSize: "0.8rem", color: "#f59e0b" }}
                >
                  <Footprints size={15} style={{ color: "#f59e0b" }} /> Walking Directions:
                </div>
                <p
                  className="small mb-0 leading-relaxed text-body"
                  style={{ fontSize: "0.78rem" }}
                >
                  {selectedNode.guide}
                </p>
              </div>

              <div>
                <div
                  className="small font-bold mb-2"
                  style={{ fontSize: "0.76rem", color: "#e5e7eb" }}
                >
                  Available Gate Facilities:
                </div>
                <div className="d-flex flex-wrap align-items-center gap-1.5">
                  {selectedNode.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="badge rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center"
                      style={{
                        fontSize: "0.72rem",
                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                        color: "#fbbf24",
                        border: "1px solid rgba(245, 158, 11, 0.45)",
                      }}
                    >
                      <CheckCircle size={11} className="me-1" style={{ color: "#f59e0b" }} />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-top border-warning border-opacity-20">
              <button
                onClick={() => handleSelectGate(selectedNode)}
                className="btn btn-warning w-100 rounded-pill py-2.5 fw-bold d-inline-flex align-items-center justify-content-center gap-2 shadow-md"
                style={{
                  fontSize: "0.85rem",
                  backgroundColor: "#f59e0b",
                  color: "#000000",
                  border: "none",
                }}
              >
                <MapPin size={16} style={{ color: "#000000" }} /> Explore {selectedNode.shortName} in 360°
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SVG Animation Keyframes */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -30;
          }
        }
        .animatedRoute {
          animation: dash 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
