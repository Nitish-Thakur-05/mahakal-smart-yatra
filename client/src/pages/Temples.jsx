import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Eye, Search, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { Temple360Viewer } from '../components/Temple360Viewer';
import styles from '../styles/custom.module.css';

export function Temples({ temples }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [active360TempleId, setActive360TempleId] = useState(null);

  const filtered = (temples || []).filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTemple360Key = (temple) => {
    if (temple.id && (temple.id.includes("mahakal") || temple.id.includes("bhairav") || temple.id.includes("harsiddhi") || temple.id.includes("chintaman") || temple.id.includes("mangal") || temple.id.includes("sandipani"))) {
      return temple.id;
    }
    const nameLower = (temple.name || "").toLowerCase();
    if (nameLower.includes("kal bhairav") || nameLower.includes("kaal bhairav")) return "kal-bhairav";
    if (nameLower.includes("harsiddhi")) return "harsiddhi-mata";
    if (nameLower.includes("chintaman")) return "chintaman-ganesh";
    if (nameLower.includes("mangal")) return "mangalnath-temple";
    if (nameLower.includes("sandipani")) return "sandipani-ashram";
    return "shri-mahakaleshwar";
  };

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: '110px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}>
            Sacred Temples & 360° Virtual Shrines
          </h1>
          <p className="text-secondary max-w-700 mx-auto">
            Experience 360° interactive virtual darshan of Shri Mahakaleshwar Jyotirlinga, Kal Bhairav, Shaktipeeths, and ancient shrines of Ujjain with audio ambience and spiritual hotspots.
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
                    <button
                      onClick={() => setActive360TempleId(getTemple360Key(temple))}
                      className="badge bg-warning text-dark font-semibold px-3 py-1.5 rounded-pill border-0 shadow cursor-pointer d-flex align-items-center gap-1"
                    >
                      <Compass size={13} /> 360° Virtual Darshan
                    </button>
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

                  <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between gap-2">
                    <button
                      onClick={() => setActive360TempleId(getTemple360Key(temple))}
                      className="btn btn-warning rounded-pill px-3 py-1.5 btn-sm font-semibold text-dark d-flex align-items-center gap-1.5"
                    >
                      <Compass size={15} /> 360° View
                    </button>

                    <Link 
                      to={`/temple/${temple.id || temple._id}`} 
                      className="btn btn-outline-light rounded-pill px-3 py-1.5 btn-sm font-semibold d-flex align-items-center gap-1"
                    >
                      <span>Full Details</span> <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 360 Panorama Viewer Modal */}
        {active360TempleId && (
          <Temple360Viewer
            templeId={active360TempleId}
            onClose={() => setActive360TempleId(null)}
          />
        )}
      </div>
    </div>
  );
}
