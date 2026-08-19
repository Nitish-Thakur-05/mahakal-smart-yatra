import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Crown,
  Sparkles,
  Ticket,
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Info,
  X,
  ChevronRight,
  Hash,
  Printer,
  Download,
  Star,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { RazorpayModal } from "../components/RazorpayModal";
import { recordVipBooking } from "../utils/bookingStats";
import styles from "../styles/custom.module.css";

const VIP_PACKAGES = [
  {
    id: "sheeta-gate-express",
    name: "Sheeta Gate Fast-Track Pass",
    nameHi: "शीता द्वार एक्सप्रेस दर्शन",
    price: 250,
    badge: "Most Popular",
    gate: "Gate No. 4 (Sheeta Dwar)",
    estimatedTime: "20 - 30 Mins",
    image:
      "https://cdn.mahakal.brainabove.net/public-static/Galleryimages/IMG20251219105017.jpg",
    description:
      "Priority express line access via Sheeta Dwar (Gate 4) bypassing general queues. Includes sacred Mahakal Prasad pouch and queue assistance.",
    inclusions: [
      "Express Entry via Sheeta Dwar Gate No. 4",
      "Dedicated Fast-Track Moving Line (20-30 min Darshan)",
      "Blessed Mahakal Tilak & Mishri Prasad Box",
      "Shoe Stand & Cloakroom Priority Counter Access",
    ],
    reportingTime: "15 mins before chosen slot",
  },
  {
    id: "garbhagriha-protocol",
    name: "Protocol Garbhagriha Priority Pass",
    nameHi: "गर्भगृह प्रोटोकॉल दर्शन",
    price: 500,
    badge: "Sanctum Proximity",
    gate: "Gate No. 1 (Avantika VIP Gate)",
    estimatedTime: "15 - 20 Mins",
    image:
      "https://cdn.mahakal.brainabove.net/public-static/Galleryimages/IMG20251124073821.jpg",
    description:
      "Sanctum proximity darshan with special privilege view right near the Nandi Hall & Garbhagriha threshold. Includes holy Rudraksha & Bhasma prasad.",
    inclusions: [
      "VIP Entry via Avantika Dwar (Gate 1)",
      "Proximity Nandi Hall Seating during Aarti",
      "Holy Mahakal Bhasma & Sacred Rudraksha Bead",
      "Escorted Entry through Temple Protocol Officers",
      "Complimentary Mahakal Lok Battery Car Ride",
    ],
    reportingTime: "20 mins before chosen slot",
  },
  {
    id: "special-abhishek-vip",
    name: "Special Mahakal Abhishek & VIP Pass",
    nameHi: "विशेष महाकाल अभिषेक दर्शन",
    price: 1100,
    badge: "Pujan Included",
    gate: "VIP Protocol Gate & Garbhagriha",
    estimatedTime: "30 - 45 Mins",
    image:
      "https://cdn.mahakal.brainabove.net/public-static/Galleryimages/IMG20251120183509.jpg",
    description:
      "Personalized VIP Jalabhishek & Sankaalpa booking under expert temple Purohit guidance along with sanctum priority darshan.",
    inclusions: [
      "VIP Protocol Escort to Garbhagriha Threshold",
      "Personalized Panchamrut Jalabhishek Pujan & Sankalpa",
      "Special Mahaprasad Box (Laddu + Bhasma + Dupatta)",
      "Personal Temple Priest (Purohit) Assistance",
      "Fast-track VIP Car Parking Pass",
    ],
    reportingTime: "30 mins before chosen slot",
  },
  {
    id: "royal-nri-protocol",
    name: "Royal Protocol & Family VIP Express Pass",
    nameHi: "शाही प्रोटोकॉल परिवार पास",
    price: 2100,
    badge: "Zero-Wait Royal Pass",
    gate: "VVIP Protocol Holding Lounge",
    estimatedTime: "Direct Zero-Wait Access",
    image:
      "https://cdn.mahakal.brainabove.net/public-static/Galleryimages/IMG-20251117-WA0552.jpg",
    description:
      "Zero-wait executive protocol pass for up to 4 family members or NRI delegates with private VIP holding lounge and dedicated priest.",
    inclusions: [
      "Private Air-Conditioned VVIP Protocol Lounge Access",
      "Direct Zero-Wait Escorted Sanctum Entry",
      "Full Royal Prasadam Kit & Silver-Plated Shiva Frame",
      "Dedicated Golf Cart & Car Chauffeur Escort inside Mahakal Lok",
      "Covers up to 4 Devotees in single pass",
    ],
    reportingTime: "At your convenience within time window",
  },
];

