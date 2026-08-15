const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  pricePerNight: { type: Number, required: true },
  image: { type: String },
  amenities: [{ type: String }],
  roomTypes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
