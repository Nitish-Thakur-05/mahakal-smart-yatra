import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  ShieldAlert,
  Ambulance,
  Flame,
  HelpCircle,
  Clock,
  MapPin,
  Send,
  User,
  Mail,
  HeartPulse,
  Lock,
  Compass,
  Check,
  CheckCircle2,
  Utensils,
  LogIn
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "../styles/custom.module.css";

export const EMERGENCY_HELPLINES = [
  {
    id: "med_01",
    title: "Medical ICU & Ambulance",
    titleHi: "चिकित्सा आपातकालीन एवं एम्बुलेंस",
    category: "Medical",
    icon: Ambulance,
    phone: "+91 734 2550700",
    phoneClean: "tel:+917342550700",
    location: "Gate 5 & Gate 1 Medical Post",
    availability: "24/7 Service",
    desc: "Free 24x7 doctor on duty, oxygen support, ICU trauma bed, and emergency campus ambulance."
  },
  {
    id: "pol_01",
    title: "Temple Police Control",
    titleHi: "मंदिर पुलिस नियंत्रण कक्ष",
    category: "Security",
    icon: ShieldAlert,
    phone: "+91 734 2551222",
    phoneClean: "tel:+917342551222",
    location: "Mahakal Police Station, Gate 1",
    availability: "24/7 Control Room",
    desc: "Direct line to Ujjain Police Control Room, CCTV monitoring hub, and security officers."
  },
  {
    id: "fire_01",
    title: "Fire Safety & Rescue",
    titleHi: "अग्निशमन एवं सुरक्षा दल",
    category: "Safety",
    icon: Flame,
    phone: "+91 734 2550101",
    phoneClean: "tel:+917342550101",
    location: "Mahakal Lok Fire Post",
    availability: "24/7 Standby",
    desc: "High-pressure fire hydrants and rescue personnel stationed across 108 pillars corridor."
  },
  {
    id: "trust_01",
    title: "Temple Trust Helpline",
    titleHi: "मंदिर प्रबंध समिति हेल्पलाइन",
    category: "Helpline",
    icon: PhoneCall,
    phone: "+91 734 2550701",
    phoneClean: "tel:+917342550701",
    location: "Temple Administrative Building",
    availability: "06:00 AM - 11:00 PM",
    desc: "Official trust helpline for Bhasma Aarti pass queries, protocol darshan, and guidance."
  },
  {
    id: "lost_01",
    title: "Lost & Found Center",
    titleHi: "खोया-पाया सहायता केंद्र",
    category: "Assistance",
    icon: HelpCircle,
    phone: "+91 734 2550702",
    phoneClean: "tel:+917342550702",
    location: "Gate 1 Plaza & Gate 4",
    availability: "04:00 AM - 11:00 PM",
    desc: "Public announcement system, lost belongings recovery desk, and family reunion assistance."
  },
  {
    id: "cart_01",
    title: "Golf Cart & Wheelchair",
    titleHi: "दिव्यांग एवं वरिष्ठ नागरिक सेवा",
    category: "Accessibility",
    icon: Compass,
    phone: "+91 734 2550703",
    phoneClean: "tel:+917342550703",
    location: "Gate 1 Hub & Atithi Niwas",
    availability: "04:00 AM - 10:30 PM",
    desc: "Free battery electric golf carts and wheelchairs for senior citizens & disabled devotees."
  }
];

export const PREMISES_FACILITIES = [
  {
    id: "fac_01",
    name: "Medical Post & Pharmacy",
    nameHi: "चिकित्सा केंद्र एवं औषधि",
    icon: HeartPulse,
    location: "Near Gate 5 & Gate 1 Plaza",
    timing: "24 Hours / 7 Days",
    details: [
      "MBBS doctors & paramedics on duty",
      "Free medicines, ORS & ECG checks",
      "Wheelchairs & stretchers at all gates"
    ]
  },
  {
    id: "fac_02",
    name: "Cloak Room & Lockers",
    nameHi: "अमानती घर एवं लॉकर",
    icon: Lock,
    location: "Gate 1 Plaza & Gate 4 Entrance",
    timing: "04:00 AM - 11:00 PM",
    details: [
      "Free luggage & footwear counters",
      "CCTV-monitored electronic mobile lockers",
      "Digital receipt token system"
    ]
  },
  {
    id: "fac_03",
    name: "Sattvik Annakshetra Dining",
    nameHi: "अन्नक्षेत्र (निःशुल्क भोजन)",
    icon: Utensils,
    location: "100m from Gate 1 Plaza",
    timing: "11 AM - 3 PM | 7 PM - 9:30 PM",
    details: [
      "Clean AC hall for 2000+ devotees",
      "Free wholesome Sattvik Mahaprasad",
      "Purified RO drinking water"
    ]
  },
  {
    id: "fac_04",
    name: "Mother & Infant Care Room",
    nameHi: "मातृ एवं शिशु देखभाल कक्ष",
    icon: User,
    location: "Gate 1 & Gate 4 Courtyard",
    timing: "05:00 AM - 10:30 PM",
    details: [
      "Private AC feeding cubicles",
      "Diaper changing stations & warm water",
      "Female attendants on duty"
    ]
  }
];

