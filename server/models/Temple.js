const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, default: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const templeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String },
  tagline: { type: String },
  location: { type: String, required: true },
  city: { type: String, default: 'Ujjain' },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  images: [{ type: String }],
  image: { type: String },
  description: { type: String },
  detailedHistory: { type: String },
  highlight: { type: String },
  timings: { type: String },
  virtualTourUrl: { type: String },
  facilities: [{ type: String }],
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);
