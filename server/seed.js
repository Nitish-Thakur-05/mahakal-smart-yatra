require("dotenv").config();
const mongoose = require("mongoose");
const Temple = require("./models/Temple");
const Event = require("./models/Event");
const Hotel = require("./models/Hotel");
const Itinerary = require("./models/Itinerary");
const User = require("./models/User");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mahakal_db";

const initialTemples = [
  {
    id: "shri-mahakaleshwar",
    name: "Shri Mahakaleshwar Jyotirlinga",
    title: "Shri Mahakaleshwar Jyotirlinga",
    tagline: "The Sovereign Lord of Time & Dakshinamukhi Jyotirlinga",
    location: "Mahakal Marg, Ujjain, Madhya Pradesh 456001",
    city: "Ujjain",
    coordinates: { lat: 23.1827, lng: 75.7682 },
    images: [
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1200",
    description:
      "Shri Mahakaleshwar Temple is one of the 12 sacred Jyotirlingas in India. It is unique as the only south-facing (Dakshinamukhi) Jyotirlinga, symbolizing authority over death and time. Famous worldwide for its early morning 4:00 AM Bhasma Aarti.",
    detailedHistory:
      "According to Hindu Puranas, Lord Shiva manifested here as Mahakal to protect his devotees from the demon Dushan. The temple complex is a three-tiered structure housing Lord Mahakaleshwar at the base, Omkareshwar Mahadev in the middle tier, and Nagchandreshwar at the topmost tier which opens only once a year on Nag Panchami.",
    highlight: "360° Virtual Tour & Bhasma Aarti Booking",
    timings: "04:00 AM - 11:00 PM Daily",
    virtualTourUrl: "https://my.matterport.com/show/?m=sample360mahakal",
    facilities: [
      "Bhasma Aarti Online Booking",
      "VIP Darshan Pass",
      "Prasadam Counter",
      "Locker Room",
      "Wheelchair Access",
    ],
    reviews: [
      {
        user: "Ramesh Sharma",
        rating: 5,
        comment: "Experiencing Bhasma Aarti was divine and soul-stirring.",
      },
      {
        user: "Priya Patel",
        rating: 5,
        comment: "The Mahakal Lok Corridor design is breathtaking.",
      },
    ],
  },
  {
    id: "kal-bhairav",
    name: "Kal Bhairav Temple",
    title: "Kal Bhairav Temple",
    tagline: "Guardian Deity of Ancient Ujjain",
    location: "Jail Road, Bhairav Garh, Ujjain 456003",
    city: "Ujjain",
    coordinates: { lat: 23.2125, lng: 75.7661 },
    images: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200",
    description:
      "Dedicated to Kal Bhairav, the fierce manifestation of Lord Shiva associated with protection. Known for the unique ancient ritual where liquor offerings are poured into the deity's mouth.",
    detailedHistory:
      "Mentioned in the Skanda Purana, Kal Bhairav was appointed guardian commander of Avantika (Ujjain). Pilgrims traditionally visit Kal Bhairav after Mahakaleshwar to complete their pilgrimage.",
    highlight: "Ancient Tantric Shrine & Shipra Ghat View",
    timings: "05:00 AM - 10:00 PM Daily",
    virtualTourUrl: "",
    facilities: ["Puja Samagri Stalls", "Parking Available", "Shoe Counter"],
    reviews: [
      {
        user: "Amit Varma",
        rating: 5,
        comment: "Fascinating tradition and powerful spiritual energy.",
      },
    ],
  },
  {
    id: "harsiddhi-mata",
    name: "Harsiddhi Mata Temple",
    title: "Harsiddhi Mata Temple",
    tagline: "Sacred 51 Shaktipeeth & Deepstambha Glow",
    location: "Near Mahakal Temple, Ujjain 456001",
    city: "Ujjain",
    coordinates: { lat: 23.1812, lng: 75.7668 },
    images: [
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=1200",
    description:
      "One of the 51 holy Shaktipeeths where Goddess Sati's elbow fell. Famous for two imposing 13th-century stone lamp towers (Deepstambha) illuminated with hundreds of diyas during evening Aarti.",
    detailedHistory:
      "King Vikramaditya worshipped Harsiddhi Devi as his family deity. Historical records state Vikramaditya offered his head to Goddess Harsiddhi eleven times, restored each time by her grace.",
    highlight: "Evening Deepstambha Lighting Ritual",
    timings: "05:00 AM - 11:00 PM Daily",
    facilities: [
      "Deepstambha Lighting Booking",
      "Annakshetra Prasad",
      "Direct Pathway from Mahakal Lok",
    ],
    reviews: [
      {
        user: "Sneha Gupta",
        rating: 5,
        comment: "The evening lamp tower lighting is mesmerising!",
      },
    ],
  },
  {
    id: "chintaman-ganesh",
    name: "Chintaman Ganesh Temple",
    title: "Chintaman Ganesh Temple",
    tagline: "Remover of All Sorrows & Worries",
    location: "Fatehabad Road, Ujjain 456006",
    city: "Ujjain",
    coordinates: { lat: 23.1645, lng: 75.7362 },
    images: [
      "https://images.unsplash.com/photo-1567591370504-20b1e428cf11?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1567591370504-20b1e428cf11?auto=format&fit=crop&q=80&w=1200",
    description:
      "Houses a self-manifested idol of Lord Ganesha flanked by Riddhi and Siddhi. Devotees pray here to dissolve worries (Chinta) and receive blessings for new endeavors.",
    detailedHistory:
      "Built during the Paramara era, the shrine features ancient carved pillars and an auspicious sanctum dating back to the 11th century.",
    highlight: "Self-Manifested Swayambhu Ganesha Idol",
    timings: "06:00 AM - 09:30 PM Daily",
    facilities: ["Car Parking", "Modak Prasad Counters", "Sitting Courtyard"],
    reviews: [],
  },
  {
    id: "mangalnath-temple",
    name: "Mangalnath Temple",
    title: "Mangalnath Temple",
    tagline: "Vedic Birthplace of Planet Mars",
    location: "Mangalnath Marg, Ujjain 456003",
    city: "Ujjain",
    coordinates: { lat: 23.2189, lng: 75.7725 },
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    description:
      "Situated on the banks of Shipra River, this temple is revered in astrological texts as the birthplace of planet Mars (Mangal). Renowned worldwide for Bhaum Seva & Mangal Dosh Nivaran Pujas.",
    detailedHistory:
      "In ancient Indian geography, Ujjain intersected the Prime Meridian (Tropic of Cancer). Vedic astronomers calculated planetary coordinates from Mangalnath Hill.",
    highlight: "Mangal Dosh Shanti Puja & Astrological Consultation",
    timings: "06:00 AM - 09:00 PM Daily",
    facilities: ["Puja Slot Booking", "Pandit Ji Assistance", "Ghat Seating"],
    reviews: [],
  },
  {
    id: "sandipani-ashram",
    name: "Maharshi Sandipani Ashram",
    title: "Maharshi Sandipani Ashram",
    tagline: "Sacred Gurukul of Lord Krishna, Balarama & Sudama",
    location: "Mangalnath Road, Ujjain 456003",
    city: "Ujjain",
    coordinates: { lat: 23.2081, lng: 75.7758 },
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    ],
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
    description:
      "The historical ashram where Lord Krishna, Lord Balarama, and Sudama received education under Sage Sandipani. Lord Krishna mastered 64 Vidyas and 16 Kalas here in just 64 days.",
    detailedHistory:
      "Features the ancient Gomti Kund tank where Lord Krishna summoned waters from sacred rivers for his guru, and stone carvings depicting 64 arts.",
    highlight: "Gomti Kund & 64 Kala Display",
    timings: "07:00 AM - 08:00 PM Daily",
    facilities: ["Guided Heritage Walks", "Botanical Garden", "Library"],
    reviews: [],
  },
];

const initialEvents = [
  {
    id: "bhasma-aarti",
    title: "Daily Shri Mahakal Bhasma Aarti",
    category: "Daily Sacred Ritual",
    date: "Daily at 04:00 AM",
    time: "04:00 AM - 06:00 AM",
    location: "Shri Mahakaleshwar Temple Sanctum",
    image:
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=800",
    description:
      "The world-famous early morning Bhasma Aarti where Lord Mahakal is adorned with sacred ash accompanied by thunderous dhol, conch shells, and Vedic chants.",
    availableTickets: 250,
    price: 0,
    badge: "Mandatory Online Pass",
  },
  {
    id: "mahashivratri",
    title: "Mahashivratri Grand Mahotsav",
    category: "Annual Festival",
    date: "Feb 26 - Mar 06, 2026",
    time: "All Day & Night",
    location: "Mahakal Temple Complex & Mahakal Lok",
    image:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=800",
    description:
      "9-day Shiv Navratri celebrations culminating in Mahashivratri with continuous Jalabhishek, Sehra decoration, and millions of illuminated oil lamps.",
    availableTickets: 5000,
    price: 150,
    badge: "Grand Celebration",
  },
  {
    id: "sawan-swari",
    title: "Sawan Somvar Royal Palanquin Procession",
    category: "Seasonal Procession",
    date: "Every Monday of Sawan Month",
    time: "04:00 PM - 09:00 PM",
    location: "Ujjain Heritage Streets to Ram Ghat",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800",
    description:
      "Lord Mahakal rides in a golden palanquin (Swari) through the streets of Ujjain to give darshan to his citizens and receives a ceremonial dip at Ram Ghat.",
    availableTickets: 1000,
    price: 0,
    badge: "Royal Swari",
  },
];

const initialHotels = [
  {
    id: "hotel-mahakal-palace",
    name: "Hotel Mahakal Palace",
    location: "Near Mahakal Temple Gate 1, Ujjain",
    rating: 4.8,
    pricePerNight: 2499,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    amenities: [
      "Free High Speed Wi-Fi",
      "0.2 km to Temple",
      "Pure Veg Sattvik Dining",
      "24/7 Hot Water",
      "Bhasma Aarti Help Desk",
    ],
    roomTypes: [
      "Standard Double",
      "Deluxe Temple View",
      "Family Suite (4 Bed)",
    ],
  },
  {
    id: "shipra-residency",
    name: "Shipra Residency (MP Tourism)",
    location: "University Road, Near Shipra River, Ujjain",
    rating: 4.6,
    pricePerNight: 3200,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
    amenities: [
      "Garden View",
      "Multi-Cuisine Restaurant",
      "Swimming Pool",
      "Spacious Parking",
      "Travel Desk",
    ],
    roomTypes: ["AC Deluxe Room", "Executive Suite"],
  },
];

const initialItineraries = [
  {
    id: 1,
    days: "1 Day",
    title: "1-Day Express Mahakal & Bhasma Aarti Circuit",
    destination: "Mahakal Temple & Shipra Ghats",
    description:
      "Experience 4 AM Bhasma Aarti, explore Mahakal Lok Corridor, visit Harsiddhi Temple, and attend Shipra Evening Aarti.",
    image:
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 2,
    days: "2 Days",
    title: "2-Day Jyotirlinga & Shaktipeeth Pilgrimage",
    destination: "Ujjain & Omkareshwar Excursion",
    description:
      "Day 1 in Mahakaleshwar & Harsiddhi. Day 2 trip to Omkareshwar Jyotirlinga along Narmada River.",
    image:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    days: "3 Days",
    title: "3-Day Ujjain Heritage & Astrological Trail",
    destination: "Full Avantika Tour",
    description:
      "Covers Mahakaleshwar, Kal Bhairav, Mangalnath, Sandipani Ashram, Jantar Mantar observatory, and Chintaman Ganesh.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // Clear existing collection data in MongoDB
    await Temple.deleteMany({});
    await Event.deleteMany({});
    await Hotel.deleteMany({});
    await Itinerary.deleteMany({});

    // Seed new data directly into MongoDB
    await Temple.insertMany(initialTemples);
    await Event.insertMany(initialEvents);
    await Hotel.insertMany(initialHotels);
    await Itinerary.insertMany(initialItineraries);

    // Seed Mahakal Admin User
    let adminUser = await User.findOne({ email: "admin@mahakal.com" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Mahakal Administrator",
        email: "admin@mahakal.com",
        password: "admin123",
        role: "official",
        isApproved: true,
      });
      console.log("Seeded Mahakal Admin user: admin@mahakal.com / admin123");
    }

    // Seed sample Entry Passes for Visitor Analytics
    const EntryPass = require("./models/EntryPass");
    await EntryPass.deleteMany({});
    const samplePasses = [];
    const gates = [
      { num: 1, name: "Gate 1 - Bada Ganesh Dwar", dist: 850 },
      { num: 2, name: "Gate 2 - Nandi Dwar (Main Gate)", dist: 650 },
      { num: 3, name: "Gate 3 - VIP / Shankhadwar Gate", dist: 400 },
      { num: 4, name: "Gate 4 - Char Dham Dwar", dist: 1000 },
      { num: 5, name: "Gate 5 - Harsiddhi Gate", dist: 750 },
    ];
    const names = [
      "Rajesh Kumar",
      "Amit Sharma",
      "Priya Verma",
      "Sunil Joshi",
      "Ananya Gupta",
      "Vikas Patel",
      "Deepak Rao",
      "Meena Tiwari",
      "Suresh Yadav",
      "Kavita Mishra",
    ];
    const crowdLevels = ["Low", "Moderate", "High", "Festival Peak"];

    // Generate 40 representative sample pass bookings spread across past days, festival times, and hours
    const now = new Date();
    for (let i = 0; i < 45; i++) {
      const gate = gates[i % gates.length];
      const primaryName = names[i % names.length];
      const persons = (i % 5) + 1; // 1 to 5 persons
      const crowd = crowdLevels[i % crowdLevels.length];
      const isFest = i % 3 === 0;

      // Random date within last 6 months
      const randomMonthOffset = i % 6;
      const passDate = new Date(
        now.getFullYear(),
        now.getMonth() - randomMonthOffset,
        ((i * 2) % 25) + 1,
        (i * 3) % 24,
        15,
      );
      const validityMins = 120 + ((i * 10) % 90);
      const expiryDate = new Date(
        passDate.getTime() + validityMins * 60 * 1000,
      );
      const passId = `MPASS-2026-${100000 + i * 1234}`;

      samplePasses.push({
        passId,
        userId: adminUser._id,
        primaryDevoteeName: primaryName,
        contactPhone: `+91 98765${10000 + i}`,
        passengers: Array(persons)
          .fill(0)
          .map((_, idx) => ({
            name: idx === 0 ? primaryName : `${primaryName} Guest ${idx + 1}`,
            age: 20 + idx * 5,
            gender: idx % 2 === 0 ? "Male" : "Female",
            idProof: "Aadhar Card",
          })),
        numberOfPersons: persons,
        gateNumber: gate.num,
        gateName: gate.name,
        gateDistance: gate.dist,
        crowdLevel: crowd,
        entryTime: passDate,
        expiryTime: expiryDate,
        validityMins,
        isFestivalTime: isFest,
        status: i === 0 ? "active" : i % 4 === 0 ? "used" : "expired",
        qrPayload: JSON.stringify({
          passId,
          gateNo: gate.num,
          primaryDevotee: primaryName,
          personsCount: persons,
        }),
      });
    }

    await EntryPass.insertMany(samplePasses);
    console.log("Seeded 45 sample Mahakal Entry Passes for analytics!");

    console.log(
      "Successfully seeded all Mahakal Temple data directly into MongoDB!",
    );
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error("Error Seeding MongoDB:", err);
    if (require.main === module) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