export function Support({ user, onOpenAuth }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuth) onOpenAuth("login");
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.error("Please fill out Name, Phone Number, and Message!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/support", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Support Ticket Submitted! Our control room team will contact you shortly.");
    } catch (err) {
      setIsSubmitting(false);
      const errMsg = err.response?.data?.error || "Failed to submit support ticket. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <div className="bg-black min-vh-100 text-white pb-5" style={{ paddingTop: "110px" }}>
      <div className="container py-4 max-w-7xl mx-auto">
        
        {/* Minimal Header */}
        <div className="text-center mb-5">
          <h1 className={`display-5 fw-bold text-white mb-2 ${styles.playfairFont}`}>
            24/7 Support & Emergency Helplines
          </h1>
          <p className="text-secondary max-w-xl mx-auto fs-6">
            Direct emergency dialers, campus facilities, and official helpdesk support.
          </p>
        </div>

        {/* EMERGENCY DIALERS GRID */}
        <div className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className={`h5 fw-bold text-white mb-0 ${styles.playfairFont}`}>
              Direct Emergency Helplines
            </h3>
            <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-3 py-1 font-semibold fs-7">
              Instant Connect
            </span>
          </div>

          <div className="row g-3">
            {EMERGENCY_HELPLINES.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 bg-dark rounded-4 border border-secondary border-opacity-20 hover-border-warning transition-all h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-2.5 py-1 font-semibold fs-7">
                          {item.category}
                        </span>
                        <span className="text-secondary small d-flex align-items-center gap-1">
                          <Clock size={12} className="text-warning" /> {item.availability}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-3.5 mb-3">
                        <div className="rounded-circle bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                          <IconComp size={20} />
                        </div>
                        <div>
                          <h4 className="h6 fw-bold text-white mb-0">{item.title}</h4>
                          <div className="text-warning small" style={{ fontSize: "0.78rem" }}>{item.titleHi}</div>
                        </div>
                      </div>

                      <p className="text-secondary small mb-3" style={{ fontSize: "0.82rem" }}>{item.desc}</p>

                      <div className="p-2 bg-black bg-opacity-50 rounded-3 border border-secondary border-opacity-20 text-secondary small mb-3" style={{ fontSize: "0.78rem" }}>
                        <div className="d-flex align-items-center gap-1.5">
                          <MapPin size={13} className="text-warning flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.phoneClean}
                      className="btn btn-outline-warning btn-sm rounded-pill w-100 py-2 d-flex align-items-center justify-content-center gap-2 font-semibold text-decoration-none shadow-sm"
                    >
                      <PhoneCall size={15} />
                      <span>Call Now: {item.phone}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TWO COLUMN SECTION: CONTACT FORM & CAMPUS AMENITIES */}
        <div className="row g-4">
          
          {/* LEFT COLUMN: MINIMAL CONTACT FORM */}
          <div className="col-12 col-lg-6">
            <div className="p-4 bg-dark rounded-4 border border-secondary border-opacity-20 h-100">
              <div className="mb-3">
                <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-3 py-1 font-semibold fs-7">
                  ONLINE HELPDESK
                </span>
              </div>

              <h3 className={`h4 fw-bold text-white mb-1 ${styles.playfairFont}`}>
                Send Support Inquiry
              </h3>
              <p className="text-secondary small mb-4" style={{ fontSize: "0.84rem" }}>
                Have a query about passes, lodging, or lost items? Submit a message below.
              </p>

              {!user ? (
                <div className="p-4 rounded-4 bg-black bg-opacity-60 border border-secondary border-opacity-30 text-center my-3 py-5">
                  <div className="rounded-circle bg-warning text-dark mx-auto p-3 d-flex align-items-center justify-content-center mb-3" style={{ width: 56, height: 56 }}>
                    <LogIn size={26} />
                  </div>
                  <h5 className="fw-bold text-white mb-2">Authentication Required</h5>
                  <p className="text-secondary small mb-4 max-w-400 mx-auto">
                    Only registered pilgrims can submit support queries to the Shri Mahakal Temple Control Desk.
                  </p>
                  <button
                    onClick={() => onOpenAuth && onOpenAuth("login")}
                    className="btn btn-warning text-dark font-bold rounded-pill px-4 py-2.5 shadow-sm d-inline-flex align-items-center gap-2"
                  >
                    <LogIn size={16} />
                    <span>Sign In to Submit Support Query</span>
                  </button>
                </div>
              ) : submitted ? (
                <div className="p-4 rounded-4 bg-success bg-opacity-15 border border-success border-opacity-40 text-center my-3">
                  <div className="rounded-circle bg-success text-white mx-auto p-2.5 d-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
                    <Check size={24} />
                  </div>
                  <h5 className="fw-bold text-white mb-1">Ticket Submitted!</h5>
                  <p className="text-secondary small mb-3">
                    Thank you, {formData.name}. Our control room will contact you shortly at {formData.phone}.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: user.name || "", phone: user.phone || "", email: user.email || "", category: "General Inquiry", message: "" });
                    }}
                    className="btn btn-outline-warning btn-sm rounded-pill px-4 py-1.5 font-semibold"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label text-secondary small font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="form-control bg-black text-white border-secondary border-opacity-30 rounded-3 py-2 px-3 shadow-none focus-border-warning"
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary small font-semibold mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98260XXXXX"
                        className="form-control bg-black text-white border-secondary border-opacity-30 rounded-3 py-2 px-3 shadow-none"
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-secondary small font-semibold mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@domain.com"
                        className="form-control bg-black text-white border-secondary border-opacity-30 rounded-3 py-2 px-3 shadow-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-secondary small font-semibold mb-1">
                      Inquiry Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select bg-black text-white border-secondary border-opacity-30 rounded-3 py-2 px-3 shadow-none"
                    >
                      <option value="General Inquiry">General Pilgrim Inquiry</option>
                      <option value="Bhasma Aarti Pass">Bhasma Aarti Pass Issue</option>
                      <option value="Hotel & Lodging">Hotel / Atithi Niwas Stay</option>
                      <option value="Lost & Found">Lost & Found Report</option>
                      <option value="VIP Protocol">VIP Protocol & Jalabhishek</option>
                      <option value="Emergency Assistance">Emergency Medical / Special Need</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-secondary small font-semibold mb-1">
                      Message Details *
                    </label>
                    <textarea
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your query or request..."
                      className="form-control bg-black text-white border-secondary border-opacity-30 rounded-3 py-2 px-3 shadow-none"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-warning text-dark font-bold rounded-pill w-100 py-2.5 shadow-sm d-flex align-items-center justify-content-center gap-2 mt-1"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Support Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: MINIMAL CAMPUS AMENITIES */}
          <div className="col-12 col-lg-6">
            <div className="p-4 bg-dark rounded-4 border border-secondary border-opacity-20 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="mb-3">
                  <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-3 py-1 font-semibold fs-7">
                    CAMPUS AMENITIES
                  </span>
                </div>

                <h3 className={`h4 fw-bold text-white mb-1 ${styles.playfairFont}`}>
                  Premises Facilities
                </h3>
                <p className="text-secondary small mb-4" style={{ fontSize: "0.84rem" }}>
                  Essential services established inside temple premises for pilgrim convenience.
                </p>

                <div className="d-flex flex-column gap-3 mb-3">
                  {PREMISES_FACILITIES.map((fac) => {
                    const FacIcon = fac.icon;
                    return (
                      <div key={fac.id} className="p-3 bg-black bg-opacity-50 rounded-3 border border-secondary border-opacity-20">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-3.5">
                            <div className="rounded-circle bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                              <FacIcon size={18} />
                            </div>
                            <div>
                              <h5 className="fw-bold text-white mb-0 fs-6">{fac.name}</h5>
                              <span className="text-warning small" style={{ fontSize: "0.75rem" }}>{fac.nameHi}</span>
                            </div>
                          </div>
                          <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-2.5 py-1 fs-7">
                            {fac.timing}
                          </span>
                        </div>

                        <ul className="list-unstyled mb-0 mt-2">
                          {fac.details.map((detail, idx) => (
                            <li key={idx} className="d-flex align-items-start gap-2 text-secondary small mb-1" style={{ fontSize: "0.78rem" }}>
                              <CheckCircle2 size={13} className="text-warning flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-3 bg-black bg-opacity-60 border border-secondary border-opacity-20 text-center">
                <span className="text-warning fw-bold small d-block mb-0.5">
                  Need On-Ground Help?
                </span>
                <span className="text-secondary small d-block" style={{ fontSize: "0.78rem" }}>
                  Visit <strong>Gate 1 Control Tower</strong> or approach any Mahakal Security Officer.
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
