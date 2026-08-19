const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/Event");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// GET all user-submitted events from MongoDB
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events from MongoDB" });
  }
});

// GET current user's submitted events
router.get("/my-events", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const email = req.user.email;
    const events = await Event.find({
      $or: [{ creatorUserId: userId }, { creatorEmail: email }],
    }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user events" });
  }
});

// POST create a new local event
router.post("/add", optionalAuth, async (req, res) => {
  try {
    const {
      title,
      titleHi,
      category,
      venue,
      distance,
      date,
      time,
      organizer,
      phone,
      contactPerson,
      image,
      description,
      highlights,
      mapLocation,
      entryFee,
    } = req.body;

    if (!title || !venue || !date || !time) {
      return res
        .status(400)
        .json({ error: "Event Title, Venue, Date, and Time are required." });
    }

    const creatorUserId = (req.user && req.user.userId) ? req.user.userId : new mongoose.Types.ObjectId();
    const creatorEmail = (req.user && req.user.email) ? req.user.email : (phone ? `contact_${phone.replace(/\s+/g, '')}@mahakalyatra.org` : 'devotee@mahakalyatra.org');
    const creatorName = (req.user && req.user.name) ? req.user.name : (organizer || 'Devotee Organiser');

    const newEvtId = "evt_custom_" + Date.now();
    const event = await Event.create({
      id: newEvtId,
      title: title.trim(),
      titleHi: titleHi ? titleHi.trim() : "",
      category: category || "Bhajan & Music",
      venue: venue.trim(),
      distance: distance || "Near Temple",
      date: date.trim(),
      time: time.trim(),
      organizer: organizer || creatorName,
      phone: phone || "+91 98260 14782",
      contactPerson: contactPerson || creatorName,
      image:
        image && image.trim() !== ""
          ? image.trim()
          : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800",
      description: description ? description.trim() : "",
      highlights: Array.isArray(highlights)
        ? highlights
        : highlights
          ? highlights.split("\n").filter(Boolean)
          : [],
      mapLocation: mapLocation || "Ujjain, Madhya Pradesh",
      entryFee: entryFee || "Free Entry",
      creatorUserId,
      creatorEmail,
      creatorName,
    });

    console.log(
      `🎉 New Local Event Created: "${event.title}" by ${creatorName} (${creatorEmail})`,
    );

    res.json({
      success: true,
      message: "Local Event posted successfully! Visible to all pilgrims.",
      event,
    });
  } catch (err) {
    console.error("Create event error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to post local event." });
  }
});

// DELETE a user's submitted local event
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findOne({
      $or: [{ id: eventId }, { _id: eventId }],
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const isCreator =
      (event.creatorUserId &&
        event.creatorUserId.toString() === req.user.userId) ||
      (event.creatorEmail && event.creatorEmail === req.user.email);
    const isAdmin = ["official", "admin"].includes(req.user.role);

    if (!isCreator && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Only the event creator or admin can remove this event." });
    }

    await Event.deleteOne({ _id: event._id });
    console.log(`🗑️ Local Event Deleted: "${event.title}" (ID: ${event.id})`);

    res.json({
      success: true,
      message: "Local Event removed successfully.",
    });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// POST book event pass directly
router.post("/book", authenticateToken, async (req, res) => {
  try {
    const { eventId, tickets, userName, userEmail } = req.body;
    const bookingId = "MHK-" + Math.floor(100000 + Math.random() * 900000);
    res.json({
      success: true,
      bookingId,
      message: `Pass confirmed for ${userName || req.user.name}!`,
      tickets: tickets || 1,
    });
  } catch (err) {
    res.status(500).json({ error: "Booking failed in MongoDB" });
  }
});

module.exports = router;
