const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { authenticateToken } = require('../middleware/auth');

// GET all hotels directly from MongoDB
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({});
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels from MongoDB' });
  }
});

// POST book hotel directly (Protected by JWT Authentication)
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { hotelId, roomType, nights, checkInDate, guestName } = req.body;
    const bookingRef = 'HTL-' + Math.floor(100000 + Math.random() * 900000);
    res.json({
      success: true,
      bookingRef,
      message: `Reservation confirmed for ${guestName || req.user.name}!`,
      checkInDate,
      nights
    });
  } catch (err) {
    res.status(500).json({ error: 'Hotel reservation failed' });
  }
});

module.exports = router;
