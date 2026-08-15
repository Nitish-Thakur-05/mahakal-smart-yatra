import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { FeaturedTemples } from '../components/FeaturedTemples';
import { CuratedItineraries } from '../components/CuratedItineraries';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, BookOpen, Hotel, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/custom.module.css';

const quickActions = [
  { to: "/aarties", icon: Calendar, title: "Bhasma Aarti Pass" },
  { to: "/events", icon: Calendar, title: "Local Devotional Events" },
  { to: "/temples", icon: Eye, title: "360° Virtual Shrines" },
  { to: "/hotels", icon: Hotel, title: "Book Temple Stays" }
];

export function Home({ temples, events, itineraries }) {
  return (
    <div>
      {/* Hero Carousel Banner */}
      <HeroCarousel />

      {/* Quick Action Navigation Strip */}
      <section className="py-4 bg-dark border-bottom border-warning border-opacity-25 overflow-hidden">
        <div className="container">
          <div className="row g-3 text-center">
            {quickActions.map((action, i) => {
              const IconComp = action.icon;
              return (
                <div key={i} className="col-6 col-md-3">
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Link to={action.to} className="btn btn-outline-warning w-100 py-3 rounded-4 d-flex flex-column align-items-center gap-2 text-decoration-none">
                      <IconComp size={28} />
                      <span className="fw-semibold">{action.title}</span>
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Shrines Section */}
      <FeaturedTemples temples={temples} />

      {/* Shri Mahakal Lok Highlight Banner */}
      <section className="py-5 bg-black text-white border-top border-bottom border-warning border-opacity-25 overflow-hidden">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
            >
              <span className={styles.badgeGold}>SHRI MAHAKAL LOK CORRIDOR</span>
              <h2 className={`display-5 fw-bold text-white my-3 ${styles.playfairFont}`}>
                India's Most Magnificent Spiritual Heritage Corridor
              </h2>
              <p className="text-secondary lead">
                Stretching over 900 meters around Rudra Sagar lake, Shri Mahakal Lok features 108 grand ornate pillars, sculptured fountains, and over 200 statues capturing the timeless stories of Shiva Purana.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/temples" className={styles.goldBtn}>Virtual Corridor Walk</Link>
                <Link to="/planner" className="btn btn-outline-light rounded-pill px-4 text-decoration-none fw-semibold">Plan Corridor Visit</Link>
              </div>
            </motion.div>

            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className={`${styles.glassCard} p-2 overflow-hidden rounded-4`}>
                <img 
                  src="/mahakalTemple.jpeg" 
                  alt="Shri Mahakaleshwar Temple" 
                  className="img-fluid rounded-3 w-100" 
                  style={{ maxHeight: '440px', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curated Itineraries Section */}
      <CuratedItineraries itineraries={itineraries} />
    </div>
  );
}
