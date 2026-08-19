import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  QrCode,
  Users,
  Ticket,
  Printer,
  X,
  User,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { QRCodeDisplay } from "./QRCodeDisplay";

export function EPassPortalModal({ show, onClose, user, onOpenAuth }) {
  const [primaryName, setPrimaryName] = useState(user ? user.name : "");
  const [contactPhone, setContactPhone] = useState(
    user ? user.contactPhone || "" : "",
  );
  const [personCount, setPersonCount] = useState(1);
  const [passengers, setPassengers] = useState([
    {
      name: user ? user.name : "",
      age: "",
      gender: "Male",
      idProof: "Aadhar Card",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [generatedPass, setGeneratedPass] = useState(null);

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

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

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
          idProof: "Aadhar Card",
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

  // Calculate next 30 available booking days (Today + 30 days max)
  const availableBookingDays = React.useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const isoStr = d.toISOString().substring(0, 10);
      const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      days.push({ dateStr: isoStr, label, dayNum: i });
    }
    return days;
  }, []);

  const [bookingDate, setBookingDate] = useState(availableBookingDays[0].dateStr);
  const [selectedAartiId, setSelectedAartiId] = useState("dadhodak");

  const aartiOptions = [
    { id: "bhasma", name: "Shri Mahakal Bhasma Aarti (04:00 AM - 06:00 AM)" },
    { id: "dadhodak", name: "Dadhodak Aarti / Naivedya Aarti (07:30 AM - 08:15 AM)" },
    { id: "bhog", name: "Shri Mahakal Bhog Aarti (10:30 AM - 11:30 AM)" },
    { id: "sandhya", name: "Sandhya Aarti (05:00 PM - 06:00 PM)" },
    { id: "shringar", name: "Sandhya Shringar Aarti (07:00 PM - 08:00 PM)" },
    { id: "shayan", name: "Shri Mahakal Shayan Aarti (10:30 PM - 11:00 PM)" }
  ];

  // Form submission handler
  const handleBookPass = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please Sign In first to book a Darshan E-Pass");
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setLoading(true);
    try {
      const matchedAarti = aartiOptions.find(a => a.id === selectedAartiId);
      const res = await axios.post("/api/passes/generate-epass", {
        primaryDevoteeName: primaryName,
        contactPhone,
        numberOfPersons: personCount,
        passengers,
        bookingDate,
        aartiId: selectedAartiId,
        aartiName: matchedAarti?.name || "Dadhodak Aarti (Naivedya Aarti)",
        gateNumber: Math.floor(Math.random() * 4) + 1,
      });

      if (res.data.success) {
        toast.success(`Shri Mahakal Pass Issued for ${bookingDate}! 🕉️`);
        setGeneratedPass(res.data.pass);
      } else {
        toast.error(res.data.message || "Failed to generate E-Pass");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection timeout. Please retry booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block overflow-y-auto"
      tabIndex="-1"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
    >
      <div className="modal-dialog modal-lg modal-dialog-centered py-4">
        <div
          className="modal-content rounded-4 shadow-2xl overflow-hidden epass-modal-content"
          style={{
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* MODAL HEADER */}
          <div className="modal-header px-4 py-3 epass-modal-header d-flex align-items-center justify-content-between flex-shrink-0">
            <div className="d-flex align-items-center gap-2">
              <span className="fs-5">🕉️</span>
              <div>
                <h6 className="modal-title text-warning fw-bold mb-0 font-serif">
                  Shri Mahakal Darshan E-Pass
                </h6>
                <span
                  className="text-secondary small"
                  style={{ fontSize: "0.72rem" }}
                >
                  Shri Mahakaleshwar Temple Trust · Ujjain
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* SCROLLABLE MODAL BODY */}
          <div className="modal-body p-4 p-md-4.5 overflow-auto flex-grow-1 epass-modal-body">
            {/* GENERATED PASS TICKET VIEW - DARK MODE BOARDING PASS STYLE */}
            {generatedPass ? (
              <div className="py-2 max-w-lg mx-auto">
                {/* DARK MODE PHYSICAL BOARDING PASS STUB CARD */}
                <div className="epass-ticket-card rounded-4 shadow-2xl position-relative overflow-hidden">
                  {/* TOP GOLD ACCENT STRIP */}
                  <div
                    className="bg-warning py-2.5 px-4 d-flex justify-content-between align-items-center text-dark fw-bold"
                    style={{ fontSize: "0.78rem" }}
                  >
                    <span>SHRI MAHAKALESHWAR TEMPLE TRUST · UJJAIN</span>
                    <span className="font-monospace">
                      PASS ID: {generatedPass.passId}
                    </span>
                  </div>

                  {/* BOARDING PASS CONTENT AREA */}
                  <div className="p-4.5 p-md-5 epass-ticket-body">
                    {/* GATE & ENTRY ROUTE HEADER */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3.5 border-bottom border-secondary border-opacity-25">
                      <div>
                        <span
                          className="text-warning small d-block text-uppercase fw-bold mb-1"
                          style={{ fontSize: "0.68rem", letterSpacing: "1px" }}
                        >
                          ASSIGNED ENTRY GATE
                        </span>
                        <h3 className="fw-black epass-ticket-title font-serif mb-1">
                          {generatedPass.gateName}
                        </h3>
                        <small className="epass-ticket-label fw-semibold">
                          Gate #{generatedPass.gateNumber} Scanner Entry
                        </small>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-warning text-dark px-3.5 py-2 font-monospace fw-bold rounded-pill shadow-sm">
                          CONFIRMED PASS
                        </span>
                      </div>
                    </div>

                    {/* KEY METRICS GRID */}
                    <div className="row g-3 text-sm mb-4">
                      <div className="col-6 mb-2">
                        <span
                          className="epass-ticket-label d-block text-uppercase fw-bold mb-1"
                          style={{ fontSize: "0.68rem" }}
                        >
                          PRIMARY DEVOTEE
                        </span>
                        <strong className="epass-ticket-title text-truncate d-block fs-6">
                          {generatedPass.primaryDevoteeName}
                        </strong>
                      </div>
                      <div className="col-6 mb-2">
                        <span
                          className="epass-ticket-label d-block text-uppercase fw-bold mb-1"
                          style={{ fontSize: "0.68rem" }}
                        >
                          TOTAL DEVOTEES
                        </span>
                        <strong className="text-warning d-block fs-6">
                          {generatedPass.numberOfPersons} Devotee(s)
                        </strong>
                      </div>

                      <div className="col-6">
                        <span
                          className="epass-ticket-label d-block text-uppercase fw-bold mb-1"
                          style={{ fontSize: "0.68rem" }}
                        >
                          ISSUE TIME
                        </span>
                        <span className="text-warning d-block font-monospace fw-semibold mb-0.5" style={{ fontSize: "0.78rem" }}>
                          {generatedPass.bookingDate || new Date(generatedPass.entryTime || generatedPass.createdAt).toISOString().substring(0, 10)}
                        </span>
                        <strong className="epass-ticket-title font-monospace fs-6">
                          {new Date(generatedPass.entryTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </strong>
                      </div>
                      <div className="col-6">
                        <span
                          className="epass-ticket-label d-block text-uppercase fw-bold mb-1"
                          style={{ fontSize: "0.68rem" }}
                        >
                          EXPIRE TIME
                        </span>
                        <span className="text-warning d-block font-monospace fw-semibold mb-0.5" style={{ fontSize: "0.78rem" }}>
                          {new Date(generatedPass.expiryTime).toISOString().substring(0, 10)}
                        </span>
                        <strong className="text-danger font-monospace fs-6">
                          {new Date(
                            generatedPass.expiryTime,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </div>
                    </div>

                    {/* REGISTERED PASSENGERS LIST */}
                    <div className="mb-2 pt-3 border-top border-secondary border-opacity-25">
                      <span
                        className="epass-ticket-label d-block text-uppercase fw-bold mb-2"
                        style={{ fontSize: "0.68rem" }}
                      >
                        PASSENGER LIST:
                      </span>
                      <div className="d-flex flex-wrap gap-2">
                        {generatedPass.passengers.map((p, idx) => (
                          <span
                            key={idx}
                            className="badge epass-passenger-badge px-3 py-1.5 small rounded-pill"
                          >
                            {p.name} ({p.age}y, {p.gender})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PERFORATED DOTTED SEPARATOR STUB WITH CORNER NOTCHES */}
                  <div className="position-relative epass-ticket-stub py-2.5 px-4 d-flex align-items-center justify-content-between border-top border-bottom border-secondary border-opacity-30">
                    <div
                      className="position-absolute rounded-circle epass-ticket-body"
                      style={{
                        width: 24,
                        height: 24,
                        left: -12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    ></div>
                    <div
                      className="position-absolute rounded-circle epass-ticket-body"
                      style={{
                        width: 24,
                        height: 24,
                        right: -12,
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    ></div>
                    <div className="w-100 border-top border-dashed border-warning opacity-40"></div>
                  </div>

                  {/* BOTTOM SCANNER STUB AREA WITH QR CODE */}
                  <div className="p-4.5 p-md-5 epass-ticket-stub text-center">
                    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-4">
                      <div className="text-start">
                        <div className="d-flex align-items-center gap-2 text-success fw-bold small mb-2">
                          <ShieldCheck size={18} /> OFFICIAL VERIFIED PASS
                        </div>
                        <p
                          className="epass-ticket-label small mb-0 leading-relaxed"
                          style={{ fontSize: "0.78rem" }}
                        >
                          Present QR code to automated scanner at Gate #
                          {generatedPass.gateNumber} entry turnstile.
                        </p>
                      </div>

                      {/* QR CODE BOX */}
                      <div className="p-3 bg-white rounded-4 flex-shrink-0 text-center shadow-md">
                        <QRCodeDisplay
                          value={
                            generatedPass.qrPayload || generatedPass.passId
                          }
                          size={140}
                          className="mx-auto"
                        />
                        <span
                          className="font-monospace text-dark d-block mt-2 fw-bold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          GATE #{generatedPass.gateNumber} SCANNER VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                  <button
                    className="btn btn-warning px-4 py-2 fw-bold text-dark rounded-pill shadow-sm d-flex align-items-center gap-2"
                    onClick={() => window.print()}
                  >
                    <Printer size={16} /> Print / Save Ticket Stub
                  </button>
                  <button
                    className="btn btn-outline-light px-4 py-2 rounded-pill small"
                    onClick={() => setGeneratedPass(null)}
                  >
                    Book Another Pass
                  </button>
                </div>
              </div>
            ) : (
              /* MINIMAL GENERAL FORM VIEW - FITS IN 90VH */
              <form
                onSubmit={handleBookPass}
                className="space-y-3 max-w-lg mx-auto"
              >
                {/* STEP 1: SELECT AARTI & BOOKING DATE (NEXT 30 DAYS MAX) */}
                <div className="mb-3">
                  <label className="form-label text-warning fw-bold small mb-1.5 d-flex align-items-center gap-2">
                    <Ticket size={16} className="text-warning" /> Select Aarti Ceremony
                  </label>
                  <select
                    className="form-select bg-black text-warning border border-secondary border-opacity-40 py-2 px-3 rounded-3 fw-bold shadow-sm mb-3"
                    value={selectedAartiId}
                    onChange={(e) => setSelectedAartiId(e.target.value)}
                    style={{ fontSize: "0.88rem", cursor: "pointer" }}
                  >
                    {aartiOptions.map(a => (
                      <option key={a.id} value={a.id} className="bg-dark text-white">
                        {a.name}
                      </option>
                    ))}
                  </select>

                  <label className="form-label text-warning fw-bold small mb-1.5 d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-warning" /> Select Booking Date (1 Month Advance Booking)
                  </label>
                  
                  <div className="d-flex gap-2">
                    <select
                      className="form-select bg-black text-warning border border-secondary border-opacity-40 py-2 px-3 rounded-3 fw-bold shadow-sm flex-grow-1"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      style={{ fontSize: "0.88rem", cursor: "pointer" }}
                    >
                      {availableBookingDays.map((d) => (
                        <option key={d.dateStr} value={d.dateStr} className="bg-dark text-white">
                          {d.label} ({d.dateStr})
                        </option>
                      ))}
                    </select>

                    <input
                      type="date"
                      className="form-control bg-black text-warning border border-secondary border-opacity-40 py-2 px-3 rounded-3 fw-bold"
                      style={{ width: "160px", fontSize: "0.85rem", colorScheme: "dark" }}
                      value={bookingDate}
                      min={new Date().toISOString().substring(0, 10)}
                      max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)}
                      onChange={(e) => setBookingDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* STEP 2: NUMBER OF DEVOTEES SELECTOR */}
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
                  <h6 className="text-warning fw-bold mb-2 font-serif small">
                    Primary Contact Details
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label text-gray-300 small mb-1">
                        Primary Devotee Name{" "}
                        <span className="text-warning">*</span>
                      </label>
                      <div className="position-relative">
                        <User
                          size={16}
                          className="position-absolute text-warning opacity-75"
                          style={{ top: "11px", left: "14px" }}
                        />
                        <input
                          type="text"
                          className="form-control text-white border-0 rounded-3 py-2"
                          placeholder="e.g. Ramesh Sharma"
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          style={{
                            paddingLeft: "42px",
                            backgroundColor: "#222226",
                            color: "#ffffff",
                            fontSize: "0.88rem",
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-gray-300 small mb-1">
                        Mobile Phone Number{" "}
                        <span className="text-warning">*</span>
                      </label>
                      <div className="position-relative">
                        <Phone
                          size={16}
                          className="position-absolute text-warning opacity-75"
                          style={{ top: "11px", left: "14px" }}
                        />
                        <input
                          type="tel"
                          className="form-control text-white border-0 rounded-3 py-2"
                          placeholder="+91 98765 43210"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          style={{
                            paddingLeft: "42px",
                            backgroundColor: "#222226",
                            color: "#ffffff",
                            fontSize: "0.88rem",
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* STEP 3: DEVOTEES MEMBER DETAILS */}
                <div className="mb-3">
                  <h6 className="text-warning fw-bold mb-2 font-serif small">
                    Devotee Information
                  </h6>
                  <div className="space-y-2">
                    {passengers.map((p, idx) => (
                      <div
                        key={idx}
                        className="row g-2 align-items-center mb-2"
                      >
                        <div className="col-md-5">
                          <label className="form-label text-gray-300 small mb-1">
                            {personCount > 1
                              ? `Devotee #${idx + 1} Name`
                              : "Full Name"}{" "}
                            <span className="text-warning">*</span>
                          </label>
                          <div className="position-relative">
                            <User
                              size={16}
                              className="position-absolute text-warning opacity-75"
                              style={{ top: "11px", left: "14px" }}
                            />
                            <input
                              type="text"
                              className="form-control text-white border-0 rounded-3 py-2"
                              placeholder="Enter Devotee Full Name"
                              value={p.name}
                              onChange={(e) =>
                                handlePassengerChange(
                                  idx,
                                  "name",
                                  e.target.value,
                                )
                              }
                              style={{
                                paddingLeft: "42px",
                                backgroundColor: "#222226",
                                color: "#ffffff",
                                fontSize: "0.88rem",
                              }}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label text-gray-300 small mb-1">
                            Age <span className="text-warning">*</span>
                          </label>
                          <div className="position-relative">
                            <Calendar
                              size={16}
                              className="position-absolute text-warning opacity-75"
                              style={{ top: "11px", left: "14px" }}
                            />
                            <input
                              type="number"
                              className="form-control text-white border-0 rounded-3 py-2"
                              placeholder="Age"
                              value={p.age}
                              onChange={(e) =>
                                handlePassengerChange(
                                  idx,
                                  "age",
                                  e.target.value,
                                )
                              }
                              style={{
                                paddingLeft: "42px",
                                backgroundColor: "#222226",
                                color: "#ffffff",
                                fontSize: "0.88rem",
                              }}
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
                            onChange={(e) =>
                              handlePassengerChange(
                                idx,
                                "gender",
                                e.target.value,
                              )
                            }
                            style={{
                              backgroundColor: "#222226",
                              color: "#ffffff",
                              fontSize: "0.88rem",
                            }}
                          >
                            <option
                              value="Male"
                              style={{
                                backgroundColor: "#222226",
                                color: "#ffffff",
                              }}
                            >
                              Male
                            </option>
                            <option
                              value="Female"
                              style={{
                                backgroundColor: "#222226",
                                color: "#ffffff",
                              }}
                            >
                              Female
                            </option>
                            <option
                              value="Other"
                              style={{
                                backgroundColor: "#222226",
                                color: "#ffffff",
                              }}
                            >
                              Other
                            </option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-warning btn-md w-100 fw-bold py-2.5 text-dark rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-3"
                >
                  {loading ? (
                    <span>Generating E-Pass...</span>
                  ) : (
                    <>
                      <QrCode size={18} /> Generate Mahakal Entry Pass (Free)
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
