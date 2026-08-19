import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Eye,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import stackedStyles from "../styles/featured_stacked.module.css";
import customStyles from "../styles/custom.module.css";

export function FeaturedTemples({ temples }) {
  const defaultTemples = [
    {
      id: "shri-mahakaleshwar",
      name: "Shri Mahakaleshwar Jyotirlinga",
      tagline: "The Sovereign Lord of Time & Dakshinamukhi Jyotirlinga",
      image: "/mahakalTemple.jpeg",
      description:
        "Main South-facing Jyotirlinga shrine. Famous worldwide for 4:00 AM Bhasma Aarti.",
      highlight: "Main Shrine • 360° Tour",
    },
    {
      id: "harsiddhi-mata",
      name: "Harsiddhi Mata Temple",
      tagline: "Sacred 51 Shaktipeeth & Deepstambha Glow",
      image: "/temples/harsiddhi.png",
      description:
        "0.2 km from Mahakal. 51 Shaktipeeth with two 13th-century Deepstambha lamp towers.",
      highlight: "0.2 km from Mahakal",
    },
    {
      id: "kal-bhairav",
      name: "Kal Bhairav Temple",
      tagline: "Guardian Commander of Ancient Ujjain",
      image: "/temples/kal_bhairav.png",
      description:
        "0.5 km from Mahakal. Guardian deity shrine visited right after Mahakaleshwar.",
      highlight: "0.5 km from Mahakal",
    },
    {
      id: "bade-ganeshji",
      name: "Bade Ganeshji Ka Mandir",
      tagline: "Ancient Giant 18ft Lord Ganesha Shrine",
      image: "/ganeshTemple.jpeg",
      description:
        "0.1 km from Mahakal. Features a massive 18-foot Lord Ganesha idol.",
      highlight: "0.1 km from Mahakal",
    },
    {
      id: "ram-ghat",
      name: "Ram Ghat (Shipra River)",
      tagline: "Sacred River Ghat of Simhastha Kumbh Mela",
      image: "/itineraries/heritage.png",
      description:
        "0.4 km from Mahakal. Ancient bathing ghat famous for evening Shipra Aarti.",
      highlight: "0.4 km from Mahakal",
    },
  ];

  const rawTemples = temples && temples.length > 0 ? temples : defaultTemples;

  const displayTemples = rawTemples.map((item, idx) => {
    let fallbackImg = "/mahakalTemple.jpeg";
    if (item.name?.toLowerCase().includes("harsiddhi")) fallbackImg = "/temples/harsiddhi.png";
    else if (item.name?.toLowerCase().includes("bhairav")) fallbackImg = "/temples/kal_bhairav.png";
    else if (item.name?.toLowerCase().includes("ganesh")) fallbackImg = "/ganeshTemple.jpeg";
    else if (item.name?.toLowerCase().includes("ram ghat") || item.name?.toLowerCase().includes("shipra")) fallbackImg = "/itineraries/heritage.png";
    else if (defaultTemples[idx]?.image) fallbackImg = defaultTemples[idx].image;

    return {
      ...item,
      image: (item.image && !item.image.includes("unsplash.com")) ? item.image : fallbackImg
    };
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll loop: advances every 3.5 seconds unless paused by hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayTemples.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, displayTemples.length]);

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? displayTemples.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayTemples.length);
  };

  const getCardStyle = (index) => {
    const total = displayTemples.length;
    let offset = index - activeIndex;

    // Normalize offset for circular deck
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const absOffset = Math.abs(offset);
    const isCenter = offset === 0;
    const isHovered = hoveredIndex === index;
    const isAnotherHovered =
      hoveredIndex !== null && hoveredIndex !== activeIndex;

    // Determine Z-Index
    let zIndex = 20 - absOffset * 4;
    if (isCenter && isAnotherHovered) {
      zIndex = 5; // Main card recedes back when a side card is hovered!
    }
    if (isHovered) {
      zIndex = 40; // Hovered card pops to the very front!
    }

    // Determine position & 3D scaling
    const translateX = offset * 190;
    let translateY = isCenter ? (isHovered ? -12 : -6) : absOffset * 12;
    let scale = isCenter
      ? isHovered
        ? 1.08
        : 1.02
      : Math.max(0.72, 0.92 - absOffset * 0.08);
    let rotateY = offset * -6;

    if (isHovered && !isCenter) {
      scale = 1.06;
      translateY = -14;
    }

    // Hide cards that are too far in circular list on desktop
    const isVisible = absOffset <= 2;

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex: zIndex,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
    };
  };

  return (
    <section className={stackedStyles.stackedSection}>
      <div className="container text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <span className={customStyles.badgeGold}>NEARBY SACRED SHRINES</span>
          <h2
            className={`display-5 fw-bold text-white mt-2 mb-2 ${customStyles.playfairFont}`}
          >
            5+ Nearby Temples To Visit After Mahakal
          </h2>
          <p className="text-warning lead mb-2">
            Auto-scrolling deck • Hover to pause and bring any shrine forward
          </p>

          <div className={customStyles.goldDivider}>
            <div className={customStyles.goldLineLeft}></div>
            <div className={customStyles.goldDot}></div>
            <div className={customStyles.goldDot}></div>
            <div className={customStyles.goldLineRight}></div>
          </div>
        </motion.div>

        {/* 360 Depth Stacked Deck Container with Hover Controls */}
        <motion.div
          className="position-relative d-flex align-items-center justify-content-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setHoveredIndex(null);
          }}
        >
          {/* Previous Arrow */}
          <button
            className={`${stackedStyles.navBtn} me-4 d-none d-md-flex`}
            onClick={handlePrev}
            title="Previous Temple"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Stacked Cards Viewport */}
          <div className={stackedStyles.deckViewport}>
            {displayTemples.map((temple, index) => {
              const isCenter = index === activeIndex;
              const isHovered = index === hoveredIndex;
              const isAnotherHovered =
                hoveredIndex !== null && hoveredIndex !== activeIndex;

              let cardStateClass = "";
              if (isHovered) {
                cardStateClass = stackedStyles.cardHoveredForward;
              } else if (isCenter) {
                cardStateClass = isAnotherHovered
                  ? stackedStyles.cardCenterReceded
                  : stackedStyles.cardCenterDefault;
              }

              return (
                <div
                  key={temple.id || temple._id || index}
                  className={`${stackedStyles.deckCard} ${cardStateClass}`}
                  style={getCardStyle(index)}
                  onMouseEnter={() => {
                    setIsPaused(true);
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Image Background */}
                  <div className={stackedStyles.cardImgContainer}>
                    <img
                      src={temple.image || temple.images?.[0]}
                      alt={temple.name}
                      className={stackedStyles.cardImg}
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className={stackedStyles.cardGradient}></div>

                  {/* Content Overlay */}
                  <div className={stackedStyles.cardContent}>
                    <span className={stackedStyles.distanceBadge}>
                      <MapPin size={12} className="me-1" />
                      {temple.highlight || temple.location || "Near Mahakal"}
                    </span>

                    <h3
                      className={`text-white fw-bold mb-1 ${customStyles.playfairFont}`}
                      style={{ fontSize: "1.35rem", lineHeight: 1.2 }}
                    >
                      {temple.name}
                    </h3>

                    <p
                      className="text-warning small mb-2 text-truncate"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {temple.tagline}
                    </p>

                    <p
                      className="text-secondary small mb-3"
                      style={{ fontSize: "0.78rem", lineHeight: 1.4 }}
                    >
                      {temple.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                      <Link
                        to={`/temple/${temple.id || temple._id}`}
                        className="btn btn-warning btn-sm rounded-pill font-semibold px-3 text-decoration-none"
                      >
                        Explore Shrine <ArrowRight size={14} className="ms-1" />
                      </Link>
                      <span
                        className="text-warning small"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <Eye size={12} className="me-1" /> 360°
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button
            className={`${stackedStyles.navBtn} ms-4 d-none d-md-flex`}
            onClick={handleNext}
            title="Next Temple"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>

        {/* Stacked Deck Pagination Dots */}
        <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
          {displayTemples.map((temple, i) => (
            <button
              key={i}
              className={`btn p-0 rounded-circle transition-all ${
                i === activeIndex ? "bg-warning" : "bg-secondary opacity-50"
              }`}
              style={{ width: i === activeIndex ? 24 : 10, height: 10 }}
              onClick={() => setActiveIndex(i)}
              title={temple.name}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
