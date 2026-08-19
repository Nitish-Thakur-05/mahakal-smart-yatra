import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CheckCircle,
  Sparkles,
  X,
  ShieldAlert,
  User,
  Mail,
  ChevronRight,
  Eye,
  Video,
  Info,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { RazorpayModal } from '../components/RazorpayModal';
import { toast } from 'react-hot-toast';
import { recordAartiBooking } from '../utils/bookingStats';
import styles from "../styles/custom.module.css";

const SIX_OFFICIAL_AARTIS = [
  {
    id: "bhasma-aarti",
    nameEn: "Shri Mahakal Bhasma Aarti",
    nameHi: "भस्म आरती",
    time: "04:00 AM - 06:00 AM Daily",
    period: "Early Morning (Brahma Muhurta)",
    passRequired: true,
    badge: "Mandatory Online Pass",
    image: "/bhasmaArti.jpeg",
    video: "/bhasmaArti.mp4",
    totalSeats: 1500,
    seatsLeft: 142,
    description:
      "The world-famous early morning ritual where Lord Mahakal is bathed in sacred Bhasma (fresh pyre ash & holy herbs) accompanied by reverberating dhol, conch shells, and Vedic mantras.",
    dressCode: "Male: Unstitched Dhoti / Sola. Female: Saree.",
    entryGate: "Gate No. 1 (Avantika Dwar)",
    reportingTime: "03:00 AM (1 Hour Before)",
    significance:
      "Bhasma Aarti symbolizes the eternal truth of time (Kala), mortality, and Shiva as the ultimate sovereign who transcends life and death. The sacred ash represents purity and dissolution of worldly ego.",
    guidelines:
      "Smartphones, cameras, and leather items are strictly prohibited inside the sanctum. Devotees must carry their physical Aadhaar card along with the printed Bhasma Aarti booking pass.",
    ritualTimeline: [
      {
        time: "03:00 AM",
        step: "Devotee Security Verification & QR Pass Scanning at Gate 1",
      },
      {
        time: "03:30 AM",
        step: "Panchamrut Abhishekam with Milk, Curd, Ghee, Honey & Sacred Gangajal",
      },
      {
        time: "04:00 AM",
        step: "Bhasma Shringar & Direct Sacred Ash Offering to the Dakshinamukhi Lingam",
      },
      {
        time: "05:00 AM",
        step: "Grand Maha Aarti with Reverberating Dhol, Nagada Drums & Conch Shells",
      },
      {
        time: "06:00 AM",
        step: "Morning Darshan Concludes & Distribution of Blessed Bhasma Prasad",
      },
    ],
  },
  {
    id: "dadhodak-aarti",
    nameEn: "Dadhodak Aarti (Naivedya Aarti)",
    nameHi: "दधोदक / नैवेद्य आरती",
    time: "07:30 AM - 08:15 AM Daily",
    period: "Morning Offering",
    passRequired: false,
    badge: "General Darshan",
    image: "/dadyodakArti.jpeg",
    totalSeats: 2500,
    seatsLeft: 480,
    description:
      "Morning Aarti where Lord Mahakal is offered fresh curd, milk, honey, and morning sweets (Dadhodak naivedya) after morning Shringar.",
    dressCode: "Traditional Devotional Attire",
    entryGate: "Gate No. 4 & Nandi Hall Queue",
    reportingTime: "07:00 AM",
    significance:
      "Expresses morning devotion and gratitude to the supreme preserver through sacred dairy and honey offerings.",
    guidelines:
      "General entry is free. Devotees can stand in Nandi Hall or move through the general queue line for darshan.",
    ritualTimeline: [
      { time: "07:00 AM", step: "General Queue Alignment & Sanctum Cleaning" },
      {
        time: "07:30 AM",
        step: "Dadhodak Naivedya Offering & Milk Abhishekam",
      },
      {
        time: "08:00 AM",
        step: "Morning Aarti Mantras & Camphor Light Distribution",
      },
    ],
  },
  {
    id: "bhog-aarti",
    nameEn: "Shri Mahakal Bhog Aarti",
    nameHi: "भोग आरती",
    time: "10:30 AM - 11:30 AM Daily",
    period: "Mid-Day Royal Meal",
    passRequired: false,
    badge: "General Darshan",
    image: "/bhogArti.jpeg",
    totalSeats: 3000,
    seatsLeft: 920,
    description:
      "The royal mid-day meal offering where elaborate Sattvik delicacies are presented to Lord Mahakaleshwar with grand brass bells and nagada drums.",
    dressCode: "Decent Devotional Attire",
    entryGate: "Mahakal Lok Pathway & Gate 4",
    reportingTime: "10:00 AM",
    significance:
      "Represents the royal courtly tradition (Rajopachara) honoring Lord Mahakal as the supreme King (Maharaja) of Ujjain.",
    guidelines:
      "No special booking pass required. High-frequency darshan line moves smoothly during mid-day hours.",
    ritualTimeline: [
      {
        time: "10:15 AM",
        step: "Royal Bhog Thali Presentation by Temple Priests",
      },
      {
        time: "10:30 AM",
        step: "Chanting of Rajopachara Vedic Hymns & Nagada Drums",
      },
      {
        time: "11:15 AM",
        step: "Chamar & Fan Offering Ritual to Lord Mahakaleshwar",
      },
    ],
  },
  {
    id: "sandhya-aarti",
    nameEn: "Sandhya Aarti",
    nameHi: "संध्या आरती",
    time: "05:00 PM - 06:00 PM Daily",
    period: "Twilight Evening",
    passRequired: false,
    badge: "General Darshan",
    image: "/sandhyaArti.jpeg",
    totalSeats: 2000,
    seatsLeft: 310,
    description:
      "Evening twilight Aarti marking the transition into dusk. The sanctum is illuminated with traditional oil lamps and golden Shringar.",
    dressCode: "Traditional Devotional Attire",
    entryGate: "Gate 1, 4 & Nandi Hall",
    reportingTime: "04:30 PM",
    significance:
      "Twilight is considered the auspicious Sandhya Kala where meditation and camphor light dissolve evening darkness.",
    guidelines:
      "Expect higher crowd footfall during twilight hours. Arrive 30 minutes in advance for front seating in Nandi Hall.",
    ritualTimeline: [
      {
        time: "04:30 PM",
        step: "Evening Shringar & Floral Adornment of Jyotirlingam",
      },
      {
        time: "05:00 PM",
        step: "Lighting of 108 Camphor Flames & Brass Lamp Towers",
      },
      {
        time: "05:45 PM",
        step: "Evening Stotram Chanting & Prasadam Distribution",
      },
    ],
  },
  {
    id: "shringar-aarti",
    nameEn: "Sandhya Shringar Aarti",
    nameHi: "संध्या पूजा एवं श्रृंगार आरती",
    time: "07:00 PM - 08:00 PM Daily",
    period: "Night Shringar",
    passRequired: false,
    badge: "General Darshan",
    image: "/pujanArti.jpeg",
    totalSeats: 2000,
    seatsLeft: 530,
    description:
      "Lord Mahakal is adorned with elaborate bhang paste, dried fruits, silver crown, serpent ornaments, and fragrant jasmine garlands.",
    dressCode: "Traditional Indian Wear",
    entryGate: "Main Darshan Complex",
    reportingTime: "06:30 PM",
    significance:
      "Celebrates the aesthetic divinity (Rudra Shringar) where Shiva is worshipped as Chandramouliswar decorated with flowers.",
    guidelines:
      "Best time for photography in Mahakal Lok corridor before or after attending this evening Aarti.",
    ritualTimeline: [
      { time: "06:30 PM", step: "Bhang, Dry Fruit & Silver Mask Adornment" },
      { time: "07:00 PM", step: "Floral Crown & Deepa Aarti Chanting" },
      { time: "07:45 PM", step: "Camphor Light & Aarti Chants" },
    ],
  },
  {
    id: "shayan-aarti",
    nameEn: "Shri Mahakal Shayan Aarti",
    nameHi: "शयन आरती",
    time: "10:30 PM - 11:00 PM Daily",
    period: "Concluding Night Aarti",
    passRequired: false,
    badge: "General Darshan",
    image: "/shayanArti.jpeg",
    totalSeats: 1500,
    seatsLeft: 215,
    description:
      "The peaceful final Aarti of the night before the sanctum doors close. Soft flute melodies, damru sounds, and lullaby chants escort the Lord to rest.",
    dressCode: "Quiet & Peaceful Attire",
    entryGate: "Nandi Hall & Sanctum View",
    reportingTime: "10:00 PM",
    significance:
      "Symbolizes universal dissolution (Laya) and restful peace before the next morning's Brahma Muhurta Bhasma Aarti.",
    guidelines:
      "Sanctum gates close strictly at 11:00 PM. Peaceful atmosphere ideal for quiet evening contemplation.",
    ritualTimeline: [
      {
        time: "10:15 PM",
        step: "Sanctum Bed Arrangement & Soft Flute Instrumental",
      },
      { time: "10:30 PM", step: "Final Shayan Aarti & Lullaby Chants" },
      { time: "11:00 PM", step: "Sanctum Doors Close for Night" },
    ],
  },
];

