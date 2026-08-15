import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Search,
  Sparkles,
  Info,
  CheckCircle,
  X,
  Compass,
  Share2,
  Utensils,
  Music,
  Flame,
  BookOpen,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import styles from "../styles/custom.module.css";

export const LOCAL_EVENTS_DATA = [
  {
    id: "evt_01",
    title: "Mahakal Lok Sandhya Bhajan & Classical Ensemble",
    titleHi: "महाकाल लोक संध्या भजन एवं शास्त्रीय संगीत संध्या",
    category: "Bhajan & Music",
    categoryIcon: Music,
    venue: "Amphitheatre, Mahakal Lok Corridor",
    distance: "200m from Temple Gate 1",
    date: "Every Evening",
    time: "06:30 PM - 08:30 PM",
    organizer: "Mahakal Lok Sanskritik Samiti",
    phone: "+91 98260 14782",
    contactPerson: "Shri Rakesh Sharma (Event Coordinator)",
    image:
      "https://imgs.search.brave.com/ClTy66Ou5BQ_x7nVvXGi0Hec0HmYHBfhVFDTxXNYLtg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmpkbWFnaWNi/b3guY29tL3YyL2Nv/bXAva29sa2F0YS95/MS8wMzNweHgzMy54/eDMzLjI1MDkxOTE2/NDgyNS5sNHkxL2Nh/dGFsb2d1ZS9zdW1h/bi1hbmQtZnJpZW5k/cy1zaGVobmFpLWdy/b3VwLW5pbXRhLWtv/bGthdGEtc2luZ2Vy/cy14Zm1mcmppdjkw/LTI1MC5qcGc_dz02/NDAmcT03NQ",
    description:
      "Renowned Indian classical vocalists and local bhajan mandalis perform devotional ragas dedicated to Lord Mahakal in front of the illuminated 108 grand ornate pillars of Mahakal Lok.",
    highlights: [
      "Open air seating for 500+ devotees",
      "Free entry - No pass required",
      "Complimentary herbal tea & prasad distribution",
      "Live acoustic performance with Tabla & Harmonium",
    ],
    mapLocation: "Mahakal Lok Promenade, Ujjain",
    entryFee: "Free Entry",
  },
  {
    id: "evt_02",
    title: "Grand Shipra Maha Aarti & 1000 Deep Dan",
    titleHi: "भव्य शिप्रा महाआरती एवं 1000 दीपदान",
    category: "River Aarti",
    categoryIcon: Flame,
    venue: "Ram Ghat, Shipra River Bank",
    distance: "700m from Mahakaleshwar Temple",
    date: "Daily Evening",
    time: "07:00 PM - 08:15 PM",
    organizer: "Shipra Aarti Seva Samiti",
    phone: "+91 94250 83920",
    contactPerson: "Pandit Anand Ashram (Head Priest)",
    image:
      "https://imgs.search.brave.com/hOZYnlWwY-8_JfhL3Swjh2GYd71xoEChkU-EebeD0FU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA0LzczLzQ5LzY5/LzM2MF9GXzQ3MzQ5/Njk5Nl9CcGVJVnE1/Z3J5SHhxd2c1YXJz/Rk51cjliNHZnczlF/cy5qcGc",
    description:
      "108 brass multi-tiered lamp towers lit along the holy banks of Shipra river accompanied by Vedic chants, damru beats, and floating 1000 eco-friendly oil lamps (Deep Dan).",
    highlights: [
      "Free leaf oil lamps provided to attending devotees",
      "Sacred river sankalpa and collective chanting",
      "Safe paved ghat seating for families & elders",
      "Conch shell (Shankhnad) & Damru symphony",
    ],
    mapLocation: "Ram Ghat, Shipra River, Ujjain",
    entryFee: "Free Entry",
  },
  {
    id: "evt_03",
    title: "Shiva Purana Katha & Avantika Mahatmya",
    titleHi: "श्री शिवपुराण कथा एवं अवन्तिका क्षेत्र महात्म्य",
    category: "Harikatha & Satsang",
    categoryIcon: BookOpen,
    venue: "Triveni Mandapam, Near Harsiddhi Gate",
    distance: "350m from Mahakaleshwar Temple",
    date: "Ongoing 7-Day Katha | Daily",
    time: "03:00 PM - 06:30 PM",
    organizer: "Avantika Dharmik Seva Nyas",
    phone: "+91 97555 23411",
    contactPerson: "Mahant Suresh Dasji",
    image:
      "https://cdn.shopaccino.com/divine-rudraksha/products/shiva-maha-purana-katha-418311555019278_l.jpg?v=523",
    description:
      "Enlightening 7-day discourse on Shiva Puran, Mahakal Kshetra glory, and spiritual wisdom for householders by revered Vedic scholars.",
    highlights: [
      "Covered air-cooled pandal with carpet seating",
      "Daily distribution of fresh Motichoor Ladoo prasad",
      "Devotee Q&A session after 06:00 PM",
      "Free religious stotra leaflets distribution",
    ],
    mapLocation: "Triveni Marg, Near Harsiddhi Gate, Ujjain",
    entryFee: "Free Entry",
  },
  {
    id: "evt_04",
    title: "Vedic Rudrabhishekam & Chanting Sammelan",
    titleHi: "सामूहिक वैदिक रूद्राभिषेक एवं शुक्ल यजुर्वेद पाठ",
    category: "Vedic Rituals",
    categoryIcon: Sun,
    venue: "Maharshi Sandipani Ashram Sacred Hall",
    distance: "2.5 km from Mahakaleshwar Temple",
    date: "Every Monday & Ekadashi",
    time: "08:00 AM - 11:30 AM",
    organizer: "Ujjain Veda Pathak Gurukul",
    phone: "+91 99263 77104",
    contactPerson: "Acharya Rameshwar Shastri",
    image:
      "https://imgs.search.brave.com/J8kzffXU07Y6cWYewjeP4yBTtXNlRr_2oM_DhKRN9-0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lbmNy/eXB0ZWQtdGJuMC5n/c3RhdGljLmNvbS9p/bWFnZXM_cT10Ym46/QU5kOUdjUkpBZUFW/cndFUmZaRWs2Tkty/a1kweEZlR2xIbjZW/T0RaeVAzUGpSblBh/bE9Kbk9sVmk",
    description:
      "51 Vedic Gurukul scholars perform simultaneous Shukla Yajurveda Rudrabhishekam with 11 sacred herbs, Panchamrut, and Gangajal for world peace and devotee prosperity.",
    highlights: [
      "Devotees can offer holy water (Jal) to Sphatik Lingam",
      "Energized Rudraksha & Raksha Sutra provided",
      "Insight into Lord Krishna's education at Sandipani",
      "Vedic chanting training workshop for youth",
    ],
    mapLocation: "Sandipani Ashram Road, Ujjain",
    entryFee: "Free Entry",
  },
  {
    id: "evt_05",
    title: "Nitya Mahakal Maha-Prasadam (Free Bhandara)",
    titleHi: "नित्य महाकाल महाप्रसाद अन्नक्षेत्र (निःशुल्क भण्डारा)",
    category: "Annakshetra Bhandara",
    categoryIcon: Utensils,
    venue: "Shri Mahakal Annakshetra, Bada Ganesh Marg",
    distance: "150m from Temple Gate 4",
    date: "Daily (Lunch & Dinner)",
    time: "11:30 AM - 03:30 PM & 07:30 PM - 10:00 PM",
    organizer: "Mahakaleshwar Mandir Bhakta Trust",
    phone: "+91 98270 99432",
    contactPerson: "Seva Incharge Shri Dinesh Vyas",
    image:
      "https://imgs.search.brave.com/kBsI1LQLzCOLmQrhNfxL7Oj3i1IrxtazbwP9g3_w_bA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudG9paW1nLmNv/bS90aHVtYi9tc2lk/LTEyODM5NTU2OSxp/bWdzaXplLTEwODkz/OCx3aWR0aC00MDAs/aGVpZ2h0LTIyNSxy/ZXNpemVtb2RlLTcy/LzEyODM5NTU2OS5q/cGc",
    description:
      "Continuous hygienic hot pure satvik meal (Desi Ghee Roti, Seasonal Sabzi, Dal Fry, Jeera Rice, Kheer/Halwa) served to thousands of visiting pilgrims free of cost daily.",
    highlights: [
      "100% Free Pure Satvik Meal served with warm hospitality",
      "Clean air-conditioned dining halls with capacity of 1000",
      "Priority seating for senior citizens & differently-abled",
      "Voluntary seva opportunity available for pilgrims",
    ],
    mapLocation: "Bada Ganesh Temple Road, Ujjain",
    entryFee: "Free for All",
  },
  {
    id: "evt_06",
    title: "Sunday Kal Bhairav Deepotsav & Imarti Utsav",
    titleHi: "रविवार काल भैरव दीपोत्सव एवं इमरती प्रसाद वितरण",
    category: "Utsav & Shows",
    categoryIcon: Sparkles,
    venue: "Shri Kal Bhairav Temple Premises",
    distance: "4.5 km from Mahakaleshwar Temple",
    date: "Every Sunday & Ashtami Tithi",
    time: "06:00 PM - 09:00 PM",
    organizer: "Bhairav Kshetra Seva Samiti",
    phone: "+91 94240 55123",
    contactPerson: "Pandit Harishchandra Pujari",
    image:
      "https://imgs.search.brave.com/qrTkknnWprBCclWfc0Z0DJ-7aJgocqcTO_RuavHY96U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9rYWwtYmhh/aXJhdi10ZW1wbGUt/dWpqYWluLW1hZGh5/YS0yNjBudy0xMDQw/MzE0NzA1LmpwZw",
    description:
      "Grand evening illumination of 501 traditional oil lamps at the ancient Kal Bhairav temple accompanied by special dhol tasha, nagada drums, and distribution of special hot Imarti prasad.",
    highlights: [
      "Illumination of 501 handmade terracotta diyas",
      "Fresh hot Imarti prasad served to all visiting devotees",
      "Special Sunday darshan queue management",
      "Traditional Dhol & Nagada devotional beats",
    ],
    mapLocation: "Kal Bhairav Temple Marg, Ujjain",
    entryFee: "Free Entry",
  },
  {
    id: "evt_07",
    title: "Rudra Sagar Water Screen Light & Sound Show",
    titleHi: "रूद्र सागर लाइट एवं साउण्ड हेरिटेज शो",
    category: "Utsav & Shows",
    categoryIcon: Sparkles,
    venue: "Rudra Sagar Lakefront Promenade",
    distance: "300m from Mahakaleshwar Temple",
    date: "Daily 2 Shows",
    time: "Show 1: 07:45 PM | Show 2: 08:45 PM",
    organizer: "Ujjain Smart City & MP Tourism",
    phone: "+91 734 2551200",
    contactPerson: "Ujjain Tourism Helpdesk",
    image:
      "https://imgs.search.brave.com/p1W362pdhLQnJAyP1oq-AgSjGu1LpjcpDuH_7oU_4Qk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zeW1w/aG9ueWZvdW50YWlu/cy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjUvMDYvMDFf/MV8xMXpvbl8xXzEx/em9uLTEtc2NhbGVk/LndlYnA",
    description:
      "Spectacular water fountain screen laser projection show depicting Samudra Manthan, descent of River Shipra, creation of Avantika Kshetra, and the history of Mahakaleshwar.",
    highlights: [
      "3D water curtain projection with surround sound",
      "Open lakeside promenade seating deck",
      "Free for all tourists and local pilgrims",
      "Hindi & English narration options",
    ],
    mapLocation: "Rudra Sagar Lakefront Promenade, Ujjain",
    entryFee: "Free Entry",
  },
  {
    id: "evt_08",
    title: "Nandi Mandapam Early Morning Kirtan",
    titleHi: "नंदी मंडपम प्रभाती कीर्तन एवं शिव तांडव स्तोत्र पाठ",
    category: "Bhajan & Music",
    categoryIcon: Music,
    venue: "Shri Mahakal Temple Outer Courtyard",
    distance: "Inside Mahakaleshwar Temple Complex",
    date: "Daily Early Morning",
    time: "05:30 AM - 07:00 AM",
    organizer: "Ujjain Mahakal Kirtan Mandal",
    phone: "+91 98262 33499",
    contactPerson: "Shri Gopal Krishna Samiti",
    image:
      "https://imgs.search.brave.com/TmMwihqxuOQaQsB3ZNNRi8bB5F7mX1HnGl9RmM8_j4M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy82/LzZhL1A1MjU0ODg5/JUUwJUI4JTlFJUUw/JUI4JTk5JUUwJUI4/JUExJUUwJUI4JUE3/JUUwJUI4JUIxJUUw/JUI4JTk5JUUwJUI5/JTgyJUUwJUI4JTg0/JUUwJUI4JUEzJUUw/JUI4JUIyJUUwJUI4/JThBLkpQRw",
    description:
      "Soul-stirring morning kirtan, Shiv Tandav Stotram chanting, and Ekadash Rudra recitation in the serene morning ambience right after Bhasma Aarti conclusions.",
    highlights: [
      "Open to all morning pilgrims right after Bhasma Aarti",
      "Harmonious group Shiv Tandav Stotra chanting",
      "Blessed Bhasma and Tulsi Gangajal prasad",
      "Calm, divine morning spiritual atmosphere",
    ],
    mapLocation: "Outer Courtyard, Mahakaleshwar Temple",
    entryFee: "Free Entry",
  },
  {
    id: "evt_09",
    title: "Mangalnath Bhaumik Shanti Yajna & Satsang",
    titleHi: "मंगलनाथ भौमिक शांति यज्ञ एवं ज्योतिष सत्संग",
    category: "Vedic Rituals",
    categoryIcon: Sun,
    venue: "Shri Mangalnath Temple Complex",
    distance: "3.8 km from Mahakaleshwar Temple",
    date: "Every Tuesday & Chaturthi",
    time: "09:00 AM - 01:00 PM",
    organizer: "Mangal Kshetra Jyotish Gurukul",
    phone: "+91 94253 11880",
    contactPerson: "Acharya Vikramaditya Joshi",
    image:
      "https://imgs.search.brave.com/VDfFLAOhV3mdl-1CzmYwFhr3CCBF0635wc2bkjxlSgU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90ZW1w/bGUueWF0cmFkaGFt/Lm9yZy9wdWJsaWMv/UHJvZHVjdC9wdWph/LXJpdHVhbHMvcHVq/YS1yaXR1YWxzX29m/MmdFMm5qXzIwMjUw/NTEwMTczNTMyMC5q/cGc",
    description:
      "Mass group Gayatri & Mangal Jaap for planetary peace, career prosperity, and removal of obstacles, conducted on the geographic birthplace of Mars (Mangal Graha).",
    highlights: [
      "Group Havan Fire Yajna participation for visiting pilgrims",
      "Free planetary harmony & astrology guidance desk",
      "Red flowers & sweet jaggery prasad distribution",
      "Sacred Shipra bank peaceful environment",
    ],
    mapLocation: "Mangalnath Temple Marg, Ujjain",
    entryFee: "Free Entry",
  },
];

