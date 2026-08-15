import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Compass, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/custom.module.css';

export function CuratedItineraries({ itineraries }) {
  const displayItineraries = itineraries && itineraries.length > 0 ? itineraries : [
    {
      id: 1,
      days: "1 Day",
      title: "1-Day Express Mahakal & Bhasma Aarti Circuit",
      destination: "Mahakal Temple & Shipra Ghats",
      description: "Experience 4 AM Bhasma Aarti, explore Mahakal Lok Corridor, visit Harsiddhi Temple, and attend Shipra Evening Aarti.",
      image: "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      days: "2 Days",
      title: "2-Day Jyotirlinga & Shaktipeeth Pilgrimage",
      destination: "Ujjain & Omkareshwar Excursion",
      description: "Day 1 in Mahakaleshwar & Harsiddhi. Day 2 trip to Omkareshwar Jyotirlinga along Narmada River.",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      days: "3 Days",
      title: "3-Day Ujjain Heritage & Astrological Trail",
      destination: "Full Avantika Tour",
      description: "Covers Mahakaleshwar, Kal Bhairav, Mangalnath, Sandipani Ashram, Jantar Mantar observatory, and Chintaman Ganesh.",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <section className="py-5 bg-dark text-white position-relative overflow-hidden">
      <div className="container py-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-warning text-uppercase fw-semibold tracking-widest small mb-1">
            EXPLORE UJJAIN PILGRIMAGE
          </p>
          <h2 className={`display-5 fw-bold text-white mb-2 ${styles.playfairFont}`}>
            Curated Pilgrimage Itineraries
          </h2>
          <p className="text-secondary max-w-600 mx-auto">
            Thoughtfully planned travel packages to help you experience temples, Bhasma Aarti, and sacred ghats seamlessly.
          </p>
        </motion.div>

        {/* Arch Shaped Itinerary Cards */}
        <div className="row g-4 justify-content-center">
          {displayItineraries.map((item, index) => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{ y: -10, scale: 1.03 }}
                className={`card bg-black text-white ${styles.archCard} h-100 p-3`}
              >
                <div className="position-relative overflow-hidden rounded-top-pill" style={{ height: '260px' }}>
                  <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover" />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-2 rounded-pill">
                      <Calendar size={14} className="me-1" /> {item.days}
                    </span>
                  </div>
                </div>
                
                <div className="card-body p-4 d-flex flex-column">
                  <h5 className={`card-title text-warning fw-bold mb-2 ${styles.playfairFont}`}>
                    {item.title}
                  </h5>
                  <p className="text-secondary small mb-3">
                    <Compass size={14} className="me-1 text-warning" /> {item.destination}
                  </p>
                  <p className="card-text text-light small flex-grow-1">
                    {item.description}
                  </p>
                  
                  <div className="mt-3">
                    <Link to="/planner" className="btn btn-outline-warning w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-semibold">
                      <span>View Route Plan</span> <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
