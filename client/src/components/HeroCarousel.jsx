import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero3DCanvas } from './Hero3DCanvas';
import heroStyles from '../styles/hero.module.css';
import styles from '../styles/custom.module.css';

const temples = [
  {
    name: "Shri Mahakaleshwar Temple",
    location: "Mahakal Marg, Ujjain",
    subtitle: "STEP INTO THE SACRED AVANTIKA KSHETRA",
    title: "Shri Mahakaleshwar",
    description: "Explore Shri Mahakaleshwar Jyotirlinga and Ujjain shrines through immersive 360° virtual experiences.",
    video: "/temple.mp4"
  },
  {
    name: "Ancient Ujjain & Mahakal Lok",
    location: "Rudra Sagar Lake, Ujjain",
    subtitle: "INDIA'S GRAND HERITAGE CORRIDOR",
    title: "Mahakal Lok Corridor",
    description: "Experience 108 grand ornate pillars, sculptured fountains, and timeless stories of Shiva Purana.",
    video: "/ujjain.mp4"
  },
  {
    name: "Sanctum Sanctorum & Evening Aarti",
    location: "Shipra River & Sanctum",
    subtitle: "SPIRITUAL UJJAIN EVENING DARSHAN",
    title: "Sacred Aarti & Darshan",
    description: "Immerse in the rhythmic chants, evening lamp towers, and holy Shipra river atmosphere.",
    video: "/mahakal.mp4"
  },
  {
    name: "Sacred Bhasma Aarti Ritual",
    location: "Sanctum Sanctorum, Ujjain",
    subtitle: "DIVINE 4:00 AM MORNING RITUAL",
    title: "Bhasma Aarti Darshan",
    description: "Attend the world-famous early morning ash ritual and receive sacred blessings.",
    video: "/bhasmaArti.mp4"
  }
];

export function HeroCarousel() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const currentTemple = temples[currentVideo];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [isMuted, currentVideo]);

  const handleVideoChange = (dir) => {
    if (dir === "next") {
      setCurrentVideo((prev) => (prev + 1) % temples.length);
    } else {
      setCurrentVideo((prev) => (prev - 1 + temples.length) % temples.length);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="hero-carousel-container position-relative w-100 overflow-hidden bg-black text-white" style={{ height: '100vh', minHeight: '100vh' }}>
      {/* 100vh Fullscreen Video Background */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 1 }}>
        <video
          ref={videoRef}
          key={currentTemple.video}
          className="w-100 h-100"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          src={currentTemple.video}
          autoPlay
          muted={isMuted}
          playsInline
          onEnded={() => handleVideoChange("next")}
        />
        {/* Dark Gradient Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)', 
            zIndex: 2 
          }} 
        />
        {/* Three.js 3D Particles Aura Canvas */}
        <Hero3DCanvas />
      </div>

      {/* Hero Center Content Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 10 }}>
        <div className="text-center px-4 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-warning text-sm text-md-lg mb-2 tracking-widest text-uppercase fw-semibold" style={{ letterSpacing: '0.2em' }}>
                {currentTemple.subtitle}
              </p>
              <h1 className={`display-1 text-white fst-italic mb-2 ${styles.playfairFont}`}>
                {currentTemple.title}
              </h1>
              <p className="lead text-light opacity-85 max-w-2xl mx-auto px-2 mb-4" style={{ fontWeight: 300, fontSize: '1.12rem', lineHeight: 1.6 }}>
                {currentTemple.description}
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/navigation" className={styles.goldBtn}>
                  <Eye size={18} className="me-2" /> Explore Shrines 360°
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Information & Control Strip */}
      <div className="position-absolute bottom-0 start-0 end-0 pb-4 pb-md-5 px-4 px-md-5" style={{ zIndex: 20 }}>
        <div className="container max-w-7xl mx-auto">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-3">
            {/* Left: Temple Title & Location */}
            <div className="d-flex flex-column">
              <div className="h2 h1-md font-bold text-warning mb-1">
                {currentTemple.name}
              </div>
              <div className="fs-5 font-light text-white opacity-80 d-flex align-items-center gap-2">
                <MapPin size={20} className="text-warning" />
                <span>{currentTemple.location}</span>
              </div>
            </div>

            {/* Right: Glass Round Mute, Prev & Next Buttons */}
            <div className="d-flex gap-3 align-items-center">
              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="btn btn-dark text-white rounded-circle p-3 d-flex align-items-center justify-content-center border-0 shadow-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', width: 50, height: 50 }}
                title={isMuted ? "Unmute Temple Audio" : "Mute Temple Audio"}
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} className="text-warning" />}
              </button>

              {/* Prev Button */}
              <button
                onClick={() => handleVideoChange("prev")}
                className="btn btn-dark text-white rounded-circle p-3 d-flex align-items-center justify-content-center border-0 shadow-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', width: 50, height: 50 }}
                title="Previous Slide"
              >
                <ChevronLeft size={22} />
              </button>

              {/* Next Button */}
              <button
                onClick={() => handleVideoChange("next")}
                className="btn btn-dark text-white rounded-circle p-3 d-flex align-items-center justify-content-center border-0 shadow-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', width: 50, height: 50 }}
                title="Next Slide"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