const TIME_SLOTS = [
  "06:00 AM - 08:00 AM (Early Morning)",
  "09:00 AM - 11:00 AM (Morning Peak)",
  "12:00 PM - 02:00 PM (Mid-Day Royal)",
  "03:00 PM - 05:00 PM (Afternoon)",
  "06:00 PM - 08:00 PM (Evening Sandhya)",
  "08:30 PM - 10:00 PM (Night Shringar)",
];

export function VIPDarshan({ user, onOpenAuth }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [devoteeCount, setDevoteeCount] = useState(1);
  const [primaryName, setPrimaryName] = useState(user?.name || "");
  const [primaryEmail, setPrimaryEmail] = useState(user?.email || "");
  const [primaryPhone, setPrimaryPhone] = useState(user?.contactPhone || "");
  const [idCardNumber, setIdCardNumber] = useState("");

  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState(null);

  useEffect(() => {
    if (user) {
      setPrimaryName(user.name || "");
      setPrimaryEmail(user.email || "");
      setPrimaryPhone(user.contactPhone || "");
    }
  }, [user]);

  const handleOpenBookingModal = (pkg) => {
    if (!user) {
      toast.error("Please sign in or register to book VIP Darshan passes.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    setSelectedPkg(pkg);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to proceed with VIP Darshan booking.");
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (!primaryName || !primaryEmail || !idCardNumber) {
      toast.error("Please fill in all mandatory devotee verification details.");
      return;
    }
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsRazorpayOpen(false);

    const ticketRef = `VIP-MAHAKAL-${Math.floor(100000 + Math.random() * 900000)}`;
    const passesCount = Number(devoteeCount) || 1;
    const totalAmount = selectedPkg.price * passesCount;

    const ticketData = {
      ticketId: ticketRef,
      pkgId: selectedPkg.id,
      pkgName: selectedPkg.name,
      pkgNameHi: selectedPkg.nameHi,
      gate: selectedPkg.gate,
      date: bookingDate,
      timeSlot: selectedSlot,
      devoteeCount: passesCount,
      primaryName,
      primaryEmail,
      primaryPhone,
      idCardNumber,
      totalAmount,
      paymentId:
        paymentDetails.paymentId ||
        `pay_VIP_${Math.random().toString(36).substring(2, 10)}`,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    };

    // Post VIP booking to MongoDB backend 'viptickets' collection
    try {
      await axios.post("/api/passes/book-vip-ticket", {
        bookingDate,
        pkgId: selectedPkg.id,
        pkgName: selectedPkg.name,
        passesCount,
        pricePerPass: selectedPkg.price,
        totalAmount,
        primaryName,
        primaryEmail,
        primaryPhone,
        timeSlot: selectedSlot,
        gateName: selectedPkg.gate
      });
    } catch (err) {
      console.error("Failed to sync VIP booking to MongoDB:", err);
    }

    // Save ticket to localStorage for user profile persistence
    const userStorageKey = `mahakal_vip_tickets_${user?.email || "guest"}`;
    const existing = JSON.parse(localStorage.getItem(userStorageKey) || "[]");
    const updated = [ticketData, ...existing];
    localStorage.setItem(userStorageKey, JSON.stringify(updated));

    // Record dynamic VIP analytics for Admin Dashboard
    if (selectedPkg) {
      recordVipBooking(bookingDate, selectedPkg.name, selectedPkg.price, passesCount);
    }

    // Trigger custom event for real-time UI updates
    window.dispatchEvent(new Event("vip-ticket-booked"));

    setIssuedTicket(ticketData);
    toast.success(`VIP Darshan Ticket ${ticketRef} issued for ${bookingDate}! 👑`);
  };

  return (
    <div
      className="bg-black min-vh-100 text-white pb-5"
      style={{ paddingTop: "110px" }}
    >
      <div className="container py-4">
        {/* Header Section */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-warning bg-opacity-10 border border-warning border-opacity-30 text-warning mb-3">
            <Crown size={18} />
            <span
              className="small fw-bold text-uppercase"
              style={{ letterSpacing: "0.1em" }}
            >
              Official VIP Protocol & Priority Darshan
            </span>
          </div>

          <h1
            className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}
          >
            Shri Mahakaleshwar VIP Darshan Booking
          </h1>
          <p
            className="text-secondary max-w-750 mx-auto fs-5"
            style={{ lineHeight: 1.6 }}
          >
            Bypass long general queue lines with official temple protocol
            passes, Sheeta Dwar fast-track access, Garbhagriha proximity view,
            and VIP Mahaprasadam.
          </p>
        </motion.div>

        {/* 2 Cards Per Row VIP Packages Grid */}
        <div className="row g-4 mb-5">
          {VIP_PACKAGES.map((pkg, idx) => (
            <div key={pkg.id} className="col-12 col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`card bg-dark text-white ${styles.glassCard} h-100 p-0 overflow-hidden border border-warning border-opacity-30 shadow-2xl d-flex flex-column rounded-4`}
              >
                {/* Cover Banner Image */}
                <div className="position-relative" style={{ height: 230 }}>
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,13,13,0.85) 100%)",
                    }}
                  />

                  {/* Top Badges Row */}
                  <div className="position-absolute top-0 start-0 end-0 m-3 d-flex align-items-center justify-content-between">
                    <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 rounded-pill shadow">
                      {pkg.badge}
                    </span>
                    <span className="badge bg-black bg-opacity-80 text-warning border border-warning border-opacity-40 font-monospace small px-2.5 py-1.5 rounded-pill shadow-sm">
                      <MapPin size={12} className="me-1" /> {pkg.gate}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="position-absolute bottom-0 start-0 m-3">
                    <span className="badge bg-black bg-opacity-85 text-warning border border-warning border-opacity-40 px-3 py-1.5 rounded-pill small">
                      <Clock size={13} className="me-1" /> {pkg.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4 p-md-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-warning small font-monospace fw-bold">
                      {pkg.nameHi}
                    </span>
                    <small className="text-secondary opacity-75">
                      Reporting: {pkg.reportingTime}
                    </small>
                  </div>

                  <h3
                    className={`text-white fw-bold mb-2 ${styles.playfairFont}`}
                  >
                    {pkg.name}
                  </h3>

                  <p
                    className="text-secondary small mb-3 flex-grow-1"
                    style={{ fontSize: "0.88rem", lineHeight: 1.6 }}
                  >
                    {pkg.description}
                  </p>

                  {/* Key Inclusions Container */}
                  <div className="p-3.5 bg-black bg-opacity-80 rounded-3 border border-secondary border-opacity-25 mb-4">
                    <small className="text-warning font-monospace fw-bold d-block mb-2.5" style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                      PASS PRIVILEGES &amp; INCLUSIONS:
                    </small>
                    <div className="row g-2">
                      {pkg.inclusions.map((inc, i) => (
                        <div key={i} className="col-12 col-sm-6">
                          <div className="d-flex align-items-center gap-2 text-light small" style={{ fontSize: "0.8rem" }}>
                            <CheckCircle
                              size={15}
                              className="text-warning flex-shrink-0"
                            />
                            <span>{inc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Price & Action Strip */}
                  <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between mt-auto">
                    <div>
                      <small
                        className="text-secondary d-block font-monospace"
                        style={{ fontSize: "0.72rem" }}
                      >
                        {pkg.id === "royal-nri-protocol" ? "FAMILY PASS (UP TO 4 DEVOTEES)" : "PASS RATE / DEVOTEE"}
                      </small>
                      <span className="h3 fw-bold text-warning mb-0">
                        ₹{pkg.price}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenBookingModal(pkg)}
                      className={`btn ${styles.goldBtn} rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2 shadow-lg`}
                    >
                      <Crown size={17} /> Book VIP Pass
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Temple Rules & Protocol Banner */}
        <div className="p-4 p-md-5 rounded-4 bg-dark border border-warning border-opacity-30 shadow-2xl mb-5">
          <div className="row g-4 align-items-center">
            <div className="col-md-8">
              <h3
                className={`text-warning fw-bold mb-2 d-flex align-items-center gap-2 ${styles.playfairFont}`}
              >
                <ShieldCheck size={24} /> Temple Protocol & Guidelines for VIP
                Visitors
              </h3>
              <p className="text-light small mb-3 leading-relaxed">
                Devotees carrying VIP Darshan passes must report at{" "}
                <strong>Sheeta Dwar (Gate No. 4)</strong> or{" "}
                <strong>Avantika VIP Gate (Gate No. 1)</strong> with their
                printed or mobile QR code pass along with a valid original
                Government ID (Aadhaar, Passport, or Voter ID).
              </p>
              <div className="d-flex flex-wrap gap-3 text-secondary small">
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle size={14} className="text-warning" /> Traditional
                  Attire Mandatory
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle size={14} className="text-warning" /> Mobile
                  Phones Prohibited in Sanctum
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle size={14} className="text-warning" /> Verified QR
                  Entry Code
                </span>
              </div>
            </div>
            <div className="col-md-4 text-center text-md-end">
              <button
                onClick={() => handleOpenBookingModal(VIP_PACKAGES[0])}
                className={`btn ${styles.goldBtn} rounded-pill px-4 py-2.5 fw-bold shadow-lg`}
              >
                Book Sheeta Gate Pass <ArrowRight size={16} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- VIP BOOKING MODAL --- */}
      <AnimatePresence>
        {selectedPkg && (
          <div
            className="modal show d-block p-2 p-md-3"
            style={{ backgroundColor: "rgba(0,0,0,0.88)", zIndex: 1070 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                className="modal-content bg-black text-white border border-warning border-opacity-40 rounded-4 overflow-hidden shadow-2xl"
              >
                {/* Modal Header */}
                <div className="modal-header border-bottom border-warning border-opacity-20 px-4 py-3 bg-dark">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-circle bg-warning text-dark">
                      <Crown size={20} />
                    </div>
                    <div>
                      <h5
                        className={`modal-title text-warning fw-bold mb-0 ${styles.playfairFont}`}
                      >
                        Book VIP Pass: {selectedPkg.name}
                      </h5>
                      <small className="text-secondary">
                        {selectedPkg.gate}
                      </small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedPkg(null)}
                  />
                </div>

                {/* Modal Body Form */}
                <div
                  className="modal-body p-4"
                  style={{ maxHeight: "78vh", overflowY: "auto" }}
                >
                  <form onSubmit={handleProceedToPayment}>
                    {/* Pass Summary Banner */}
                    <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-25 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <span className="badge bg-warning text-dark font-monospace fw-bold mb-1">
                          {selectedPkg.badge}
                        </span>
                        <h6 className="text-white fw-bold mb-0">
                          {selectedPkg.name}
                        </h6>
                        <small className="text-secondary">
                          {selectedPkg.nameHi}
                        </small>
                      </div>
                      <div className="text-end">
                        <small className="text-secondary d-block">
                          Pass Rate
                        </small>
                        <span className="fs-4 text-warning fw-bold">
                          ₹{selectedPkg.price}
                        </span>
                        <small className="text-secondary d-block">
                          / devotee
                        </small>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      {/* Booking Date */}
                      <div className="col-md-6">
                        <label className="form-label text-warning font-monospace small fw-bold">
                          <Calendar size={14} className="me-1" /> SELECT DARSHAN
                          DATE *
                        </label>
                        <input
                          type="date"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          min={new Date().toISOString().split("T")[0]}
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          required
                        />
                      </div>

                      {/* Time Slot */}
                      <div className="col-md-6">
                        <label className="form-label text-warning font-monospace small fw-bold">
                          <Clock size={14} className="me-1" /> SELECT TIME SLOT
                          *
                        </label>
                        <select
                          className="form-select bg-dark text-white border-secondary border-opacity-50"
                          value={selectedSlot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                        >
                          {TIME_SLOTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Devotee Count */}
                      <div className="col-md-6">
                        <label className="form-label text-warning font-monospace small fw-bold">
                          <User size={14} className="me-1" /> NUMBER OF DEVOTEES
                          *
                        </label>
                        <select
                          className="form-select bg-dark text-white border-secondary border-opacity-50"
                          value={devoteeCount}
                          disabled={selectedPkg.id === "royal-nri-protocol"}
                          onChange={(e) =>
                            setDevoteeCount(parseInt(e.target.value, 10))
                          }
                        >
                          <option value="1">1 Devotee</option>
                          <option value="2">2 Devotees</option>
                          <option value="3">3 Devotees</option>
                          <option value="4">4 Devotees (Max)</option>
                        </select>
                        {selectedPkg.id === "royal-nri-protocol" && (
                          <small className="text-warning d-block mt-1">
                            Includes 4 Family Members in flat ₹2100 pass.
                          </small>
                        )}
                      </div>

                      {/* Aadhaar / ID Card */}
                      <div className="col-md-6">
                        <label className="form-label text-warning font-monospace small fw-bold">
                          <ShieldCheck size={14} className="me-1" /> AADHAAR /
                          GOVT ID NUMBER *
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="e.g. 4832 9102 4491"
                          value={idCardNumber}
                          onChange={(e) => setIdCardNumber(e.target.value)}
                          required
                        />
                      </div>

                      {/* Primary Devotee Name */}
                      <div className="col-md-6">
                        <label className="form-label text-warning font-monospace small fw-bold">
                          PRIMARY DEVOTEE NAME *
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="e.g. Vikramaditya Sharma"
                          value={primaryName}
                          onChange={(e) => setPrimaryName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <label className="form-label text-warning font-monospace small fw-bold">
                          EMAIL ADDRESS FOR QR PASS *
                        </label>
                        <input
                          type="email"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="devotee@example.com"
                          value={primaryEmail}
                          onChange={(e) => setPrimaryEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Total Amount & Payment Breakdown */}
                    <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-30 mb-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-secondary font-monospace d-block">
                            TOTAL PAYABLE AMOUNT
                          </small>
                          <span className="text-white small">
                            ₹{selectedPkg.price} ×{" "}
                            {selectedPkg.id === "royal-nri-protocol"
                              ? "1 Family Pass"
                              : `${devoteeCount} devotee(s)`}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="h3 fw-bold text-warning mb-0">
                            ₹
                            {selectedPkg.price *
                              (selectedPkg.id === "royal-nri-protocol"
                                ? 1
                                : devoteeCount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPkg(null)}
                        className="btn btn-outline-secondary rounded-pill px-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`btn ${styles.goldBtn} rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow`}
                      >
                        <Lock size={16} /> Pay &amp; Generate VIP Ticket
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MOCK RAZORPAY PAYMENT MODAL INTEGRATION --- */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={
          selectedPkg
            ? selectedPkg.price *
              (selectedPkg.id === "royal-nri-protocol" ? 1 : devoteeCount)
            : 0
        }
        itemTitle={
          selectedPkg ? `VIP Darshan: ${selectedPkg.name}` : "VIP Darshan Pass"
        }
        devoteeInfo={{ name: primaryName, email: primaryEmail }}
        onSuccess={handlePaymentSuccess}
      />

      {/* --- SUCCESS TICKET ISSUED MODAL --- */}
      <AnimatePresence>
        {issuedTicket && (
          <div
            className="modal show d-block p-2 p-md-3"
            style={{ backgroundColor: "rgba(0,0,0,0.88)", zIndex: 1085 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="modal-content bg-black text-white border border-warning border-opacity-50 rounded-4 p-4 shadow-2xl text-center"
              >
                <div className="mb-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-inline-flex align-items-center justify-content-center p-3 shadow-lg mb-2"
                    style={{ width: 64, height: 64 }}
                  >
                    <CheckCircle size={36} />
                  </div>
                  <h3
                    className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                  >
                    VIP Darshan Pass Issued Successfully!
                  </h3>
                  <p className="text-secondary small">
                    Your official priority pass has been confirmed and saved to
                    your pilgrim profile.
                  </p>
                </div>

                {/* Pass Ticket Design Card */}
                <div className="p-4 rounded-4 bg-dark border border-warning border-opacity-30 text-start shadow-inner mb-4 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-success font-monospace fw-bold px-3 py-1.5 rounded-pill">
                      ✓ CONFIRMED VIP PASS
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Crown size={22} className="text-warning" />
                    <h5
                      className={`text-warning fw-bold mb-0 ${styles.playfairFont}`}
                    >
                      Shri Mahakaleshwar VIP Protocol Pass
                    </h5>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <small className="text-secondary font-monospace d-block">
                        PASS TICKET REF
                      </small>
                      <span className="text-warning fw-bold font-monospace fs-5">
                        {issuedTicket.ticketId}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-secondary font-monospace d-block">
                        PASS CATEGORY
                      </small>
                      <span className="text-white fw-bold">
                        {issuedTicket.pkgName}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-secondary font-monospace d-block">
                        DARSHAN DATE &amp; TIME
                      </small>
                      <span className="text-white fw-semibold">
                        {issuedTicket.date} · {issuedTicket.timeSlot}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-secondary font-monospace d-block">
                        ENTRY GATE
                      </small>
                      <span className="text-warning fw-bold">
                        {issuedTicket.gate}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-secondary font-monospace d-block">
                        PRIMARY DEVOTEE
                      </small>
                      <span className="text-white">
                        {issuedTicket.primaryName} ({issuedTicket.devoteeCount}{" "}
                        Devotee(s))
                      </span>
                    </div>
                    <div className="col-md-6">
                      <small className="text-secondary font-monospace d-block">
                        RAZORPAY PAYMENT ID
                      </small>
                      <span className="text-success font-monospace small">
                        {issuedTicket.paymentId}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Placeholder */}
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-30 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${issuedTicket.ticketId}`}
                        alt="VIP Pass QR"
                        className="rounded border p-1 bg-white"
                        style={{ width: 70, height: 70 }}
                      />
                      <div>
                        <small className="text-warning fw-bold d-block">
                          SCAN FOR FAST-TRACK ENTRY
                        </small>
                        <small className="text-secondary">
                          Present QR code at Gate security verification
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <small className="text-secondary d-block">
                        AMOUNT PAID
                      </small>
                      <span className="h4 text-warning fw-bold mb-0">
                        ₹{issuedTicket.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <a
                    href="/profile"
                    className={`btn ${styles.goldBtn} rounded-pill px-4 fw-bold text-decoration-none`}
                  >
                    View in My Profile
                  </a>
                  <button
                    onClick={() => {
                      setIssuedTicket(null);
                      setSelectedPkg(null);
                    }}
                    className="btn btn-outline-secondary rounded-pill px-4"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