export function LocalEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  const categories = [
    "All",
    "Bhajan & Music",
    "River Aarti",
    "Harikatha & Satsang",
    "Annakshetra Bhandara",
    "Vedic Rituals",
    "Utsav & Shows",
  ];

  const filteredEvents = LOCAL_EVENTS_DATA.filter((evt) => {
    const matchesCategory =
      selectedCategory === "All" || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.titleHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareEvent = (eventTitle) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this spiritual event near Mahakaleshwar Temple: ${eventTitle}`,
      );
      toast.success("Event details copied to clipboard!");
    } else {
      toast.success("Event shared!");
    }
  };

  return (
    <div
      className="bg-black min-vh-100 text-white pb-5"
      style={{ paddingTop: "110px" }}
    >
      <div className="container py-4 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1
            className={`display-4 fw-bold text-white mb-3 ${styles.playfairFont}`}
          >
            Local Devotional Programs Near Mahakal
          </h1>
          <p className="text-light opacity-80 max-w-2xl mx-auto fs-6">
            Discover Harikathas, Bhajan Sandhyas, Shipra Aartis, Annakshetra
            Bhandaras, and Satsangs happening around Shri Mahakaleshwar Temple.
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3 mb-4">
          {/* Search Input */}
          <div className="position-relative flex-grow-1 max-w-md">
            <Search
              size={18}
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-warning opacity-75"
            />
            <input
              type="text"
              className="form-control bg-dark bg-opacity-90 text-white border-secondary border-opacity-40 ps-5 py-2.5 rounded-pill placeholder-secondary"
              placeholder="Search event, venue, or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "0.88rem" }}
            />
            {searchTerm && (
              <button
                className="btn btn-link text-secondary position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs Scrollable */}
          <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 pb-md-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-pill px-3 py-2 text-nowrap transition-all ${
                  selectedCategory === cat
                    ? "btn-warning text-dark fw-bold shadow-sm"
                    : "btn-outline-secondary text-light border-opacity-30"
                }`}
                style={{ fontSize: "0.82rem" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Card Grid Section */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-5 my-5 border border-secondary border-opacity-25 rounded-4 p-5">
            <Calendar size={48} className="text-warning opacity-50 mb-3" />
            <h4 className="text-white fw-bold">No Local Events Found</h4>
            <p className="text-secondary small">
              Try adjusting your search terms or category filter to find local
              programs.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="btn btn-outline-warning btn-sm rounded-pill mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredEvents.map((evt) => {
              const CategoryIconComp = evt.categoryIcon || Calendar;
              return (
                <div key={evt.id} className="col-lg-4 col-md-6 col-12 d-flex">
                  <div className="card bg-dark text-white rounded-4 overflow-hidden border border-warning border-opacity-25 w-100 d-flex flex-column shadow-lg">
                    {/* Image Header */}
                    <div
                      className="position-relative flex-shrink-0"
                      style={{ height: "200px" }}
                    >
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(15,15,15,0.85) 100%)",
                        }}
                      />

                      {/* Top Badges */}
                      <div className="position-absolute top-0 start-0 end-0 p-3 d-flex align-items-center justify-content-between">
                        <span
                          className="badge bg-warning text-dark font-bold px-2.5 py-1.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-1"
                          style={{ fontSize: "0.76rem" }}
                        >
                          <CategoryIconComp size={12} />
                          <span>{evt.category}</span>
                        </span>
                        <span
                          className="badge bg-black bg-opacity-80 text-success border border-success border-opacity-50 px-2.5 py-1.5 rounded-pill shadow-sm"
                          style={{ fontSize: "0.74rem" }}
                        >
                          {evt.entryFee}
                        </span>
                      </div>

                      {/* Distance Tag Overlay */}
                      <div className="position-absolute bottom-0 start-0 end-0 p-3">
                        <div className="d-inline-flex align-items-center gap-1.5 bg-black bg-opacity-75 text-warning px-2.5 py-1 rounded-pill small border border-warning border-opacity-30">
                          <Compass size={14} className="flex-shrink-0" />
                          <span
                            className="fw-semibold"
                            style={{ fontSize: "0.78rem" }}
                          >
                            {evt.distance}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      {/* Event Title */}
                      <h5
                        className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                        style={{ fontSize: "1.15rem", lineHeight: 1.4 }}
                      >
                        {evt.title}
                      </h5>
                      <p
                        className="text-warning small fw-medium mb-3"
                        style={{ fontSize: "0.84rem" }}
                      >
                        {evt.titleHi}
                      </p>

                      {/* Schedule Info Box */}
                      <div className="bg-black bg-opacity-60 rounded-3 p-3 mb-3 border border-secondary border-opacity-25">
                        <div
                          className="d-flex align-items-center gap-2 text-warning fw-semibold small mb-1.5"
                          style={{ fontSize: "0.84rem" }}
                        >
                          <Clock size={15} className="flex-shrink-0" />
                          <span>{evt.time}</span>
                        </div>
                        <div
                          className="d-flex align-items-center gap-2 text-light opacity-80 small mb-1.5"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <Calendar size={14} className="flex-shrink-0" />
                          <span>{evt.date}</span>
                        </div>
                        <div
                          className="d-flex align-items-center gap-2 text-light opacity-90 small"
                          style={{ fontSize: "0.82rem" }}
                        >
                          <MapPin
                            size={14}
                            className="text-warning flex-shrink-0"
                          />
                          <span className="text-truncate">{evt.venue}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-light opacity-80 small mb-3 flex-grow-1"
                        style={{ fontSize: "0.86rem", lineHeight: 1.55 }}
                      >
                        {evt.description}
                      </p>

                      {/* Key Highlights */}
                      <div className="mb-3">
                        <div className="d-flex flex-column gap-1.5">
                          {evt.highlights.slice(0, 2).map((hl, idx) => (
                            <div
                              key={idx}
                              className="d-flex align-items-start gap-2 text-light opacity-90 small"
                            >
                              <CheckCircle
                                size={14}
                                className="text-warning flex-shrink-0 mt-0.5"
                              />
                              <span
                                style={{ fontSize: "0.8rem", lineHeight: 1.35 }}
                              >
                                {hl}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Organizer & Action Buttons Footer */}
                      <div className="mt-auto pt-3 border-top border-secondary border-opacity-25">
                        <div className="mb-3">
                          <small
                            className="text-secondary d-block mb-0.5"
                            style={{
                              fontSize: "0.72rem",
                              letterSpacing: "0.05em",
                            }}
                          >
                            ORGANIZER / CONTACT
                          </small>
                          <strong
                            className="text-white small d-block text-truncate"
                            style={{ fontSize: "0.84rem" }}
                          >
                            {evt.organizer}
                          </strong>
                        </div>

                        {/* Action Buttons Stack */}
                        <div className="d-flex flex-column gap-2">
                          <a
                            href={`tel:${evt.phone.replace(/\s+/g, "")}`}
                            className="btn btn-warning text-dark fw-bold btn-sm rounded-pill py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm transition-all hover-scale"
                            style={{ fontSize: "0.86rem" }}
                            title={`Call ${evt.contactPerson}`}
                          >
                            <Phone size={15} />
                            <span>Call {evt.phone}</span>
                          </a>

                          <button
                            onClick={() => setActiveModalEvent(evt)}
                            className="btn btn-outline-warning btn-sm rounded-pill py-2 d-flex align-items-center justify-content-center gap-1.5 font-medium transition-all"
                            style={{ fontSize: "0.82rem" }}
                          >
                            <Info size={15} />
                            <span>Full Program Schedule</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Program Schedule Modal */}
        <AnimatePresence>
          {activeModalEvent && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1065 }}
              onClick={() => setActiveModalEvent(null)}
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg px-3"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="modal-content bg-dark text-white border border-warning border-opacity-30 rounded-4 overflow-hidden shadow-2xl"
                >
                  {/* Modal Banner Image */}
                  <div
                    className="position-relative overflow-hidden"
                    style={{ height: "230px" }}
                  >
                    <img
                      src={activeModalEvent.image}
                      alt={activeModalEvent.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(18,18,18,1) 100%)",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-close btn-close-white position-absolute top-0 end-0 m-3 p-2 bg-black bg-opacity-60 rounded-circle"
                      onClick={() => setActiveModalEvent(null)}
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-4">
                      <span className="badge bg-warning text-dark font-bold px-3 py-1 rounded-pill mb-2">
                        {activeModalEvent.category}
                      </span>
                      <h3
                        className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                      >
                        {activeModalEvent.title}
                      </h3>
                      <p className="text-warning font-semibold small mb-0">
                        {activeModalEvent.titleHi}
                      </p>
                    </div>
                  </div>

                  {/* Modal Content Body */}
                  <div className="modal-body p-4">
                    {/* Time & Venue Cards */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <div className="bg-black p-3 rounded-3 border border-secondary border-opacity-25 h-100">
                          <small className="text-secondary d-block mb-1">
                            SCHEDULE & TIMINGS
                          </small>
                          <div className="d-flex align-items-center gap-2 text-warning fw-bold">
                            <Clock size={16} />
                            <span>{activeModalEvent.time}</span>
                          </div>
                          <small className="text-light opacity-80 d-block mt-1">
                            {activeModalEvent.date}
                          </small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="bg-black p-3 rounded-3 border border-secondary border-opacity-25 h-100">
                          <small className="text-secondary d-block mb-1">
                            VENUE & LOCATION
                          </small>
                          <div className="d-flex align-items-center gap-2 text-white font-semibold">
                            <MapPin
                              size={16}
                              className="text-warning flex-shrink-0"
                            />
                            <span>{activeModalEvent.venue}</span>
                          </div>
                          <small className="text-warning d-block mt-1">
                            <Compass size={13} className="me-1" />
                            {activeModalEvent.distance}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* About Program */}
                    <h5 className="text-warning fw-bold mb-2">
                      About the Program
                    </h5>
                    <p
                      className="text-light opacity-90 small mb-4"
                      style={{ lineHeight: 1.6 }}
                    >
                      {activeModalEvent.description}
                    </p>

                    {/* Key Highlights for Devotees */}
                    <h5 className="text-warning fw-bold mb-2">
                      Key Highlights for Devotees
                    </h5>
                    <div className="row g-2 mb-4">
                      {activeModalEvent.highlights.map((hl, idx) => (
                        <div
                          key={idx}
                          className="col-md-6 d-flex align-items-start gap-2 text-light small"
                        >
                          <CheckCircle
                            size={15}
                            className="text-warning flex-shrink-0 mt-0.5"
                          />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Organizer Contact Action Box */}
                    <div className="bg-black p-3.5 rounded-3 border border-warning border-opacity-30">
                      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                          <small className="text-secondary d-block">
                            ORGANIZING SAMITI / TRUST
                          </small>
                          <h6 className="text-white fw-bold mb-0 mt-0.5">
                            {activeModalEvent.organizer}
                          </h6>
                          <small className="text-warning opacity-90">
                            {activeModalEvent.contactPerson}
                          </small>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <a
                            href={`tel:${activeModalEvent.phone.replace(/\s+/g, "")}`}
                            className="btn btn-warning text-dark rounded-pill px-4 py-2 font-bold d-inline-flex align-items-center gap-2 shadow"
                          >
                            <Phone size={16} />
                            <span>Call {activeModalEvent.phone}</span>
                          </a>
                          <button
                            onClick={() =>
                              handleShareEvent(activeModalEvent.title)
                            }
                            className="btn btn-outline-secondary text-light rounded-circle p-2"
                            title="Share Event Details"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer border-top border-secondary border-opacity-25 p-3">
                    <button
                      type="button"
                      className="btn btn-outline-warning rounded-pill px-4"
                      onClick={() => setActiveModalEvent(null)}
                    >
                      Close Details
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
