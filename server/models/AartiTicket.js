const mongoose = require('mongoose');

const aartiTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  aartiId: {
    type: String,
    required: true // 'bhasma', 'dadhodak', 'bhog', 'sandhya', 'shringar', 'shayan'
  },
  aartiName: {
    type: String,
    required: true
  },
  bookingDate: {
    type: String, // e.g. "2026-08-22"
    required: true
  },
  ticketsCount: {
    type: Number,
    required: true,
    default: 1
  },
  primaryDevoteeName: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'used'],
    default: 'confirmed'
  }
}, { timestamps: true });

aartiTicketSchema.pre('validate', function () {
  if (!this.ticketId) {
    this.ticketId = 'AARTI-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  }
});

// Explicitly use 'artiestickets' collection in MongoDB as requested
module.exports = mongoose.model('AartiTicket', aartiTicketSchema, 'artiestickets');
