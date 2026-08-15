import React, { useState, useEffect } from 'react';
import {
  Megaphone, AlertTriangle, ShieldCheck, Clock, Info, Search,
  MapPin, RefreshCw, Building, Plus, Trash2, Save
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../styles/custom.module.css';

const FALLBACK_ANNOUNCEMENTS = [
  {
    _id: "demo-1",
    title: "Gate No. 1 (General Darshan Entry) Fully Operational",
    category: "Gate Status",
    status: "Open",
    gateName: "Gate 1 - General Queue",
    location: "Bada Ganesh Temple Side",
    reason: "Normal Queue Flow",
    description: "General Darshan queue is operating smoothly. Average waiting time is 25-30 minutes for Garbhagriha darshan.",
    priority: "Normal",
    createdAt: new Date().toISOString()
  },
  {
    _id: "demo-2",
    title: "Gate No. 4 (Nandi Mandapam) Temporary Maintenance Closure",
    category: "Gate Status",
    status: "Closed",
    gateName: "Gate 4 - Nandi Hall",
    location: "Nandi Mandapam Entrance",
    reason: "Routine sanitization, flower decoration & security review before evening Sandhya Aarti.",
    description: "Gate 4 is closed from 2:00 PM to 4:30 PM. Pass holders are requested to divert to Gate No. 3.",
    priority: "High",
    createdAt: new Date().toISOString()
  },
  {
    _id: "demo-3",
    title: "Gate No. 5 (VIP & Protocol Entry) Diverted",
    category: "Gate Status",
    status: "Diverted",
    gateName: "Gate 5 - Protocol",
    location: "VIP Car Pass Parking Side",
    reason: "Heavy footfall of special festival buses.",
    description: "Protocol visitors are requested to present original Photo ID and e-pass at Gate 3 counter.",
    priority: "Normal",
    createdAt: new Date().toISOString()
  },
  {
    _id: "demo-4",
    title: "Bhasma Aarti Counter Advisory & Online Verification",
    category: "Bhasma Aarti",
    status: "Active",
    gateName: "Bhasma Aarti Cell",
    location: "Prashasnik Bhavan Counter 2",
    reason: "Offline counter quota filled for today.",
    description: "Bhasma Aarti offline counter token distribution is complete for today. Pilgrims with valid online e-passes can proceed for biometric verification between 10:00 PM to 1:00 AM.",
    priority: "Urgent",
    createdAt: new Date().toISOString()
  }
];

export function Announcements({ user, onOpenAuth }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [savingNotice, setSavingNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '', category: 'Gate Status', status: 'Open',
    gateName: '', location: 'Shri Mahakaleshwar Temple Premises',
    reason: '', description: '', priority: 'Normal'
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/announcements');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAnnouncements(res.data);
      } else {
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
      }
    } catch (err) {
      setAnnouncements(FALLBACK_ANNOUNCEMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      toast.error('Title and description are required.');
      return;
    }
    setSavingNotice(true);
    try {
      await axios.post('/api/announcements', newNotice);
      toast.success('Notice published!');
      setNewNotice({ title: '', category: 'Gate Status', status: 'Open', gateName: '', location: 'Shri Mahakaleshwar Temple Premises', reason: '', description: '', priority: 'Normal' });
      setShowAddModal(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to publish notice.');
    } finally {
      setSavingNotice(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success('Notice deleted.');
      fetchAnnouncements();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const isAdmin = user && (user.role === 'official' || user.role === 'admin' || user.email?.toLowerCase().includes('admin'));

  const safeAnnouncements = Array.isArray(announcements) ? announcements : FALLBACK_ANNOUNCEMENTS;

  const filteredAnnouncements = safeAnnouncements.filter(a => {
    const matchesSearch =
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.gateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const gateNotices = safeAnnouncements.filter(a => a.category === 'Gate Status' || a.gateName);

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: '110px' }}>
      <div className="container py-4">

        {/* Header — same as Temples.jsx */}
        <div className="text-center mb-5">
          <h1 className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}>
            Gate Status & Live Announcements
          </h1>
          <p className="text-secondary max-w-700 mx-auto">
            Real-time official updates from Shri Mahakaleshwar Temple Administration — entry gate statuses, Bhasma Aarti advisories, and crowd notices.
          </p>

          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mt-4">
            <button
              onClick={fetchAnnouncements}
              className="btn btn-outline-warning rounded-pill px-4 py-2 d-flex align-items-center gap-2"
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className={`${styles.goldBtn}`}
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                <Plus size={16} className="me-2 d-inline" /> Post Notice
              </button>
            )}
          </div>
        </div>

        {/* Gate Status Summary Cards */}
        {gateNotices.length > 0 && (
          <div className="mb-5">
            <h5 className={`text-warning fw-bold mb-3 ${styles.playfairFont}`}>
              Live Gate Entry Status
            </h5>
            <div className="row g-3">
              {gateNotices.slice(0, 4).map(gate => (
                <div key={gate._id} className="col-12 col-sm-6 col-lg-3">
                  <div className={`card bg-dark text-white h-100 p-3 ${styles.glassCard} border border-warning border-opacity-25`}>
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <p className="fw-semibold text-white small mb-0" style={{ maxWidth: 130 }}>
                        {gate.gateName || gate.title}
                      </p>
                      <span className={`badge rounded-pill px-2 py-1 small ${
                        gate.status === 'Open' ? 'bg-success' :
                        gate.status === 'Closed' ? 'bg-danger' : 'bg-warning text-dark'
                      }`}>
                        {gate.status === 'Open' ? '🟢 OPEN' : gate.status === 'Closed' ? '🔴 CLOSED' : '🟡 DIVERTED'}
                      </span>
                    </div>
                    {gate.reason && (
                      <small className="text-secondary d-block mb-2" style={{ fontSize: '0.74rem' }}>
                        {gate.reason}
                      </small>
                    )}
                    <small className="text-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.74rem' }}>
                      <MapPin size={11} className="text-warning" />{gate.location}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className="d-flex flex-column flex-md-row gap-3 mb-4">
          <div className="input-group" style={{ maxWidth: 420 }}>
            <span className="input-group-text bg-dark border-warning border-opacity-25 text-warning">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-white border-warning border-opacity-25 p-3"
              placeholder="Search by gate name, reason, or title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="d-flex flex-wrap gap-2">
            {['All', 'Gate Status', 'Bhasma Aarti', 'Crowd Advisory'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`btn btn-sm rounded-pill px-3 py-1.5 ${
                  categoryFilter === cat
                    ? 'btn-warning text-dark fw-bold'
                    : 'btn-dark text-secondary border border-secondary border-opacity-30'
                }`}
              >
                {cat === 'All' ? 'All Notices' : cat === 'Gate Status' ? '🚪 Gate Status' : cat === 'Bhasma Aarti' ? '🔥 Bhasma Aarti' : '🚨 Advisory'}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Feed */}
        <div className="d-flex flex-column gap-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-5">
              <div className={`p-5 bg-dark rounded-4 ${styles.glassCard} border border-warning border-opacity-25 d-inline-block`}>
                <Info size={44} className="text-warning mb-3" />
                <h5 className="text-white fw-bold mb-2">No Notices Found</h5>
                <p className="text-secondary small mb-0">Try clearing your search or selecting a different category.</p>
              </div>
            </div>
          ) : filteredAnnouncements.map(notice => (
            <div key={notice._id} className={`card bg-dark text-white p-4 ${styles.glassCard} border border-warning border-opacity-25`}>

              {/* Top badges + timestamp */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <span className={`badge rounded-pill px-3 py-1 small ${
                    notice.priority === 'Urgent' ? 'bg-danger' :
                    notice.priority === 'High' ? 'bg-warning text-dark' : 'bg-secondary'
                  }`}>
                    {notice.priority === 'Urgent' ? '⚡ Urgent' : notice.priority === 'High' ? '⚠️ High Priority' : 'Notice'}
                  </span>

                  <span className={`badge rounded-pill px-3 py-1 small ${
                    notice.status === 'Open' ? 'bg-success' :
                    notice.status === 'Closed' ? 'bg-danger' :
                    notice.status === 'Diverted' ? 'bg-warning text-dark' : 'bg-secondary'
                  }`}>
                    {notice.status === 'Open' ? '🟢 Open' : notice.status === 'Closed' ? '🔴 Closed' : notice.status === 'Diverted' ? '🟡 Diverted' : 'ℹ️ Active'}
                  </span>

                  <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-1 small rounded-pill">
                    {notice.category}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <small className="text-secondary d-flex align-items-center gap-1">
                    <Clock size={13} />
                    {notice.createdAt && !isNaN(new Date(notice.createdAt).getTime())
                      ? new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Recently posted'}
                  </small>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteNotice(notice._id)}
                      className="btn btn-sm btn-outline-danger rounded-circle p-1.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <h4 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>{notice.title}</h4>

              <div className="d-flex flex-wrap gap-3 mb-3">
                {notice.gateName && (
                  <span className="text-warning small d-flex align-items-center gap-1">
                    🚪 <strong>{notice.gateName}</strong>
                  </span>
                )}
                <span className="text-secondary small d-flex align-items-center gap-1">
                  <MapPin size={13} className="text-warning" /> {notice.location}
                </span>
              </div>

              {notice.reason && (
                <div className="p-3 bg-black rounded-3 border border-warning border-opacity-20 mb-3">
                  <p className="text-warning fw-semibold small mb-1 d-flex align-items-center gap-1">
                    <AlertTriangle size={13} /> Reason
                  </p>
                  <p className="text-light small mb-0">{notice.reason}</p>
                </div>
              )}

              <p className="text-light small mb-3" style={{ lineHeight: 1.7 }}>{notice.description}</p>

              <div className="border-top border-secondary border-opacity-15 pt-3">
                <small className="text-secondary">
                  Issued by: {notice.postedBy || 'Shri Mahakal Temple Administration'}
                </small>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Admin Post Notice Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1070 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-white border border-warning border-opacity-30 rounded-4 shadow-2xl overflow-hidden">
              <div className="modal-header border-bottom border-warning border-opacity-20 px-4 py-3 bg-black">
                <h5 className={`modal-title text-warning fw-bold ${styles.playfairFont}`}>
                  Post Gate / Temple Notice
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)} />
              </div>

              <form onSubmit={handleCreateNotice}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label text-secondary small fw-semibold">NOTICE TITLE *</label>
                      <input type="text" className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5" placeholder="e.g. Gate No. 4 Closure for Bhasma Aarti" required value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-semibold">CATEGORY</label>
                      <select className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5" value={newNotice.category} onChange={e => setNewNotice({ ...newNotice, category: e.target.value })}>
                        <option value="Gate Status">🚪 Gate Status</option>
                        <option value="Bhasma Aarti">🔥 Bhasma Aarti</option>
                        <option value="Darshan Line">🚶 Darshan Line</option>
                        <option value="Crowd Advisory">🚨 Advisory</option>
                        <option value="General Notice">📢 General</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-semibold">GATE STATUS</label>
                      <select className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5" value={newNotice.status} onChange={e => setNewNotice({ ...newNotice, status: e.target.value })}>
                        <option value="Open">🟢 Open</option>
                        <option value="Closed">🔴 Closed</option>
                        <option value="Diverted">🟡 Diverted</option>
                        <option value="Active">ℹ️ Active</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-semibold">GATE NAME</label>
                      <input type="text" className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5" placeholder="e.g. Gate 4 (Nandi Mandapam)" value={newNotice.gateName} onChange={e => setNewNotice({ ...newNotice, gateName: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-secondary small fw-semibold">PRIORITY</label>
                      <select className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5" value={newNotice.priority} onChange={e => setNewNotice({ ...newNotice, priority: e.target.value })}>
                        <option value="Normal">Normal</option>
                        <option value="High">⚠️ High</option>
                        <option value="Urgent">⚡ Urgent</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small fw-semibold">REASON</label>
                      <input type="text" className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5" placeholder="e.g. Routine cleaning between 2:00 PM - 4:30 PM." value={newNotice.reason} onChange={e => setNewNotice({ ...newNotice, reason: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small fw-semibold">DESCRIPTION *</label>
                      <textarea className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5" rows={3} placeholder="Clear guidance for pilgrims, alternate gates, timing details..." required value={newNotice.description} onChange={e => setNewNotice({ ...newNotice, description: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top border-secondary border-opacity-25 px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" disabled={savingNotice} className={`${styles.goldBtn}`} style={{ padding: '10px 28px' }}>
                    {savingNotice ? 'Publishing...' : 'Publish Notice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
