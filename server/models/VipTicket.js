const mongoose = require('mongoose');

const vipTicketSchema = new mongoose.Schema({
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
  pkgId: {
    type: String,
    required: true
  },
  pkgName: {
    type: String,
    required: true
  },
  gateNumber: {
    type: Number,
    default: 4
  },
  gateName: {
    type: String,
    default: 'Gate 4'
  },
  bookingDate: {
    type: String, // e.g. "2026-08-29"
    required: true
  },
  timeSlot: {
    type: String,
    default: '06:00 AM - 08:00 AM'
  },
  passesCount: {
    type: Number,
    required: true,
    default: 1
  },
  pricePerPass: {
    type: Number,
    required: true,
    default: 250
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 250
  },
  primaryName: {
    type: String,
    required: true
  },
  primaryEmail: {
    type: String,
    default: ''
  },
  primaryPhone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'used'],
    default: 'confirmed'
  }
}, { timestamps: true });

vipTicketSchema.pre('validate', function () {
  if (!this.ticketId) {
    this.ticketId = 'VIP-MAHAKAL-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  }
});

// Explicitly map to 'viptickets' collection in MongoDB as requested
module.exports = mongoose.model('VipTicket', vipTicketSchema, 'viptickets');
