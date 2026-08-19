import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function CuratedItineraries({ itineraries }) {
  const defaultItineraries = [
    {
      id: 1,
      days: "1 Day",
      title: "Mahakal Bhasma Aarti Express",
      destination: "Mahakaleshwar & Shipra Ghats",
      description: "Experience 4 AM Bhasma Aarti, Shri Mahakal Lok Corridor, and Harsiddhi Temple.",
      image: "/itineraries/bhasma_aarti.png"
    },
    {
      id: 2,
      days: "2 Days",
      title: "Jyotirlinga & Shaktipeeth Yatra",
      destination: "Ujjain & Omkareshwar Circuit",
      description: "Mahakaleshwar, Harsiddhi Shaktipeeth, and Omkareshwar Narmada tour.",
      image: "/itineraries/jyotirlinga.png"
    },
    {
      id: 3,
      days: "3 Days",
      title: "Ujjain Heritage & Astrological Trail",
      destination: "Avantika Temple Circuit",
      description: "Mahakaleshwar, Kal Bhairav, Mangalnath Mars Temple & Sandipani Ashram.",
      image: "/itineraries/heritage.png"
    }
  ];

  const displayItineraries = defaultItineraries;

  return (
    <section className="curated-itineraries-section py-5 position-relative overflow-hidden">
      <div className="container py-3 curated-itineraries-container">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-warning text-uppercase fw-semibold tracking-widest small mb-1 font-monospace" style={{ fontSize: '0.8rem' }}>
            DISCOVER UJJAIN
          </p>
          <h2
            className="display-5 fw-bold mb-2 curated-section-heading"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
          >
            Curated Pilgrimage Itineraries
          </h2>
          <p className="curated-itinerary-sub max-w-600 mx-auto small mb-0">
            Handpicked travel plans designed to help you explore sacred temples, Bhasma Aarti, and divine heritage.
          </p>
        </motion.div>

        {/* Minimal 3 Arched Cards Grid */}
        <div className="row g-4 justify-content-center">
          {displayItineraries.map((item, index) => (
            <div key={item.id || index} className="col-lg-4 col-md-4 col-sm-6">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="curated-arch-card h-100 d-flex flex-column text-center"
              >
                <Link to="/planner" className="text-decoration-none d-flex flex-column h-100">
                  {/* Arch Frame */}
                  <div className="curated-arch-img-box flex-shrink-0">
                    <img src={item.image} alt={item.title} />
                    <div className="curated-arch-img-overlay" />
                  </div>
                  
                  {/* Minimal Details Below Arch */}
                  <div className="pt-3 d-flex flex-column flex-grow-1 align-items-center">
                    <span className="text-warning font-monospace fw-bold small text-uppercase tracking-wider mb-1" style={{ fontSize: '0.82rem' }}>
                      {item.days}
                    </span>

                    <h5 className="curated-itinerary-title fw-bold mb-1">
                      {item.title}
                    </h5>

                    <p className="curated-itinerary-sub small mb-0 opacity-75">
                      {item.destination}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
