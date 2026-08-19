import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ShieldCheck,
  Users,
  Building,
  Compass,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Clock,
  Megaphone,
  Save,
  Eye,
  CheckCircle2,
  MapPin,
  HelpCircle,
  AlertTriangle,
  Lock,
  Ticket,
  Calendar,
  Crown,
  Bed,
  Filter,
  BarChart3,
  TrendingUp,
  Building2,
  DollarSign,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  getAartiStats,
  getVipStats,
  getRoomStats,
} from "../utils/bookingStats";
import styles from "../styles/custom.module.css";

const DAILY_VIP_ANALYTICS = {
  "2026-08-12": {
    dayLabel: "Today (Wed, 12 Aug 2026)",
    totalPasses: 342,
    totalRevenue: 184500,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 185,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 94,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 48,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 15,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-13": {
    dayLabel: "Tomorrow (Thu, 13 Aug 2026)",
    totalPasses: 410,
    totalRevenue: 226000,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 220,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 110,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 62,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 18,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-14": {
    dayLabel: "Fri, 14 Aug 2026 (Eve of Holiday)",
    totalPasses: 580,
    totalRevenue: 345000,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 310,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 160,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 85,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 25,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-15": {
    dayLabel: "Sat, 15 Aug 2026 (Festive Peak Surge)",
    totalPasses: 750,
    totalRevenue: 492500,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 400,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 210,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 105,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 35,
        gate: "VVIP Lounge",
      },
    ],
  },
  "2026-08-16": {
    dayLabel: "Sun, 16 Aug 2026",
    totalPasses: 620,
    totalRevenue: 388000,
    packages: [
      {
        name: "Sheeta Dwar Fast-Track Pass",
        price: 250,
        sold: 340,
        gate: "Gate 4",
      },
      {
        name: "Protocol Garbhagriha View Pass",
        price: 750,
        sold: 175,
        gate: "Gate 1",
      },
      {
        name: "Special Abhishek & Rudrabhishek Pass",
        price: 1500,
        sold: 83,
        gate: "Gate 1",
      },
      {
        name: "Royal Family & NRI Protocol Pass",
        price: 2500,
        sold: 22,
        gate: "VVIP Lounge",
      },
    ],
  },
};

const AARTI_PASS_ANALYTICS = [
  {
    id: "bhasma",
    name: "Shri Mahakal Bhasma Aarti",
    time: "04:00 AM - 06:00 AM",
    capacity: 1500,
    sold: 1358,
    left: 142,
    status: "High Surge",
  },
  {
    id: "dadhodak",
    name: "Dadhodak Aarti (Naivedya Aarti)",
    time: "07:30 AM - 08:15 AM",
    capacity: 2500,
    sold: 2020,
    left: 480,
    status: "Seats Available",
  },
  {
    id: "bhog",
    name: "Shri Mahakal Bhog Aarti",
    time: "10:30 AM - 11:30 AM",
    capacity: 3000,
    sold: 2080,
    left: 920,
    status: "Seats Available",
  },
  {
    id: "sandhya",
    name: "Sandhya Aarti",
    time: "05:00 PM - 06:00 PM",
    capacity: 2000,
    sold: 1690,
    left: 310,
    status: "Filling Fast",
  },
  {
    id: "shringar",
    name: "Sandhya Shringar Aarti",
    time: "07:00 PM - 08:00 PM",
    capacity: 2000,
    sold: 1470,
    left: 530,
    status: "Seats Available",
  },
  {
    id: "shayan",
    name: "Shri Mahakal Shayan Aarti",
    time: "10:30 PM - 11:00 PM",
    capacity: 1500,
    sold: 1285,
    left: 215,
    status: "Filling Fast",
  },
];

const ROOM_OCCUPANCY_ANALYTICS = [
  {
    property: "Pt. Surya Narayan Vyas Atithi Niwas",
    type: "Official Temple Trust Stay (Sanctum Complex)",
    totalRooms: 50,
    filledRooms: 42,
    leftRooms: 8,
    occupancyPct: 84,
  },
  {
    property: "Shri Mahakaleshwar Atithi Niwas",
    type: "Temple Trust Annex Stay (Nandi Hall Marg)",
    totalRooms: 70,
    filledRooms: 55,
    leftRooms: 15,
    occupancyPct: 78.5,
  },
  {
    property: "Shipra Residency (MP Tourism Resort)",
    type: "State Tourism Partner Stay",
    totalRooms: 35,
    filledRooms: 28,
    leftRooms: 7,
    occupancyPct: 80,
  },
  {
    property: "Hotel Mahakal Palace",
    type: "Deluxe Partner Hotel",
    totalRooms: 25,
    filledRooms: 17,
    leftRooms: 8,
    occupancyPct: 68,
  },
];

