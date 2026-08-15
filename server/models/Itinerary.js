const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  days: { type: String, required: true },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
