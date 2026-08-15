import React, { useState, useEffect } from "react";
import {
  Building,
  Plus,
  Trash2,
  Edit3,
  BedDouble,
  Users,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Package,
  Wifi,
  Star,
  Phone,
  ChevronDown,
  ChevronUp,
  Eye,
  MapPin,
  Clock,
  ShieldCheck,
  Settings,
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

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Super Deluxe",
  "Suite",
  "Family Room",
  "Dormitory",
];

function RoomForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(
    initial || {
      roomNumber: "",
      roomType: "Deluxe",
      description: "",
      pricePerNight: "",
      maxGuests: 2,
      amenities: [],
      isAvailable: true,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      ],
    },
  );

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  return (
    <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-30 mb-4 shadow-lg">
      <h6 className={`text-warning fw-bold mb-3 ${styles.playfairFont}`}>
        {initial?._id ? "Edit Room Listing" : "Add New Room Listing"}
      </h6>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label text-secondary small">
            Room Number / Name *
          </label>
          <input
            className="form-control bg-black text-white border-secondary border-opacity-50"
            placeholder="e.g. 101 / Ground Floor Suite"
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label text-secondary small">Room Type *</label>
          <select
            className="form-select bg-black text-white border-secondary border-opacity-50"
            value={form.roomType}
            onChange={(e) => setForm({ ...form, roomType: e.target.value })}
          >
            {ROOM_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label text-secondary small">
            Price / Night (₹) *
          </label>
          <input
            type="number"
            className="form-control bg-black text-white border-secondary border-opacity-50"
            placeholder="1499"
            value={form.pricePerNight}
            onChange={(e) =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
            required
          />
        </div>
        <div className="col-md-2">
          <label className="form-label text-secondary small">Max Guests</label>
          <input
            type="number"
            className="form-control bg-black text-white border-secondary border-opacity-50"
            value={form.maxGuests}
            min={1}
            max={10}
            onChange={(e) =>
              setForm({ ...form, maxGuests: parseInt(e.target.value) })
            }
          />
        </div>
        <div className="col-12">
          <label className="form-label text-secondary small">
            Room Description
          </label>
          <textarea
            className="form-control bg-black text-white border-secondary border-opacity-50"
            rows={2}
            placeholder="Describe the room, view, and special features..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="col-12">
          <label className="form-label text-secondary small d-block mb-2">
            Room Amenities
          </label>
          <div className="d-flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`btn btn-sm rounded-pill px-3 py-1 ${form.amenities.includes(a) ? "btn-warning text-dark fw-bold" : "btn-outline-secondary text-secondary"}`}
                style={{ fontSize: "0.78rem" }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="col-12">
          <label className="form-label text-secondary small">
            Room Image URL
          </label>
          <input
            className="form-control bg-black text-white border-secondary border-opacity-50"
            placeholder="https://..."
            value={form.images?.[0] || ""}
            onChange={(e) => setForm({ ...form, images: [e.target.value] })}
          />
        </div>
        <div className="col-12 d-flex align-items-center gap-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="availSwitch"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
            />
            <label
              className="form-check-label text-secondary small"
              htmlFor="availSwitch"
            >
              {form.isAvailable ? "Available for Booking" : "Not Available"}
            </label>
          </div>
        </div>
        <div className="col-12 d-flex gap-2 justify-content-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline-secondary rounded-pill px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(form)}
            className={`btn ${styles.goldBtn} rounded-pill px-4 fw-bold`}
          >
            {saving ? "Saving..." : initial?._id ? "Save Changes" : "List Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

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

function HotelProfileView({ user, onEdit }) {
  return (
    <div className="bg-dark rounded-4 border border-warning border-opacity-30 overflow-hidden shadow-2xl mb-5">
      {/* Banner */}
      <div className="position-relative" style={{ height: 260 }}>
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
            <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 rounded-pill small mb-2 d-inline-block">
              MAHAKAL VERIFIED HOTEL PARTNER
            </span>
            <h2 className={`text-white fw-bold mb-1 ${styles.playfairFont}`}>
              {user.hotelName || `${user.name}'s Hotel`}
            </h2>
            <div className="d-flex align-items-center gap-2 text-warning small font-monospace">
              <MapPin size={15} />
              <span>
                {user.hotelAddress ||
                  "Near Mahakal Temple, Ujjain, Madhya Pradesh"}
              </span>
            </div>
          </div>
          <button
            onClick={onEdit}
            className={`btn ${styles.goldBtn} fw-bold rounded-pill px-4 py-2.5 mt-3 mt-md-0 d-flex align-items-center gap-2 shadow-lg`}
          >
            <Edit3 size={16} /> Edit Hotel Details
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-4 p-md-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="p-3.5 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
              <span className="text-warning font-monospace small fw-bold d-block mb-2">
                OWNER / MANAGER
              </span>
              <div className="d-flex align-items-center gap-2 text-white fw-bold mb-1">
                <Users size={16} className="text-warning" />
                <span>{user.name}</span>
              </div>
              <span className="text-secondary small font-monospace d-block">
                {user.email}
              </span>
              <span className="text-secondary small font-monospace d-block mt-1">
                📞 {user.contactPhone || "Not provided"}
              </span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3.5 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
              <span className="text-warning font-monospace small fw-bold d-block mb-2 font-monospace">
                CHECK-IN / CHECK-OUT
              </span>
              <div className="d-flex align-items-center gap-2 text-light small mb-1">
                <Clock size={16} className="text-warning" />
                <span>
                  <strong className="text-white">Check-in:</strong>{" "}
                  {user.checkInTime || "12:00 PM"}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 text-light small">
                <Clock size={16} className="text-warning" />
                <span>
                  <strong className="text-white">Check-out:</strong>{" "}
                  {user.checkOutTime || "11:00 AM"}
                </span>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3.5 bg-black rounded-3 border border-secondary border-opacity-25 h-100">
              <span className="text-warning font-monospace small fw-bold d-block mb-2 font-monospace">
                VERIFICATION STATUS
              </span>
              <div className="d-flex align-items-center gap-2 text-success fw-bold mb-1">
                <ShieldCheck size={18} />
                <span>Verified Temple Partner</span>
              </div>
              <small className="text-secondary font-monospace">
                Approved for Temple Pilgrim Stays
              </small>
            </div>
          </div>

          {/* Description */}
          <div className="col-12">
            <div className="p-4 bg-black rounded-3 border border-secondary border-opacity-25">
              <h6 className="text-warning font-monospace small fw-bold mb-2">
                HOTEL OVERVIEW &amp; DESCRIPTION
              </h6>
              <p className="text-light mb-0 leading-relaxed">
                {user.hotelDescription ||
                  'No overview provided yet. Click "Edit Hotel Details" to add a description for pilgrims visiting your hotel property.'}
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div className="col-12">
            <div className="p-4 bg-black rounded-3 border border-secondary border-opacity-25">
              <h6 className="text-warning font-monospace small fw-bold mb-3">
                HOTEL AMENITIES &amp; FACILITIES
              </h6>
              {user.amenities && user.amenities.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {user.amenities.map((a) => (
                    <span
                      key={a}
                      className="badge bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30 rounded-pill px-3 py-2 font-monospace"
                    >
                      ✓ {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-secondary small mb-0">
                  No amenities listed yet. Click "Edit Hotel Details" to specify
                  hotel facilities.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HotelPartnerDashboard({ user, onOpenAuth, onUpdateUser }) {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("rooms");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        axios.get("/api/rooms/my-rooms"),
        axios.get("/api/rooms/partner-bookings"),
      ]);
      setRooms(roomsRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "hotel") fetchData();
  }, [user]);

  const handleSaveRoom = async (form) => {
    if (!form.roomNumber || !form.pricePerNight) {
      toast.error("Room Number and Price are required.");
      return;
    }
    setSaving(true);
    try {
      if (editingRoom) {
        await axios.put(`/api/rooms/update-room/${editingRoom._id}`, form);
        toast.success("Room updated successfully!");
        setEditingRoom(null);
      } else {
        await axios.post("/api/rooms/add-room", form);
        toast.success("Room listed successfully!");
        setShowAddForm(false);
      }
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save room.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Remove this room listing?")) return;
    try {
      await axios.delete(`/api/rooms/delete-room/${roomId}`);
      toast.success("Room removed.");
      fetchData();
    } catch {
      toast.error("Failed to remove room.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axios.patch(`/api/rooms/cancel-booking/${bookingId}`);
      toast.success("Booking cancelled.");
      fetchData();
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleSaveProfile = async (form) => {
    if (!form.hotelName || !form.name) {
      toast.error("Hotel Name and Owner Name are required.");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await axios.put("/api/auth/profile", form);
      toast.success("Hotel profile updated successfully!");
      if (onUpdateUser) onUpdateUser(res.data.user);
      setShowEditProfile(false);
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
      <div className="min-vh-100 bg-black d-flex align-items-center justify-content-center">
        <div className="text-center p-5 bg-dark rounded-4 border border-warning border-opacity-30">
          <Building size={52} className="text-warning mb-3" />
          <h4 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>
            Hotel Partner Portal
          </h4>
          <p className="text-secondary small mb-4">
            Sign in with your Hotel Partner account to manage rooms and view
            bookings.
          </p>
          <button
            onClick={() => onOpenAuth?.("login")}
            className={`btn ${styles.goldBtn} fw-bold rounded-pill px-4`}
          >
            Sign In as Hotel Partner
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "hotel") {
    return (
      <div className="min-vh-100 bg-black d-flex align-items-center justify-content-center pt-5">
        <div className="text-center p-5">
          <h4 className="text-secondary">
            This portal is for Hotel Partners only.
          </h4>
        </div>
      </div>
    );
  }

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce(
    (s, b) => s + (b.totalPrice || 0),
    0,
  );

  return (
    <div
      className="min-vh-100 bg-black text-white pb-5"
      style={{ paddingTop: "110px" }}
    >
      <div className="container py-4">
        {/* Header */}
        <div
          className="p-4 p-md-5 rounded-4 border border-warning border-opacity-30 mb-5 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #0d0d0d 0%, #1a1200 100%)",
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 rounded-pill small mb-2 d-inline-block">
                HOTEL PARTNER DASHBOARD
              </span>
              <h1
                className={`display-6 fw-bold text-white mb-1 ${styles.playfairFont}`}
              >
                {user.hotelName || user.name}
              </h1>
              <p className="text-secondary small mb-0">
                {user.email} ·{" "}
                {user.hotelAddress || "Near Mahakal Temple, Ujjain"}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setShowEditProfile(true)}
                className={`btn ${styles.goldBtn} btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5 fw-bold shadow`}
              >
                <Edit3 size={14} /> Edit Hotel Details
              </button>
              <button
                onClick={fetchData}
                className="btn btn-outline-warning btn-sm rounded-pill px-3 py-2 d-flex align-items-center gap-1.5"
              >
                <RefreshCw size={14} className={loading ? "spin" : ""} />{" "}
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-5">
          {[
            {
              label: "TOTAL ROOMS",
              value: rooms.length,
              sub: "Listed",
              icon: <BedDouble size={20} />,
            },
            {
              label: "AVAILABLE",
              value: rooms.filter((r) => r.isAvailable).length,
              sub: "Open for Booking",
              icon: <CheckCircle2 size={20} />,
            },
            {
              label: "BOOKINGS",
              value: confirmedBookings.length,
              sub: "Active Reservations",
              icon: <Calendar size={20} />,
            },
            {
              label: "REVENUE",
              value: `₹${totalRevenue.toLocaleString()}`,
              sub: "Total Earned",
              icon: <IndianRupee size={20} />,
            },
          ].map((s) => (
            <div key={s.label} className="col-6 col-lg-3">
              <div className="p-4 bg-dark rounded-4 border border-warning border-opacity-25 shadow h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span
                    className="text-warning font-monospace fw-bold"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {s.label}
                  </span>
                  <div className="text-warning opacity-75">{s.icon}</div>
                </div>
                <h3 className="text-white fw-bold mb-1">{s.value}</h3>
                <small className="text-secondary">{s.sub}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Controls */}
        <div className="d-flex flex-wrap gap-2 mb-4 border-bottom border-warning border-opacity-25 pb-2">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`btn border-0 py-2.5 px-4 rounded-top fw-bold ${activeTab === "rooms" ? "bg-warning text-dark shadow" : "text-secondary"}`}
          >
            <BedDouble size={16} className="me-2 d-inline" /> My Rooms (
            {rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`btn border-0 py-2.5 px-4 rounded-top fw-bold ${activeTab === "bookings" ? "bg-warning text-dark shadow" : "text-secondary"}`}
          >
            <Calendar size={16} className="me-2 d-inline" /> Guest Bookings (
            {bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`btn border-0 py-2.5 px-4 rounded-top fw-bold ${activeTab === "profile" ? "bg-warning text-dark shadow" : "text-secondary"}`}
          >
            <Building size={16} className="me-2 d-inline" /> Hotel Profile
            Details
          </button>
        </div>

        {/* HOTEL PROFILE TAB */}
        {activeTab === "profile" && (
          <HotelProfileView
            user={user}
            onEdit={() => setShowEditProfile(true)}
          />
        )}

        {/* ROOMS TAB */}
        {activeTab === "rooms" && (
          <div>
            {/* Add Room Button */}
            {!showAddForm && !editingRoom && (
              <button
                onClick={() => setShowAddForm(true)}
                className={`btn ${styles.goldBtn} fw-bold rounded-pill px-4 py-2.5 d-flex align-items-center gap-2 mb-4 shadow`}
              >
                <Plus size={18} /> Add New Room
              </button>
            )}

            {showAddForm && (
              <RoomForm
                saving={saving}
                onSave={handleSaveRoom}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {editingRoom && (
              <RoomForm
                initial={editingRoom}
                saving={saving}
                onSave={handleSaveRoom}
                onCancel={() => setEditingRoom(null)}
              />
            )}

            {rooms.length === 0 && !showAddForm ? (
              <div className="text-center py-5 text-secondary">
                <BedDouble size={48} className="opacity-25 mb-3" />
                <p>
                  No rooms listed yet. Add your first room to start receiving
                  bookings!
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {rooms.map((room) => (
                  <div key={room._id} className="col-md-6 col-lg-4">
                    <div
                      className={`card bg-dark text-white border border-secondary border-opacity-25 rounded-4 overflow-hidden h-100 shadow ${styles.glassCard}`}
                    >
                      <div
                        style={{ height: 160 }}
                        className="position-relative"
                      >
                        <img
                          src={
                            room.images?.[0] ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                          }
                          alt={room.roomType}
                          className="w-100 h-100 object-fit-cover"
                        />
                        <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
                          <button
                            onClick={() => {
                              setEditingRoom(room);
                              setShowAddForm(false);
                            }}
                            className="btn btn-sm btn-dark rounded-circle p-1.5 shadow border border-warning border-opacity-40"
                            title="Edit Room"
                          >
                            <Edit3 size={13} className="text-warning" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="btn btn-sm btn-danger rounded-circle p-1.5 shadow"
                            title="Remove Listing"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="position-absolute bottom-0 start-0 m-2">
                          <span
                            className={`badge ${room.isAvailable ? "bg-success" : "bg-danger"} rounded-pill px-2.5 py-1 small`}
                          >
                            {room.isAvailable ? "● Available" : "● Unavailable"}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h6
                            className={`text-warning fw-bold mb-0 ${styles.playfairFont}`}
                          >
                            {room.roomType}
                          </h6>
                          <span className="text-white fw-bold small">
                            ₹{Number(room.pricePerNight).toLocaleString()}/night
                          </span>
                        </div>
                        <small className="text-secondary d-block mb-2 font-monospace">
                          Room {room.roomNumber} · Max {room.maxGuests} Guests
                        </small>
                        {room.description && (
                          <p className="text-light small mb-2 text-truncate">
                            {room.description}
                          </p>
                        )}
                        {room.amenities?.length > 0 && (
                          <div className="d-flex flex-wrap gap-1">
                            {room.amenities.slice(0, 3).map((a) => (
                              <span
                                key={a}
                                className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 rounded-pill px-2 py-1"
                                style={{ fontSize: "0.68rem" }}
                              >
                                {a}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span
                                className="badge bg-secondary bg-opacity-20 text-secondary rounded-pill px-2 py-1"
                                style={{ fontSize: "0.68rem" }}
                              >
                                +{room.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <Calendar size={48} className="opacity-25 mb-3" />
                <p>No bookings received yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className={`p-4 bg-dark rounded-4 border ${b.status === "confirmed" ? "border-success border-opacity-40" : b.status === "cancelled" ? "border-danger border-opacity-30" : "border-secondary border-opacity-25"} shadow`}
                  >
                    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="text-warning fw-bold font-monospace small">
                            {b.bookingRef}
                          </span>
                          <span
                            className={`badge ${b.status === "confirmed" ? "bg-success" : b.status === "cancelled" ? "bg-danger" : "bg-secondary"} rounded-pill px-2.5 py-1 small`}
                          >
                            {b.status.charAt(0).toUpperCase() +
                              b.status.slice(1)}
                          </span>
                        </div>
                        <h6 className="text-white fw-bold mb-0">
                          {b.guestName}
                        </h6>
                        <small className="text-secondary font-monospace">
                          {b.guestEmail}
                        </small>
                      </div>
                      <div className="text-end">
                        <div className="text-warning fw-bold">
                          ₹{Number(b.totalPrice).toLocaleString()}
                        </div>
                        <small className="text-secondary">
                          {b.nights} night{b.nights > 1 ? "s" : ""}
                        </small>
                      </div>
                    </div>

                    <div className="row g-2 mt-3 text-secondary small font-monospace">
                      <div className="col-auto">
                        Room:{" "}
                        <span className="text-white">
                          {b.roomNumber} · {b.roomType}
                        </span>
                      </div>
                      <div className="col-auto">
                        Check-in:{" "}
                        <span className="text-white">{b.checkInDate}</span>
                      </div>
                      <div className="col-auto">
                        Check-out:{" "}
                        <span className="text-white">{b.checkOutDate}</span>
                      </div>
                    </div>

                    {b.status === "confirmed" && (
                      <div className="mt-3">
                        <button
                          onClick={() => handleCancelBooking(b._id)}
                          className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 small"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EDIT HOTEL PROFILE MODAL */}
        {showEditProfile && (
          <EditHotelProfileModal
            user={user}
            saving={savingProfile}
            onSave={handleSaveProfile}
            onClose={() => setShowEditProfile(false)}
          />
        )}
      </div>
    </div>
  );
}
