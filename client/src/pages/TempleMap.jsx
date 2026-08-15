import React, { useState } from "react";
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Car,
  Train,
  Plane,
  Building,
  Sparkles,
  Info,
  Layers,
  Phone,
  CheckCircle,
  Eye,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import styles from "../styles/custom.module.css";

export const KEY_TEMPLE_GATES = [
  {
    id: "gate_1",
    name: "Gate 1 - Mahakal Lok Main Plaza",
    nameHi: "प्रवेश द्वार 1 - महाकाल लोक प्लाजा",
    category: "Main Gate Entry",
    distance: "0m (Main Plaza)",
    timing: "04:00 AM - 11:00 PM",
    desc: "Primary grand entrance for General Darshan queues, Mahakal Lok Corridor promenade, and free electric golf cart drop-off.",
    features: [
      "Shoe Stand 1 & Cloak Room counter available",
      "Free Electric Golf Carts for senior citizens & disabled",
      "Direct entry to 108 ornate Shiva pillars corridor",
      "24x7 Helpdesk & Lost-and-Found center",
    ],
    coordinates: "23.183055, 75.768222",
    googleMapsUrl: "https://maps.google.com/?q=23.183055,75.768222",
  },
  {
    id: "gate_2",
    name: "Gate 2 - Vikramaditya Plaza Entrance",
    nameHi: "द्वार 2 - विक्रमादित्य द्वार (उत्तर प्रवेश)",
    category: "North Gate Entry",
    distance: "120m from Koti Tirth",
    timing: "04:00 AM - 11:00 PM",
    desc: "North entry gate accessible from Bada Ganesh side, providing direct access to Koti Tirth Kunda and fast-moving darshan lines.",
    features: [
      "Direct entry near Bada Ganesh Mandir",
      "Less crowded queue line for morning darshan",
      "Shoe counter & water booth inside perimeter",
      "Wheelchair accessible ramp entry",
    ],
    coordinates: "23.184120, 75.768850",
    googleMapsUrl: "https://maps.google.com/?q=23.184120,75.768850",
  },
  {
    id: "gate_3",
    name: "Gate 3 - Shankh Gate (East Exit & Rapid Lane)",
    nameHi: "द्वार 3 - शंख द्वार (पूर्व निकास)",
    category: "East Gate Entry & Exit",
    distance: "180m from Sanctum",
    timing: "04:00 AM - 10:30 PM",
    desc: "Dedicated east gate for quick exit post-darshan and special fast-moving queue lanes during festivals.",
    features: [
      "Quick exit pathway leading towards Harsiddhi Marg",
      "Filtered drinking water kiosks",
      "Security screening & CCTV monitored lane",
      "Direct exit to trust souvenir & prasad counters",
    ],
    coordinates: "23.183780, 75.769210",
    googleMapsUrl: "https://maps.google.com/?q=23.183780,75.769210",
  },
  {
    id: "gate_4",
    name: "Gate 4 - Nandi Hall & Bhasma Aarti Gate",
    nameHi: "द्वार 4 - नंदी हॉल एवं भस्म आरती प्रवेश",
    category: "Pass Holders & Aarti",
    distance: "150m from Sanctum",
    timing: "03:00 AM - 10:30 PM",
    desc: "Dedicated gate for online & offline Bhasma Aarti pass holders, VIP protocol guests, and Jalabhishek counter.",
    features: [
      "Biometric pass scanner & barcode verification",
      "Dhoti / Saree dress code change rooms",
      "Direct queue lane to Nandi Hall & Garbhagriha",
      "Dedicated line for elders & infants",
    ],
    coordinates: "23.183500, 75.768500",
    googleMapsUrl: "https://maps.google.com/?q=23.183500,75.768500",
  },
  {
    id: "gate_5",
    name: "Gate 5 - Protocol, Senior Citizen & Medical Gate",
    nameHi: "द्वार 5 - प्रोटोकॉल एवं वरिष्ठ नागरिक द्वार",
    category: "VIP & Senior Citizens",
    distance: "90m from Administrative Block",
    timing: "05:00 AM - 10:00 PM",
    desc: "Administrative entrance reserved for protocol guests, senior citizens requiring wheelchairs, and emergency medical access.",
    features: [
      "Wheelchair assistance & dedicated attendants",
      "Direct access to Temple Administrative Office",
      "Emergency First-Aid Post & Medical Room",
      "Priority elevator access for elderly devotees",
    ],
    coordinates: "23.182910, 75.767940",
    googleMapsUrl: "https://maps.google.com/?q=23.182910,75.767940",
  },
  {
    id: "prasad_counter",
    name: "Official Mahakal Ladoo Prasad Counter (Premises Shop)",
    nameHi: "श्री महाकाल शासकीय लड्डू प्रसाद काउंटर",
    category: "Trust Prasad Counter",
    distance: "Inside Gate 1 Plaza",
    timing: "06:00 AM - 10:30 PM",
    desc: "Official prasad counter operated directly by Shri Mahakaleshwar Temple Management Committee offering pure Desi Ghee Besan Ladoo.",
    features: [
      "100% Pure Besan & Shuddh Desi Ghee preparation",
      "Hygiene certified 250g, 500g & 1kg tamper-proof boxes",
      "Digital payment (UPI/Cards) & Cash accepted",
      "Fixed government-regulated trust pricing",
    ],
    coordinates: "23.183300, 75.768400",
    googleMapsUrl: "https://maps.google.com/?q=23.183300,75.768400",
  },
  {
    id: "annakshetra",
    name: "Sattvik Annakshetra Bhojanalaya (Premises Dining)",
    nameHi: "श्री महाकाल अन्नक्षेत्र भोजनालय",
    category: "Trust Dining Hall",
    distance: "100m from Gate 1",
    timing: "11:00 AM - 03:00 PM | 07:00 PM - 09:30 PM",
    desc: "Spacious, ultra-hygienic dining hall inside temple premises serving free & subsidized full Sattvik Mahaprasad thali meals.",
    features: [
      "Air-conditioned clean seating for 2000+ devotees simultaneously",
      "Wholesome meal: Roti, Sabzi, Dal, Rice & Sweet Prasad",
      "Free dining tokens available for pilgrims",
      "RO purified drinking water",
    ],
    coordinates: "23.183900, 75.767900",
    googleMapsUrl: "https://maps.google.com/?q=23.183900,75.767900",
  },
  {
    id: "bhasma_counter",
    name: "Bhasma Aarti Counter & Cloak Room Center",
    nameHi: "भस्म आरती पास काउंटर एवं अमानती घर",
    category: "Pass & Cloak Room",
    distance: "50m from Gate 1",
    timing: "06:00 AM - 10:00 PM",
    desc: "Official offline Bhasma Aarti pass counter, token generation, mobile/electronic luggage locker deposit counter.",
    features: [
      "Token generation for offline morning Bhasma Aarti",
      "Secure mobile & leather item deposit lockers",
      "Pass printout & ID verification desk",
      "CCTV monitored cloak room counter",
    ],
    coordinates: "23.183200, 75.768100",
    googleMapsUrl: "https://maps.google.com/?q=23.183200,75.768100",
  },
  {
    id: "stay_01",
    name: "Pt. Surya Narayan Vyas Atithi Niwas",
    nameHi: "पं. सूर्य नारायण व्यास अतिथि निवास",
    category: "Campus Pilgrim Stay",
    type: "inside",
    distance: "200m inside Gate 1",
    timing: "24 Hours Check-in",
    desc: "Official Shri Mahakaleshwar Temple Trust pilgrim stay inside security perimeter with AC rooms, family suites & parking.",
    features: [
      "Located inside temple security perimeter",
      "Direct walking distance to Garbhagriha & Aarti queues",
      "Luggage storage & 24x7 hot water supply",
      "CCTV monitored trust parking",
    ],
    coordinates: "23.184100, 75.767800",
    googleMapsUrl: "https://maps.google.com/?q=23.184100,75.767800",
  },
  {
    id: "koti_tirth",
    name: "Koti Tirth Kunda & Inner Sanctum Courtyard",
    nameHi: "कोटि तीर्थ कुंड एवं मंदिर प्रांगण",
    category: "Inner Sanctum Complex",
    type: "inside",
    distance: "0m (Inside Temple Courtyard)",
    timing: "04:00 AM - 11:00 PM",
    desc: "Sacred holy water sarovar inside temple inner courtyard surrounded by ancient stone shrines and Maratha architectural pillars.",
    features: [
      "Sacred sarovar water view for devotees",
      "Surrounded by Avanti & Kotieshwar Mahadev shrines",
      "Evening brass oil lamp illuminations",
      "Paved marble pradakshina path",
    ],
    coordinates: "23.183650, 75.768650",
    googleMapsUrl: "https://maps.google.com/?q=23.183650,75.768650",
  },
  {
    id: "kal_bhairav",
    name: "Shri Kal Bhairav Temple",
    nameHi: "श्री काल भैरव मंदिर",
    category: "Outside Temple Shrine",
    type: "outside",
    distance: "4.2 km from Mahakal",
    timing: "05:00 AM - 10:00 PM",
    desc: "Ancient guardian deity of Ujjain where sacred liquor prasad is traditionally offered to the fierce manifestation of Lord Shiva.",
    features: [
      "10 mins drive by Auto / E-Rickshaw from Mahakal",
      "Ancient Maratha architecture & Shipra river backdrop",
      "Official trust prasad stalls & parking",
      "Must-visit shrine post Mahakal Darshan",
    ],
    coordinates: "23.212300, 75.772500",
    googleMapsUrl: "https://maps.google.com/?q=23.212300,75.772500",
  },
  {
    id: "harsiddhi",
    name: "Harsiddhi Mata Shaktipeeth",
    nameHi: "मां हरसिद्धि शक्तिपीठ मंदिर",
    category: "Outside Temple Shrine",
    type: "outside",
    distance: "350m from Mahakal",
    timing: "05:00 AM - 11:00 PM",
    desc: "One of 51 holy Shaktipeeths where Devi Sati's elbow fell. Famous for its 51-foot twin deepstambha lamp towers.",
    features: [
      "5 mins walking distance from Mahakal Gate 1",
      "Spectacular 1008-lamp lighting ceremony during evening",
      "Historic shrine built by Samrat Vikramaditya",
      "Peaceful courtyard for meditation",
    ],
    coordinates: "23.182100, 75.765400",
    googleMapsUrl: "https://maps.google.com/?q=23.182100,75.765400",
  },
  {
    id: "mangalnath",
    name: "Shri Mangalnath Temple",
    nameHi: "श्री मंगलनाथ मंदिर",
    category: "Outside Temple Shrine",
    type: "outside",
    distance: "5.8 km from Mahakal",
    timing: "06:00 AM - 09:00 PM",
    desc: "Birthplace of Planet Mars (Mangal Graha) according to Matsya Purana. Famous for Mangal Dosh Bhaat Puja rituals.",
    features: [
      "Panoramic Shipra river bend view",
      "Special Bhaat Puja counters for planetary peace",
      "15 mins drive from Mahakal Temple",
      "Spacious parking & prasad counters",
    ],
    coordinates: "23.219800, 75.779400",
    googleMapsUrl: "https://maps.google.com/?q=23.219800,75.779400",
  },
  {
    id: "ram_ghat",
    name: "Ram Ghat & Shipra River Banks",
    nameHi: "रामघाट एवं पवित्र शिप्रा नदी तट",
    category: "Holy Bathing Ghat",
    type: "outside",
    distance: "700m from Mahakal",
    timing: "Open 24 Hours (Aarti at 07:00 PM)",
    desc: "Ancient riverbank for holy Kshipra Snan, evening 1000 Deep Dan, Pitra Dosh Tarpan, and daily Shipra Aarti.",
    features: [
      "Safely paved stone steps with safety railings & divers",
      "Daily grand 108-lamp Shipra Aarti at 07:00 PM",
      "Boating facilities & serene sunset view",
      "Change rooms & locker facilities for bathers",
    ],
    coordinates: "23.186500, 75.763200",
    googleMapsUrl: "https://maps.google.com/?q=23.186500,75.763200",
  },
  {
    id: "chintaman",
    name: "Chintaman Ganesh Temple",
    nameHi: "श्री चिंतामन गणेश मंदिर",
    category: "Outside Temple Shrine",
    type: "outside",
    distance: "7.0 km from Mahakal",
    timing: "05:00 AM - 10:00 PM",
    desc: "Swayambhu Lord Ganesha temple built during the reign of King Vikramaditya, believed to relieve all worldly worries (Chinta).",
    features: [
      "Houses three manifestations: Chintaman, Icchaman & Ichhapuran",
      "Historic stone carved temple complex",
      "Special Wednesday Modak offering rush",
      "Ample parking area",
    ],
    coordinates: "23.165400, 75.728900",
    googleMapsUrl: "https://maps.google.com/?q=23.165400,75.728900",
  },
  {
    id: "sandipani",
    name: "Maharshi Sandipani Ashram",
    nameHi: "महर्षि सांदीपनि आश्रम",
    category: "Outside Sacred Ashram",
    type: "outside",
    distance: "4.8 km from Mahakal",
    timing: "06:00 AM - 07:30 PM",
    desc: "Vedic Gurukul where Lord Shri Krishna, Balarama, and Sudama learned 64 arts and 14 vidyas from Guru Sandipani.",
    features: [
      "Gomti Kund water spring inside ashram",
      "Ancient standing Lord Shiva idol holding trident",
      "Serene green heritage trees campus",
      "Free entry for all pilgrims",
    ],
    coordinates: "23.204500, 75.781200",
    googleMapsUrl: "https://maps.google.com/?q=23.204500,75.781200",
  },
  {
    id: "gadhkalika",
    name: "Gadhkalika Mata Temple",
    nameHi: "मां गढ़कालिका मंदिर",
    category: "Outside Temple Shrine",
    type: "outside",
    distance: "4.5 km from Mahakal",
    timing: "06:00 AM - 09:30 PM",
    desc: "Ancient Shakti shrine worshipped by Mahakavi Kalidasa, who gained literary genius through Devi Gadhkalika's grace.",
    features: [
      "Ancient mound (Gadh) archaeological site",
      "Special Navratri & Ashtami celebrations",
      "5 mins drive from Sandipani Ashram",
      "Peaceful spiritual atmosphere",
    ],
    coordinates: "23.208900, 75.775100",
    googleMapsUrl: "https://maps.google.com/?q=23.208900,75.775100",
  },
  {
    id: "bada_ganesh",
    name: "Bada Ganesh Mandir",
    nameHi: "श्री बड़ा गणेश मंदिर",
    category: "Outside Temple Shrine",
    type: "outside",
    distance: "100m from Mahakal Gate 2",
    timing: "05:00 AM - 10:30 PM",
    desc: "Features a colossal 18-foot idol of Lord Ganesha made of jaggery, saptamrtika, and holy water. Center for Sanskrit learning.",
    features: [
      "1 minute walk from Mahakal Gate 2",
      "Panchmukhi Hanuman idol inside campus",
      "Rare astrology & Sanskrit research library",
      "Daily evening Aarti",
    ],
    coordinates: "23.184300, 75.769100",
    googleMapsUrl: "https://maps.google.com/?q=23.184300,75.769100",
  },
];