export function AdminDashboard({ user, onOpenAuth }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    pendingHotels: 0,
    totalTemples: 0,
  });
  const [usersList, setUsersList] = useState([]);
  const [templesList, setTemplesList] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedDate, setSelectedDate] = useState("today");

  const [inventoryRange, setInventoryRange] = useState("today");
  const [inventoryData, setInventoryData] = useState(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(
    new Date().toISOString().substring(0, 10),
  );

  const dateInputRef = useRef(null);

  const handleCalendarIconClick = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const fetchInventoryAnalytics = async (range = inventoryRange) => {
    try {
      const res = await axios.get(
        `/api/passes/inventory-analytics?range=${range}`,
      );
      if (res.data) {
        setInventoryData(res.data);
      }
    } catch (err) {
      console.error("Error fetching inventory analytics:", err);
    }
  };

  const handleInventoryRangeChange = async (newRange) => {
    setInventoryRange(newRange);
    await fetchInventoryAnalytics(newRange);
  };

  const handleDateSelect = async (customDateStr) => {
    setSelectedCalendarDate(customDateStr);
    setInventoryRange("custom");
    try {
      const res = await axios.get(
        `/api/passes/inventory-analytics?date=${customDateStr}`,
      );
      if (res.data) setInventoryData(res.data);
    } catch (e) {
      console.error("Failed to load inventory for date", customDateStr, e);
    }
  };

  // Generate date options for the past 30 days
  const past30DaysOptions = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isoStr = d.toISOString().substring(0, 10);
      const label =
        i === 0
          ? "Today (Resets Daily)"
          : i === 1
            ? "Yesterday"
            : d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
      days.push({ dateStr: isoStr, label });
    }
    return days;
  }, []);

  const [aartiAnalytics, setAartiAnalytics] = useState(getAartiStats());
  const [vipAnalytics, setVipAnalytics] = useState(getVipStats());
  const [roomAnalytics, setRoomAnalytics] = useState(getRoomStats());

  useEffect(() => {
    const handleUpdate = () => {
      setAartiAnalytics(getAartiStats());
      setVipAnalytics(getVipStats());
      setRoomAnalytics(getRoomStats());
    };
    handleUpdate();
    window.addEventListener("mahakal_stats_updated", handleUpdate);
    return () =>
      window.removeEventListener("mahakal_stats_updated", handleUpdate);
  }, []);

  const [siteAlert, setSiteAlert] = useState({
    message:
      "🚩 OFFICIAL ANNOUNCEMENT: Shri Mahakaleshwar Temple Bhasma Aarti online booking for upcoming festival season is open. Please carry original Photo ID for entry.",
    isActive: true,
    alertType: "warning",
    speed: 25,
  });
  const [savingAlert, setSavingAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [adminNotices, setAdminNotices] = useState([]);
  const [postingNotice, setPostingNotice] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "Gate Status",
    status: "Open",
    gateName: "",
    location: "Shri Mahakaleshwar Temple Premises",
    reason: "",
    description: "",
    priority: "Normal",
  });

  const [showAddTempleModal, setShowAddTempleModal] = useState(false);
  const [newTemple, setNewTemple] = useState({
    id: "",
    name: "",
    title: "",
    location: "Ujjain, Madhya Pradesh",
    description: "",
    highlight: "360° Virtual Darshan",
    timings: "05:00 AM - 10:00 PM Daily",
    image:
      "https://images.unsplash.com/photo-1627894006596-9b057508007a?auto=format&fit=crop&q=80&w=1200",
  });

  const [passAnalytics, setPassAnalytics] = useState(null);
  const [chronosForecast, setChronosForecast] = useState(null);
  const [loadingChronos, setLoadingChronos] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setLoadingChronos(true);
    try {
      const [
        statsRes,
        usersRes,
        templesRes,
        alertRes,
        noticesRes,
        ticketsRes,
        passAnalyticsRes,
        chronosRes,
        inventoryRes,
      ] = await Promise.all([
        axios.get("/api/admin/stats"),
        axios.get("/api/admin/users"),
        axios.get("/api/temples"),
        axios.get("/api/admin/alert"),
        axios.get("/api/announcements"),
        axios.get("/api/support/admin").catch(() => ({ data: [] })),
        axios.get("/api/passes/analytics").catch(() => ({ data: null })),
        axios
          .get("/api/admin/crowd/forecast-public?refresh=true")
          .catch(() => ({ data: null })),
        axios
          .get(`/api/passes/inventory-analytics?date=${selectedCalendarDate}`)
          .catch(() => ({ data: null })),
      ]);
      setStats(statsRes.data);
      const cleanUsers = (usersRes.data || []).map((u) => ({
        ...u,
        name: u.name ? u.name.replace(/Sancthan/g, "Mahakal") : u.name,
      }));
      setUsersList(cleanUsers);
      setTemplesList(templesRes.data || []);
      if (alertRes.data) setSiteAlert(alertRes.data);
      setAdminNotices(Array.isArray(noticesRes.data) ? noticesRes.data : []);
      setSupportTickets(Array.isArray(ticketsRes.data) ? ticketsRes.data : []);
      if (passAnalyticsRes && passAnalyticsRes.data)
        setPassAnalytics(passAnalyticsRes.data);
      if (chronosRes && chronosRes.data) setChronosForecast(chronosRes.data);
      if (inventoryRes && inventoryRes.data)
        setInventoryData(inventoryRes.data);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Access Denied. Administrator credentials required.",
      );
    } finally {
      setLoading(false);
      setLoadingChronos(false);
    }
  };

  useEffect(() => {
    fetchInventoryAnalytics("today");
    if (user && (user.role === "official" || user.role === "admin"))
      fetchAdminData();
  }, [user]);

  const handleToggleApproval = async (userId) => {
    try {
      const res = await axios.patch(`/api/admin/users/${userId}/approve`);
      toast.success(res.data.message);
      fetchAdminData();
    } catch {
      toast.error("Failed to update approval status.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success("Account deleted.");
      fetchAdminData();
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const handleDeleteTemple = async (templeId) => {
    if (!window.confirm("Remove this shrine from directory?")) return;
    try {
      await axios.delete(`/api/admin/temples/${templeId}`);
      toast.success("Shrine removed.");
      fetchAdminData();
    } catch {
      toast.error("Failed to delete shrine.");
    }
  };

  const handleAddTempleSubmit = async (e) => {
    e.preventDefault();
    try {
      const slugId =
        newTemple.id || newTemple.name.toLowerCase().replace(/\s+/g, "-");
      await axios.post("/api/admin/temples", { ...newTemple, id: slugId });
      toast.success("Shrine registered!");
      setShowAddTempleModal(false);
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add shrine.");
    }
  };

  const handleSaveSiteAlert = async (e) => {
    e.preventDefault();
    if (!siteAlert.message) {
      toast.error("Alert message cannot be empty.");
      return;
    }
    setSavingAlert(true);
    try {
      const res = await axios.post("/api/admin/alert", siteAlert);
      toast.success("Website alert published!");
      if (res.data.alert) setSiteAlert(res.data.alert);
      window.dispatchEvent(new Event("site-alert-updated"));
    } catch {
      toast.error("Failed to update alert.");
    } finally {
      setSavingAlert(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const res = await axios.patch(`/api/support/admin/${ticketId}/status`, {
        status: newStatus,
      });
      toast.success(`Ticket status updated to ${newStatus}`);
      setSupportTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t)),
      );
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to update ticket status.",
      );
    }
  };

  const handlePostGateNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      toast.error("Title and description are required.");
      return;
    }
    setPostingNotice(true);
    try {
      await axios.post("/api/announcements", newNotice);
      toast.success("Notice published to devotees!");
      setNewNotice({
        title: "",
        category: "Gate Status",
        status: "Open",
        gateName: "",
        location: "Shri Mahakaleshwar Temple Premises",
        reason: "",
        description: "",
        priority: "Normal",
      });
      fetchAdminData();
    } catch {
      toast.error("Failed to publish notice.");
    } finally {
      setPostingNotice(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await axios.delete(`/api/announcements/${id}`);
      toast.success("Notice deleted.");
      fetchAdminData();
    } catch {
      toast.error("Failed to delete notice.");
    }
  };

  const isAdmin =
    user &&
    (user.role === "official" ||
      user.role === "admin" ||
      (user.email && user.email.toLowerCase().includes("admin")));

  if (!isAdmin) {
    return (
      <div className="py-5 bg-black min-vh-100 text-white d-flex align-items-center justify-content-center pt-5">
        <div
          className="text-center p-5 bg-dark rounded-4 border border-warning border-opacity-30 shadow-2xl"
          style={{ maxWidth: 480 }}
        >
          <div
            className="rounded-circle bg-warning text-dark mx-auto d-flex align-items-center justify-content-center mb-4"
            style={{ width: 72, height: 72 }}
          >
            <ShieldCheck size={36} />
          </div>
          <h3 className={`text-white fw-bold mb-2 ${styles.playfairFont}`}>
            Administrator Access Required
          </h3>
          <p className="text-secondary small mb-4">
            This panel is restricted to Mahakal Administration officials.
          </p>
          <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-30 text-start small mb-4">
            <p className="text-warning fw-bold mb-1 small">
              Administrator Credentials:
            </p>
            <p className="text-light mb-0 small">
              Email: <strong>admin@mahakal.com</strong>
            </p>
            <p className="text-light mb-0 small">
              Password: <strong>admin123</strong>
            </p>
          </div>
          <button
            onClick={() => onOpenAuth && onOpenAuth("login")}
            className={`${styles.goldBtn} w-100`}
          >
            Sign In as Administrator
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    const match =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);
    if (roleFilter === "pending")
      return match && u.role === "hotel" && !u.isApproved;
    if (roleFilter === "hotel") return match && u.role === "hotel";
    if (roleFilter === "devotee") return match && u.role === "devotee";
    return match;
  });

  return (
    <div
      className="bg-black min-vh-100 text-white"
      style={{ paddingTop: "110px", paddingBottom: "60px" }}
    >
      <div className="container py-4">
        {/* Page Header - same pattern as Temples/Hotels pages */}
        <div className="text-center mb-5">
          <h1
            className={`display-5 fw-bold text-white mb-3 ${styles.playfairFont}`}
          >
            Temple Executive Dashboard
          </h1>
          <p className="text-secondary">
            Manage pilgrims, hotel partners, shrine directory and live gate
            announcements.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="row g-3 mb-5">
          {[
            {
              label: "Total Pilgrims",
              value: stats.totalUsers,
              icon: <Users size={22} className="text-warning" />,
            },
            {
              label: "Hotel Partners",
              value: stats.totalHotels,
              sub: `${stats.pendingHotels} pending`,
              icon: <Building size={22} className="text-warning" />,
            },
            {
              label: "Shrines Listed",
              value: stats.totalTemples,
              icon: <Compass size={22} className="text-warning" />,
            },
            {
              label: "Live Notices",
              value: adminNotices.length,
              icon: <Megaphone size={22} className="text-warning" />,
            },
            {
              label: "Support Queries",
              value: supportTickets.length,
              sub: `${supportTickets.filter((t) => t.status === "Pending").length} pending`,
              icon: <HelpCircle size={22} className="text-warning" />,
            },
          ].map((stat, i) => (
            <div key={i} className="col-6 col-md-4 col-lg">
              <div
                className={`card bg-dark text-white h-100 p-4 ${styles.glassCard} border border-warning border-opacity-25`}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  {stat.icon}
                  <span className="display-6 fw-bold text-warning">
                    {stat.value}
                  </span>
                </div>
                <p className="mb-0 text-white fw-semibold small">
                  {stat.label}
                </p>
                {stat.sub && (
                  <small className="text-secondary">{stat.sub}</small>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation — same style as Hotels page */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {[
            {
              key: "analytics",
              label: `Passes & Room Analytics`,
              icon: <BarChart3 size={16} />,
            },
            {
              key: "chronos",
              label: `AI Crowd Forecast (Chronos-2)`,
              icon: <TrendingUp size={16} />,
            },
            {
              key: "users",
              label: `Pilgrims & Partners (${usersList.length})`,
              icon: <Users size={16} />,
            },
            {
              key: "temples",
              label: `Shrine Directory (${templesList.length})`,
              icon: <Compass size={16} />,
            },
            {
              key: "alert",
              label: `Gate Notices & Alerts (${adminNotices.length})`,
              icon: <Megaphone size={16} />,
            },
            {
              key: "support",
              label: `Support Tickets (${supportTickets.length})`,
              icon: <HelpCircle size={16} />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn rounded-pill px-4 py-2 font-semibold d-flex align-items-center gap-2 ${
                activeTab === tab.key
                  ? "btn-warning text-dark shadow-lg fw-bold"
                  : "btn-dark text-secondary border border-secondary border-opacity-30"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}

          <div className="ms-auto">
            <button
              onClick={fetchAdminData}
              className="btn btn-outline-warning rounded-pill px-3 py-2 d-flex align-items-center gap-2"
            >
              <RefreshCw size={15} className={loading ? "spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ============================
            TAB 0: PASSES & ROOM ANALYTICS
        ============================ */}
        {activeTab === "analytics" && (
          <div className="d-flex flex-column gap-4">
            {/* VISITOR & PASS CROWD ANALYTICS (HOURLY, DAILY, FESTIVAL, MONTHLY) */}
            {passAnalytics && (
              <div
                className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-30 shadow-2xl rounded-4`}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                      style={{ width: 48, height: 48, flexShrink: 0 }}
                    >
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4
                        className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                      >
                        Shri Mahakal Visitor &amp; Entry Pass Analytics
                      </h4>
                      <p className="text-secondary small mb-0">
                        Real-time devotee footfall metrics: Hour-wise, Day-wise,
                        Festival time &amp; Month-wise
                      </p>
                    </div>
                  </div>
                  <span className="badge bg-success text-white font-monospace px-3 py-2 rounded-pill fs-6">
                    ● Live Database Tracking
                  </span>
                </div>

                {/* Top Metrics Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-black rounded-3 border border-warning border-opacity-30 text-center">
                      <span className="text-secondary small font-monospace d-block mb-1">
                        TOTAL DEVOTEES
                      </span>
                      <h3 className="text-warning fw-bold mb-0">
                        {passAnalytics.summary.totalVisitorsCount}
                      </h3>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-black rounded-3 border border-success border-opacity-30 text-center">
                      <span className="text-secondary small font-monospace d-block mb-1">
                        ACTIVE PASSES NOW
                      </span>
                      <h3 className="text-success fw-bold mb-0">
                        {passAnalytics.summary.activePassesCount}
                      </h3>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-black rounded-3 border border-info border-opacity-30 text-center">
                      <span className="text-secondary small font-monospace d-block mb-1">
                        FESTIVAL VISITORS
                      </span>
                      <h3 className="text-info fw-bold mb-0">
                        {passAnalytics.summary.festivalVisitors}
                      </h3>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-30 text-center">
                      <span className="text-secondary small font-monospace d-block mb-1">
                        REGULAR VISITORS
                      </span>
                      <h3 className="text-white fw-bold mb-0">
                        {passAnalytics.summary.normalVisitors}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* 1. HOURLY VISITORS CHART (00:00 to 23:00) */}
                <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="text-warning fw-bold mb-0 font-monospace">
                      1. HOUR-WISE VISITOR DISTRIBUTION (24-HOUR TIMELINE)
                    </h6>
                    <span className="badge bg-warning text-dark small fw-bold">
                      Peak: 04:00 AM Bhasma Aarti &amp; 07:00 PM Aarti
                    </span>
                  </div>
                  <div
                    className="d-flex align-items-end gap-1.5 pt-3 overflow-x-auto pb-2"
                    style={{ height: 160 }}
                  >
                    {passAnalytics.hourly.map((h) => {
                      const maxVal = Math.max(
                        ...passAnalytics.hourly.map((x) => x.count),
                        1,
                      );
                      const barPct = Math.max(
                        12,
                        Math.round((h.count / maxVal) * 100),
                      );
                      const isPeak = h.hour === 4 || h.hour === 19;

                      return (
                        <div
                          key={h.hour}
                          className="d-flex flex-column align-items-center flex-grow-1"
                          style={{ minWidth: 30 }}
                        >
                          <span
                            className="small text-secondary font-monospace mb-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {h.count}
                          </span>
                          <div
                            className="w-100 bg-dark rounded-top position-relative"
                            style={{ height: 100 }}
                          >
                            <div
                              className={`w-100 rounded-top position-absolute bottom-0 ${isPeak ? "bg-warning shadow-lg" : "bg-success bg-opacity-75"}`}
                              style={{
                                height: `${barPct}%`,
                                transition: "height 0.5s ease",
                              }}
                              title={`${h.hourLabel}: ${h.count} visitors`}
                            />
                          </div>
                          <span
                            className="small font-monospace text-gray-400 mt-1"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {h.hourLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. DAY-WISE & FESTIVAL VS NORMAL ROW */}
                <div className="row g-4 mb-4">
                  {/* Day-Wise Visitors */}
                  <div className="col-md-6">
                    <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 h-100">
                      <h6 className="text-warning fw-bold mb-3 font-monospace">
                        2. DAY-WISE VISITOR FOOTFALL
                      </h6>
                      <div className="space-y-3">
                        {passAnalytics.dayOfWeek.map((d) => {
                          const maxDay = Math.max(
                            ...passAnalytics.dayOfWeek.map((x) => x.count),
                            1,
                          );
                          const pct = Math.round((d.count / maxDay) * 100);
                          const isMonday = d.day === "Mon";

                          return (
                            <div key={d.day}>
                              <div className="d-flex justify-content-between small font-monospace mb-1">
                                <span
                                  className={
                                    isMonday
                                      ? "text-warning fw-bold"
                                      : "text-white"
                                  }
                                >
                                  {d.day} {isMonday && "(Mahakal Somvar)"}
                                </span>
                                <span className="text-secondary">
                                  {d.count} Visitors
                                </span>
                              </div>
                              <div
                                className="progress bg-dark"
                                style={{ height: 10 }}
                              >
                                <div
                                  className={`progress-bar ${isMonday ? "bg-warning" : "bg-info"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Festival Time vs Regular Days */}
                  <div className="col-md-6">
                    <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 h-100">
                      <h6 className="text-warning fw-bold mb-3 font-monospace">
                        3. FESTIVAL TIME vs REGULAR DAYS
                      </h6>

                      <div className="p-3 bg-dark rounded-3 border border-warning border-opacity-25 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-info fw-bold">
                            Festival / Shivratri / Sawan Days
                          </span>
                          <span className="fs-5 fw-bold text-info">
                            {passAnalytics.summary.festivalVisitors} Pax
                          </span>
                        </div>
                        <p className="small text-muted mb-0">
                          High-capacity extended queue routes active across all
                          gates.
                        </p>
                      </div>

                      <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-white fw-bold">
                            Regular / Normal Days
                          </span>
                          <span className="fs-5 fw-bold text-white">
                            {passAnalytics.summary.normalVisitors} Pax
                          </span>
                        </div>
                        <p className="small text-muted mb-0">
                          Standard processing with normal gate flow capacity.
                        </p>
                      </div>

                      <div className="mt-3">
                        <span className="small text-secondary font-monospace d-block mb-1">
                          TRAFFIC RATIO:
                        </span>
                        <div
                          className="progress bg-dark"
                          style={{ height: 14 }}
                        >
                          <div
                            className="progress-bar bg-info"
                            style={{
                              width: `${Math.round((passAnalytics.summary.festivalVisitors / (passAnalytics.summary.totalVisitorsCount || 1)) * 100)}%`,
                            }}
                            title="Festival Traffic"
                          />
                          <div
                            className="progress-bar bg-secondary"
                            style={{
                              width: `${Math.round((passAnalytics.summary.normalVisitors / (passAnalytics.summary.totalVisitorsCount || 1)) * 100)}%`,
                            }}
                            title="Regular Days"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. MONTH-WISE & GATE DISTRIBUTION ROW */}
                <div className="row g-4">
                  {/* Month-Wise Visitors */}
                  <div className="col-md-7">
                    <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 h-100">
                      <h6 className="text-warning fw-bold mb-3 font-monospace">
                        4. MONTH-WISE VISITOR VOLUME (ANNUAL TREND)
                      </h6>
                      <div
                        className="d-flex align-items-end gap-2 pt-3 overflow-x-auto"
                        style={{ height: 130 }}
                      >
                        {passAnalytics.monthly.map((m) => {
                          const maxM = Math.max(
                            ...passAnalytics.monthly.map((x) => x.count),
                            1,
                          );
                          const pct = Math.max(
                            10,
                            Math.round((m.count / maxM) * 100),
                          );

                          return (
                            <div
                              key={m.month}
                              className="d-flex flex-column align-items-center flex-grow-1"
                              style={{ minWidth: 32 }}
                            >
                              <span
                                className="small text-secondary font-monospace mb-1"
                                style={{ fontSize: "0.65rem" }}
                              >
                                {m.count}
                              </span>
                              <div
                                className="w-100 bg-dark rounded-top position-relative"
                                style={{ height: 80 }}
                              >
                                <div
                                  className="w-100 bg-warning rounded-top position-absolute bottom-0"
                                  style={{
                                    height: `${pct}%`,
                                    transition: "height 0.5s ease",
                                  }}
                                />
                              </div>
                              <span
                                className="small font-monospace text-gray-400 mt-1"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {m.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Gate-Wise Distribution (Exact Original UI with Dynamic Data) */}
                  <div className="col-md-5">
                    <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 h-100">
                      <h6 className="text-warning fw-bold mb-3 font-monospace">
                        5. GATE-WISE VISITOR DISTRIBUTION
                      </h6>
                      <div className="space-y-2">
                        {(passAnalytics?.gateDistribution || []).map((g) => (
                          <div
                            key={g.gate}
                            className="d-flex justify-content-between align-items-center p-2 rounded bg-dark border border-secondary border-opacity-20 small"
                          >
                            <span className="text-white fw-bold">{g.gate}</span>
                            <span className="badge bg-warning text-dark font-monospace fw-bold">
                              {g.count} Devotees
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 1. Daily Aarti Passes & Tickets Inventory */}
            <div
              className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-25 shadow-2xl`}
            >
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, flexShrink: 0 }}
                  >
                    <Ticket size={22} />
                  </div>
                  <div>
                    <h4
                      className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                    >
                      Daily Aarti Passes & Tickets Inventory
                    </h4>
                    <p className="text-secondary small mb-0">
                      Live status for{" "}
                      <strong className="text-warning">
                        {inventoryData?.timeframeLabel || "Today"}
                      </strong>{" "}
                      (Resets at 12:00 AM Daily)
                    </p>
                  </div>
                </div>

                {/* Dynamic Gold Date Input Pill Header Filter */}
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={18} className="text-warning flex-shrink-0" />
                  <input
                    type="date"
                    className="form-control bg-black text-warning font-monospace fw-bold py-1.5 px-3 rounded-pill border border-warning border-opacity-50 shadow-sm"
                    style={{
                      width: "175px",
                      fontSize: "0.84rem",
                      cursor: "pointer",
                      colorScheme: "dark",
                    }}
                    value={selectedCalendarDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    title="Click to open calendar and select any date (past or future)"
                  />
                </div>
              </div>

              {/* Aarti Cards / Table Grid */}
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr className="border-bottom border-warning border-opacity-25 text-warning small font-monospace">
                      <th className="py-3">AARTI NAME</th>
                      <th className="py-3">TIMING</th>
                      <th className="py-3 text-center">TOTAL CAPACITY</th>
                      <th className="py-3 text-center">TICKETS SOLD</th>
                      <th className="py-3 text-center">SEATS LEFT</th>
                      <th className="py-3">OCCUPANCY RATE</th>
                      <th className="py-3 text-end">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inventoryData?.aartiAnalytics || []).map((aarti) => {
                      const pct =
                        Math.round((aarti.sold / aarti.capacity) * 100) || 0;
                      return (
                        <tr
                          key={aarti.id}
                          className="border-bottom border-secondary border-opacity-15"
                        >
                          <td className="py-3">
                            <span className="fw-bold text-white font-monospace">
                              {aarti.name}
                            </span>
                          </td>
                          <td className="py-3 text-secondary small">
                            {aarti.time}
                          </td>
                          <td className="py-3 text-center font-monospace fw-semibold">
                            {aarti.capacity}
                          </td>
                          <td className="py-3 text-center font-monospace fw-bold text-success">
                            {aarti.sold} Sold
                          </td>
                          <td className="py-3 text-center font-monospace fw-bold text-warning">
                            {aarti.left} Left
                          </td>
                          <td className="py-3" style={{ minWidth: 160 }}>
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="progress bg-black flex-grow-1"
                                style={{ height: 7 }}
                              >
                                <div
                                  className={`progress-bar ${pct > 90 ? "bg-danger" : pct > 75 ? "bg-warning" : "bg-success"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span
                                className="small font-monospace text-secondary"
                                style={{ fontSize: "0.76rem" }}
                              >
                                {pct}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-end font-monospace">
                            {aarti.status === "Seats Available" ? (
                              <span className="text-success fw-semibold small">
                                Seats Available
                              </span>
                            ) : (
                              <span
                                className={`badge rounded-pill px-3 py-1 small ${
                                  aarti.status?.includes("Closing") ||
                                  aarti.left < 200
                                    ? "bg-danger text-white"
                                    : "bg-warning bg-opacity-15 text-warning border border-warning border-opacity-30"
                                }`}
                              >
                                {aarti.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. VIP Darshan Daily Bookings & Revenue */}
            <div
              className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-25 shadow-2xl`}
            >
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, flexShrink: 0 }}
                  >
                    <Crown size={22} />
                  </div>
                  <div>
                    <h4
                      className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                    >
                      VIP Darshan Daily Bookings & Revenue
                    </h4>
                    <p className="text-secondary small mb-0">
                      Live package revenue for{" "}
                      <strong className="text-warning">
                        {inventoryData?.timeframeLabel || "Today"}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Dynamic Gold Date Input Pill Header Filter */}
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={18} className="text-warning flex-shrink-0" />
                  <input
                    type="date"
                    className="form-control bg-black text-warning font-monospace fw-bold py-1.5 px-3 rounded-pill border border-warning border-opacity-50 shadow-sm"
                    style={{
                      width: "175px",
                      fontSize: "0.84rem",
                      cursor: "pointer",
                      colorScheme: "dark",
                    }}
                    value={selectedCalendarDate}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    title="Click to open calendar and select any date (past or future)"
                  />
                </div>
              </div>

              {/* Selected Day Stats Row */}
              {inventoryData?.vipAnalytics && (
                <>
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="p-3 bg-black rounded-3 border border-secondary border-opacity-30">
                        <small className="text-secondary font-monospace d-block mb-1">
                          ANALYTICS TIMEFRAME
                        </small>
                        <span className="h5 fw-bold text-white mb-0">
                          {inventoryData.timeframeLabel ||
                            inventoryData.vipAnalytics.timeframeLabel}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-black rounded-3 border border-warning border-opacity-30">
                        <small className="text-secondary font-monospace d-block mb-1">
                          VIP PASSES ISSUED
                        </small>
                        <span className="h3 fw-bold text-warning mb-0">
                          {inventoryData.vipAnalytics.totalPasses} Passes
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-black rounded-3 border border-success border-opacity-30">
                        <small className="text-secondary font-monospace d-block mb-1">
                          TOTAL REVENUE
                        </small>
                        <span className="h3 fw-bold text-success mb-0">
                          ₹
                          {(
                            inventoryData.vipAnalytics.totalRevenue || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* VIP Package Breakdown Table */}
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle mb-0">
                      <thead>
                        <tr className="border-bottom border-warning border-opacity-25 text-warning small font-monospace">
                          <th className="py-3">VIP PASS CATEGORY</th>
                          <th className="py-3">ENTRY GATE</th>
                          <th className="py-3 text-center">RATE / DEVOTEE</th>
                          <th className="py-3 text-center">PASSES SOLD</th>
                          <th className="py-3 text-end">CATEGORY REVENUE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryData.vipAnalytics.packages.map((pkg, idx) => (
                          <tr
                            key={idx}
                            className="border-bottom border-secondary border-opacity-15"
                          >
                            <td className="py-3">
                              <span className="fw-bold text-white font-monospace">
                                {pkg.name}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="badge bg-black text-warning border border-warning border-opacity-30 small">
                                {pkg.gate}
                              </span>
                            </td>
                            <td className="py-3 text-center font-monospace fw-semibold text-light">
                              ₹{pkg.price}
                            </td>
                            <td className="py-3 text-center font-monospace fw-bold text-warning">
                              {pkg.sold} Sold
                            </td>
                            <td className="py-3 text-end font-monospace fw-bold text-success">
                              ₹{(pkg.price * pkg.sold).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* 3. Temple Atithi Niwas & Hotel Rooms Occupancy Tracker */}
            <div
              className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-25 shadow-2xl`}
            >
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, flexShrink: 0 }}
                  >
                    <Bed size={22} />
                  </div>
                  <div>
                    <h4
                      className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                    >
                      Temple Atithi Niwas & Hotel Room Occupancy
                    </h4>
                    <p className="text-secondary small mb-0">
                      Live status of filled (occupied) and available (left)
                      rooms right now
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-danger text-white font-monospace fw-bold px-3 py-1.5 rounded-pill">
                    {roomAnalytics.reduce((acc, r) => acc + r.filledRooms, 0)}{" "}
                    Rooms Filled
                  </span>
                  <span className="badge bg-success text-white font-monospace fw-bold px-3 py-1.5 rounded-pill">
                    {roomAnalytics.reduce((acc, r) => acc + r.leftRooms, 0)}{" "}
                    Rooms Left Available
                  </span>
                </div>
              </div>

              {/* Room Occupancy Table */}
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0">
                  <thead>
                    <tr className="border-bottom border-warning border-opacity-25 text-warning small font-monospace">
                      <th className="py-3">ACCOMMODATION / ATITHI NIWAS</th>
                      <th className="py-3">PROPERTY TYPE</th>
                      <th className="py-3 text-center">TOTAL ROOMS</th>
                      <th className="py-3 text-center">ROOMS FILLED</th>
                      <th className="py-3 text-center">ROOMS LEFT</th>
                      <th className="py-3 text-end">OCCUPANCY RATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomAnalytics.map((room, idx) => (
                      <tr
                        key={idx}
                        className="border-bottom border-secondary border-opacity-15"
                      >
                        <td className="py-3">
                          <p className="fw-bold text-white mb-0 font-monospace">
                            {room.property}
                          </p>
                        </td>
                        <td className="py-3 text-secondary small">
                          {room.type}
                        </td>
                        <td className="py-3 text-center font-monospace fw-semibold">
                          {room.totalRooms} Rooms
                        </td>
                        <td className="py-3 text-center font-monospace fw-bold text-danger">
                          {room.filledRooms} Filled
                        </td>
                        <td className="py-3 text-center font-monospace fw-bold text-success">
                          {room.leftRooms} Left
                        </td>
                        <td className="py-3 text-end">
                          <span className="text-warning font-monospace fw-bold bg-transparent border-0 p-0">
                            {room.occupancyPct}% Occupied
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================
            TAB: AI CROWD FORECAST (AMAZON CHRONOS-2)
        ============================ */}
        {activeTab === "chronos" && (
          <div className="d-flex flex-column gap-4">
            {/* HERO BANNER CARD */}
            <div
              className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-30 shadow-2xl rounded-4`}
            >
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, flexShrink: 0 }}
                  >
                    <TrendingUp size={26} />
                  </div>
                  <div>
                    <h4
                      className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                    >
                      AI Crowd Prediction & Time-Series Analytics
                    </h4>
                    <p className="text-secondary small mb-0">
                      {chronosForecast?.aiModel ||
                        "Google Gemini 1.5 Flash AI Engine"}
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge ${chronosForecast?.aiAvailable !== false ? "bg-success text-white" : "bg-warning text-dark"} font-monospace px-3 py-2 rounded-pill fs-6`}
                  >
                    ● {chronosForecast?.aiModel || "Gemini 1.5 Flash AI Active"}
                  </span>
                  <button
                    onClick={fetchAdminData}
                    className="btn btn-sm btn-outline-warning rounded-pill px-3 py-1.5 ms-2 d-flex align-items-center gap-1.5"
                  >
                    <RefreshCw
                      size={14}
                      className={loadingChronos ? "spin" : ""}
                    />{" "}
                    Refresh AI Prediction
                  </button>
                </div>
              </div>

              {/* TOP METRICS: TOMORROW'S AI PREDICTION */}
              {chronosForecast ? (
                <>
                  <div className="row g-4 mb-4">
                    {/* Expected Total Crowd Tomorrow */}
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-black rounded-4 border border-warning border-opacity-30 shadow text-center h-100 d-flex flex-column justify-content-center">
                        <span className="text-secondary small font-monospace d-block mb-1 text-uppercase">
                          TOMORROW EXPECTED CROWD
                        </span>
                        <h2 className="text-warning fw-black mb-1">
                          {chronosForecast.tomorrow?.expectedCrowd?.toLocaleString() ||
                            "18,500"}
                        </h2>
                        <small
                          className="text-gray-400 font-monospace"
                          style={{ fontSize: "0.72rem" }}
                        >
                          {chronosForecast.tomorrow?.formattedDate ||
                            "Tomorrow"}
                        </small>
                      </div>
                    </div>

                    {/* Crowd Level Risk Badge */}
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-black rounded-4 border border-warning border-opacity-30 shadow text-center h-100 d-flex flex-column justify-content-center">
                        <span className="text-secondary small font-monospace d-block mb-1 text-uppercase">
                          CROWD RISK LEVEL
                        </span>
                        <div className="my-1">
                          <span
                            className={`badge ${
                              chronosForecast.tomorrow?.crowdLevel ===
                              "CRITICAL"
                                ? "bg-danger text-white"
                                : chronosForecast.tomorrow?.crowdLevel ===
                                    "HIGH"
                                  ? "bg-warning text-dark"
                                  : chronosForecast.tomorrow?.crowdLevel ===
                                      "MEDIUM"
                                    ? "bg-info text-dark"
                                    : "bg-success text-white"
                            } px-3 py-2 fs-5 font-monospace fw-bold rounded-pill`}
                          >
                            {chronosForecast.tomorrow?.crowdLevel || "HIGH"}
                          </span>
                        </div>
                        <small
                          className="text-gray-400 font-monospace"
                          style={{ fontSize: "0.72rem" }}
                        >
                          Threshold: LOW &lt;10k · MED &lt;16k · HIGH &lt;22k
                        </small>
                      </div>
                    </div>

                    {/* Predicted Peak Hour */}
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-black rounded-4 border border-warning border-opacity-30 shadow text-center h-100 d-flex flex-column justify-content-center">
                        <span className="text-secondary small font-monospace d-block mb-1 text-uppercase">
                          PREDICTED PEAK HOUR
                        </span>
                        <h2 className="text-white fw-bold mb-1">
                          {chronosForecast.tomorrow?.peakHour || "11:00 AM"}
                        </h2>
                        <small
                          className="text-warning font-monospace"
                          style={{ fontSize: "0.72rem" }}
                        >
                          Auto-identified Peak
                        </small>
                      </div>
                    </div>

                    {/* Predicted Peak Crowd */}
                    <div className="col-md-3 col-6">
                      <div className="p-4 bg-black rounded-4 border border-warning border-opacity-30 shadow text-center h-100 d-flex flex-column justify-content-center">
                        <span className="text-secondary small font-monospace d-block mb-1 text-uppercase">
                          PREDICTED PEAK CROWD
                        </span>
                        <h2 className="text-warning fw-bold mb-1">
                          {chronosForecast.tomorrow?.peakCrowd?.toLocaleString() ||
                            "4,800"}
                        </h2>
                        <small
                          className="text-gray-400 font-monospace"
                          style={{ fontSize: "0.72rem" }}
                        >
                          Devotees in Peak Slot
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* UPCOMING CROWD RISK TABLE (NEXT 7 DAYS) */}
                  <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30 mb-4">
                    <h5 className="text-warning fw-bold mb-3 font-serif d-flex align-items-center gap-2">
                      <Calendar size={18} /> Upcoming 7-Day Crowd Risk Forecast
                      (Chronos-2)
                    </h5>

                    <div className="row g-3">
                      {chronosForecast.upcomingDays?.map((dayObj, idx) => (
                        <div key={idx} className="col-md-3 col-6">
                          <div className="p-3 bg-dark rounded-3 border border-secondary border-opacity-25 h-100 d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong className="text-white small font-monospace">
                                {dayObj.day}
                              </strong>
                              <span
                                className="text-secondary small"
                                style={{ fontSize: "0.7rem" }}
                              >
                                {dayObj.formattedDate || dayObj.date}
                              </span>
                            </div>

                            <h4 className="text-warning fw-bold mb-2">
                              {dayObj.expectedCrowd?.toLocaleString()}
                            </h4>

                            <div>
                              <span
                                className={`badge ${
                                  dayObj.crowdLevel === "CRITICAL"
                                    ? "bg-danger text-white"
                                    : dayObj.crowdLevel === "HIGH"
                                      ? "bg-warning text-dark"
                                      : dayObj.crowdLevel === "MEDIUM"
                                        ? "bg-info text-dark"
                                        : "bg-success text-white"
                                } px-2.5 py-1 rounded-pill small font-monospace fw-bold w-100`}
                              >
                                {dayObj.crowdLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HOURLY PREDICTION BREAKDOWN CHART FOR TOMORROW */}
                  <div className="p-4 bg-black rounded-4 border border-secondary border-opacity-30">
                    <h5 className="text-warning fw-bold mb-3 font-serif d-flex align-items-center gap-2">
                      <Clock size={18} /> Tomorrow's Hourly Chronos-2 Crowd
                      Breakdown (24 Hours)
                    </h5>

                    <div
                      className="d-flex align-items-end gap-1.5 pt-3 overflow-x-auto"
                      style={{ height: 160 }}
                    >
                      {chronosForecast.hourlyTomorrow?.map((hrPoint) => {
                        const maxHrCrowd = Math.max(
                          ...chronosForecast.hourlyTomorrow.map(
                            (x) => x.predictedCrowd,
                          ),
                          1,
                        );
                        const heightPct = Math.max(
                          8,
                          Math.round(
                            (hrPoint.predictedCrowd / maxHrCrowd) * 100,
                          ),
                        );
                        const isPeak =
                          hrPoint.hourLabel ===
                            chronosForecast.tomorrow?.peakHour ||
                          hrPoint.predictedCrowd ===
                            chronosForecast.tomorrow?.peakCrowd;

                        return (
                          <div
                            key={hrPoint.hour24}
                            className="d-flex flex-column align-items-center flex-grow-1"
                            style={{ minWidth: 28 }}
                          >
                            <span
                              className="small text-secondary font-monospace mb-1"
                              style={{ fontSize: "0.62rem" }}
                            >
                              {hrPoint.predictedCrowd}
                            </span>
                            <div
                              className="w-100 bg-dark rounded-top position-relative"
                              style={{ height: 100 }}
                              title={
                                hrPoint.lowerBound !== undefined
                                  ? `10% Lower: ${hrPoint.lowerBound} | 50% Median: ${hrPoint.predictedCrowd} | 90% Upper: ${hrPoint.upperBound}`
                                  : `${hrPoint.predictedCrowd} devotees`
                              }
                            >
                              <div
                                className={`w-100 rounded-top position-absolute bottom-0 ${isPeak ? "bg-danger shadow-lg" : "bg-warning"}`}
                                style={{
                                  height: `${heightPct}%`,
                                  transition: "height 0.5s ease",
                                }}
                              />
                            </div>
                            <span
                              className={`small font-monospace ${isPeak ? "text-danger fw-bold" : "text-gray-400"} mt-1`}
                              style={{ fontSize: "0.65rem" }}
                            >
                              {hrPoint.hourLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-warning" role="status" />
                  <p className="text-secondary small mt-3">
                    Fetching Chronos-2 AI predictions...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================
            TAB 1: USERS & PARTNERS
        ============================ */}
        {activeTab === "users" && (
          <div
            className={`card bg-dark text-white p-4 ${styles.glassCard} border border-warning border-opacity-25`}
          >
            {/* Search + Filter */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
              <div className="input-group" style={{ maxWidth: 420 }}>
                <span className="input-group-text bg-dark border-warning border-opacity-25 text-warning">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-warning border-opacity-25 p-2.5"
                  placeholder="Search by name, email or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                {[
                  { key: "all", label: `All (${usersList.length})` },
                  {
                    key: "pending",
                    label: `Pending (${usersList.filter((u) => u.role === "hotel" && !u.isApproved).length})`,
                  },
                  {
                    key: "hotel",
                    label: `Hotels (${usersList.filter((u) => u.role === "hotel").length})`,
                  },
                  {
                    key: "devotee",
                    label: `Devotees (${usersList.filter((u) => u.role === "devotee").length})`,
                  },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setRoleFilter(f.key)}
                    className={`btn btn-sm rounded-pill px-3 py-1.5 ${
                      roleFilter === f.key
                        ? "btn-warning text-dark fw-bold"
                        : "btn-dark text-secondary border border-secondary border-opacity-30"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr className="border-bottom border-warning border-opacity-25">
                    <th className="text-warning py-3">User / Partner</th>
                    <th className="text-warning py-3">Email</th>
                    <th className="text-warning py-3">Account Role</th>
                    <th className="text-warning py-3">Status</th>
                    <th className="text-warning py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-5 text-secondary"
                      >
                        No accounts match your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-bottom border-secondary border-opacity-10"
                      >
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: 38,
                                height: 38,
                                fontSize: "0.95rem",
                                flexShrink: 0,
                              }}
                            >
                              {u.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="mb-0 fw-semibold text-white">
                                {u.name
                                  ? u.name.replace(/Sancthan/g, "Mahakal")
                                  : "User"}
                              </p>
                              {u.hotelName && (
                                <small className="text-warning">
                                  {u.hotelName}
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-secondary small">{u.email}</td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            {u.role === "official" ? (
                              <>
                                <ShieldCheck
                                  size={15}
                                  className="text-warning"
                                />
                                <span className="text-warning fw-semibold small">
                                  Administrator
                                </span>
                              </>
                            ) : u.role === "hotel" ? (
                              <>
                                <Building size={15} className="text-light" />
                                <span className="text-light small">
                                  Hotel Partner
                                </span>
                              </>
                            ) : (
                              <>
                                <Users size={15} className="text-secondary" />
                                <span className="text-secondary small">
                                  Devotee
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          {u.role === "hotel" ? (
                            <span
                              className={`badge rounded-pill px-3 py-1 small ${u.isApproved ? "bg-success" : "bg-danger"}`}
                            >
                              {u.isApproved ? "✓ Approved" : "⏳ Pending"}
                            </span>
                          ) : (
                            <span className="badge bg-success rounded-pill px-3 py-1 small">
                              ✓ Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            {u.role === "hotel" && (
                              <button
                                onClick={() => handleToggleApproval(u._id)}
                                className={`btn btn-sm rounded-pill px-3 ${u.isApproved ? "btn-outline-warning" : "btn-success"}`}
                              >
                                {u.isApproved ? "Revoke" : "Approve"}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="btn btn-sm btn-outline-danger rounded-circle p-1.5"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================
            TAB 2: SHRINE DIRECTORY
        ============================ */}
        {activeTab === "temples" && (
          <>
            <div className="d-flex justify-content-end mb-4">
              <button
                onClick={() => setShowAddTempleModal(true)}
                className={`${styles.goldBtn} d-flex align-items-center gap-2`}
                style={{ padding: "10px 24px", fontSize: "0.9rem" }}
              >
                <Plus size={18} /> Register New Shrine
              </button>
            </div>

            <div className="row g-4">
              {templesList.map((t) => (
                <div key={t._id || t.id} className="col-lg-4 col-md-6">
                  <div
                    className={`card bg-dark text-white ${styles.glassCard} overflow-hidden h-100 border border-warning border-opacity-25`}
                  >
                    <div className="position-relative" style={{ height: 220 }}>
                      <img
                        src={t.image || "/mahakalTemple.jpeg"}
                        alt={t.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8) 100%)",
                        }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <button
                          onClick={() => handleDeleteTemple(t._id || t.id)}
                          className="btn btn-danger btn-sm rounded-circle p-1.5 shadow"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-warning text-dark fw-semibold px-3 py-1 rounded-pill small">
                          {t.highlight || "360° Tour"}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h5
                        className={`text-warning fw-bold mb-1 ${styles.playfairFont}`}
                      >
                        {t.name}
                      </h5>
                      <p className="text-secondary small mb-2 d-flex align-items-center gap-1">
                        <MapPin size={12} className="text-warning" />{" "}
                        {t.location}
                      </p>
                      <p
                        className="text-light small mb-0"
                        style={{ lineHeight: 1.5 }}
                      >
                        {t.description?.slice(0, 120)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ============================
            TAB 3: ALERTS & GATE NOTICES
        ============================ */}
        {activeTab === "alert" && (
          <div className="d-flex flex-column gap-4">
            {/* Section 1: Header Marquee Alert */}
            <div
              className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-25`}
            >
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                <div
                  className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, flexShrink: 0 }}
                >
                  <Megaphone size={22} />
                </div>
                <div className="flex-grow-1">
                  <h4
                    className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                  >
                    Header Alert Banner
                  </h4>
                  <p className="text-secondary small mb-0">
                    Scrolling announcement visible at top of all pages.
                  </p>
                </div>
                <a
                  href="/announcements"
                  className="btn btn-outline-warning rounded-pill px-3 py-1.5 small d-flex align-items-center gap-2"
                >
                  <Eye size={14} /> View Notices Page
                </a>
              </div>

              {/* Live Preview */}
              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">
                  LIVE PREVIEW
                </label>
                <div
                  className="p-3 bg-black rounded-3 border border-warning border-opacity-30 overflow-hidden"
                  style={{ height: 44 }}
                >
                  {siteAlert.isActive ? (
                    <div
                      className="text-warning fw-semibold small text-nowrap"
                      style={{ animation: "marqueeScroll 20s linear infinite" }}
                    >
                      {siteAlert.message || "Type a message below..."}
                    </div>
                  ) : (
                    <div className="text-secondary small text-center py-1">
                      Alert is currently turned OFF.
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveSiteAlert}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-secondary small fw-semibold">
                      ANNOUNCEMENT MESSAGE
                    </label>
                    <textarea
                      rows={3}
                      className="form-control bg-black text-white border-secondary border-opacity-50 p-3"
                      placeholder="e.g. 🚩 SPECIAL ANNOUNCEMENT: Bhasma Aarti online booking is now open..."
                      value={siteAlert.message}
                      onChange={(e) =>
                        setSiteAlert({ ...siteAlert, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      DISPLAY
                    </label>
                    <div className="form-check form-switch d-flex align-items-center justify-content-between p-3 bg-black rounded-3 border border-secondary border-opacity-30">
                      <label className="form-check-label text-white mb-0 small fw-semibold">
                        {siteAlert.isActive ? "🟢 Active" : "🔴 Off"}
                      </label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={siteAlert.isActive}
                        onChange={(e) =>
                          setSiteAlert({
                            ...siteAlert,
                            isActive: e.target.checked,
                          })
                        }
                        style={{
                          width: "2.5em",
                          height: "1.3em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      COLOR THEME
                    </label>
                    <select
                      className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5"
                      value={siteAlert.alertType}
                      onChange={(e) =>
                        setSiteAlert({
                          ...siteAlert,
                          alertType: e.target.value,
                        })
                      }
                    >
                      <option value="warning">🚩 Saffron Gold</option>
                      <option value="danger">🔴 Urgent Red</option>
                      <option value="info">🔵 Blue Info</option>
                      <option value="success">🟢 Emerald Green</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      SCROLL SPEED
                    </label>
                    <select
                      className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5"
                      value={siteAlert.speed}
                      onChange={(e) =>
                        setSiteAlert({
                          ...siteAlert,
                          speed: Number(e.target.value),
                        })
                      }
                    >
                      <option value={18}>⚡ Fast</option>
                      <option value={25}>Medium (Recommended)</option>
                      <option value={35}>🐢 Slow</option>
                    </select>
                  </div>

                  <div className="col-12 text-end pt-2 border-top border-secondary border-opacity-20">
                    <button
                      type="submit"
                      disabled={savingAlert}
                      className={`${styles.goldBtn} d-inline-flex align-items-center gap-2`}
                      style={{ padding: "10px 28px" }}
                    >
                      <Save size={16} />
                      {savingAlert ? "Publishing..." : "Publish Alert"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Section 2: Post New Gate Notice */}
            <div
              className={`card bg-dark text-white p-4 p-md-5 ${styles.glassCard} border border-warning border-opacity-25`}
            >
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-warning border-opacity-20">
                <div
                  className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center"
                  style={{ width: 48, height: 48, flexShrink: 0 }}
                >
                  <Plus size={22} />
                </div>
                <div>
                  <h4
                    className={`text-white fw-bold mb-1 ${styles.playfairFont}`}
                  >
                    Post Gate & Temple Notice
                  </h4>
                  <p className="text-secondary small mb-0">
                    Publish live notices about gate status, closures, and
                    advisories.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePostGateNotice}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label text-secondary small fw-semibold">
                      NOTICE TITLE *
                    </label>
                    <input
                      type="text"
                      className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                      placeholder="e.g. Gate No. 4 Closure for Bhasma Aarti Preparation"
                      required
                      value={newNotice.title}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      CATEGORY
                    </label>
                    <select
                      className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5"
                      value={newNotice.category}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, category: e.target.value })
                      }
                    >
                      <option value="Gate Status">🚪 Gate Status</option>
                      <option value="Bhasma Aarti">🔥 Bhasma Aarti</option>
                      <option value="Darshan Line">🚶 Darshan Line</option>
                      <option value="Crowd Advisory">🚨 Crowd Advisory</option>
                      <option value="General Notice">📢 General Notice</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      GATE STATUS
                    </label>
                    <select
                      className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5"
                      value={newNotice.status}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, status: e.target.value })
                      }
                    >
                      <option value="Open">🟢 Open</option>
                      <option value="Closed">🔴 Closed</option>
                      <option value="Diverted">🟡 Diverted</option>
                      <option value="Active">ℹ️ Active Notice</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      GATE NAME
                    </label>
                    <input
                      type="text"
                      className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                      placeholder="e.g. Gate 4 (Nandi Mandapam)"
                      value={newNotice.gateName}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, gateName: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-secondary small fw-semibold">
                      PRIORITY
                    </label>
                    <select
                      className="form-select bg-black text-white border-secondary border-opacity-50 p-2.5"
                      value={newNotice.priority}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, priority: e.target.value })
                      }
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">⚠️ High Priority</option>
                      <option value="Urgent">⚡ Urgent</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-secondary small fw-semibold">
                      REASON FOR CLOSURE / DIVERSION
                    </label>
                    <input
                      type="text"
                      className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                      placeholder="e.g. Routine cleaning & security review between 2:00 PM to 4:30 PM."
                      value={newNotice.reason}
                      onChange={(e) =>
                        setNewNotice({ ...newNotice, reason: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-secondary small fw-semibold">
                      DETAILED DESCRIPTION *
                    </label>
                    <textarea
                      className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                      rows={3}
                      placeholder="Provide clear guidance, alternate gate recommendations, and timings for pilgrims..."
                      required
                      value={newNotice.description}
                      onChange={(e) =>
                        setNewNotice({
                          ...newNotice,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-12 text-end pt-2 border-top border-secondary border-opacity-20">
                    <button
                      type="submit"
                      disabled={postingNotice}
                      className={`${styles.goldBtn} d-inline-flex align-items-center gap-2`}
                      style={{ padding: "10px 28px" }}
                    >
                      <Megaphone size={16} />
                      {postingNotice
                        ? "Publishing..."
                        : "Post Notice to Devotees"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Section 3: Active Notices List */}
            <div
              className={`card bg-dark text-white p-4 ${styles.glassCard} border border-warning border-opacity-25`}
            >
              <h5
                className={`text-warning fw-bold mb-4 ${styles.playfairFont}`}
              >
                Active Published Notices ({adminNotices.length})
              </h5>

              {adminNotices.length === 0 ? (
                <p className="text-secondary text-center py-4">
                  No notices published yet.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle">
                    <thead>
                      <tr className="border-bottom border-warning border-opacity-25">
                        <th className="text-warning py-3">Notice / Gate</th>
                        <th className="text-warning py-3">Category</th>
                        <th className="text-warning py-3">Status</th>
                        <th className="text-warning py-3">Reason</th>
                        <th className="text-warning py-3 text-end">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminNotices.map((notice) => (
                        <tr
                          key={notice._id}
                          className="border-bottom border-secondary border-opacity-10"
                        >
                          <td className="py-3">
                            <p className="fw-semibold text-white mb-0 small">
                              {notice.title}
                            </p>
                            {notice.gateName && (
                              <small className="text-warning">
                                {notice.gateName}
                              </small>
                            )}
                          </td>
                          <td className="py-3">
                            <span className="badge bg-warning text-dark small px-2 py-1">
                              {notice.category}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`badge rounded-pill px-3 py-1 small ${
                                notice.status === "Open"
                                  ? "bg-success"
                                  : notice.status === "Closed"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                              }`}
                            >
                              {notice.status === "Open"
                                ? "🟢 Open"
                                : notice.status === "Closed"
                                  ? "🔴 Closed"
                                  : "🟡 Diverted"}
                            </span>
                          </td>
                          <td
                            className="py-3 text-secondary small"
                            style={{ maxWidth: 260 }}
                          >
                            {notice.reason || "—"}
                          </td>
                          <td className="py-3 text-end">
                            <button
                              onClick={() => handleDeleteNotice(notice._id)}
                              className="btn btn-sm btn-outline-danger rounded-circle p-1.5"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================
            TAB 4: SUPPORT TICKETS & HELPLINES
            ============================ */}
        {activeTab === "support" && (
          <div className="card bg-dark text-white p-4 rounded-4 border border-warning border-opacity-25 shadow-2xl">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <h4
                  className={`fw-bold text-white mb-1 ${styles.playfairFont}`}
                >
                  Pilgrim Support Queries & Helplines
                </h4>
                <p className="text-secondary small mb-0">
                  Manage and update resolution status for incoming support
                  tickets from logged-in pilgrims.
                </p>
              </div>

              <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-30 rounded-pill px-3 py-1.5 font-semibold">
                {supportTickets.length} Total Tickets
              </span>
            </div>

            {supportTickets.length === 0 ? (
              <div className="text-center py-5">
                <HelpCircle
                  size={40}
                  className="text-warning opacity-50 mb-3"
                />
                <h5 className="text-white fw-bold">
                  No Support Tickets Logged
                </h5>
                <p className="text-secondary small mb-0">
                  All pilgrim inquiries and helplines are currently clear.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table
                  className="table table-dark table-hover align-middle mb-0"
                  style={{ fontSize: "0.88rem" }}
                >
                  <thead>
                    <tr className="text-warning border-bottom border-secondary border-opacity-40">
                      <th>Submitted</th>
                      <th>Pilgrim Details</th>
                      <th>Category</th>
                      <th>Query Message</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="border-bottom border-secondary border-opacity-25"
                      >
                        <td
                          className="text-nowrap"
                          style={{ fontSize: "0.8rem" }}
                        >
                          <div className="text-white fw-semibold">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-secondary">
                            {new Date(ticket.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold text-white">
                            {ticket.name}
                          </div>
                          <div className="text-warning small font-monospace">
                            {ticket.phone}
                          </div>
                          {ticket.email && (
                            <div className="text-secondary small">
                              {ticket.email}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-2.5 py-1">
                            {ticket.category}
                          </span>
                        </td>
                        <td style={{ maxWidth: "320px" }}>
                          <div className="text-light small text-wrap">
                            {ticket.message}
                          </div>
                        </td>
                        <td className="text-nowrap">
                          {ticket.status === "Resolved" ? (
                            <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-40 rounded-pill px-3 py-1.5 font-semibold d-inline-flex align-items-center gap-1.5">
                              <CheckCircle2 size={14} /> Resolved (Locked)
                            </span>
                          ) : ticket.status === "Closed" ? (
                            <span className="badge bg-secondary bg-opacity-20 text-light border border-secondary border-opacity-40 rounded-pill px-3 py-1.5 font-semibold d-inline-flex align-items-center gap-1.5">
                              <Lock size={14} /> Closed (Locked)
                            </span>
                          ) : (
                            <div className="d-flex align-items-center gap-2">
                              {ticket.status === "Pending" ? (
                                <AlertTriangle
                                  size={15}
                                  className="text-warning flex-shrink-0"
                                />
                              ) : (
                                <Clock
                                  size={15}
                                  className="text-info flex-shrink-0"
                                />
                              )}
                              <select
                                value={ticket.status}
                                onChange={(e) =>
                                  handleUpdateTicketStatus(
                                    ticket._id,
                                    e.target.value,
                                  )
                                }
                                className={`form-select form-select-sm rounded-pill font-semibold border-opacity-40 ${
                                  ticket.status === "Pending"
                                    ? "bg-warning text-dark font-bold"
                                    : "bg-info text-dark font-bold"
                                }`}
                                style={{ fontSize: "0.78rem", width: "145px" }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Mark Resolved</option>
                                <option value="Closed">Mark Closed</option>
                              </select>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REGISTER SHRINE MODAL */}
        {showAddTempleModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1070 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border border-warning border-opacity-30 rounded-4 shadow-2xl overflow-hidden">
                <div className="modal-header border-bottom border-warning border-opacity-20 px-4 py-3 bg-black">
                  <h5
                    className={`modal-title text-warning fw-bold ${styles.playfairFont}`}
                  >
                    Register New Shrine
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowAddTempleModal(false)}
                  />
                </div>

                <form onSubmit={handleAddTempleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-semibold">
                        TEMPLE NAME *
                      </label>
                      <input
                        type="text"
                        className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                        placeholder="e.g. Shri Gopal Mandir"
                        required
                        value={newTemple.name}
                        onChange={(e) =>
                          setNewTemple({ ...newTemple, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-secondary small fw-semibold">
                        LOCATION *
                      </label>
                      <input
                        type="text"
                        className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                        placeholder="Location in Ujjain"
                        required
                        value={newTemple.location}
                        onChange={(e) =>
                          setNewTemple({
                            ...newTemple,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label text-secondary small fw-semibold">
                        DESCRIPTION *
                      </label>
                      <textarea
                        className="form-control bg-black text-white border-secondary border-opacity-50 p-2.5"
                        rows={3}
                        placeholder="Brief spiritual history and significance..."
                        required
                        value={newTemple.description}
                        onChange={(e) =>
                          setNewTemple({
                            ...newTemple,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button type="submit" className={`${styles.goldBtn} w-100`}>
                      Publish Shrine to Directory
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
