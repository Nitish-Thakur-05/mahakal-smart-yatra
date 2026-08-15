const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Temple = require("../models/Temple");
const Event = require("../models/Event");
const Hotel = require("../models/Hotel");
const SiteAlert = require("../models/SiteAlert");
const { requireAdmin } = require("../middleware/adminAuth");

// PUBLIC ENDPOINT: Fetch active website alert banner
router.get("/alert-public", async (req, res) => {
  try {
    let alertDoc = await SiteAlert.findOne();
    if (!alertDoc) {
      alertDoc = await SiteAlert.create({
        message: '🚩 OFFICIAL ANNOUNCEMENT: Shri Mahakaleshwar Temple Bhasma Aarti online booking for upcoming festival season is open. Please carry original Photo ID for entry.',
        isActive: true,
        alertType: 'warning'
      });
    }
    res.json(alertDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch site alert" });
  }
});

const { fetchChronosForecast } = require('../services/chronosClient');

// PUBLIC ENDPOINT: Fetch AI Crowd Forecast
router.get("/crowd/forecast-public", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const forecast = await fetchChronosForecast(forceRefresh);
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AI crowd forecast." });
  }
});

// Apply Admin Middleware to all subsequent /api/admin routes
router.use(requireAdmin);

// GET /api/admin/crowd/forecast (Admin AI Crowd Forecast)
router.get("/crowd/forecast", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const forecast = await fetchChronosForecast(forceRefresh);
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch AI crowd forecast." });
  }
});

// GET /api/admin/alert (Admin fetch)
router.get("/alert", async (req, res) => {
  try {
    let alertDoc = await SiteAlert.findOne();
    if (!alertDoc) {
      alertDoc = await SiteAlert.create({
        message: '🚩 OFFICIAL ANNOUNCEMENT: Shri Mahakaleshwar Temple Bhasma Aarti online booking for upcoming festival season is open. Please carry original Photo ID for entry.',
        isActive: true,
        alertType: 'warning'
      });
    }
    res.json(alertDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch site alert" });
  }
});

// POST /api/admin/alert (Admin update/create alert)
router.post("/alert", async (req, res) => {
  try {
    const { message, isActive, alertType, speed } = req.body;
    let alertDoc = await SiteAlert.findOne();
    if (!alertDoc) {
      alertDoc = new SiteAlert({ message, isActive, alertType, speed });
    } else {
      if (message !== undefined) alertDoc.message = message;
      if (isActive !== undefined) alertDoc.isActive = isActive;
      if (alertType !== undefined) alertDoc.alertType = alertType;
      if (speed !== undefined) alertDoc.speed = speed;
    }
    await alertDoc.save();
    res.json({ message: "Website scrolling alert updated successfully!", alert: alertDoc });
  } catch (err) {
    res.status(500).json({ error: "Failed to update site alert" });
  }
});

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "devotee" });
    const totalHotels = await User.countDocuments({ role: "hotel" });
    const pendingHotels = await User.countDocuments({ role: "hotel", isApproved: false });
    const totalTemples = await Temple.countDocuments({});
    const totalEvents = await Event.countDocuments({});

    res.json({
      totalUsers,
      totalHotels,
      pendingHotels,
      totalTemples,
      totalEvents
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    // Migrate any legacy database records with Sancthan
    for (let u of users) {
      if (u.name && u.name.includes('Sancthan')) {
        u.name = u.name.replace(/Sancthan/g, 'Mahakal');
        await u.save();
      }
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// PATCH /api/admin/users/:id/approve
router.patch("/users/:id/approve", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User account not found" });
    }
    user.isApproved = !user.isApproved;
    await user.save();
    res.json({ message: `Account approval status set to ${user.isApproved}`, user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update approval status" });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User account removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// POST /api/admin/temples
router.post("/temples", async (req, res) => {
  try {
    const temple = await Temple.create(req.body);
    res.json({ message: "Shrine added successfully", temple });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create temple" });
  }
});

// PUT /api/admin/temples/:id
router.put("/temples/:id", async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Shrine updated successfully", temple });
  } catch (err) {
    res.status(500).json({ error: "Failed to update temple" });
  }
});

// DELETE /api/admin/temples/:id
router.delete("/temples/:id", async (req, res) => {
  try {
    await Temple.findByIdAndDelete(req.params.id);
    res.json({ message: "Shrine removed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete temple" });
  }
});

module.exports = router;
