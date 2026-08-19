import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import styles from '../styles/custom.module.css';

export function Temples({ temples }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = (temples || []).filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: '110px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}>
            Sacred Temples & Shrines of Ujjain
          </h1>
          <p className="text-secondary max-w-700 mx-auto">
            Explore Shri Mahakaleshwar Jyotirlinga, Kal Bhairav, Shaktipeeths, and ancient divine shrines of Ujjain with darshan timings and location guides.
          </p>

          {/* Search Bar */}
          <div className="max-w-500 mx-auto mt-4">
            <div className="input-group">
              <span className="input-group-text bg-dark border-warning border-opacity-25 text-warning">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-white border-warning border-opacity-25 p-3"
                placeholder="Search temples (e.g. Mahakaleshwar, Kal Bhairav, Harsiddhi)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Temple Cards Grid */}
        <div className="row g-4">
          {filtered.map((temple) => (
            <div key={temple.id || temple._id} className="col-lg-4 col-md-6">
              <div className={`card h-100 bg-black text-white ${styles.glassCard} overflow-hidden border border-warning border-opacity-25`}>
                <div className="position-relative" style={{ height: '240px' }}>
                  <img 
                    src={temple.image || temple.images?.[0]} 
                    alt={temple.name} 
                    className="w-100 h-100 object-fit-cover" 
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-warning text-dark font-semibold px-3 py-1.5 rounded-pill shadow small">
                      {temple.highlight || 'Sacred Shrine'}
                    </span>
                  </div>
                </div>

                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h4 className={`card-title text-warning fw-bold mb-1 ${styles.playfairFont}`}>
                      {temple.name}
                    </h4>
                    <p className="text-secondary small mb-2">
                      <MapPin size={14} className="me-1 text-warning" /> {temple.location || 'Ujjain, Madhya Pradesh'}
                    </p>
                    <p className="card-text text-light small mb-3" style={{ fontSize: '0.84rem' }}>
                      {temple.description}
                    </p>
                  </div>

                  <div className="pt-3 border-top border-secondary border-opacity-25 text-end">
                    <Link 
                      to={`/temple/${temple.id || temple._id}`} 
                      className="btn btn-warning rounded-pill px-4 py-1.5 btn-sm font-semibold text-dark d-inline-flex align-items-center gap-1.5 text-decoration-none shadow-sm"
                    >
                      <span>View Temple Details</span> <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
