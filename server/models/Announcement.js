const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Gate Status', 'Bhasma Aarti', 'Darshan Line', 'Crowd Advisory', 'General Notice'],
    default: 'Gate Status'
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Diverted', 'Advisory', 'Active'],
    default: 'Open'
  },
  gateName: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Shri Mahakaleshwar Temple Premises'
  },
  reason: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  postedBy: {
    type: String,
    default: 'Shri Mahakal Temple Administration'
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
