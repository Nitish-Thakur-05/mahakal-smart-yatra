const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true }, // e.g., 'Deluxe', 'Standard', 'Suite'
  location: { type: String, default: 'Near Mahakaleshwar Temple, Ujjain' },
  distance: { type: String, default: '0.3 km from Temple' },
  rating: { type: Number, default: 4.8 },
  badge: { type: String, default: 'Mahakal Verified' },
  description: { type: String, default: '' },
  pricePerNight: { type: Number, required: true },
  maxGuests: { type: Number, default: 2 },
  amenities: [{ type: String }],
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
