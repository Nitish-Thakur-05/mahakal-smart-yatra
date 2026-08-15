// Central Live Analytics & Dynamic Booking Store Helper
const DEFAULT_AARTI_STATS = [
  { id: "bhasma", name: "Shri Mahakal Bhasma Aarti", time: "04:00 AM - 06:00 AM", capacity: 1500, sold: 1358, left: 142, status: "High Surge" },
  { id: "dadhodak", name: "Dadhodak Aarti (Naivedya Aarti)", time: "07:30 AM - 08:15 AM", capacity: 2500, sold: 2020, left: 480, status: "Seats Available" },
  { id: "bhog", name: "Shri Mahakal Bhog Aarti", time: "10:30 AM - 11:30 AM", capacity: 3000, sold: 2080, left: 920, status: "Seats Available" },
  { id: "sandhya", name: "Sandhya Aarti", time: "05:00 PM - 06:00 PM", capacity: 2000, sold: 1690, left: 310, status: "Filling Fast" },
  { id: "shringar", name: "Sandhya Shringar Aarti", time: "07:00 PM - 08:00 PM", capacity: 2000, sold: 1470, left: 530, status: "Seats Available" },
  { id: "shayan", name: "Shri Mahakal Shayan Aarti", time: "10:30 PM - 11:00 PM", capacity: 1500, sold: 1285, left: 215, status: "Filling Fast" }
];

const DEFAULT_VIP_STATS = {
  "2026-08-12": {
    dayLabel: "Today (Wed, 12 Aug 2026)",
    totalPasses: 342,
    totalRevenue: 184500,
    packages: [
      { name: "Sheeta Dwar Fast-Track Pass", price: 250, sold: 185, gate: "Gate 4" },
      { name: "Protocol Garbhagriha View Pass", price: 750, sold: 94, gate: "Gate 1" },
      { name: "Special Abhishek & Rudrabhishek Pass", price: 1500, sold: 48, gate: "Gate 1" },
      { name: "Royal Family & NRI Protocol Pass", price: 2500, sold: 15, gate: "VVIP Lounge" },
    ]
  },
  "2026-08-13": {
    dayLabel: "Tomorrow (Thu, 13 Aug 2026)",
    totalPasses: 410,
    totalRevenue: 226000,
    packages: [
      { name: "Sheeta Dwar Fast-Track Pass", price: 250, sold: 220, gate: "Gate 4" },
      { name: "Protocol Garbhagriha View Pass", price: 750, sold: 110, gate: "Gate 1" },
      { name: "Special Abhishek & Rudrabhishek Pass", price: 1500, sold: 62, gate: "Gate 1" },
      { name: "Royal Family & NRI Protocol Pass", price: 2500, sold: 18, gate: "VVIP Lounge" },
    ]
  },
  "2026-08-14": {
    dayLabel: "Fri, 14 Aug 2026 (Eve of Holiday)",
    totalPasses: 580,
    totalRevenue: 345000,
    packages: [
      { name: "Sheeta Dwar Fast-Track Pass", price: 250, sold: 310, gate: "Gate 4" },
      { name: "Protocol Garbhagriha View Pass", price: 750, sold: 160, gate: "Gate 1" },
      { name: "Special Abhishek & Rudrabhishek Pass", price: 1500, sold: 85, gate: "Gate 1" },
      { name: "Royal Family & NRI Protocol Pass", price: 2500, sold: 25, gate: "VVIP Lounge" },
    ]
  },
  "2026-08-15": {
    dayLabel: "Sat, 15 Aug 2026 (Festive Peak Surge)",
    totalPasses: 750,
    totalRevenue: 492500,
    packages: [
      { name: "Sheeta Dwar Fast-Track Pass", price: 250, sold: 400, gate: "Gate 4" },
      { name: "Protocol Garbhagriha View Pass", price: 750, sold: 210, gate: "Gate 1" },
      { name: "Special Abhishek & Rudrabhishek Pass", price: 1500, sold: 105, gate: "Gate 1" },
      { name: "Royal Family & NRI Protocol Pass", price: 2500, sold: 35, gate: "VVIP Lounge" },
    ]
  },
  "2026-08-16": {
    dayLabel: "Sun, 16 Aug 2026",
    totalPasses: 620,
    totalRevenue: 388000,
    packages: [
      { name: "Sheeta Dwar Fast-Track Pass", price: 250, sold: 340, gate: "Gate 4" },
      { name: "Protocol Garbhagriha View Pass", price: 750, sold: 175, gate: "Gate 1" },
      { name: "Special Abhishek & Rudrabhishek Pass", price: 1500, sold: 83, gate: "Gate 1" },
      { name: "Royal Family & NRI Protocol Pass", price: 2500, sold: 22, gate: "VVIP Lounge" },
    ]
  }
};

