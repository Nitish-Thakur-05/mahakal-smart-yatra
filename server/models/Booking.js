const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  hotelPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  guestPhone: { type: String, default: '' },
  checkInDate: { type: String, required: true },
  checkOutDate: { type: String, required: true },
  nights: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  roomType: { type: String },
  hotelName: { type: String },
  roomNumber: { type: String },
  bookingRef: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'], 
    default: 'confirmed' 
  }
}, { timestamps: true });

// Auto-generate booking reference before save
bookingSchema.pre('save', async function () {
  if (!this.bookingRef) {
    this.bookingRef = 'HTL-' + Math.floor(100000 + Math.random() * 900000);
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
