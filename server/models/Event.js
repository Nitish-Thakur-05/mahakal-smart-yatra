const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  date: { type: String },
  time: { type: String },
  location: { type: String },
  image: { type: String },
  description: { type: String },
  availableTickets: { type: Number, default: 100 },
  price: { type: Number, default: 0 },
  badge: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