export function CulturalEvents({ events, user, onOpenAuth }) {
  const [selectedAarti, setSelectedAarti] = useState(null);
  const [bookingModalAarti, setBookingModalAarti] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [ticketsCount, setTicketsCount] = useState(1);
  const [userName, setUserName] = useState(user?.name || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    } else {
      setUserName("");
      setUserEmail("");
    }
  }, [user, bookingModalAarti]);

  useEffect(() => {
    if (selectedAarti || bookingModalAarti) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedAarti, bookingModalAarti]);

  const openPassModal = (aarti) => {
    if (aarti && aarti.seatsLeft <= 0) {
      toast.error("Housefull: All seats/passes for this Aarti are fully reserved.");
      return;
    }
    if (!user) {
      toast.error("Authentication Required: Please sign in or register to book Aarti passes.");
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    setBookingModalAarti(aarti);
    setSelectedAarti(null);
  };

  const handleBookPass = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Authentication Required: Please sign in or register to book Aarti passes.");
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (!userName || !userEmail) return;
    setIsRazorpayOpen(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setIsRazorpayOpen(false);
    try {
      // Save pass booking in MongoDB database
      const aartiKeyMap = {
        'bhasma-aarti': 'bhasma',
        'dadhodak-aarti': 'dadhodak',
        'bhog-aarti': 'bhog',
        'sandhya-aarti': 'sandhya',
        'shringar-aarti': 'shringar',
        'shayan-aarti': 'shayan'
      };
      const aartiIdKey = aartiKeyMap[bookingModalAarti?.id] || 'dadhodak';

      await axios.post("/api/passes/generate-epass", {
        primaryDevoteeName: userName || user?.name || "Devotee",
        contactPhone: "9876543210",
        numberOfPersons: ticketsCount,
        passengers: Array.from({ length: ticketsCount }, (_, i) => ({
          name: i === 0 ? (userName || user?.name || "Devotee") : `Devotee ${i + 1}`,
          age: 30,
          gender: "Other",
          idProof: "Aadhaar Card"
        })),
        bookingDate: selectedDate,
        aartiId: aartiIdKey,
        aartiName: bookingModalAarti?.nameEn || "Dadhodak Aarti (Naivedya Aarti)",
        gateNumber: 4
      });
    } catch (err) {
      console.error("Failed to sync booking to backend DB:", err);
    }

    toast.success(`Aarti Pass for ${bookingModalAarti?.nameEn || 'Sacred Aarti'} issued for ${selectedDate}! 🕉️`);
    if (bookingModalAarti) {
      recordAartiBooking(bookingModalAarti.id || bookingModalAarti.nameEn, ticketsCount);
      bookingModalAarti.seatsLeft = Math.max(0, bookingModalAarti.seatsLeft - ticketsCount);
    }
    setBookingSuccess(`MAHAKAL-PASS-${Math.floor(100000 + Math.random() * 900000)}`);
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
            The 6 Daily Aartis of Shri Mahakaleshwar
          </h1>
          <p className="text-secondary max-w-700 mx-auto">
            From the 4:00 AM morning Bhasma Aarti to the 10:30 PM Shayan Aarti,
            explore timings, dress codes, rituals, and pass booking for all
            daily Aartis held at the sanctum.
          </p>
        </motion.div>

        {/* 6 Aartis Grid */}
        <div className="row g-4">
          {SIX_OFFICIAL_AARTIS.map((aarti, index) => (
            <div key={aarti.id} className="col-lg-4 col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`card bg-dark text-white ${styles.glassCard} h-100 p-0 overflow-hidden cursor-pointer`}
                onClick={() => setSelectedAarti(aarti)}
              >
                {/* Image Cover */}
                <div className="position-relative" style={{ height: 200 }}>
                  <img
                    src={aarti.image}
                    alt={aarti.nameEn}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <div className="position-absolute top-0 start-0 m-3">
                    <span
                      className={`badge ${aarti.passRequired ? "bg-warning text-dark" : "bg-dark text-warning border border-warning border-opacity-40"} font-monospace fw-bold px-3 py-1.5 rounded-pill`}
                    >
                      {aarti.badge}
                    </span>
                  </div>

                  <div className="position-absolute bottom-0 start-0 m-3">
                    <span className="badge bg-black bg-opacity-75 text-warning border border-warning border-opacity-30 small">
                      <Clock size={12} className="me-1" /> {aarti.time}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="text-warning small fw-bold">
                      {aarti.period}
                    </span>
                    <span className="text-secondary small fst-italic">
                      {aarti.nameHi}
                    </span>
                  </div>

                  <h4
                    className={`card-title text-white fw-bold mb-2 ${styles.playfairFont}`}
                  >
                    {aarti.nameEn}
                  </h4>

                  <p
                    className="card-text text-secondary small flex-grow-1 mb-3"
                    style={{ fontSize: "0.82rem", lineHeight: 1.5 }}
                  >
                    {aarti.description}
                  </p>

                  <div className="pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                    <button
                      className="btn btn-warning btn-sm rounded-pill fw-bold px-3 text-dark d-inline-flex align-items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAarti(aarti);
                      }}
                    >
                      <span>Full Details</span> <ChevronRight size={14} />
                    </button>

                    {/* Seats Left display with NO background color at position of Online Pass */}
                    {aarti.seatsLeft > 0 ? (
                      <span className="text-warning small fw-bold font-monospace bg-transparent border-0 p-0">
                        {aarti.seatsLeft}/{aarti.totalSeats} Seats Left
                      </span>
                    ) : (
                      <span className="text-danger small fw-bold font-monospace bg-transparent border-0 p-0">
                        Housefull (0 Seats)
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* --- AARTI DETAIL MODAL (Dynamic Content-Filled Portal UI) --- */}
      <AnimatePresence>
        {selectedAarti && (
          <div
            className="modal show d-flex align-items-center justify-content-center p-2 p-md-3 position-fixed top-0 start-0 w-100 h-100 overflow-hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.88)", zIndex: 1060, height: "100vh", width: "100vw" }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-xl w-100 m-auto"
              style={{ maxWidth: "980px", height: "92vh", maxHeight: "92vh" }}
            >
              <motion.div
                className="modal-content bg-black text-white border border-warning border-opacity-40 rounded-4 overflow-hidden shadow-2xl d-flex flex-column h-100"
                style={{ maxHeight: "92vh" }}
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Hero Media Banner Header */}
                <div
                  className="position-relative flex-shrink-0"
                  style={{ height: 230 }}
                >
                  {selectedAarti.video ? (
                    <video
                      src={selectedAarti.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <img
                      src={selectedAarti.image}
                      alt={selectedAarti.nameEn}
                      className="w-100 h-100 object-fit-cover"
                    />
                  )}
                  <div className="position-absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Top Floating Controls & Badges */}
                  <button
                    onClick={() => setSelectedAarti(null)}
                    className="position-absolute top-0 end-0 m-3 btn btn-dark text-warning rounded-circle p-2 border border-warning border-opacity-30 shadow"
                    style={{ zIndex: 10 }}
                  >
                    <X size={20} />
                  </button>

                  <div className="position-absolute bottom-0 start-0 m-4">
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 rounded-pill">
                        {selectedAarti.badge}
                      </span>
                      <span className="badge bg-dark text-warning border border-warning border-opacity-40 px-3 py-1.5 rounded-pill">
                        {selectedAarti.nameHi}
                      </span>
                      <span className="badge bg-black bg-opacity-75 text-light border border-secondary border-opacity-30 px-3 py-1.5 rounded-pill">
                        <Clock size={12} className="me-1 text-warning" />{" "}
                        {selectedAarti.time}
                      </span>
                    </div>
                    <h2
                      className={`text-white fw-bold display-6 mb-0 ${styles.playfairFont}`}
                    >
                      {selectedAarti.nameEn}
                    </h2>
                  </div>
                </div>

                {/* Modal Main Scrollable Content Area */}
                <div className="modal-body p-4 overflow-y-auto flex-grow-1">
                  {/* 4-Card Quick Specifications Grid */}
                  <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                      <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100">
                        <small
                          className="text-warning fw-bold d-block mb-1"
                          style={{ fontSize: "0.73rem" }}
                        >
                          TIMING & PERIOD
                        </small>
                        <span className="text-white fw-semibold small d-block">
                          {selectedAarti.time}
                        </span>
                        <small
                          className="text-secondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {selectedAarti.period}
                        </small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100">
                        <small
                          className="text-warning fw-bold d-block mb-1"
                          style={{ fontSize: "0.73rem" }}
                        >
                          REPORTING TIME
                        </small>
                        <span className="text-white fw-semibold small d-block">
                          {selectedAarti.reportingTime}
                        </span>
                        <small
                          className="text-secondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Arrive Early
                        </small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100">
                        <small
                          className="text-warning fw-bold d-block mb-1"
                          style={{ fontSize: "0.73rem" }}
                        >
                          ENTRY GATE
                        </small>
                        <span className="text-white fw-semibold small d-block">
                          {selectedAarti.entryGate}
                        </span>
                        <small
                          className="text-secondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Verified Pass Gate
                        </small>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100">
                        <small
                          className="text-warning fw-bold d-block mb-1"
                          style={{ fontSize: "0.73rem" }}
                        >
                          DRESS CODE
                        </small>
                        <span className="text-white fw-semibold small d-block">
                          {selectedAarti.dressCode}
                        </span>
                        <small
                          className="text-secondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Mandatory Traditional
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Spiritual Significance Narrative */}
                  <div className="mb-4">
                    <h5 className="text-warning fw-bold mb-2 d-flex align-items-center gap-2">
                      <Sparkles size={18} /> Spiritual Significance & Puranic
                      Heritage
                    </h5>
                    <p
                      className="text-light lead fs-6 mb-3"
                      style={{ lineHeight: 1.6 }}
                    >
                      {selectedAarti.description}
                    </p>
                    <div
                      className="p-3 bg-dark rounded-3 border-start border-warning border-4 text-light small"
                      style={{ lineHeight: 1.6 }}
                    >
                      <strong className="text-warning">Puranic Wisdom:</strong>{" "}
                      {selectedAarti.significance}
                    </div>
                  </div>

                  {/* Step-by-Step Ritual Sequence Schedule */}
                  {selectedAarti.ritualTimeline && (
                    <div className="mb-4">
                      <h5 className="text-warning fw-bold mb-3 d-flex align-items-center gap-2">
                        <Clock size={18} /> Step-by-Step Ritual Sequence
                      </h5>
                      <div className="d-flex flex-column gap-2.5">
                        {selectedAarti.ritualTimeline.map((step, i) => (
                          <div
                            key={i}
                            className="d-flex align-items-center gap-3 p-3 bg-dark rounded-3 border border-secondary border-opacity-25"
                          >
                            <span
                              className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1.5 rounded-pill small"
                              style={{ width: 95 }}
                            >
                              {step.time}
                            </span>
                            <span
                              className="text-light small flex-grow-1"
                              style={{ fontSize: "0.88rem" }}
                            >
                              {step.step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Essential Devotee Guidelines Box */}
                  <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-25">
                    <h6 className="text-warning fw-bold mb-1 d-flex align-items-center gap-2">
                      <Info size={16} /> Devotee Essential Guidelines & Sanctum
                      Rules
                    </h6>
                    <p
                      className="text-secondary small mb-0"
                      style={{ lineHeight: 1.5 }}
                    >
                      {selectedAarti.guidelines}
                    </p>
                  </div>
                </div>

                {/* Modal Footer - Fixed Gold Action Strip */}
                <div className="px-4 py-3 bg-dark border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between flex-shrink-0">
                  <button
                    className="btn btn-outline-light btn-sm rounded-pill px-4"
                    onClick={() => setSelectedAarti(null)}
                  >
                    Close
                  </button>

                  {selectedAarti.seatsLeft <= 0 ? (
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill px-4 fw-bold"
                      disabled
                    >
                      Housefull (0 Seats Left)
                    </button>
                  ) : (
                    <button
                      className={styles.goldBtn}
                      onClick={() => openPassModal(selectedAarti)}
                    >
                      <Ticket size={18} className="me-2" /> Book Aarti Pass / Token
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- BOOKING PASS MODAL --- */}
      {bookingModalAarti && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-black text-white border border-warning border-opacity-50 rounded-4 p-3 shadow-lg">
              <div className="modal-header border-bottom border-secondary border-opacity-25 pb-3">
                <h5
                  className={`modal-title text-warning fw-bold ${styles.playfairFont}`}
                >
                  Book Pass: {bookingModalAarti.nameEn}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setBookingModalAarti(null)}
                ></button>
              </div>

              {bookingSuccess ? (
                <div className="modal-body text-center py-4">
                  <CheckCircle size={56} className="text-warning mb-3" />
                  <h4 className="text-white fw-bold mb-2">
                    Devotee Pass Issued Successfully!
                  </h4>
                  <p className="text-secondary small mb-3">
                    Your official pass QR code has been sent to your email.
                  </p>

                  <div className="p-3 bg-dark text-warning font-monospace fw-bold fs-5 rounded-3 border border-warning border-opacity-40 mb-4">
                    {bookingSuccess}
                  </div>

                  <button
                    className="btn btn-warning w-100 rounded-pill fw-bold text-dark"
                    onClick={() => {
                      setBookingSuccess(null);
                      setBookingModalAarti(null);
                    }}
                  >
                    Done & Download Pass
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookPass}>
                  <div className="modal-body py-3">
                    {/* Seats Left Banner */}
                    <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-30 mb-3 d-flex align-items-center justify-content-between">
                      <span className="text-secondary small d-flex align-items-center gap-1.5">
                        <Ticket size={16} className="text-warning" /> Live Capacity:
                      </span>
                      <span className="badge bg-warning text-dark font-monospace fw-bold px-3 py-1 rounded-pill">
                        {bookingModalAarti.seatsLeft} / {bookingModalAarti.totalSeats} Seats Remaining
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small">
                        Devotee Full Name
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="e.g. Ramesh Sharma"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-warning fw-bold small d-flex align-items-center gap-2">
                        <Calendar size={16} /> Select Booking Date (1 Month Advance Booking)
                      </label>
                      <input
                        type="date"
                        className="form-control bg-dark text-warning border-warning border-opacity-50 font-monospace fw-bold"
                        value={selectedDate}
                        min={new Date().toISOString().substring(0, 10)}
                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ colorScheme: "dark" }}
                        required
                      />
                      <small className="text-secondary d-block mt-1" style={{ fontSize: "0.75rem" }}>
                        You can book Aarti passes up to 30 days (1 month) in advance.
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-secondary small">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-dark border-secondary border-opacity-50 text-warning">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          className="form-control bg-dark text-white border-secondary border-opacity-50"
                          placeholder="devotee@example.com"
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label text-secondary small">
                        Number of Passes
                      </label>
                      <select
                        className="form-select bg-dark text-white border-secondary border-opacity-50"
                        value={ticketsCount}
                        onChange={(e) =>
                          setTicketsCount(parseInt(e.target.value, 10))
                        }
                      >
                        <option value="1">1 Pass</option>
                        <option value="2">2 Passes</option>
                        <option value="3">3 Passes</option>
                        <option value="4">4 Passes (Family Max)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className={`w-100 ${styles.goldBtn}`}
                      disabled={loading}
                    >
                      {loading
                        ? "Issuing Official Pass..."
                        : "Confirm & Issue Pass"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RAZORPAY DEMO CHECKOUT MODAL INTEGRATION --- */}
      <RazorpayModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        amount={bookingModalAarti?.passRequired ? 250 * ticketsCount : 0}
        itemTitle={bookingModalAarti ? `Aarti Pass: ${bookingModalAarti.nameEn}` : 'Aarti Pass'}
        devoteeInfo={{ name: userName, email: userEmail }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
