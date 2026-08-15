const mongoose = require('mongoose');

const entryPassSchema = new mongoose.Schema({
  passId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  primaryDevoteeName: { 
    type: String, 
    required: true 
  },
  contactPhone: { 
    type: String, 
    required: true 
  },
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, default: 25 },
    gender: { type: String, default: 'Other' },
    idProof: { type: String, default: '' }
  }],
  numberOfPersons: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 6 
  },
  gateNumber: { 
    type: Number, 
    required: true,
    enum: [1, 2, 3, 4, 5] 
  },
  gateName: { 
    type: String, 
    required: true 
  },
  gateDistance: { 
    type: Number, 
    required: true // distance in meters
  },
  crowdLevel: { 
    type: String, 
    enum: ['Low', 'Moderate', 'High', 'Festival Peak', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW' 
  },
  bookingDate: {
    type: String, // e.g. "2026-08-15"
    required: false
  },
  entryTime: { 
    type: Date, 
    required: true 
  },
  expiryTime: { 
    type: Date, 
    required: true 
  },
  validityMins: { 
    type: Number, 
    required: true 
  },
  isFestivalTime: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['active', 'used', 'expired', 'cancelled'], 
    default: 'active' 
  },
  qrPayload: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

// Auto-generate passId before validation if not preset
entryPassSchema.pre('validate', function () {
  if (!this.passId) {
    this.passId = 'MPASS-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  }
});

module.exports = mongoose.model('EntryPass', entryPassSchema);
