import React, { useState } from "react";
import axios from "axios";
import {
  Hotel,
  MapPin,
  Star,
  Check,
  CheckCircle2,
  Home,
  Sparkles,
  ShieldCheck,
  Phone,
  Info,
  User,
  Calendar,
  CreditCard,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RazorpayModal } from "../components/RazorpayModal";
import { toast } from "react-hot-toast";
import { recordRoomBooking } from "../utils/bookingStats";
import styles from "../styles/custom.module.css";
import { useEffect } from "react";

// --- DATA EXACTLY MATCHING USER'S ATITHI NIWAS IMAGES ---
const OFFICIAL_ATITHI_NIWAS_DATA = [
  {
    id: "pt-surya-narayan-vyas",
    name: "Pandit Surya Narayan Vyas Atithi Niwas",
    hindiTitle: "पद्मभूषण पं. सूर्यनारायण व्यास अतिथि निवास",
    address:
      "Near Harsiddhi Temple, Harsiddhi Square, Ujjain - 456006, Madhya Pradesh, India",
    phone: "0734-2585873",
    image: "/mahakalTemple.jpeg",
    extraBedNote: "Extra bed available on request.",
    facilities: [
      { name: "AC Rooms", icon: "🏠" },
      { name: "24/7 Water", icon: "💧" },
      { name: "Parking", icon: "🅿️" },
      { name: "Security", icon: "🛡️" },
      { name: "Cleanliness", icon: "✨" },
      { name: "Maintenance", icon: "🛠️" },
    ],
    floors: [
      {
        floorName: "First Floor",
        rooms: [
          { roomNo: "101", rent: 3200, type: "AC Room", beds: 7 },
          { roomNo: "102", rent: 1500, type: "AC Room", beds: 2 },
          { roomNo: "103", rent: 2700, type: "AC Room", beds: 5 },
          { roomNo: "104", rent: 2700, type: "AC Room", beds: 5 },
          { roomNo: "105", rent: 2300, type: "AC Room", beds: 4 },
        ],
      },
      {
        floorName: "Second Floor",
        rooms: [
          { roomNo: "201", rent: 2300, type: "AC Room", beds: 4 },
          { roomNo: "202", rent: 1500, type: "AC Room", beds: 2 },
          { roomNo: "203", rent: 1500, type: "AC Room", beds: 2 },
          { roomNo: "204", rent: 3500, type: "AC Room", beds: 8 },
          { roomNo: "205", rent: 4200, type: "AC Room", beds: 10 },
          { roomNo: "206", rent: 2000, type: "AC Room", beds: 3 },
          { roomNo: "207", rent: 3200, type: "AC Room", beds: 7 },
        ],
      },
      {
        floorName: "Third Floor",
        rooms: [
          { roomNo: "301", rent: 1500, type: "AC Room", beds: 2 },
          { roomNo: "302", rent: 2000, type: "AC Room", beds: 3 },
          { roomNo: "303", rent: 2300, type: "AC Room", beds: 4 },
          { roomNo: "304", rent: 2000, type: "AC Room", beds: 3 },
          { roomNo: "305", rent: 2300, type: "AC Room", beds: 4 },
          { roomNo: "306", rent: 2300, type: "AC Room", beds: 4 },
          { roomNo: "307", rent: 2300, type: "AC Room", beds: 4 },
          { roomNo: "308", rent: 1500, type: "AC Room", beds: 2 },
        ],
      },
      {
        floorName: "Fourth Floor",
        rooms: [
          { roomNo: "401", rent: 1000, type: "AC Room", beds: 2 },
          { roomNo: "402", rent: 1000, type: "AC Room", beds: 2 },
          { roomNo: "403", rent: 1000, type: "AC Room", beds: 2 },
          { roomNo: "404", rent: 1000, type: "AC Room", beds: 2 },
        ],
      },
    ],
  },
  {
    id: "shri-mahakaleshwar-atithi-niwas",
    name: "Shri Mahakaleshwar Atithi Niwas",
    hindiTitle: "श्री महाकालेश्वर मंदिर प्रबंध समिति अतिथि निवास",
    address:
      "Within Shri Mahakaleshwar Temple Annakshetra Complex, Shaktipath, Ujjain - 456006, Madhya Pradesh, India",
    phone: "0734-2990773",
    image: "/ganeshTemple.jpeg",
    extraBedNote: "Note: Extra bed charges: ₹250 per additional bed.",
    facilities: [
      { name: "AC Rooms", icon: "🏠" },
      { name: "24/7 Water", icon: "💧" },
      { name: "Parking", icon: "🅿️" },
      { name: "Security", icon: "🛡️" },
      { name: "Cleanliness", icon: "✨" },
      { name: "Maintenance", icon: "🛠️" },
    ],
    floors: [
      {
        floorName: "Ground & First Floor",
        rooms: [
          { roomNo: "101", rent: 2500, type: "AC Hall", beds: 6 },
          { roomNo: "102", rent: 2500, type: "AC Hall", beds: 6 },
          { roomNo: "103", rent: 2500, type: "AC Hall", beds: 6 },
          { roomNo: "104", rent: 1250, type: "AC Room", beds: 2 },
          { roomNo: "105", rent: 1250, type: "AC Room", beds: 2 },
          { roomNo: "106", rent: 1250, type: "AC Room", beds: 2 },
          { roomNo: "107", rent: 1250, type: "AC Room", beds: 2 },
          { roomNo: "108", rent: 2000, type: "AC Room", beds: 3 },
          { roomNo: "109", rent: 2000, type: "AC Room", beds: 3 },
        ],
      },
    ],
  },
];

