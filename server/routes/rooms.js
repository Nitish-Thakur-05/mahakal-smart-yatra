const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { authenticateToken } = require('../middleware/auth');
const { sendETicketEmail } = require('../services/emailService');

// ─── HOTEL PARTNER: MY ROOMS ──────────────────────────────────────────────────

// GET all rooms listed by this hotel partner
router.get('/my-rooms', authenticateToken, async (req, res) => {
  try {
    const rooms = await Room.find({ hotelPartnerId: req.user.userId }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your rooms.' });
  }
});

// POST add a new room (Hotel Partner only)
router.post('/add-room', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'hotel') {
      return res.status(403).json({ error: 'Only Hotel Partners can add rooms.' });
    }
    const partnerUser = await User.findById(req.user.userId);
    const hotelName = partnerUser?.hotelName || partnerUser?.name || 'Mahakal Verified Hotel';
    const room = await Room.create({
      hotelPartnerId: req.user.userId,
      hotelName,
      location: req.body.location || `${hotelName}, Near Mahakal Temple, Ujjain`,
      distance: req.body.distance || '0.3 km from Temple',
      rating: req.body.rating || 4.8,
      badge: req.body.badge || req.body.roomType || 'Mahakal Verified',
      ...req.body
    });
    res.json({ message: 'Room listed successfully!', room });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to add room.' });
  }
});

// PUT update a room (Hotel Partner only)
router.put('/update-room/:id', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, hotelPartnerId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!room) return res.status(404).json({ error: 'Room not found or unauthorized.' });
    res.json({ message: 'Room updated.', room });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update room.' });
  }
});

// DELETE a room (Hotel Partner only)
router.delete('/delete-room/:id', authenticateToken, async (req, res) => {
  try {
    await Room.findOneAndDelete({ _id: req.params.id, hotelPartnerId: req.user.userId });
    res.json({ message: 'Room removed from listings.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete room.' });
  }
});

// ─── PUBLIC ROOM LISTINGS ─────────────────────────────────────────────────────

// GET all available rooms (for devotees browsing)
router.get('/available', async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms.' });
  }
});

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

// POST book a room by ID
router.post('/book/:id', authenticateToken, async (req, res) => {
  try {
    const { checkInDate, checkOutDate, nights, guestPhone } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: 'Room not found.' });
    if (!room.isAvailable) return res.status(400).json({ error: 'This room is not currently available for booking.' });

    const totalPrice = room.pricePerNight * (nights || 1);

    const booking = await Booking.create({
      roomId: room._id,
      hotelPartnerId: room.hotelPartnerId,
      userId: req.user.userId,
      guestName: req.user.name,
      guestEmail: req.user.email,
      guestPhone: guestPhone || '',
      checkInDate,
      checkOutDate,
      nights: nights || 1,
      totalPrice,
      roomType: room.roomType,
      hotelName: room.hotelName,
      roomNumber: room.roomNumber,
      status: 'confirmed'
    });

    // Auto-send hotel booking confirmation E-Ticket email
    if (req.user.email) {
      sendETicketEmail({
        toEmail: req.user.email,
        ticketType: "HOTEL STAY RESERVATION",
        ticketDetails: {
          passId: booking.bookingRef || booking._id.toString().substring(16).toUpperCase(),
          primaryName: req.user.name,
          contactPhone: guestPhone,
          bookingDate: checkInDate,
          hotelName: room.hotelName,
          roomType: room.roomType,
          totalAmount: totalPrice,
        },
      });
    }

    res.json({
      success: true,
      message: `Room booked successfully! Your booking reference is ${booking.bookingRef}.`,
      booking
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: err.message || 'Booking failed. Please try again.' });
  }
});

// GET all bookings for a user (Devotee)
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('roomId', 'roomNumber roomType hotelName images pricePerNight')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your bookings.' });
  }
});

// GET all bookings for a hotel partner's rooms
router.get('/partner-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ hotelPartnerId: req.user.userId })
      .populate('userId', 'name email contactPhone')
      .populate('roomId', 'roomNumber roomType')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch partner bookings.' });
  }
});

// PATCH cancel booking
router.patch('/cancel-booking/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user.userId }, { hotelPartnerId: req.user.userId }]
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found or unauthorized.' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

module.exports = router;
