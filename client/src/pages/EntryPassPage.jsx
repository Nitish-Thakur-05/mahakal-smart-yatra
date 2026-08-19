import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  QrCode,
  ShieldAlert,
  Clock,
  Users,
  CheckCircle2,
  Ticket,
  Printer,
  Sparkles,
  User,
  Phone,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { QRCodeDisplay } from "../components/QRCodeDisplay";

export function EntryPassPage({ user, onOpenAuth }) {
  const [primaryName, setPrimaryName] = useState(user ? user.name : "");
  const [contactPhone, setContactPhone] = useState(user ? user.contactPhone || "" : "");
  const [personCount, setPersonCount] = useState(1);

  // Passengers array (up to 6)
  const [passengers, setPassengers] = useState([
    { name: user ? user.name : "", age: "", gender: "Male", idProof: "Aadhar Card" }
  ]);

  const [loading, setLoading] = useState(false);
  const [myPasses, setMyPasses] = useState([]);
  const [cooldown, setCooldown] = useState({ active: false, remainingMs: 0 });
  const [activeTab, setActiveTab] = useState("book"); // 'book' or 'my-passes'
  const [selectedPassForQR, setSelectedPassForQR] = useState(null);

  // Sync user info
  useEffect(() => {
    if (user) {
      if (!primaryName) setPrimaryName(user.name);
      if (passengers[0] && !passengers[0].name) {
        const updated = [...passengers];
        updated[0].name = user.name;
        setPassengers(updated);
      }
    }
  }, [user]);

  // Lock background body scroll when ticket modal is open
  useEffect(() => {
    if (selectedPassForQR) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPassForQR]);

  // Load user passes
  const fetchMyPasses = async () => {
    if (user) {
      try {
        const res = await axios.get("/api/passes/my-passes");
        setMyPasses(res.data.passes || []);
        setCooldown(res.data.cooldown || { active: false, remainingMs: 0 });
      } catch (e) {
        console.error("Error fetching passes", e);
      }
    }
  };

  useEffect(() => {
    fetchMyPasses();
    const timer = setInterval(() => {
      fetchMyPasses();
    }, 30000); // refresh every 30s
    return () => clearInterval(timer);
  }, [user]);

  // Adjust passengers when personCount changes
  const handlePersonCountChange = (count) => {
    const validCount = Math.max(1, Math.min(6, count));
    setPersonCount(validCount);

    const updated = [...passengers];
    if (validCount > updated.length) {
      for (let i = updated.length; i < validCount; i++) {
        updated.push({
          name: "",
          age: "",
          gender: "Male",
          idProof: "Aadhar Card"
        });
      }
    } else {
      updated.splice(validCount);
    }
    setPassengers(updated);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // Calculate next 5 available booking days (Today + 5 days max)
  const availableBookingDays = React.useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i <= 5; i++) {
      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const isoStr = d.toISOString().substring(0, 10);
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      days.push({ dateStr: isoStr, label, dayNum: i });
    }
    return days;
  }, []);

  const [bookingDate, setBookingDate] = useState(availableBookingDays[0].dateStr);

  // Form submission handler
  const handleBookPass = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first to book a Mahakal Entry Pass.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }

    if (!primaryName.trim() || !contactPhone.trim()) {
      toast.error("Please provide Primary Devotee Name and Contact Phone Number.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/passes/book", {
        primaryDevoteeName: primaryName,
        primaryEmail: user?.email || "",
        contactPhone,
        passengers,
        bookingDate
      });

      toast.success(res.data.message || "Entry Pass booked successfully!");
      fetchMyPasses();
      setActiveTab("my-passes");
      setSelectedPassForQR(res.data.pass);

      if (res.data.pass) {
        const userStorageKey = `mahakal_entry_passes_${user?.email || "guest"}`;
        const existing = JSON.parse(localStorage.getItem(userStorageKey) || "[]");
        const updated = [res.data.pass, ...existing];
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
        window.dispatchEvent(new Event("mahakal-booking-success"));
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to book entry pass.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "0m";
    const hrs = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.ceil((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="min-vh-100 bg-black text-light pb-5" style={{ paddingTop: '130px' }}>
      <div className="container py-2 max-w-3xl mx-auto">
        
        {/* HERO TITLE HEADER */}
        <div className="text-center mb-4">
          <h2 className="fw-black text-warning font-serif mb-1">
            Shri Mahakal Entry Pass Portal
          </h2>
          <span className="text-gray-400 small">Shri Mahakaleshwar Temple Trust · Official Entry Portal</span>
        </div>

        {/* 5-HOUR COOLDOWN WARNING IF ACTIVE */}
        {cooldown.active && (
          <div className="alert bg-black border border-warning text-white rounded-3 p-3 mb-3 shadow d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <Clock size={22} className="text-warning" />
              <div>
                <h6 className="fw-bold mb-0 text-warning small">5-Hour Cooldown Active</h6>
                <span className="text-gray-400 small" style={{ fontSize: "0.76rem" }}>Next booking available after cooldown expires.</span>
              </div>
            </div>
            <div className="fw-bold font-monospace text-white small">{formatRemainingTime(cooldown.remainingMs)}</div>
          </div>
        )}

        {/* MAIN NAVIGATION TABS */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          <button
            className={`btn ${
              activeTab === "book"
                ? "btn-warning text-dark font-bold shadow"
                : "btn-outline-secondary text-white"
            } px-4 py-2 rounded-pill small fw-bold d-flex align-items-center gap-2`}
            onClick={() => setActiveTab("book")}
          >
            <Ticket size={16} /> Book Entry Pass
          </button>
          <button
            className={`btn ${
              activeTab === "my-passes"
                ? "btn-warning text-dark font-bold shadow"
                : "btn-outline-secondary text-white"
            } px-4 py-2 rounded-pill small fw-bold d-flex align-items-center gap-2`}
            onClick={() => {
              if (!user) {
                toast.error("Please login first to view your passes.");
                onOpenAuth("login");
              } else {
                setActiveTab("my-passes");
              }
            }}
          >
            <QrCode size={16} /> My E-Passes ({myPasses.length})
          </button>
        </div>

        {/* TAB 1: BOOKING FORM */}
        {activeTab === "book" && (
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleBookPass} className="card text-white rounded-4 p-4 shadow-2xl" style={{ backgroundColor: "#161618", border: "1px solid #2d2d30" }}>
              
              {/* STEP 1: SELECT BOOKING DATE (NEXT 5 DAYS MAX) */}
              <div className="mb-4">
                <label className="form-label text-warning fw-bold small mb-1.5 d-flex align-items-center gap-2">
                  <Calendar size={16} className="text-warning" /> Select Booking Date
                </label>
                
                <div className="position-relative">
                  <select
                    className="form-select bg-black text-warning border border-secondary border-opacity-40 py-2.5 px-3 rounded-3 fw-bold shadow-sm"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    style={{ fontSize: "0.92rem", cursor: "pointer" }}
                  >
                    {availableBookingDays.map((d) => (
                      <option key={d.dateStr} value={d.dateStr} className="bg-dark text-white">
                        {d.label} ({d.dateStr})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STEP 2: DEVOTEES COUNT SELECTOR */}
              <div className="mb-3">
                <label className="form-label text-warning fw-bold small mb-1.5 d-flex align-items-center gap-2">
                  <Users size={16} /> Select Number of Devotees (Max 6)
                </label>

                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`btn ${
                        personCount === num
                          ? "btn-warning text-dark font-bold"
                          : "btn-outline-secondary text-white"
                      } flex-grow-1 py-1.5 rounded-3 fw-bold small transition-all`}
                      onClick={() => handlePersonCountChange(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: PRIMARY CONTACT DETAILS */}
              <div className="mb-3">
                <h6 className="text-warning fw-bold mb-2 font-serif small">Primary Contact Details</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label text-gray-300 small mb-1">
                      Primary Devotee Name <span className="text-warning">*</span>
                    </label>
                    <div className="position-relative">
                      <User size={16} className="position-absolute text-warning opacity-75" style={{ top: "11px", left: "14px" }} />
                      <input
                        type="text"
                        className="form-control text-white border-0 rounded-3 py-2"
                        placeholder="e.g. Ramesh Sharma"
                        value={primaryName}
                        onChange={(e) => setPrimaryName(e.target.value)}
                        style={{ paddingLeft: "42px", backgroundColor: "#222226", color: "#ffffff", fontSize: "0.88rem" }}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-gray-300 small mb-1">
                      Mobile Phone Number <span className="text-warning">*</span>
                    </label>
                    <div className="position-relative">
                      <Phone size={16} className="position-absolute text-warning opacity-75" style={{ top: "11px", left: "14px" }} />
                      <input
                        type="tel"
                        className="form-control text-white border-0 rounded-3 py-2"
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        style={{ paddingLeft: "42px", backgroundColor: "#222226", color: "#ffffff", fontSize: "0.88rem" }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: DEVOTEES MEMBER DETAILS */}
              <div className="mb-3">
                <h6 className="text-warning fw-bold mb-2 font-serif small">Devotee Information</h6>
                <div className="space-y-2">
                  {passengers.map((p, idx) => (
                    <div key={idx} className="row g-2 align-items-center mb-2">
                      <div className="col-md-5">
                        <label className="form-label text-gray-300 small mb-1">
                          {personCount > 1 ? `Devotee #${idx + 1} Name` : "Full Name"} <span className="text-warning">*</span>
                        </label>
                        <div className="position-relative">
                          <User size={16} className="position-absolute text-warning opacity-75" style={{ top: "11px", left: "14px" }} />
                          <input
                            type="text"
                            className="form-control text-white border-0 rounded-3 py-2"
                            placeholder="Enter Devotee Full Name"
                            value={p.name}
                            onChange={(e) => handlePassengerChange(idx, "name", e.target.value)}
                            style={{ paddingLeft: "42px", backgroundColor: "#222226", color: "#ffffff", fontSize: "0.88rem" }}
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label text-gray-300 small mb-1">
                          Age <span className="text-warning">*</span>
                        </label>
                        <div className="position-relative">
                          <Calendar size={16} className="position-absolute text-warning opacity-75" style={{ top: "11px", left: "14px" }} />
                          <input
                            type="number"
                            className="form-control text-white border-0 rounded-3 py-2"
                            placeholder="Age"
                            value={p.age}
                            onChange={(e) => handlePassengerChange(idx, "age", e.target.value)}
                            style={{ paddingLeft: "42px", backgroundColor: "#222226", color: "#ffffff", fontSize: "0.88rem" }}
                            min="1"
                            max="110"
                            required
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label text-gray-300 small mb-1">
                          Gender <span className="text-warning">*</span>
                        </label>
                        <select
                          className="form-select text-white border-0 rounded-3 py-2"
                          value={p.gender}
                          onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                          style={{ backgroundColor: "#222226", color: "#ffffff", fontSize: "0.88rem" }}
                        >
                          <option value="Male" style={{ backgroundColor: "#222226", color: "#ffffff" }}>Male</option>
                          <option value="Female" style={{ backgroundColor: "#222226", color: "#ffffff" }}>Female</option>
                          <option value="Other" style={{ backgroundColor: "#222226", color: "#ffffff" }}>Other</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || cooldown.active}
                className="btn btn-warning btn-md w-100 fw-bold py-2.5 text-dark rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-3"
              >
                {loading ? (
                  <span>Generating E-Pass...</span>
                ) : cooldown.active ? (
                  <span>Cooldown Active ({formatRemainingTime(cooldown.remainingMs)} remaining)</span>
                ) : (
                  <>
                    <QrCode size={18} /> Generate Mahakal Entry Pass (Free)
                  </>
                )}
              </button>

            </form>
          </div>
        )}

        {/* TAB 2: MY PASSES LIST */}
        {activeTab === "my-passes" && (
          <div>
            {!user ? (
              <div className="text-center py-4 bg-dark rounded-4 border border-secondary border-opacity-25">
                <ShieldAlert size={36} className="text-warning mb-2" />
                <h6>Login Required</h6>
                <button onClick={() => onOpenAuth("login")} className="btn btn-warning btn-sm px-4 py-1.5 fw-bold rounded-pill">
                  Login Now
                </button>
              </div>
            ) : myPasses.length === 0 ? (
              <div className="text-center py-4 bg-dark rounded-4 border border-secondary border-opacity-25">
                <Ticket size={36} className="text-warning mb-2" />
                <h6>No E-Passes Booked Yet</h6>
                <button onClick={() => setActiveTab("book")} className="btn btn-warning btn-sm px-4 py-1.5 fw-bold rounded-pill text-dark">
                  Book Free Pass Now
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {myPasses.map((pass) => {
                  const isExpired = pass.status === "expired" || new Date() > new Date(pass.expiryTime);
                  const isUsed = pass.status === "used";

                  return (
                    <div key={pass._id} className="col-md-6">
                      <div className={`card h-100 bg-black text-white border ${isExpired ? "border-danger border-opacity-40" : isUsed ? "border-secondary" : "border-warning border-opacity-30"} rounded-3 p-3 shadow`}>
                        
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-warning text-dark font-monospace fw-bold">{pass.passId}</span>
                          <span className={`badge ${isExpired ? "bg-danger" : isUsed ? "bg-secondary" : "bg-success"} small px-2 py-0.5 rounded-pill`}>
                            {isExpired ? "EXPIRED" : isUsed ? "USED" : "ACTIVE"}
                          </span>
                        </div>

                        <h6 className="fw-bold text-white font-serif mb-1">{pass.gateName}</h6>
                        <small className="text-gray-400 d-block mb-2">Primary: {pass.primaryDevoteeName} ({pass.numberOfPersons} Devotees)</small>

                        <div className="d-flex gap-2 mt-auto">
                          <button
                            onClick={() => setSelectedPassForQR(pass)}
                            className="btn btn-warning btn-sm flex-grow-1 fw-bold rounded-2 text-dark"
                          >
                            <QrCode size={14} /> View Ticket
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="btn btn-outline-light btn-sm rounded-2"
                          >
                            <Printer size={14} />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BOARDING PASS STYLE STUB DIALOG FOR MY PASSES */}
        {selectedPassForQR && (
          <div
            className="modal fade show d-block overflow-y-auto"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.88)",
              backdropFilter: "blur(8px)",
              zIndex: 1060,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              overflowY: "auto",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPassForQR(null);
            }}
          >
            <div className="modal-dialog modal-dialog-centered py-4">
              <div
                className="modal-content rounded-4 shadow-2xl overflow-hidden epass-modal-content"
                style={{
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                
                <div className="modal-header px-4 py-3 epass-modal-header d-flex align-items-center justify-content-between flex-shrink-0">
                  <h6 className="modal-title font-serif fw-bold text-warning d-flex align-items-center gap-2 mb-0">
                    <QrCode size={18} /> Shri Mahakal E-Pass Ticket Stub
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPassForQR(null)}
                  ></button>
                </div>

                <div className="modal-body p-4 p-md-4.5 overflow-auto flex-grow-1 epass-modal-body">
                  
                  {/* PHYSICAL BOARDING PASS CARD */}
                  <div className="epass-ticket-card rounded-4 shadow-2xl overflow-hidden">
                    
                    <div className="bg-warning py-2.5 px-4 d-flex justify-content-between align-items-center text-dark fw-bold" style={{ fontSize: "0.78rem" }}>
                      <span>SHRI MAHAKALESHWAR TEMPLE TRUST</span>
                      <span className="font-monospace">{selectedPassForQR.passId}</span>
                    </div>

                    <div className="p-4.5 p-md-5 epass-ticket-body">
                      <div className="d-flex justify-content-between align-items-center mb-4 pb-3.5 border-bottom border-secondary border-opacity-25">
                        <div>
                          <span className="text-warning d-block text-uppercase fw-bold mb-1" style={{ fontSize: "0.68rem" }}>ENTRY GATE</span>
                          <h4 className="fw-black epass-ticket-title font-serif mb-1">{selectedPassForQR.gateName}</h4>
                        </div>
                        <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 small shadow-sm">
                          Gate #{selectedPassForQR.gateNumber}
                        </span>
                      </div>

                      <div className="row g-3 text-sm mb-3">
                        <div className="col-6 mb-2">
                          <span className="epass-ticket-label d-block text-uppercase fw-bold mb-1" style={{ fontSize: "0.68rem" }}>PRIMARY DEVOTEE</span>
                          <strong className="epass-ticket-title d-block text-truncate fs-6">{selectedPassForQR.primaryDevoteeName}</strong>
                        </div>
                        <div className="col-6 mb-2">
                          <span className="epass-ticket-label d-block text-uppercase fw-bold mb-1" style={{ fontSize: "0.68rem" }}>TOTAL DEVOTEES</span>
                          <strong className="text-warning d-block fs-6">{selectedPassForQR.numberOfPersons} Person(s)</strong>
                        </div>

                        <div className="col-6">
                          <span className="epass-ticket-label d-block text-uppercase fw-bold mb-1" style={{ fontSize: "0.68rem" }}>ISSUE TIME</span>
                          <span className="text-warning d-block font-monospace fw-semibold mb-0.5" style={{ fontSize: "0.78rem" }}>
                            {selectedPassForQR.bookingDate || new Date(selectedPassForQR.entryTime || selectedPassForQR.createdAt).toISOString().substring(0, 10)}
                          </span>
                          <strong className="epass-ticket-title font-monospace fs-6">{new Date(selectedPassForQR.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                        </div>
                        <div className="col-6">
                          <span className="epass-ticket-label d-block text-uppercase fw-bold mb-1" style={{ fontSize: "0.68rem" }}>EXPIRE TIME</span>
                          <span className="text-warning d-block font-monospace fw-semibold mb-0.5" style={{ fontSize: "0.78rem" }}>
                            {new Date(selectedPassForQR.expiryTime).toISOString().substring(0, 10)}
                          </span>
                          <strong className="text-danger font-monospace fs-6">{new Date(selectedPassForQR.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                        </div>
                      </div>
                    </div>

                    {/* PERFORATED DOTTED SEPARATOR */}
                    <div className="position-relative epass-ticket-stub py-2 px-4">
                      <div className="w-100 border-top border-dashed border-warning opacity-40"></div>
                    </div>

                    {/* QR CODE SCANNER STUB */}
                    <div className="p-4.5 p-md-5 epass-ticket-stub text-center">
                      <div className="p-3 bg-white rounded-4 d-inline-block shadow-md mb-2">
                        <QRCodeDisplay value={selectedPassForQR.qrPayload || selectedPassForQR.passId} size={145} className="mx-auto" />
                      </div>
                      <div className="epass-ticket-label font-monospace d-block mt-2 fw-semibold" style={{ fontSize: "0.72rem" }}>
                        GATE #{selectedPassForQR.gateNumber} SCANNER VERIFIED
                      </div>
                    </div>

                  </div>

                </div>

                <div className="modal-footer border-0 px-4 pb-4">
                  <button
                    type="button"
                    className="btn btn-outline-light rounded-pill px-4 btn-sm"
                    onClick={() => setSelectedPassForQR(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning text-dark font-bold rounded-pill px-4 btn-sm"
                    onClick={() => window.print()}
                  >
                    Print Ticket
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
