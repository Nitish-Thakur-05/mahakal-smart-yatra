import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { SiteAlertTicker } from "./components/SiteAlertTicker";
import { Footer } from "./components/Footer";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { AuthModal } from "./components/AuthModal";
import { AppSplashLoader } from "./components/AppSplashLoader";

import { Home } from "./pages/Home";
import { Temples } from "./pages/Temples";
import { TempleDetail } from "./pages/TempleDetail";
import { CulturalEvents } from "./pages/CulturalEvents";
import { LocalEvents } from "./pages/LocalEvents";
import { Hotels } from "./pages/Hotels";
import { AIPlanner } from "./pages/AIPlanner";
import { UserProfile } from "./pages/UserProfile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { HotelPartnerDashboard } from "./pages/HotelPartnerDashboard";
import { Announcements } from "./pages/Announcements";
import { TempleMap } from "./pages/TempleMap";
import { Support } from "./pages/Support";
import { VIPDarshan } from "./pages/VIPDarshan";
import { EntryPassPage } from "./pages/EntryPassPage";
import { EPassPortalModal } from "./components/EPassPortalModal";
import { Navigation } from "./pages/Navigation/Navigation";

function MainApp() {
  const navigate = useNavigate();
  const [temples, setTemples] = useState([]);
  const [events, setEvents] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showPassModal, setShowPassModal] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mahakal_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/api/auth/session")
        .then((res) => {
          if (res.data.user) setUser(res.data.user);
        })
        .catch(() => {
          localStorage.removeItem("mahakal_token");
          delete axios.defaults.headers.common["Authorization"];
        });
    }

    async function loadData() {
      try {
        const res = await axios.get("/api/temples");
        setTemples(res.data);
      } catch (e) {}
      try {
        const res = await axios.get("/api/events");
        setEvents(res.data);
      } catch (e) {}
      try {
        const res = await axios.get("/api/hotels");
        setHotels(res.data);
      } catch (e) {}
      try {
        const res = await axios.get("/api/itineraries");
        setItineraries(res.data);
      } catch (e) {}
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("mahakal_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Logged out successfully. Have a blessed day!");
    navigate("/");
  };

  const handleOpenAuth = (mode = "login") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {isInitialLoading && (
          <AppSplashLoader onComplete={() => setIsInitialLoading(false)} />
        )}
      </AnimatePresence>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#121212",
            color: "#ffffff",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "12px",
            fontSize: "0.88rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          },
          success: {
            iconTheme: {
              primary: "#f59e0b",
              secondary: "#000000",
            },
          },
        }}
      />
      <div className="d-flex flex-column min-vh-100 bg-black text-white">
        <SiteAlertTicker />
        <Navbar
          onOpenAuth={handleOpenAuth}
          onOpenPassPortal={() => setShowPassModal(true)}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  temples={temples}
                  events={events}
                  itineraries={itineraries}
                />
              }
            />
            <Route path="/temples" element={<Temples temples={temples} />} />
            <Route path="/temple/:id" element={<TempleDetail />} />

            {/* Sacred Aartis -> /aarties */}
            <Route
              path="/aarties"
              element={
                <CulturalEvents
                  events={events}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                />
              }
            />

            {/* Mandatory Entry Pass Routes */}
            <Route
              path="/entry-pass"
              element={
                <EntryPassPage user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route
              path="/pass"
              element={
                <EntryPassPage user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route path="/events" element={<LocalEvents />} />
            <Route
              path="/vip-darshan"
              element={<VIPDarshan user={user} onOpenAuth={handleOpenAuth} />}
            />
            <Route path="/map" element={<TempleMap />} />
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/temple-view" element={<Navigation />} />
            <Route
              path="/support"
              element={<Support user={user} onOpenAuth={handleOpenAuth} />}
            />

            <Route
              path="/hotels"
              element={
                <Hotels
                  hotels={hotels}
                  user={user}
                  onOpenAuth={handleOpenAuth}
                />
              }
            />
            <Route path="/planner" element={<AIPlanner />} />
            <Route
              path="/profile"
              element={
                <UserProfile
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  onUpdateUser={(u) => setUser(u)}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <AdminDashboard user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route
              path="/announcements"
              element={
                <Announcements user={user} onOpenAuth={handleOpenAuth} />
              }
            />
            <Route
              path="/hotel-dashboard"
              element={
                <HotelPartnerDashboard
                  user={user}
                  onOpenAuth={handleOpenAuth}
                  onUpdateUser={(u) => setUser(u)}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
        <ChatbotWidget />

        <AuthModal
          show={showAuthModal}
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(u) => setUser(u)}
        />

        <EPassPortalModal
          show={showPassModal}
          onClose={() => setShowPassModal(false)}
          user={user}
          onOpenAuth={handleOpenAuth}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
