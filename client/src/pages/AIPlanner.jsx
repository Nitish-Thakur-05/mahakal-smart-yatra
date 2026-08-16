import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Navigation,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Info,
  Compass,
  Utensils,
  Flame,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "../styles/custom.module.css";

export function AIPlanner() {
  const [days, setDays] = useState("1");
  const [travelPace, setTravelPace] = useState("Standard");
  const [groupType, setGroupType] = useState("Family");
  const [customNotes, setCustomNotes] = useState("");
  const [interests, setInterests] = useState([
    "Bhasma Aarti",
    "Mahakal Lok Corridor",
    "Kal Bhairav Shrine",
    "Harsiddhi Deepstambha",
    "Shipra River Aarti",
  ]);
  const [activeDayTab, setActiveDayTab] = useState(0);
  const [plan, setPlan] = useState(null);
  const [planSource, setPlanSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableHighlights = [
    "Bhasma Aarti",
    "Mahakal Lok Corridor",
    "Kal Bhairav Shrine",
    "Harsiddhi Deepstambha",
    "Shipra River Aarti",
    "Vedic Observatory",
    "Omkareshwar Excursion",
    "Chintaman Ganesh",
    "Sandipani Ashram",
    "Mangalnath Temple",
  ];

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  // Helper to normalize and validate plan data structure received from n8n or backend APIs
  const normalizeAndValidatePlan = (rawPlan) => {
    if (!rawPlan) return null;

    let planObj = rawPlan.plan || rawPlan.output || rawPlan;
    if (typeof planObj === "string") {
      try {
        planObj = JSON.parse(planObj);
      } catch (e) {
        return null;
      }
    }

    if (!planObj || typeof planObj !== "object") return null;

    const title = planObj.title || planObj.name || "Custom Ujjain Pilgrimage Plan";
    const subtitle =
      planObj.subtitle ||
      planObj.summary ||
      "Tailored Sacred Itinerary for Shri Mahakaleshwar";
    const summary = planObj.summary || subtitle;

    let days = Array.isArray(planObj.days)
      ? planObj.days
      : Array.isArray(planObj.itinerary)
      ? planObj.itinerary
      : null;

    if (!days || !Array.isArray(days) || days.length === 0) {
      return null;
    }

    const normalizedDays = days.map((d, dIdx) => {
      const dayNumber = d.dayNumber || d.day || dIdx + 1;
      const theme = d.theme || d.title || `Day ${dayNumber} Exploration`;
      const tip = d.tip || d.note || "Wear traditional attire and carry water.";

      const rawSchedule = Array.isArray(d.schedule)
        ? d.schedule
        : Array.isArray(d.activities)
        ? d.activities
        : Array.isArray(d.items)
        ? d.items
        : [];

      const schedule = rawSchedule.map((item) => ({
        time: item.time || "Flexible",
        title: item.title || item.name || "Sacred Visit",
        location: item.location || item.place || "Mahakal Temple Complex",
        description: item.description || item.details || "",
        category: item.category || item.type || "Darshan",
      }));

      return {
        dayNumber,
        theme,
        tip,
        schedule,
      };
    });

    return {
      title,
      subtitle,
      summary,
      days: normalizedDays,
    };
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const numDays = Math.min(Math.max(parseInt(days, 10) || 1, 1), 7);
    const n8nWebhookUrl = import.meta.env.VITE_N8N_ITINERARY_WEBHOOK_URL;

    // 1. PRIMARY: Try n8n AI Itinerary Webhook
    if (
      n8nWebhookUrl &&
      !n8nWebhookUrl.includes("your-n8n-domain") &&
      n8nWebhookUrl.trim() !== ""
    ) {
      try {
        const uniqueVariationSeed = `${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
        const payload = {
          numberOfDays: String(numDays),
          travelPace,
          groupType,
          selectedInterests: interests,
          customNotes,
          uniqueVariationSeed,
        };

        const response = await axios.post(n8nWebhookUrl, payload, {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 45000,
        });

        const validatedPlan = normalizeAndValidatePlan(response.data);
        if (validatedPlan) {
          setPlan(validatedPlan);
          setPlanSource("n8n-ai");
          setActiveDayTab(0);
          toast.success("Your custom AI pilgrimage plan is ready!");
          setLoading(false);
          return;
        } else {
          console.warn(
            "n8n returned malformed itinerary data structure. Falling back to backend endpoint."
          );
        }
      } catch (err) {
        console.warn(
          "n8n AI itinerary webhook primary call failed. Activating fallback 1 (backend endpoint):",
          err.message
        );
      }
    } else {
      console.info(
        "VITE_N8N_ITINERARY_WEBHOOK_URL is not set or using placeholder. Proceeding to fallback 1."
      );
    }

    // 2. FALLBACK 1: Try Backend Gemini / API Generator Endpoint
    try {
      const res = await axios.post("/api/itineraries/generate", {
        days,
        travelPace,
        groupType,
        interests,
        customNotes,
      });

      if (res.data && res.data.plan) {
        const validatedBackendPlan = normalizeAndValidatePlan(res.data.plan);
        if (validatedBackendPlan) {
          setPlan(validatedBackendPlan);
          setPlanSource(res.data.source || "gemini-ai");
          setActiveDayTab(0);
          if (res.data.source === "gemini-ai") {
            toast.success("Your custom pilgrimage plan is ready!");
          } else {
            toast.success("Fresh Custom AI Pilgrimage Plan generated!");
          }
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn(
        "Backend itinerary API endpoint call failed. Activating fallback 2 (client dynamic generator):",
        err.message
      );
    }

    // 3. FALLBACK 2: Client-side Dynamic Generator Fallback with Randomization
    const clientPlan = generateClientDynamicPlan(
      numDays,
      travelPace,
      groupType,
      interests,
      customNotes
    );
    setPlan(clientPlan);
    setPlanSource("dynamic-ai");
    setActiveDayTab(0);
    toast.success("Fresh Custom AI Pilgrimage Plan generated!");
    setLoading(false);
  };

  const getCategoryIcon = (category = "") => {
    const catLower = category.toLowerCase();
    if (
      catLower.includes("darshan") ||
      catLower.includes("ritual") ||
      catLower.includes("aarti")
    )
      return <Sparkles size={13} className="text-warning flex-shrink-0" />;
    if (catLower.includes("dining") || catLower.includes("food"))
      return <Utensils size={13} className="text-warning flex-shrink-0" />;
    if (
      catLower.includes("shrine") ||
      catLower.includes("bath") ||
      catLower.includes("dip")
    )
      return <Flame size={13} className="text-warning flex-shrink-0" />;
    if (catLower.includes("heritage") || catLower.includes("science"))
      return <BookOpen size={13} className="text-warning flex-shrink-0" />;
    return <Compass size={13} className="text-warning flex-shrink-0" />;
  };

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: '110px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1
            className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}
          >
            Dynamic Ujjain Trip Generator
          </h1>
          <p className="text-secondary max-w-700 mx-auto">
            Select your travel duration, group preferences, and sacred
            highlights to generate a dynamic multi-day pilgrimage schedule.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Left Preference Form Card */}
          <div className="col-lg-5">
            <div
              className={`card bg-dark text-white p-4 ${styles.glassCard} border border-warning border-opacity-25 rounded-4 shadow-lg`}
            >
              <h4
                className={`text-warning fw-bold mb-4 d-flex align-items-center gap-2 ${styles.playfairFont}`}
              >
                <Sparkles size={20} /> Configure Preferences
              </h4>

              <form onSubmit={handleGenerate}>
                {/* Duration */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Trip Duration (Days)
                  </label>
                  <select
                    className="form-select bg-black text-white border-secondary border-opacity-50"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  >
                    <option value="1">1 Day Express Darshan</option>
                    <option value="2">
                      2 Days Temple & Shaktipeeth Circuit
                    </option>
                    <option value="3">
                      3 Days Complete Heritage & Astronomy
                    </option>
                    <option value="4">
                      4 Days Ujjain & Omkareshwar Circuit
                    </option>
                    <option value="5">5 Days Full Sacred Avantika Trail</option>
                    <option value="6">6 Days Comprehensive Pilgrimage</option>
                    <option value="7">7 Days Grand Avantika Yatra</option>
                  </select>
                </div>

                {/* Pace */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Travel Pace
                  </label>
                  <div className="d-flex gap-2">
                    {["Relaxed", "Standard", "Fast Track"].map((pace) => (
                      <button
                        key={pace}
                        type="button"
                        className={`btn btn-sm flex-fill rounded-pill ${travelPace === pace ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-light"}`}
                        onClick={() => setTravelPace(pace)}
                      >
                        {pace}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Group Type */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Group Type
                  </label>
                  <div className="d-flex gap-2">
                    {["Solo", "Family", "Senior Citizens", "Friends"].map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          className={`btn btn-sm flex-fill rounded-pill ${groupType === type ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-light"}`}
                          onClick={() => setGroupType(type)}
                        >
                          {type}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Highlights Filter */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-semibold">
                    Select Highlights ({interests.length})
                  </label>
                  <div
                    className="d-flex flex-wrap gap-2"
                    style={{ maxHeight: 150, overflowY: "auto" }}
                  >
                    {availableHighlights.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`btn btn-sm rounded-pill ${interests.includes(item) ? "btn-warning text-dark fw-semibold" : "btn-outline-secondary text-light"}`}
                        onClick={() => toggleInterest(item)}
                        style={{ fontSize: "0.78rem" }}
                      >
                        {interests.includes(item) ? "✓ " : "+ "}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Notes */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-semibold">
                    Special Requests / Custom Notes
                  </label>
                  <input
                    type="text"
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    placeholder="e.g. Elderly wheelchair access needed, Pure veg food"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={`w-100 ${styles.goldBtn}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="d-inline-flex align-items-center gap-2">
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                      Creating Itinerary...
                    </span>
                  ) : (
                    <span className="d-inline-flex align-items-center gap-2">
                      <Sparkles size={18} /> Generate AI Pilgrimage Plan
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Dynamic Itinerary View */}
          <div className="col-lg-7">
            {loading ? (
              /* User Friendly Simple Loading State Panel */
              <div
                className={`card bg-dark text-white p-5 text-center ${styles.glassCard} h-100 border border-secondary border-opacity-25 rounded-4 shadow-lg d-flex flex-column align-items-center justify-content-center overflow-hidden`}
              >
                <div
                  className="spinner-border text-warning mb-3"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4
                  className={`text-warning fw-bold mb-2 ${styles.playfairFont}`}
                >
                  Creating Your Customized Itinerary...
                </h4>
                <p className="text-secondary small max-w-500 mb-0">
                  Please wait a moment while we organize your Ujjain pilgrimage
                  schedule, temple timings, and local recommendations.
                </p>
              </div>
            ) : plan ? (
              /* Spacious 1-Column Activity Cards View */
              <div
                className={`card bg-dark text-white p-4 ${styles.glassCard} border border-secondary border-opacity-25 rounded-4 shadow-lg overflow-hidden`}
              >
                {/* Header Title Bar */}
                <div className="pb-3 mb-4 border-bottom border-secondary border-opacity-25">
                  <h3
                    className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                  >
                    {plan.title}
                  </h3>
                  <p className="text-secondary small mb-0">
                    {plan.subtitle || plan.summary}
                  </p>
                </div>

                {/* Day Selector Tabs */}
                <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                  {plan.days &&
                    plan.days.map((dayObj, idx) => (
                      <button
                        key={idx}
                        className={`btn btn-sm rounded-pill px-4 py-2 text-nowrap fw-bold ${activeDayTab === idx ? "btn-warning text-dark shadow-sm" : "btn-outline-secondary text-light"}`}
                        onClick={() => setActiveDayTab(idx)}
                      >
                        Day {dayObj.dayNumber}
                      </button>
                    ))}
                </div>

                {/* Selected Day Content */}
                {plan.days && plan.days[activeDayTab] && (
                  <div>
                    {/* Spacious Stacked Activity Cards with Generous Inner Padding */}
                    <div className="d-flex flex-column gap-3.5">
                      {plan.days[activeDayTab].schedule &&
                        plan.days[activeDayTab].schedule.map((slot, index) => (
                          <div
                            key={index}
                            className="card bg-black text-white p-4 rounded-4 border border-secondary border-opacity-25 shadow-sm transition-all hover-border-warning overflow-hidden"
                          >
                            {/* Header: Time Badge Left + Category Right */}
                            <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
                              <span
                                className="badge bg-black text-warning border border-warning border-opacity-30 rounded-pill px-3 py-1.5 font-monospace fw-bold small d-inline-flex align-items-center gap-2 text-nowrap"
                                style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                              >
                                <Clock
                                  size={14}
                                  className="text-warning flex-shrink-0 me-1"
                                />
                                <span>{slot.time}</span>
                              </span>

                              <span
                                className="badge bg-dark text-secondary border border-secondary border-opacity-30 rounded-pill px-3 py-1.5 small font-semibold d-inline-flex align-items-center gap-2 text-nowrap"
                                style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
                              >
                                {getCategoryIcon(slot.category)}
                                <span className="ms-1">{slot.category || "Activity"}</span>
                              </span>
                            </div>

                            {/* Activity Title */}
                            <h5
                              className={`text-white fw-bold mb-2.5 ${styles.playfairFont}`}
                              style={{ fontSize: "1.15rem" }}
                            >
                              {slot.title}
                            </h5>

                            {/* Activity Description */}
                            <p
                              className="text-light opacity-80 small mb-3.5"
                              style={{ lineHeight: 1.6, fontSize: "0.88rem" }}
                            >
                              {slot.description}
                            </p>

                            {/* Footer: Location Pin */}
                            <div className="pt-3 border-top border-secondary border-opacity-20 d-flex align-items-center justify-content-between flex-wrap gap-2">
                              <span
                                className="text-warning small d-inline-flex align-items-center gap-2"
                                style={{ fontSize: "0.82rem" }}
                              >
                                <MapPin
                                  size={14}
                                  className="text-warning flex-shrink-0 me-1"
                                />
                                <span className="fw-medium">
                                  {slot.location}
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Footer Quick Action Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top border-secondary border-opacity-25">
                      <Link
                        to="/aarties"
                        className="btn btn-warning btn-sm rounded-pill fw-bold px-3 text-decoration-none text-dark shadow"
                      >
                        Book Bhasma Aarti Pass{" "}
                        <ArrowRight size={14} className="ms-1" />
                      </Link>
                      <Link
                        to="/events"
                        className="btn btn-outline-warning btn-sm rounded-pill px-3 text-decoration-none"
                      >
                        Local Devotional Events
                      </Link>
                      <Link
                        to="/temples"
                        className="btn btn-outline-warning btn-sm rounded-pill px-3 text-decoration-none"
                      >
                        Explore Shrines 360°
                      </Link>
                      <Link
                        to="/hotels"
                        className="btn btn-outline-light btn-sm rounded-pill px-3 text-decoration-none"
                      >
                        Book Nearby Stays
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User Friendly Empty Initial State Card */
              <div
                className={`card bg-dark text-white p-5 text-center ${styles.glassCard} h-100 d-flex flex-column align-items-center justify-content-center border border-warning border-opacity-25 rounded-4 shadow-lg`}
              >
                <Sparkles
                  size={48}
                  className="text-warning mb-3 opacity-60 mx-auto"
                />
                <h4
                  className={`text-warning fw-bold mb-2 ${styles.playfairFont}`}
                >
                  Plan Your Sacred Ujjain Yatra
                </h4>
                <p className="text-secondary small max-w-500 mx-auto mb-4">
                  Select your duration (1 to 7 Days), travel pace, group type,
                  and sacred highlights on the left to generate your custom
                  pilgrimage schedule.
                </p>

                <div className="d-flex flex-column gap-2 text-start max-w-500 mx-auto bg-black p-3 rounded-3 border border-secondary border-opacity-25 w-100">
                  <div className="d-flex align-items-center gap-2 text-light opacity-90 small">
                    <span className="text-warning fw-bold">✓</span> Personalized
                    Darshan & Aarti Schedules
                  </div>
                  <div className="d-flex align-items-center gap-2 text-light opacity-90 small">
                    <span className="text-warning fw-bold">✓</span> Mahakal Lok
                    Corridor & Shaktipeeth Shrines
                  </div>
                  <div className="d-flex align-items-center gap-2 text-light opacity-90 small">
                    <span className="text-warning fw-bold">✓</span> Authentic
                    Satvik Food & Heritage Recommendations
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Client-side Dynamic Generator with Full Randomization
function generateClientDynamicPlan(
  numDays,
  travelPace,
  groupType,
  interests,
  customNotes,
) {
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());
  const optionId = Math.floor(Math.random() * 900 + 100);

  const breakfastOptions = [
    {
      title: "Authentic Ujjaini Poha-Jalebi & Coconut Water",
      loc: "Mahakal Marg Outlets",
      desc: "Enjoy steaming hot Ujjaini Poha topped with Ratlami Sev and crisp golden Jalebis.",
    },
    {
      title: "Traditional Malwi Samosa & Masala Chai Breakfast",
      loc: "Freeganj Tower Chowk",
      desc: "Savor spicy Malwi samosas, kachori, and hot kulhad chai at iconic Ujjain breakfast stalls.",
    },
    {
      title: "Satvik Ashram Sabudana Khichdi & Herbal Tea",
      loc: "Ram Ghat Annakshetra",
      desc: "Healthy satvik breakfast featuring fresh coconut water, sabudana khichdi, and herbal tea.",
    },
  ];

  const lunchOptions = [
    {
      title: "Traditional Malwi Daal Bafla Thali",
      loc: "Tower Chowk Bhojanalaya",
      desc: "Iconic Malwi feast with ghee-dipped Bafla, 5-pulse Daal, spicy Kadhi, and Desi Ghee Ladoo.",
    },
    {
      title: "Mahakal Annakshetra Free Satvik Bhandara",
      loc: "Mahakal Annakshetra Complex",
      desc: "Blessed temple trust prasadam thali served with love and devotion.",
    },
    {
      title: "Heritage Rajasthani-Malwi Thali",
      loc: "Sarafa Market Food Center",
      desc: "Generous thali featuring Gatte ki Sabzi, Daal Baati, Ker Sangri, and sweet Rabdi.",
    },
  ];

  const KATALOG_TITLES = {
    "Bhasma Aarti": [
      "Shri Mahakaleshwar Bhasma Aarti Darshan",
      "Early Morning Sacred Ash Bhasma Aarti",
      "Mahakal Sanctum Holy Ash Bhasma Ritual",
    ],
    "Mahakal Lok Corridor": [
      "Shri Mahakal Lok Heritage Corridor Exploration",
      "Rudra Sagar Promenade & 108 Stone Pillars",
      "Shri Mahakal Lok Grand Murals Walk",
    ],
    "Kal Bhairav Shrine": [
      "Kal Bhairav Guardian Commander Shrine",
      "Ancient Guardian Deity Kal Bhairav Darshan",
      "Bhairav Garh Guardian Temple Visit",
    ],
    "Harsiddhi Deepstambha": [
      "Harsiddhi Mata 51 Shaktipeeth & Deepstambha Glow",
      "Harsiddhi Temple Twin Lamp Towers Lighting",
      "Shaktipeeth Harsiddhi Devi Evening Deepstambha",
    ],
    "Shipra River Aarti": [
      "Grand Evening Shipra River Maha Aarti & Deep Dan",
      "Ram Ghat Holy Shipra River Aarti",
      "Sacred Kshipra River Brass Lamp Aarti",
    ],
    "Vedic Observatory": [
      "Vedh Shala (Jantar Mantar Solar Observatory)",
      "Ancient Ujjaini Astronomy Observatory",
      "Maharaja Jai Singh II Vedic Observatory Tour",
    ],
    "Chintaman Ganesh": [
      "Chintaman Ganesh Swayambhu Shrine",
      "Ancient Obstacle-Removing Ganesha Temple",
      "Fatehabad Road Chintaman Ganesh Darshan",
    ],
    "Sandipani Ashram": [
      "Maharshi Sandipani Ashram & Gomti Kund",
      "Lord Krishna's Ancient Gurukul Site",
      "Sandipani Ashram Vedic Learning Center",
    ],
    "Mangalnath Temple": [
      "Mangalnath Temple (Birthplace of Mars)",
      "Sacred Mangalnath Shrine on Shipra Bank",
      "Planetary Harmony Mangalnath Darshan",
    ],
  };

  const daysArr = [];

  for (let d = 1; d <= numDays; d++) {
    let daySchedule = [];
    const bfast = getRandom(breakfastOptions);
    const lunch = getRandom(lunchOptions);

    if (numDays === 1) {
      if (interests.includes("Bhasma Aarti")) {
        daySchedule.push({
          time: travelPace === "Fast Track" ? "03:00 AM" : "03:30 AM",
          title: getRandom(KATALOG_TITLES["Bhasma Aarti"]),
          location: "Mahakal Temple Gate No. 1 & Nandi Hall",
          description: `Early morning security assembly at Gate 1 with QR pass. Witness sacred ash ritual tailored for ${groupType}.`,
          category: "Primary Darshan",
        });
      } else {
        daySchedule.push({
          time: "06:30 AM",
          title: getRandom([
            "Morning Shipra River Bath & Mangala Darshan",
            "Ram Ghat Holy Dip & Morning Surya Arghya",
          ]),
          location: "Ram Ghat, Shipra River",
          description:
            "Perform sacred morning bath at Ram Ghat followed by temple entry.",
          category: "Sacred Bath",
        });
      }

      daySchedule.push({
        time: "08:00 AM",
        title: bfast.title,
        location: bfast.loc,
        description: bfast.desc,
        category: "Dining",
      });

      // Add selected interests with randomized titles
      interests.forEach((item) => {
        if (
          item !== "Bhasma Aarti" &&
          item !== "Shipra River Aarti" &&
          item !== "Harsiddhi Deepstambha" &&
          KATALOG_TITLES[item]
        ) {
          daySchedule.push({
            time: "10:30 AM",
            title: getRandom(KATALOG_TITLES[item]),
            location: "Ujjain Sacred Circuit",
            description: `Visit and offer prayers at ${item}. Experience divine spiritual vibrations.`,
            category: "Sacred Shrine",
          });
        }
      });

      daySchedule.push({
        time: "01:30 PM",
        title: lunch.title,
        location: lunch.loc,
        description: lunch.desc,
        category: "Dining",
      });

      if (interests.includes("Harsiddhi Deepstambha")) {
        daySchedule.push({
          time: "06:30 PM",
          title: getRandom(KATALOG_TITLES["Harsiddhi Deepstambha"]),
          location: "Harsiddhi Temple Complex",
          description:
            "Witness 501 clay lamps lit on twin 13th-century stone towers.",
          category: "Shaktipeeth Shrine",
        });
      }

      if (customNotes && customNotes.trim() !== "") {
        daySchedule.push({
          time: "05:00 PM",
          title: `Special Request Fulfilled: ${customNotes.trim()}`,
          location: "Mahakal Temple Gate 1 & Sacred Complex",
          description: `Custom arrangements prepared for your request: "${customNotes.trim()}". Dedicated assistance, tailored facilities, and specialized guidance provided for your group.`,
          category: "Special Request",
        });
      }

      if (interests.includes("Shipra River Aarti")) {
        daySchedule.push({
          time: "07:30 PM",
          title: getRandom(KATALOG_TITLES["Shipra River Aarti"]),
          location: "Ram Ghat, Shipra River",
          description:
            "Attend grand river Aarti with brass lamps along sacred Ram Ghat.",
          category: "River Aarti",
        });
      }
    } else {
      daySchedule = [
        {
          time: "07:30 AM",
          title: bfast.title,
          location: bfast.loc,
          description: bfast.desc,
          category: "Dining",
        },
        {
          time: "09:30 AM",
          title: "Shri Mahakaleshwar & Mahakal Lok Darshan",
          location: "Mahakal Temple Complex",
          description: "Grand darshan and corridor walk.",
          category: "Primary Darshan",
        },
        {
          time: "01:30 PM",
          title: lunch.title,
          location: lunch.loc,
          description: lunch.desc,
          category: "Dining",
        },
      ];
    }

    daysArr.push({
      dayNumber: d,
      theme: `Day ${d}: ${getRandom(["Divine Jyotirlinga & Sacred Circuit", "Heritage Corridor & Shaktipeeth Trail", "Vedic Avantika & Sacred River Ghats"])}`,
      tip: `Option #${optionId} • Pace set to ${travelPace}. Keep photo ID handy.`,
      schedule: daySchedule,
    });
  }

  return {
    title: `${numDays}-Day ${groupType} Ujjain Pilgrimage Plan`,
    subtitle: `Tailored for ${groupType} • ${travelPace} Travel Pace`,
    summary: `Personalized ${numDays}-day Ujjain pilgrimage schedule crafted for ${groupType}.`,
    days: daysArr,
  };
}