const DEFAULT_ROOM_STATS = [
  {
    id: "surya-vyas",
    property: "Pt. Surya Narayan Vyas Atithi Niwas",
    type: "Official Temple Trust Stay (Sanctum Complex)",
    totalRooms: 50,
    filledRooms: 42,
    leftRooms: 8,
    occupancyPct: 84
  },
  {
    id: "mahakal-atithi",
    property: "Shri Mahakaleshwar Atithi Niwas",
    type: "Temple Trust Annex Stay (Nandi Hall Marg)",
    totalRooms: 70,
    filledRooms: 55,
    leftRooms: 15,
    occupancyPct: 78.5
  },
  {
    id: "shipra-residency",
    property: "Shipra Residency (MP Tourism Resort)",
    type: "State Tourism Partner Stay",
    totalRooms: 35,
    filledRooms: 28,
    leftRooms: 7,
    occupancyPct: 80
  },
  {
    id: "mahakal-palace",
    property: "Hotel Mahakal Palace",
    type: "Deluxe Partner Hotel",
    totalRooms: 25,
    filledRooms: 17,
    leftRooms: 8,
    occupancyPct: 68
  }
];

export const getAartiStats = () => {
  try {
    const saved = localStorage.getItem("mahakal_aarti_analytics");
    return saved ? JSON.parse(saved) : DEFAULT_AARTI_STATS;
  } catch {
    return DEFAULT_AARTI_STATS;
  }
};

export const recordAartiBooking = (aartiId, ticketsCount = 1) => {
  const stats = getAartiStats();
  const updated = stats.map((a) => {
    if (a.id === aartiId || a.name.toLowerCase().includes(aartiId.toLowerCase())) {
      const newSold = a.sold + ticketsCount;
      const newLeft = Math.max(0, a.capacity - newSold);
      return {
        ...a,
        sold: newSold,
        left: newLeft,
        status: newLeft < 100 ? "High Surge (Closing)" : newLeft < 300 ? "Filling Fast" : a.status
      };
    }
    return a;
  });
  localStorage.setItem("mahakal_aarti_analytics", JSON.stringify(updated));
  window.dispatchEvent(new Event("mahakal_stats_updated"));
  return updated;
};

export const getVipStats = () => {
  try {
    const saved = localStorage.getItem("mahakal_vip_analytics");
    return saved ? JSON.parse(saved) : DEFAULT_VIP_STATS;
  } catch {
    return DEFAULT_VIP_STATS;
  }
};

export const recordVipBooking = (dateKey, pkgName, price, passesCount = 1) => {
  const stats = getVipStats();
  const key = stats[dateKey] ? dateKey : "2026-08-12";
  const dayData = stats[key];
  if (dayData) {
    dayData.totalPasses += passesCount;
    dayData.totalRevenue += price * passesCount;
    const pkg = dayData.packages.find((p) => p.name === pkgName || p.name.includes(pkgName));
    if (pkg) {
      pkg.sold += passesCount;
    }
  }
  localStorage.setItem("mahakal_vip_analytics", JSON.stringify(stats));
  window.dispatchEvent(new Event("mahakal_stats_updated"));
  return stats;
};

export const getRoomStats = () => {
  try {
    const saved = localStorage.getItem("mahakal_room_analytics");
    return saved ? JSON.parse(saved) : DEFAULT_ROOM_STATS;
  } catch {
    return DEFAULT_ROOM_STATS;
  }
};

export const recordRoomBooking = (stayName) => {
  const stats = getRoomStats();
  const updated = stats.map((r) => {
    if (r.property.toLowerCase().includes(stayName.toLowerCase()) || stayName.toLowerCase().includes(r.property.toLowerCase())) {
      const newFilled = Math.min(r.totalRooms, r.filledRooms + 1);
      const newLeft = Math.max(0, r.totalRooms - newFilled);
      const newPct = Math.round((newFilled / r.totalRooms) * 100);
      return {
        ...r,
        filledRooms: newFilled,
        leftRooms: newLeft,
        occupancyPct: newPct
      };
    }
    return r;
  });
  localStorage.setItem("mahakal_room_analytics", JSON.stringify(updated));
  window.dispatchEvent(new Event("mahakal_stats_updated"));
  return updated;
};