const NEARBY_HOTELS = [
  {
    id: "hotel-mahakal-palace",
    name: "Hotel Mahakal Palace",
    subtitle: "Deluxe Heritage Hotel",
    location: "Near Mahakal Temple Gate 1, Mahakal Marg, Ujjain",
    distance: "0.2 km from Temple",
    rating: 4.8,
    pricePerNight: 2499,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    badge: "4-Star Deluxe",
    amenities: [
      "Free High-Speed Wi-Fi",
      "Pure Veg Multi-Cuisine Dining",
      "Elevator & 24/7 Room Service",
      "Taxi Desk",
    ],
  },
  {
    id: "shipra-residency",
    name: "Shipra Residency (MP Tourism)",
    subtitle: "Official State Tourism Resort",
    location: "University Road, Near Shipra River, Ujjain",
    distance: "1.2 km from Temple",
    rating: 4.6,
    pricePerNight: 3200,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    badge: "MP Tourism Govt Resort",
    amenities: [
      "Garden Lawns",
      "Swimming Pool & Restaurant",
      "Car Parking",
      "24/7 Security",
    ],
  },
];

export function Hotels({ user, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState("atithi_niwas"); // 'atithi_niwas' or 'hotels'
  const [bookingRoom, setBookingRoom] = useState(null); // Selected room for booking
  const [stayDetails, setStayDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState("2026-08-15");
  const [nights, setNights] = useState(1);
  const [devoteeName, setDevoteeName] = useState(user?.name || "");
  const [devoteePhone, setDevoteePhone] = useState("");
  const [devoteeEmail, setDevoteeEmail] = useState(user?.email || "");
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Partner Rooms state
  const [partnerRooms, setPartnerRooms] = useState([]);
  const [bookingPartnerRoom, setBookingPartnerRoom] = useState(null);
  const [partnerCheckIn, setPartnerCheckIn] = useState("");
  const [partnerCheckOut, setPartnerCheckOut] = useState("");
  const [partnerNights, setPartnerNights] = useState(1);
  const [partnerBookingSuccess, setPartnerBookingSuccess] = useState(null);
  const [partnerBookingLoading, setPartnerBookingLoading] = useState(false);
  const [isPartnerRazorpayOpen, setIsPartnerRazorpayOpen] = useState(false);
  const [partnerGuestPhone, setPartnerGuestPhone] = useState("");

  useEffect(() => {
    if (user) {
      setDevoteeName(user.name || "");
      setDevoteeEmail(user.email || "");
    } else {
      setDevoteeName("");
      setDevoteeEmail("");
      setDevoteePhone("");
    }
  }, [user, bookingRoom]);

  // Fetch partner rooms
  useEffect(() => {
    axios.get('/api/rooms/available').then(res => setPartnerRooms(res.data || [])).catch(() => {});
  }, []);

  // Step 1: Validate guest details form → open Razorpay modal
  const handlePartnerRoomBook = (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to book a room.'); onOpenAuth?.('login'); return; }
    if (!partnerCheckIn || !partnerCheckOut || !partnerNights) {
      toast.error('Please fill in check-in and check-out dates.');
      return;
    }
    if (!partnerGuestPhone) {
      toast.error('Please enter your phone number.');
      return;
    }
    setIsPartnerRazorpayOpen(true);
  };

  // Step 2: On Razorpay payment success → save booking to DB
  const handlePartnerPaymentSuccess = async (paymentDetails) => {
    setIsPartnerRazorpayOpen(false);
    setPartnerBookingLoading(true);
    try {
      const res = await axios.post(`/api/rooms/book/${bookingPartnerRoom._id}`, {
        checkInDate: partnerCheckIn,
        checkOutDate: partnerCheckOut,
        nights: partnerNights,
        guestPhone: partnerGuestPhone,
        paymentId: paymentDetails.paymentId
      });
      setPartnerBookingSuccess(res.data.booking);
      setBookingPartnerRoom(null);
      toast.success(res.data.message || 'Room booked successfully!');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Booking failed. Please try again.';
      console.error('Booking error:', err.response?.data || err.message);
      toast.error(msg);
    } finally {
      setPartnerBookingLoading(false);
    }
  };

  const openBookingModal = (stay, room) => {
    if (!user) {
      toast.error(
        "Authentication Required: Please sign in or register to book stay rooms.",
      );
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    setStayDetails(stay);
    setBookingRoom(room);
  };

  const handleProceedToRazorpay = (e) => {
    e.preventDefault();
    if (!devoteeName || !devoteePhone) return;
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = (paymentDetails) => {
    setIsRazorpayOpen(false);
    toast.success(
      `Room ${bookingRoom.roomNo} successfully reserved at ${stayDetails.name}!`,
    );
    if (stayDetails) {
      recordRoomBooking(stayDetails.name);
    }
    setConfirmedBooking({
      bookingRef: `ATITHI-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentId: paymentDetails.paymentId,
      stayName: stayDetails.name,
      roomNo: bookingRoom.roomNo,
      amount: bookingRoom.rent * nights,
      checkInDate,
      nights,
    });
    setBookingRoom(null);
  };

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: '110px' }}>
      <div className="container py-4">
        {/* Page Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}
          >
            Shri Mahakal Atithi Niwas & Pilgrim Stays
          </h1>
          <p className="text-secondary max-w-750 mx-auto">
            Book seats and AC rooms directly inside{" "}
            <strong>Pt. Surya Narayan Vyas Atithi Niwas</strong> &{" "}
            <strong>Shri Mahakaleshwar Atithi Niwas</strong> with official
            temple trust tariffs and instant Razorpay payment.
          </p>

          {/* Trust Guarantees */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mt-4">
            <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-dark border border-warning border-opacity-25 text-warning small">
              <ShieldCheck size={16} />{" "}
              <span>Official Temple Trust Tariff</span>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-dark border border-warning border-opacity-25 text-warning small">
              <MapPin size={16} /> <span>0.0 km Sanctum Access</span>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-dark border border-warning border-opacity-25 text-warning small">
              <CreditCard size={16} /> <span>Razorpay Instant Payment</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Selector */}
        <div className="d-flex justify-content-center mb-5">
          <div className="p-1.5 bg-dark rounded-pill border border-warning border-opacity-30 d-inline-flex gap-2">
            <button
              onClick={() => setActiveTab("atithi_niwas")}
              className={`btn rounded-pill px-4 py-2.5 font-semibold transition-all d-flex align-items-center gap-2 ${
                activeTab === "atithi_niwas"
                  ? "btn-warning text-dark shadow-lg fw-bold"
                  : "btn-dark text-secondary hover-text-white"
              }`}
            >
              <Home size={18} />
              <span>Shri Mahakal Atithi Niwas</span>
            </button>

            <button
              onClick={() => setActiveTab("hotels")}
              className={`btn rounded-pill px-4 py-2.5 font-semibold transition-all d-flex align-items-center gap-2 ${
                activeTab === "hotels"
                  ? "btn-warning text-dark shadow-lg fw-bold"
                  : "btn-dark text-secondary hover-text-white"
              }`}
            >
              <Hotel size={18} />
              <span>Hotels Nearby</span>
            </button>
          </div>
        </div>

        {/* --- ATITHI NIWAS SECTION (WITH EXACT USER DATA & ROOM BOOKING) --- */}
        {activeTab === "atithi_niwas" && (
          <div className="d-flex flex-column gap-5">
            {OFFICIAL_ATITHI_NIWAS_DATA.map((niwas) => (
              <motion.div
                key={niwas.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                className="bg-dark text-white rounded-4 overflow-hidden border border-warning border-opacity-30 p-0 shadow-2xl"
              >
                {/* Header Title Banner */}
                <div className="bg-warning text-dark p-3.5 px-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                  <div>
                    <h3 className={`fw-bold mb-0 ${styles.playfairFont}`}>
                      {niwas.name}
                    </h3>
                    <small className="fw-semibold opacity-90">
                      {niwas.hindiTitle}
                    </small>
                  </div>
                  <span className="badge bg-dark text-warning border border-dark px-3 py-2 rounded-pill font-monospace small">
                    Contact: {niwas.phone}
                  </span>
                </div>

                {/* Building Cover & Address & Facilities */}
                <div className="p-4 border-bottom border-secondary border-opacity-25">
                  <div className="row g-4 align-items-center">
                    <div className="col-md-5">
                      <div
                        className="rounded-3 overflow-hidden border border-secondary border-opacity-30 position-relative"
                        style={{ height: 220 }}
                      >
                        <img
                          src={niwas.image}
                          alt={niwas.name}
                          className="w-100 h-100 object-fit-cover"
                        />
                        <div className="position-absolute bottom-0 start-0 m-3">
                          <span className="badge bg-black bg-opacity-80 text-warning border border-warning border-opacity-40 font-monospace small">
                            <MapPin size={12} className="me-1" /> Ujjain -
                            456006
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <h5 className="text-warning fw-bold mb-2">
                        Address & Contact Information
                      </h5>
                      <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-25 mb-3">
                        <p className="text-light small mb-1">
                          <strong>Address:</strong> {niwas.address}
                        </p>
                        <p className="text-warning small mb-0">
                          <strong>Phone:</strong> {niwas.phone}
                        </p>
                        {niwas.extraBedNote && (
                          <p className="text-secondary small mb-0 mt-1 fst-italic">
                            {niwas.extraBedNote}
                          </p>
                        )}
                      </div>

                      <h6 className="text-warning fw-bold mb-2">
                        Facilities & Amenities
                      </h6>
                      <div className="d-flex flex-wrap gap-2">
                        {niwas.facilities.map((fac, idx) => (
                          <span
                            key={idx}
                            className="badge bg-black text-light border border-secondary border-opacity-30 px-3 py-2 rounded-pill small"
                          >
                            {fac.icon} {fac.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floor-wise Room Tables & Direct Seat/Room Booking */}
                <div className="p-4">
                  <h4
                    className={`text-warning fw-bold mb-3 ${styles.playfairFont}`}
                  >
                    Room Details, Tariff & Instant Seat Booking
                  </h4>

                  {niwas.floors.map((floor, fIdx) => (
                    <div key={fIdx} className="mb-4">
                      <h6 className="text-warning fw-bold mb-2 border-bottom border-warning border-opacity-30 pb-1">
                        {floor.floorName}
                      </h6>

                      <div className="table-responsive">
                        <table className="table table-dark table-hover table-striped align-middle border border-secondary border-opacity-25 rounded-3 overflow-hidden small">
                          <thead className="table-warning text-dark font-monospace fw-bold">
                            <tr>
                              <th>Room No.</th>
                              <th>Rent / Night</th>
                              <th>Type</th>
                              <th>Beds</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {floor.rooms.map((room, rIdx) => (
                              <tr key={rIdx}>
                                <td className="fw-bold text-warning font-monospace">
                                  Room {room.roomNo}
                                </td>
                                <td className="fw-bold text-white fs-6">
                                  ₹{room.rent}/-
                                </td>
                                <td>
                                  <span className="badge bg-black text-warning border border-warning border-opacity-25">
                                    {room.type}
                                  </span>
                                </td>
                                <td>{room.beds} Beds</td>
                                <td className="text-end">
                                  <button
                                    onClick={() =>
                                      openBookingModal(niwas, room)
                                    }
                                    className="btn btn-warning btn-sm rounded-pill font-semibold px-3 text-dark d-inline-flex align-items-center gap-1"
                                  >
                                    <span>Book Seat / Room</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- HOTELS NEARBY SECTION --- */}
        {activeTab === "hotels" && (
          <div className="row g-4">
            {/* Render Registered Partner Rooms First using Identical Card Layout */}
            {partnerRooms.map((room) => (
              <div key={room._id} className="col-lg-6">
                <div
                  className={`card bg-dark text-white ${styles.glassCard} overflow-hidden h-100 p-0 border border-warning border-opacity-25`}
                >
                  <div className="row g-0 h-100">
                    {/* Left Column Image */}
                    <div
                      className="col-md-5 position-relative"
                      style={{ minHeight: "240px" }}
                    >
                      <img
                        src={
                          room.images?.[0] ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={room.roomType}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-warning text-dark font-semibold px-2.5 py-1.5 rounded-pill small">
                          {room.badge || room.roomType || "Mahakal Verified"}
                        </span>
                      </div>
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-success rounded-pill px-2.5 py-1 small">
                          ● Available
                        </span>
                      </div>
                    </div>

                    {/* Right Column Details */}
                    <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex align-items-start justify-content-between mb-1">
                          <h4
                            className={`text-white fw-bold mb-0 ${styles.playfairFont}`}
                          >
                            {room.hotelName}
                          </h4>
                          <span className="badge bg-warning text-dark font-semibold">
                            ★ {room.rating || 4.8}
                          </span>
                        </div>
                        <p className="text-warning small mb-1 fw-semibold font-monospace">
                          {room.roomType} · Room {room.roomNumber} (Max {room.maxGuests} Guests)
                        </p>
                        <p className="text-secondary small mb-3">
                          <MapPin size={13} className="me-1 text-warning" />{" "}
                          {room.location || room.distance || "Near Mahakaleshwar Temple, Ujjain • 0.3 km"}
                        </p>

                        <div className="mb-3">
                          <div className="d-flex flex-wrap gap-1">
                            {(room.amenities && room.amenities.length > 0
                              ? room.amenities
                              : ["Free Wi-Fi", "AC Room", "Pure Veg Dining"]
                            ).slice(0, 4).map((a, i) => (
                              <span
                                key={i}
                                className="badge bg-black text-secondary border border-secondary border-opacity-25"
                                style={{ fontSize: "0.72rem" }}
                              >
                                ✓ {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Bar: Price + Gold Button */}
                      <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
                        <div>
                          <span className="text-secondary small">
                            Starting from
                          </span>
                          <h4 className="text-warning fw-bold mb-0">
                            ₹{Number(room.pricePerNight).toLocaleString()}{" "}
                            <small className="text-secondary fs-6">
                              / night
                            </small>
                          </h4>
                        </div>

                        <button
                          onClick={() => {
                            if (!user) {
                              toast.error("Please sign in to book a room.");
                              onOpenAuth?.("login");
                              return;
                            }
                            setBookingPartnerRoom(room);
                            const today = new Date().toISOString().split("T")[0];
                            const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
                            setPartnerCheckIn(today);
                            setPartnerCheckOut(tomorrow);
                            setPartnerNights(1);
                          }}
                          className={styles.goldBtn}
                          style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                        >
                          Reserve Room
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mock Nearby Hotels */}
            {NEARBY_HOTELS.map((hotel) => (
              <div key={hotel.id} className="col-lg-6">
                <div
                  className={`card bg-dark text-white ${styles.glassCard} overflow-hidden h-100 p-0 border border-warning border-opacity-25`}
                >
                  <div className="row g-0 h-100">
                    <div
                      className="col-md-5 position-relative"
                      style={{ minHeight: "240px" }}
                    >
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-warning text-dark font-semibold px-2.5 py-1.5 rounded-pill small">
                          {hotel.badge}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex align-items-start justify-content-between mb-1">
                          <h4
                            className={`text-white fw-bold mb-0 ${styles.playfairFont}`}
                          >
                            {hotel.name}
                          </h4>
                          <span className="badge bg-warning text-dark font-semibold">
                            ★ {hotel.rating}
                          </span>
                        </div>
                        <p className="text-secondary small mb-3">
                          <MapPin size={13} className="me-1 text-warning" />{" "}
                          {hotel.location}
                        </p>

                        <div className="mb-3">
                          <div className="d-flex flex-wrap gap-1">
                            {hotel.amenities.map((a, i) => (
                              <span
                                key={i}
                                className="badge bg-black text-secondary border border-secondary border-opacity-25"
                                style={{ fontSize: "0.72rem" }}
                              >
                                ✓ {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
                        <div>
                          <span className="text-secondary small">
                            Starting from
                          </span>
                          <h4 className="text-warning fw-bold mb-0">
                            ₹{hotel.pricePerNight}{" "}
                            <small className="text-secondary fs-6">
                              / night
                            </small>
                          </h4>
                        </div>

                        <button
                          onClick={() =>
                            openBookingModal(hotel, {
                              roomNo: "Deluxe",
                              rent: hotel.pricePerNight,
                              type: "AC Room",
                              beds: 2,
                            })
                          }
                          className={styles.goldBtn}
                          style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                        >
                          Reserve Hotel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ROOM / SEAT BOOKING MODAL --- */}
        {bookingRoom && stayDetails && (
          <div
            className="modal show d-block p-2 p-md-3"
            style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                className="modal-content bg-black border border-warning border-opacity-50 text-white rounded-4 p-3 shadow-2xl"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="modal-header border-bottom border-secondary border-opacity-25 pb-3">
                  <div>
                    <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill small mb-1">
                      Room {bookingRoom.roomNo} • {bookingRoom.type} (
                      {bookingRoom.beds} Beds)
                    </span>
                    <h5
                      className={`modal-title text-white fw-bold mb-0 ${styles.playfairFont}`}
                    >
                      Book Room: {stayDetails.name}
                    </h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setBookingRoom(null)}
                  ></button>
                </div>

                <form onSubmit={handleProceedToRazorpay}>
                  <div className="modal-body py-3">
                    <div className="mb-3">
                      <label className="form-label text-secondary small">
                        Devotee Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary border-opacity-50"
                        placeholder="e.g. Ramesh Sharma"
                        required
                        value={devoteeName}
                        onChange={(e) => setDevoteeName(e.target.value)}
                      />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label text-secondary small">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="+91 9876543210"
                          required
                          value={devoteePhone}
                          onChange={(e) => setDevoteePhone(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="devotee@example.com"
                          required
                          value={devoteeEmail}
                          onChange={(e) => setDevoteeEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <label className="form-label text-secondary small">
                          Check-in Date
                        </label>
                        <input
                          type="date"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          required
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">
                          Number of Nights
                        </label>
                        <select
                          className="form-select bg-dark text-white border-secondary border-opacity-50"
                          value={nights}
                          onChange={(e) =>
                            setNights(parseInt(e.target.value, 10))
                          }
                        >
                          <option value={1}>1 Night</option>
                          <option value={2}>2 Nights</option>
                          <option value={3}>3 Nights</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-25 mb-4">
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Room Rent ({nights} Night/s):</span>
                        <strong className="text-white">
                          ₹{bookingRoom.rent * nights}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Razorpay Gateway Tax:</span>
                        <strong className="text-success">
                          FREE (Temple Trust Waived)
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between font-monospace fw-bold fs-6 text-warning pt-2 border-top border-secondary border-opacity-25">
                        <span>Total Payable:</span>
                        <span>₹{bookingRoom.rent * nights}</span>
                      </div>
                    </div>

                    <button type="submit" className={`w-100 ${styles.goldBtn}`}>
                      <CreditCard size={18} className="me-2" /> Proceed to
                      Razorpay Payment (₹{bookingRoom.rent * nights})
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}

        {/* --- CONFIRMED BOOKING RECEIPT MODAL --- */}
        {confirmedBooking && (
          <div
            className="modal show d-block p-2 p-md-3"
            style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-black border border-warning border-opacity-50 text-white rounded-4 p-4 text-center shadow-2xl">
                <CheckCircle2 size={64} className="text-warning mb-3 mx-auto" />
                <h3 className="text-white fw-bold mb-2">
                  Room / Seat Reserved Successfully!
                </h3>
                <p className="text-secondary small mb-4">
                  Your official temple stay voucher has been issued.
                </p>

                <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-40 text-start small font-monospace mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Booking Ref:</span>
                    <span className="text-warning fw-bold">
                      {confirmedBooking.bookingRef}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Razorpay Payment ID:</span>
                    <span className="text-light">
                      {confirmedBooking.paymentId}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Stay:</span>
                    <span className="text-light">
                      {confirmedBooking.stayName}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-secondary">Room No:</span>
                    <span className="text-warning fw-bold">
                      {confirmedBooking.roomNo}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Amount Paid:</span>
                    <span className="text-success fw-bold">
                      ₹{confirmedBooking.amount}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-warning w-100 rounded-pill fw-bold text-dark py-2.5"
                  onClick={() => setConfirmedBooking(null)}
                >
                  Done & Download Stay Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- RAZORPAY DEMO CHECKOUT MODAL INTEGRATION --- */}
        <RazorpayModal
          isOpen={isRazorpayOpen}
          onClose={() => setIsRazorpayOpen(false)}
          amount={bookingRoom ? bookingRoom.rent * nights : 0}
          itemTitle={
            stayDetails
              ? `${stayDetails.name} - Room ${bookingRoom?.roomNo}`
              : "Temple Stay"
          }
          devoteeInfo={{
            name: devoteeName,
            phone: devoteePhone,
            email: devoteeEmail,
          }}
          onSuccess={handlePaymentSuccess}
        />



        {/* PARTNER ROOM BOOKING MODAL — Full guest details form identical to Atithi Niwas */}
        {bookingPartnerRoom && (
          <div className="modal show d-block p-2 p-md-3" style={{ backgroundColor: 'rgba(0,0,0,0.88)', zIndex: 1070 }}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div
                className="modal-content bg-black border border-warning border-opacity-50 text-white rounded-4 overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="modal-header border-bottom border-secondary border-opacity-25 pb-3 px-4 pt-4">
                  <div>
                    <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill small mb-1">
                      {bookingPartnerRoom.roomType} · Room {bookingPartnerRoom.roomNumber}
                    </span>
                    <h5 className={`modal-title text-white fw-bold mb-0 ${styles.playfairFont}`}>
                      Book Stay: {bookingPartnerRoom.hotelName}
                    </h5>
                  </div>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setBookingPartnerRoom(null)} />
                </div>

                <form onSubmit={handlePartnerRoomBook}>
                  <div className="modal-body p-4">
                    {/* Guest Name */}
                    <div className="mb-3">
                      <label className="form-label text-secondary small">Guest Full Name</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary border-opacity-50"
                        placeholder="e.g. Ramesh Sharma"
                        required
                        value={devoteeName}
                        onChange={e => setDevoteeName(e.target.value)}
                      />
                    </div>

                    {/* Phone + Email */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label text-secondary small">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="+91 9876543210"
                          required
                          value={partnerGuestPhone}
                          onChange={e => setPartnerGuestPhone(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">Email Address</label>
                        <input
                          type="email"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="guest@email.com"
                          required
                          value={devoteeEmail}
                          onChange={e => setDevoteeEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <label className="form-label text-secondary small">Check-in Date</label>
                        <input
                          type="date"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          required
                          value={partnerCheckIn}
                          onChange={e => setPartnerCheckIn(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-secondary small">Check-out Date</label>
                        <input
                          type="date"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          required
                          value={partnerCheckOut}
                          onChange={e => {
                            setPartnerCheckOut(e.target.value);
                            if (partnerCheckIn && e.target.value) {
                              const diff = Math.ceil((new Date(e.target.value) - new Date(partnerCheckIn)) / (1000 * 60 * 60 * 24));
                              setPartnerNights(diff > 0 ? diff : 1);
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-25 mb-4">
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Room Rent ({partnerNights} Night{partnerNights > 1 ? 's' : ''}):</span>
                        <strong className="text-white">₹{(Number(bookingPartnerRoom.pricePerNight) * partnerNights).toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between small text-secondary mb-1">
                        <span>Razorpay Gateway Tax:</span>
                        <strong className="text-success">FREE (Partner Offer)</strong>
                      </div>
                      <div className="d-flex justify-content-between font-monospace fw-bold fs-6 text-warning pt-2 border-top border-secondary border-opacity-25">
                        <span>Total Payable:</span>
                        <span>₹{(Number(bookingPartnerRoom.pricePerNight) * partnerNights).toLocaleString()}</span>
                      </div>
                    </div>

                    <button type="submit" className={`w-100 ${styles.goldBtn} fw-bold`}>
                      <CreditCard size={18} className="me-2" />
                      Proceed to Razorpay Payment (₹{(Number(bookingPartnerRoom.pricePerNight) * partnerNights).toLocaleString()})
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}

        {/* RAZORPAY MODAL FOR PARTNER ROOM BOOKING */}
        <RazorpayModal
          isOpen={isPartnerRazorpayOpen}
          onClose={() => setIsPartnerRazorpayOpen(false)}
          amount={bookingPartnerRoom ? Number(bookingPartnerRoom.pricePerNight) * partnerNights : 0}
          itemTitle={bookingPartnerRoom ? `${bookingPartnerRoom.hotelName} — ${bookingPartnerRoom.roomType} (Room ${bookingPartnerRoom.roomNumber})` : 'Partner Hotel Stay'}
          devoteeInfo={{
            name: devoteeName,
            phone: partnerGuestPhone,
            email: devoteeEmail,
          }}
          onSuccess={handlePartnerPaymentSuccess}
        />

        {/* PARTNER ROOM BOOKING SUCCESS RECEIPT */}
        {partnerBookingSuccess && (
          <div className="modal show d-block p-3" style={{ backgroundColor: 'rgba(0,0,0,0.87)', zIndex: 1070 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-black border border-success border-opacity-50 text-white rounded-4 p-4 text-center shadow-2xl">
                <CheckCircle2 size={64} className="text-success mb-3 mx-auto" />
                <h3 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>Room Reserved!</h3>
                <p className="text-secondary small mb-4">Your room has been confirmed with the hotel partner.</p>
                <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-40 text-start small font-monospace mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Booking Ref:</span>
                    <span className="text-warning fw-bold">{partnerBookingSuccess.bookingRef}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Hotel:</span>
                    <span className="text-light">{partnerBookingSuccess.hotelName}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Room:</span>
                    <span className="text-light">{partnerBookingSuccess.roomType} · #{partnerBookingSuccess.roomNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-secondary">Check-in:</span>
                    <span className="text-light">{partnerBookingSuccess.checkInDate}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-secondary">Total Paid:</span>
                    <span className="text-success fw-bold">₹{Number(partnerBookingSuccess.totalPrice).toLocaleString()}</span>
                  </div>
                </div>
                <button className="btn btn-warning w-100 rounded-pill fw-bold text-dark py-2.5"
                  onClick={() => setPartnerBookingSuccess(null)}>
                  Done · View in My Profile
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

