const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { authenticateToken } = require('../middleware/auth');

// GET all events from MongoDB
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events from MongoDB' });
  }
});

// POST book event pass directly (Protected by JWT Authentication)
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { eventId, tickets, userName, userEmail } = req.body;
    const bookingId = 'MHK-' + Math.floor(100000 + Math.random() * 900000);
    res.json({
      success: true,
      bookingId,
      message: `Pass confirmed for ${userName || req.user.name}!`,
      tickets: tickets || 1
    });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed in MongoDB' });
  }
});

module.exports = router;
