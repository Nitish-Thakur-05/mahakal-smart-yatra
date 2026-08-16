import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  User,
  Ticket,
  Calendar,
  MapPin,
  CheckCircle,
  Lock,
  ShieldCheck,
  ArrowRight,
  Building,
  BedDouble,
  IndianRupee,
  XCircle,
  RefreshCw,
  Clock,
  Hash,
  Edit3,
  Phone,
  Star,
  Settings,
  Users,
  Crown,
  QrCode,
  Printer,
  Search,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "../styles/custom.module.css";

const AMENITY_OPTIONS = [
  "Free Wi-Fi",
  "AC Room",
  "Hot Water",
  "Temple View",
  "Pure Veg Meals",
  "Attached Bathroom",
  "TV",
  "Parking",
  "Room Service",
  "Geyser",
  "Locker",
  "24/7 Security",
  "Elevator",
  "Travel Desk",
  "Doctor on Call",
];

function EditHotelProfileModal({ user, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    hotelName: user?.hotelName || "",
    name: user?.name || "",
    contactPhone: user?.contactPhone || "",
    hotelAddress: user?.hotelAddress || "",
    hotelDescription: user?.hotelDescription || "",
    checkInTime: user?.checkInTime || "12:00 PM",
    checkOutTime: user?.checkOutTime || "11:00 AM",
    hotelImage:
      user?.hotelImage ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    amenities: user?.amenities?.length
      ? user.amenities
      : ["Free Wi-Fi", "Pure Veg Meals", "Temple View", "AC Room", "Hot Water"],
  });

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-white border border-warning border-opacity-30 rounded-4 shadow-2xl overflow-hidden">
          <div className="modal-header border-bottom border-warning border-opacity-20 px-4 py-3 bg-black">
            <h5
              className={`modal-title text-warning fw-bold d-flex align-items-center gap-2 ${styles.playfairFont}`}
            >
              <Edit3 size={20} /> Edit Hotel Profile &amp; Property Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div
            className="modal-body p-4"
            style={{ maxHeight: "75vh", overflowY: "auto" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave(form);
              }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    HOTEL NAME *
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.hotelName}
                    placeholder="e.g. Hotel Mahakal Sanctuary"
                    onChange={(e) =>
                      setForm({ ...form, hotelName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    OWNER / MANAGER NAME *
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.name}
                    placeholder="e.g. Vikram Sharma"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    CONTACT PHONE *
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.contactPhone}
                    placeholder="e.g. +91 98765 43210"
                    onChange={(e) =>
                      setForm({ ...form, contactPhone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    HOTEL BANNER IMAGE URL
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.hotelImage}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) =>
                      setForm({ ...form, hotelImage: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    FULL ADDRESS / LOCATION
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.hotelAddress}
                    placeholder="e.g. Near Mahakal Temple Gate No. 4, Bada Ganesh Marg, Ujjain"
                    onChange={(e) =>
                      setForm({ ...form, hotelAddress: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    CHECK-IN TIME
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.checkInTime}
                    placeholder="e.g. 12:00 PM"
                    onChange={(e) =>
                      setForm({ ...form, checkInTime: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    CHECK-OUT TIME
                  </label>
                  <input
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    value={form.checkOutTime}
                    placeholder="e.g. 11:00 AM"
                    onChange={(e) =>
                      setForm({ ...form, checkOutTime: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small font-monospace fw-bold">
                    HOTEL DESCRIPTION & OVERVIEW
                  </label>
                  <textarea
                    className="form-control bg-black text-white border-secondary border-opacity-50"
                    rows={3}
                    value={form.hotelDescription}
                    placeholder="Describe your property, proximity to Mahakal temple, pure veg dining options, pilgrim services..."
                    onChange={(e) =>
                      setForm({ ...form, hotelDescription: e.target.value })
                    }
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small font-monospace fw-bold d-block mb-2">
                    HOTEL AMENITIES & FACILITIES
                  </label>
                  <div className="d-flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={`btn btn-sm rounded-pill px-3 py-1.5 ${form.amenities?.includes(a) ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-secondary"}`}
                        style={{ fontSize: "0.8rem" }}
                      >
                        {form.amenities?.includes(a) ? "✓ " : "+ "}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`btn ${styles.goldBtn} rounded-pill px-4 fw-bold`}
                >
                  {saving ? "Saving Changes..." : "Save Hotel Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserProfile({ user, onOpenAuth, onUpdateUser }) {
  // Admin has ONLY the Admin Panel (/admin) and does not have a user profile page
  if (user && (user.role === "official" || user.role === "admin")) {
    return <Navigate to="/admin" replace />;
  }

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [vipTickets, setVipTickets] = useState([]);
  const [entryPasses, setEntryPasses] = useState([]);
  const [selectedPassModal, setSelectedPassModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const endpoint =
        user?.role === "hotel"
          ? "/api/rooms/partner-bookings"
          : "/api/rooms/my-bookings";
      const res = await axios.get(endpoint);
      setBookings(res.data || []);
    } catch (err) {
      // Silently fail if no bookings or not authenticated
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchEntryPasses = async () => {
    if (!user) return;
    try {
      const res = await axios.get("/api/passes/my-passes");
      setEntryPasses(res.data.passes || []);
    } catch (err) {
      // Silently fail
    }
  };

  const loadVipTickets = () => {
    if (!user) return;
    const userStorageKey = `mahakal_vip_tickets_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(userStorageKey) || "[]");
    setVipTickets(saved);
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      loadVipTickets();
      fetchEntryPasses();
    }

    const handleTicketBooked = () => loadVipTickets();
    window.addEventListener("vip-ticket-booked", handleTicketBooked);
    return () =>
      window.removeEventListener("vip-ticket-booked", handleTicketBooked);
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    setCancellingId(bookingId);
    try {
      await axios.patch(`/api/rooms/cancel-booking/${bookingId}`);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleSaveHotelProfile = async (form) => {
    if (!form.hotelName || !form.name) {
      toast.error("Hotel Name and Owner Name are required.");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await axios.put("/api/auth/profile", form);
      toast.success("Hotel profile updated successfully!");
      if (onUpdateUser) onUpdateUser(res.data.user);
      setShowEditProfileModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update hotel profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div
        className="bg-black min-vh-100 text-white d-flex align-items-center justify-content-center"
        style={{ paddingTop: "110px" }}
      >
        <div className="container py-4 text-center max-w-600 mx-auto">
          <div className="p-5 bg-dark rounded-4 border border-warning border-opacity-30 shadow-2xl">
            <div
              className="rounded-circle bg-warning text-dark mx-auto p-3 d-flex align-items-center justify-content-center mb-3"
              style={{ width: 72, height: 72 }}
            >
              <Lock size={36} />
            </div>
            <h3 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>
              Authentication Required
            </h3>
            <p className="text-secondary small mb-4">
              Please sign in to access your pilgrim profile, Aarti passes, and
              hotel stay reservations.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-warning rounded-pill px-4 py-2 font-semibold"
                onClick={() => onOpenAuth && onOpenAuth("login")}
              >
                Sign In
              </button>
              <button
                className={styles.goldBtn}
                style={{ padding: "8px 24px", fontSize: "0.9rem" }}
                onClick={() => onOpenAuth && onOpenAuth("signup")}
              >
                Register Account <ArrowRight size={16} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div
      className="min-vh-100 bg-black text-white pb-5"
      style={{ paddingTop: "110px" }}
    >
      <div className="container py-4">
        <div className="p-4 p-md-5 rounded-4 mb-5 border border-warning border-opacity-30 shadow-2xl user-profile-header-card">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-4">
              {/* Avatar */}
              <div
                className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold shadow-lg"
                style={{
                  width: 84,
                  height: 84,
                  fontSize: "2rem",
                  flexShrink: 0,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h2
                    className={`text-white fw-bold mb-0 ${styles.playfairFont}`}
                  >
                    {user.role === "hotel"
                      ? user.hotelName || user.name
                      : user.name}
                  </h2>
                  <span
                    className={`badge ${user.role === "hotel" ? "bg-warning text-dark" : "bg-dark border border-warning border-opacity-40 text-warning"} px-3 py-1 rounded-pill small fw-semibold`}
                  >
                    {user.role === "hotel"
                      ? "🏨 Hotel Partner"
                      : user.role === "official"
                        ? "🛡️ Temple Official"
                        : "🙏 Pilgrim Devotee"}
                  </span>
                </div>
                <p className="text-secondary small mb-2">
                  {user.email} · {user.contactPhone || "No Phone Registered"}
                </p>
                <div className="d-flex align-items-center gap-1.5 text-success small">
                  <ShieldCheck size={14} />{" "}
                  <span>Verified Mahakal Portal Account</span>
                </div>
              </div>
            </div>

            {/* Action Buttons for Hotel Partner */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              {user.role === "hotel" && (
                <>
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className={`btn ${styles.goldBtn} btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5 fw-bold shadow`}
                  >
                    <Edit3 size={14} /> Edit Hotel Details
                  </button>
                  <a
                    href="/hotel-dashboard"
                    className="btn btn-outline-warning btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5 fw-bold"
                  >
                    <Building size={14} /> Go to Hotel Dashboard
                  </a>
                </>
              )}
              <button
                onClick={fetchBookings}
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5"
              >
                <RefreshCw
                  size={14}
                  className={loadingBookings ? "spin" : ""}
                />{" "}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* HOTEL PARTNER PROPERTY DETAILS CARD */}
        {user.role === "hotel" && (
          <div className="bg-dark rounded-4 border border-warning border-opacity-30 overflow-hidden shadow-2xl mb-5">
            <div className="position-relative" style={{ height: 220 }}>
              <img
                src={
                  user.hotelImage ||
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"
                }
                alt={user.hotelName || user.name}
                className="w-100 h-100 object-fit-cover"
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,13,13,0.95) 100%)",
                }}
              />
              <div className="position-absolute bottom-0 start-0 m-4 d-flex flex-wrap align-items-end justify-content-between w-100 pe-5">
                <div>
                  <span className="badge bg-warning text-dark fw-semibold px-3 py-1 rounded-pill small mb-2 d-inline-block">
                    Hotel Property Profile
                  </span>
                  <h3
                    className={`fw-bold mb-1 ${styles.playfairFont} hotel-overlay-title`}
                    style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}
                  >
                    {user.hotelName || `${user.name}'s Hotel`}
                  </h3>
                  <div className="d-flex align-items-center gap-2 text-warning small">
                    <MapPin size={14} />
                    <span>
                      {user.hotelAddress ||
                        "Near Mahakal Temple, Ujjain, Madhya Pradesh"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditProfileModal(true)}
                  className={`btn ${styles.goldBtn} fw-bold rounded-pill px-4 py-2 mt-3 mt-md-0 d-flex align-items-center gap-2 shadow`}
                >
                  <Edit3 size={16} /> Edit Hotel Details
                </button>
              </div>
            </div>

            <div className="p-4 p-md-5">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
                    <span className="text-warning fw-semibold small d-block mb-2">
                      Owner / Manager
                    </span>
                    <div className="d-flex align-items-center gap-2 text-white fw-bold mb-1">
                      <Users size={16} className="text-warning" />
                      <span>{user.name}</span>
                    </div>
                    <span className="text-secondary small d-block">
                      {user.email}
                    </span>
                    <span className="text-secondary small d-block mt-1">
                      📞 {user.contactPhone || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
                    <span className="text-warning fw-semibold small d-block mb-2">
                      Check-in / Check-out
                    </span>
                    <div className="d-flex align-items-center gap-2 small mb-1">
                      <Clock size={16} className="text-warning flex-shrink-0" />
                      <span className="text-body">
                        <strong className="fw-bold me-1 text-body">
                          Check-in:
                        </strong>
                        <span className="fw-semibold text-body">
                          {user.checkInTime || "12:00 PM"}
                        </span>
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 small">
                      <Clock size={16} className="text-warning flex-shrink-0" />
                      <span className="text-body">
                        <strong className="fw-bold me-1 text-body">
                          Check-out:
                        </strong>
                        <span className="fw-semibold text-body">
                          {user.checkOutTime || "11:00 AM"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
                    <span className="text-warning fw-semibold small d-block mb-2">
                      Partner Status
                    </span>
                    <div className="d-flex align-items-center gap-2 text-success fw-bold mb-1">
                      <ShieldCheck size={16} />
                      <span>Verified Partner</span>
                    </div>
                    <small className="text-secondary">
                      Approved for Pilgrim Lodging
                    </small>
                  </div>
                </div>

                {/* Description */}
                <div className="col-12">
                  <div className="p-4 bg-black rounded-3 border border-secondary border-opacity-25">
                    <h6 className="text-warning fw-semibold small mb-2">
                      Hotel Overview & Description
                    </h6>
                    <p className="text-light mb-0 leading-relaxed">
                      {user.hotelDescription ||
                        'No overview provided yet. Click "Edit Hotel Details" to add a property description.'}
                    </p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="col-12">
                  <div className="p-4 bg-black rounded-3 border border-secondary border-opacity-25">
                    <h6 className="text-warning fw-semibold small mb-3">
                      Amenities & Facilities
                    </h6>
                    {user.amenities && user.amenities.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {user.amenities.map((a) => (
                          <span
                            key={a}
                            className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 py-1.5 small"
                          >
                            ✓ {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-secondary small mb-0">
                        No amenities listed yet. Click "Edit Hotel Details" to
                        add facilities.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row & Bookings Section for Devotee Users */}
        {user.role !== "hotel" && (
          <>
            {/* Stats Row */}
            <div className="row g-3 mb-5">
              <div className="col-6 col-md-3">
                <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-25 shadow text-center">
                  <h3 className="text-warning fw-bold mb-1">
                    {entryPasses.length}
                  </h3>
                  <small className="text-secondary small">
                    Mahakal E-Passes
                  </small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-25 shadow text-center">
                  <h3 className="text-warning fw-bold mb-1">
                    {vipTickets.length}
                  </h3>
                  <small className="text-secondary small">VIP Passes</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-4 bg-dark rounded-4 border border-success border-opacity-25 shadow text-center">
                  <h3 className="text-success fw-bold mb-1">
                    {bookings.length}
                  </h3>
                  <small className="text-secondary small">Active Stays</small>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-4 bg-dark rounded-4 border border-info border-opacity-25 shadow text-center">
                  <h3 className="text-info fw-bold mb-1">Free</h3>
                  <small className="text-secondary small">Entry Pass Fee</small>
                </div>
              </div>
            </div>

            {/* SEARCH & FILTER CONTROLS FOR ALL BOOKINGS */}
            <div className="mb-5">
              {/* BORDERLESS ULTRA-MINIMAL SEARCH & FILTER CONTROLS BAR */}
              <div className="p-3 mb-4">
                <div className="row g-3 align-items-center">
                  {/* Search Input Box */}
                  <div className="col-lg-5">
                    <div className="position-relative">
                      <Search
                        size={16}
                        className="position-absolute text-warning opacity-75"
                        style={{ top: "11px", left: "14px" }}
                      />
                      <input
                        type="text"
                        className="form-control text-white border-0 rounded-3 py-2 ps-5"
                        placeholder="Search by Pass ID, Gate, Hotel or Name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          backgroundColor: "#18181c",
                          color: "#ffffff",
                          fontSize: "0.85rem",
                        }}
                      />
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="col-lg-5 col-md-8">
                    <div className="d-flex flex-wrap gap-1.5">
                      {[
                        {
                          id: "all",
                          label: `All (${entryPasses.length + vipTickets.length + bookings.length})`,
                        },
                        {
                          id: "passes",
                          label: `E-Passes (${entryPasses.length})`,
                        },
                        { id: "vip", label: `VIP (${vipTickets.length})` },
                        { id: "hotels", label: `Hotels (${bookings.length})` },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold border-0 ${
                            categoryFilter === cat.id
                              ? "btn-warning text-dark font-bold shadow-sm"
                              : "btn-dark text-gray-300"
                          }`}
                          onClick={() => setCategoryFilter(cat.id)}
                          style={{ fontSize: "0.78rem" }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter Dropdown */}
                  <div className="col-lg-2 col-md-4">
                    <select
                      className="form-select form-select-sm text-white border-0 rounded-3 py-2"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{
                        backgroundColor: "#18181c",
                        color: "#ffffff",
                        fontSize: "0.82rem",
                      }}
                    >
                      <option
                        value="all"
                        style={{ backgroundColor: "#18181c", color: "#ffffff" }}
                      >
                        All Statuses
                      </option>
                      <option
                        value="active"
                        style={{ backgroundColor: "#18181c", color: "#ffffff" }}
                      >
                        Active / Confirmed
                      </option>
                      <option
                        value="expired"
                        style={{ backgroundColor: "#18181c", color: "#ffffff" }}
                      >
                        Expired
                      </option>
                      <option
                        value="cancelled"
                        style={{ backgroundColor: "#18181c", color: "#ffffff" }}
                      >
                        Cancelled
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FILTERED RESULTS GRID */}
              {(() => {
                const allItems = [
                  ...entryPasses.map((p) => ({
                    id: p._id || p.passId,
                    code: p.passId,
                    type: "epass",
                    category: "passes",
                    title: p.gateName,
                    subtitle: `Gate #${p.gateNumber} · Primary: ${p.primaryDevoteeName}`,
                    primaryName: p.primaryDevoteeName,
                    date: p.entryTime,
                    expiry: p.expiryTime,
                    count: p.numberOfPersons,
                    status:
                      p.status === "expired" ||
                      new Date() > new Date(p.expiryTime)
                        ? "expired"
                        : p.status || "active",
                    original: p,
                  })),
                  ...vipTickets.map((v) => ({
                    id: v.ticketId || v._id,
                    code: v.ticketId,
                    type: "vip",
                    category: "vip",
                    title: v.pkgName || "VIP Protocol Darshan Pass",
                    subtitle: `Slot: ${v.timeSlot} · ${v.devoteeName || v.primaryName}`,
                    primaryName: v.devoteeName || v.primaryName,
                    date: v.date || v.bookingDate,
                    count: v.devoteeCount || v.numberOfPersons || 1,
                    price: v.totalAmount,
                    status: v.status || "active",
                    original: v,
                  })),
                  ...bookings.map((b) => ({
                    id: b._id,
                    code: b._id.substring(b._id.length - 8).toUpperCase(),
                    type: "hotel",
                    category: "hotels",
                    title:
                      b.hotelId?.name ||
                      b.hotelName ||
                      "Hotel Stay Reservation",
                    subtitle: `Room: ${b.roomType} · Check-in: ${new Date(b.checkInDate).toLocaleDateString()}`,
                    primaryName: b.userName || user?.name,
                    date: b.checkInDate,
                    price: b.totalPrice,
                    status: b.status || "confirmed",
                    original: b,
                  })),
                ];

                const filtered = allItems.filter((item) => {
                  if (
                    categoryFilter !== "all" &&
                    item.category !== categoryFilter
                  )
                    return false;
                  if (statusFilter !== "all") {
                    if (
                      statusFilter === "active" &&
                      item.status !== "active" &&
                      item.status !== "confirmed"
                    )
                      return false;
                    if (statusFilter === "expired" && item.status !== "expired")
                      return false;
                    if (
                      statusFilter === "cancelled" &&
                      item.status !== "cancelled"
                    )
                      return false;
                  }
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const mCode = item.code?.toLowerCase().includes(q);
                    const mTitle = item.title?.toLowerCase().includes(q);
                    const mSub = item.subtitle?.toLowerCase().includes(q);
                    const mName = item.primaryName?.toLowerCase().includes(q);
                    if (!mCode && !mTitle && !mSub && !mName) return false;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-5 bg-dark rounded-4 border border-secondary border-opacity-25 text-center my-3">
                      <Ticket
                        size={42}
                        className="text-warning opacity-40 mb-2"
                      />
                      <h6 className="text-warning fw-bold mb-1">
                        No Reservations Found
                      </h6>
                      <p className="text-secondary small mb-3">
                        {searchQuery ||
                        categoryFilter !== "all" ||
                        statusFilter !== "all"
                          ? "No passes or bookings match your search query or filter selection."
                          : "You have not booked any Mahakal E-Passes, VIP tickets, or Hotel stays yet."}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("all");
                          setStatusFilter("all");
                          if (onOpenPassPortal) onOpenPassPortal();
                        }}
                        className="btn btn-outline-warning btn-sm rounded-pill px-4"
                      >
                        Book Free E-Pass Now
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="row g-4">
                    {filtered.map((item) => {
                      const isExpired = item.status === "expired";
                      const isCancelled = item.status === "cancelled";

                      return (
                        <div key={item.id} className="col-md-6">
                          <div
                            className={`p-4 bg-dark rounded-4 border ${isExpired ? "border-danger border-opacity-40" : isCancelled ? "border-secondary" : "border-warning border-opacity-40"} shadow-xl position-relative overflow-hidden h-100 d-flex flex-column justify-content-between`}
                          >
                            <div>
                              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary border-opacity-20 pb-2">
                                <div className="d-flex align-items-center gap-2">
                                  {item.type === "epass" && (
                                    <QrCode
                                      size={18}
                                      className="text-warning"
                                    />
                                  )}
                                  {item.type === "vip" && (
                                    <Crown size={18} className="text-warning" />
                                  )}
                                  {item.type === "hotel" && (
                                    <Building
                                      size={18}
                                      className="text-warning"
                                    />
                                  )}
                                  <span className="text-warning fw-bold font-monospace">
                                    {item.code}
                                  </span>
                                </div>
                                <span
                                  className={`badge ${isExpired ? "bg-danger" : isCancelled ? "bg-secondary" : "bg-success"} text-white px-2.5 py-1 rounded-pill small`}
                                >
                                  {item.type === "epass"
                                    ? isExpired
                                      ? "EXPIRED"
                                      : "ACTIVE E-PASS"
                                    : item.type === "vip"
                                      ? "VIP CONFIRMED"
                                      : item.status.toUpperCase()}
                                </span>
                              </div>

                              <h5
                                className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                              >
                                {item.title}
                              </h5>
                              <small className="text-gray-300 d-block mb-3">
                                {item.subtitle}
                              </small>

                              <div className="row g-2 small mb-3 bg-black p-3 rounded-3 border border-secondary border-opacity-30">
                                <div className="col-6">
                                  <span
                                    className="text-secondary d-block font-monospace"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    DATE / TIME
                                  </span>
                                  <span className="text-white fw-semibold">
                                    {item.date
                                      ? new Date(item.date).toLocaleTimeString(
                                          [],
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          },
                                        )
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="col-6">
                                  <span
                                    className="text-secondary d-block font-monospace"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    DEVOTEES / PAX
                                  </span>
                                  <span className="text-warning fw-bold">
                                    {item.count || 1} Person(s)
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* CARD ACTION BUTTON - REDIRECTS TO /entry-pass ROUTE */}
                            {item.type === "epass" && (
                              <Link
                                to="/entry-pass"
                                className="btn btn-outline-warning btn-sm rounded-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2 text-decoration-none"
                              >
                                <QrCode size={16} /> View E-Pass Details &amp;
                                QR Code
                              </Link>
                            )}

                            {item.type === "vip" && (
                              <div className="p-2.5 bg-black rounded-3 border border-secondary border-opacity-30 d-flex align-items-center gap-3">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${item.code}`}
                                  alt="VIP QR"
                                  className="rounded border p-1 bg-white"
                                  style={{ width: 44, height: 44 }}
                                />
                                <div className="flex-grow-1">
                                  <small className="text-success font-monospace fw-bold d-block">
                                    SCAN AT SHEETA DWAR
                                  </small>
                                  <small
                                    className="text-secondary"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    Official VIP Protocol Ticket
                                  </small>
                                </div>
                              </div>
                            )}

                            {item.type === "hotel" && (
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-warning fw-bold">
                                  ₹{item.price || 0}
                                </span>
                                {item.status === "confirmed" && (
                                  <button
                                    onClick={() => handleCancelBooking(item.id)}
                                    disabled={cancellingId === item.id}
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1"
                                  >
                                    {cancellingId === item.id
                                      ? "Cancelling..."
                                      : "Cancel Booking"}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* EDIT HOTEL PROFILE MODAL */}
        {showEditProfileModal && (
          <EditHotelProfileModal
            user={user}
            saving={savingProfile}
            onSave={handleSaveHotelProfile}
            onClose={() => setShowEditProfileModal(false)}
          />
        )}
      </div>
    </div>
  );
}