export function TempleMap() {
  const [activeTab, setActiveTab] = useState("map"); // 'map', 'streetview', 'gates'
  const [filterCategory, setFilterCategory] = useState("all"); // 'all', 'inside', 'outside'

  const filteredLocations = KEY_TEMPLE_GATES.filter((item) => {
    if (filterCategory === "inside") return item.type === "inside";
    if (filterCategory === "outside") return item.type === "outside";
    return true;
  });

  const handleShareMap = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Shri Mahakaleshwar Temple 3D Map",
          text: "Interactive Map & Street View of Shri Mahakaleshwar Jyotirlinga, Ujjain",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Map link copied to clipboard!");
    }
  };

  return (
    <div
      className="bg-black min-vh-100 text-white pb-5"
      style={{ paddingTop: "110px" }}
    >
      <div className="container py-4 max-w-7xl mx-auto">
        {/* Header Section - Same styling as LocalEvents.jsx */}
        <div className="text-center mb-5">
          <h1
            className={`display-5 fw-bold text-white mb-0 ${styles.playfairFont}`}
          >
            Mahakal Temple 3D & Street View Map
          </h1>
        </div>

        {/* Tab Selection Bar - Matching LocalEvents filter aesthetic */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab("map")}
            className={`btn rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${
              activeTab === "map"
                ? "btn-warning text-dark shadow-lg font-bold"
                : "btn-outline-secondary text-light border-opacity-30 hover-border-warning"
            }`}
            style={{ fontSize: "0.9rem" }}
          >
            <MapPin size={17} />
            <span>Interactive Google Map</span>
          </button>

          <button
            onClick={() => setActiveTab("streetview")}
            className={`btn rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${
              activeTab === "streetview"
                ? "btn-warning text-dark shadow-lg font-bold"
                : "btn-outline-secondary text-light border-opacity-30 hover-border-warning"
            }`}
            style={{ fontSize: "0.9rem" }}
          >
            <Eye size={17} />
            <span>360° Street View & Panorama</span>
          </button>

          <button
            onClick={() => setActiveTab("gates")}
            className={`btn rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${
              activeTab === "gates"
                ? "btn-warning text-dark shadow-lg font-bold"
                : "btn-outline-secondary text-light border-opacity-30 hover-border-warning"
            }`}
            style={{ fontSize: "0.9rem" }}
          >
            <Compass size={17} />
            <span>Key Gates & Facilities ({KEY_TEMPLE_GATES.length})</span>
          </button>
        </div>

        {/* MAIN EMBEDDED MAP DISPLAY AREA */}
        <div className="mb-5">
          <div className="p-3 bg-dark rounded-4 border border-warning border-opacity-30 shadow-2xl position-relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25 px-2">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-40 rounded-pill px-3 py-1.5 fs-7 fw-bold d-inline-flex align-items-center gap-1.5">
                  <Sparkles size={14} /> LIVE HD EMBED
                </span>
                <span className="text-secondary small d-none d-md-inline">
                  Shri Mahakaleshwar Jyotirlinga, Ujjain, MP
                </span>
              </div>

              <div className="d-flex align-items-center gap-2">
                <a
                  href="https://maps.google.com/?q=Shri+Mahakaleshwar+Jyotirlinga+Temple+Ujjain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-warning btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold text-decoration-none"
                  style={{ fontSize: "0.82rem" }}
                >
                  <Navigation size={14} />
                  <span>Open Live GPS</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  onClick={handleShareMap}
                  className="btn btn-outline-light btn-sm rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold"
                  style={{ fontSize: "0.82rem" }}
                >
                  <Navigation size={14} /> Share
                </button>
              </div>
            </div>

            {/* TAB CONTENT: 1. GOOGLE MAP EMBED */}
            {activeTab === "map" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-3 overflow-hidden border border-secondary border-opacity-30"
                style={{ height: "540px", position: "relative" }}
              >
                <iframe
                  title="Shri Mahakaleshwar Temple Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.6974116480566!2d75.76822237599026!3d23.183055510406834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82ab91e32e15c3!2sShri%20Mahakaleshwar%20Jyotirlinga%20Temple!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </motion.div>
            )}

            {/* TAB CONTENT: 2. STREET VIEW EMBED */}
            {activeTab === "streetview" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="rounded-3 overflow-hidden border border-secondary border-opacity-30 position-relative"
                style={{ height: "540px" }}
              >
                <iframe
                  title="Shri Mahakaleshwar Temple Street View 360"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.6974116480566!2d75.76822237599026!3d23.183055510406834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39637469de00ff23%3A0x7f82ab91e32e15c3!2sShri%20Mahakaleshwar%20Jyotirlinga%20Temple!5e1!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div
                  className="position-absolute bottom-0 start-0 m-3 p-3 rounded-4 bg-black bg-opacity-90 border border-warning border-opacity-40 text-white shadow-2xl"
                  style={{ maxWidth: "340px", backdropFilter: "blur(12px)" }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1 text-warning fw-bold small">
                    <Eye size={16} /> 360° Interactive Street View
                  </div>
                  <p
                    className="text-secondary small mb-0"
                    style={{ fontSize: "0.78rem" }}
                  >
                    Drag mouse or finger on the screen to look 360 degrees
                    around the sanctum corridor and surrounding holy plazas.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: 3. GATES DIRECTORY OVERVIEW */}
            {activeTab === "gates" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-3 bg-black bg-opacity-50 rounded-3"
              >
                <div className="row g-3">
                  {KEY_TEMPLE_GATES.map((gate) => (
                    <div key={gate.id} className="col-12 col-md-6 col-lg-4">
                      <div className="p-3.5 bg-dark rounded-4 border border-warning border-opacity-20 hover-border-warning transition-all h-100 d-flex flex-column justify-content-between">
                        <div>
                          <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-2.5 py-1 mb-2 font-semibold fs-7">
                            {gate.category}
                          </span>
                          <h5 className="fw-bold text-white mb-1">
                            {gate.name}
                          </h5>
                          <div className="text-warning small mb-2">
                            {gate.nameHi}
                          </div>
                          <p className="text-secondary small mb-3">
                            {gate.desc}
                          </p>
                        </div>
                        <a
                          href={gate.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-warning btn-sm w-100 rounded-pill d-flex align-items-center justify-content-center gap-1.5 font-semibold text-decoration-none"
                        >
                          <Navigation size={14} /> Open Gate GPS Pin
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* QUICK DISTANCE & TRAVEL CALCULATOR CARD GRID - Styled like LocalEvents.jsx */}
        <div className="mb-5">
          <h3
            className={`h4 fw-bold text-white mb-4 ${styles.playfairFont} text-center`}
          >
            Travel Distance & Access Routes to Mahakal
          </h3>

          <div className="row g-4">
            {/* Ujjain Junction Station */}
            <div className="col-12 col-md-4">
              <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-25 hover-border-warning transition-all h-100 shadow-xl">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle p-3 bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30">
                    <Train size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold text-white mb-0">
                      Ujjain Junction (UJN)
                    </h5>
                    <span className="text-warning small font-bold">
                      2.1 km from Temple
                    </span>
                  </div>
                </div>
                <p className="text-secondary small mb-3">
                  Direct trains connect from Delhi, Mumbai, Ahmedabad, Jaipur,
                  Bhopal, and Kolkata.
                </p>
                <div className="p-2.5 bg-black bg-opacity-60 rounded-3 border border-secondary border-opacity-20 text-light small">
                  <strong>Estimated Travel Time:</strong> 7 - 10 mins by
                  Auto-rickshaw (₹50-₹80 flat rate).
                </div>
              </div>
            </div>

            {/* Indore Airport */}
            <div className="col-12 col-md-4">
              <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-25 hover-border-warning transition-all h-100 shadow-xl">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle p-3 bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30">
                    <Plane size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold text-white mb-0">
                      Devi Ahilya Airport (IDR)
                    </h5>
                    <span className="text-warning small font-bold">
                      55 km from Temple
                    </span>
                  </div>
                </div>
                <p className="text-secondary small mb-3">
                  Nearest commercial airport with non-stop flights from all
                  major Indian metro cities.
                </p>
                <div className="p-2.5 bg-black bg-opacity-60 rounded-3 border border-secondary border-opacity-20 text-light small">
                  <strong>Estimated Travel Time:</strong> 1 hr 15 mins via
                  4-lane Indore-Ujjain Highway.
                </div>
              </div>
            </div>

            {/* Nanakheda Bus Stand */}
            <div className="col-12 col-md-4">
              <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-25 hover-border-warning transition-all h-100 shadow-xl">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-circle p-3 bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30">
                    <Car size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold text-white mb-0">
                      Nanakheda Bus Stand
                    </h5>
                    <span className="text-warning small font-bold">
                      4.5 km from Temple
                    </span>
                  </div>
                </div>
                <p className="text-secondary small mb-3">
                  Interstate AC sleeper bus terminal connecting MP, Rajasthan,
                  Gujarat, and Maharashtra.
                </p>
                <div className="p-2.5 bg-black bg-opacity-60 rounded-3 border border-secondary border-opacity-20 text-light small">
                  <strong>Estimated Travel Time:</strong> 15 mins by City Bus or
                  E-Rickshaw shuttle.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FULL DETAILED GATE & LANDMARK CARDS GRID */}
        <div>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <h3 className={`h4 fw-bold text-white mb-0 ${styles.playfairFont}`}>
              Key Temple Gates & Landmark Directory
            </h3>

            {/* Location Category Filters */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <button
                onClick={() => setFilterCategory("all")}
                className={`btn btn-sm rounded-pill px-3 py-1.5 font-semibold transition-all ${
                  filterCategory === "all"
                    ? "btn-warning text-dark font-bold"
                    : "btn-outline-secondary text-light border-opacity-30"
                }`}
              >
                All ({KEY_TEMPLE_GATES.length})
              </button>
              <button
                onClick={() => setFilterCategory("inside")}
                className={`btn btn-sm rounded-pill px-3 py-1.5 font-semibold transition-all ${
                  filterCategory === "inside"
                    ? "btn-warning text-dark font-bold"
                    : "btn-outline-secondary text-light border-opacity-30"
                }`}
              >
                Premises Gates & Services
              </button>
              <button
                onClick={() => setFilterCategory("outside")}
                className={`btn btn-sm rounded-pill px-3 py-1.5 font-semibold transition-all ${
                  filterCategory === "outside"
                    ? "btn-warning text-dark font-bold"
                    : "btn-outline-secondary text-light border-opacity-30"
                }`}
              >
                Surrounding Shrines
              </button>
            </div>
          </div>

          <div className="row g-4">
            {filteredLocations.map((gate) => (
              <div key={gate.id} className="col-12 col-md-6 col-lg-4">
                <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-20 hover-border-warning transition-all h-100 d-flex flex-column justify-content-between shadow-xl">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-2.5 py-1 font-semibold fs-7">
                        {gate.category}
                      </span>
                      <span className="text-secondary small d-flex align-items-center gap-1">
                        <MapPin size={13} className="text-warning" />{" "}
                        {gate.distance}
                      </span>
                    </div>

                    <h4 className="h5 fw-bold text-white mb-1">{gate.name}</h4>
                    <div className="text-warning small mb-2 font-semibold">
                      {gate.nameHi}
                    </div>
                    <div className="mb-3">
                      <span
                        className="badge bg-black text-warning border border-warning border-opacity-30 rounded-pill px-2.5 py-1 font-monospace d-inline-flex align-items-center gap-1.5"
                        style={{ fontSize: "0.72rem" }}
                      >
                        📍 GPS Pin: {gate.coordinates}
                      </span>
                    </div>
                    <p className="text-secondary small mb-3">{gate.desc}</p>

                    <div className="mb-3">
                      <h6
                        className="text-light fs-7 font-bold text-uppercase mb-2"
                        style={{ letterSpacing: "0.05em" }}
                      >
                        Key Facilities & Access:
                      </h6>
                      <ul className="list-unstyled mb-0">
                        {gate.features.map((feat, idx) => (
                          <li
                            key={idx}
                            className="d-flex align-items-start gap-2 text-secondary small mb-1.5"
                            style={{ fontSize: "0.8rem" }}
                          >
                            <CheckCircle
                              size={14}
                              className="text-warning flex-shrink-0 mt-0.5"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-top border-secondary border-opacity-20">
                    <a
                      href={gate.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-warning btn-sm w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 font-bold text-decoration-none shadow-sm"
                    >
                      <Navigation size={14} /> Open Live GPS Pin
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
