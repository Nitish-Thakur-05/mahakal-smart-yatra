const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['devotee', 'hotel', 'official'], 
    default: 'devotee' 
  },
  isApproved: { type: Boolean, default: true },
  hotelName: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  hotelAddress: { type: String, default: '' },
  hotelDescription: { type: String, default: '' },
  amenities: [{ type: String }],
  checkInTime: { type: String, default: '12:00 PM' },
  checkOutTime: { type: String, default: '11:00 AM' },
  hotelImage: { type: String, default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200' }
}, { timestamps: true });

// Pre-save hook to hash password with bcryptjs (Modern Mongoose Async Hook)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
