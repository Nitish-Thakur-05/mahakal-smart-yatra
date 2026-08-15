const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { requireAdmin } = require('../middleware/adminAuth');

// GET /api/announcements (Public - Devotee Access)
router.get('/', async (req, res) => {
  try {
    let announcements = await Announcement.find({}).sort({ createdAt: -1 });
    
    // Seed initial announcements if database table is empty
    if (announcements.length === 0) {
      const initialNotices = [
        {
          title: "Gate No. 1 (General Darshan Entry) Fully Operational",
          category: "Gate Status",
          status: "Open",
          gateName: "Gate 1 - General Queue",
          location: "Bada Ganesh Temple Side",
          reason: "Normal Queue Flow",
          description: "General Darshan queue is operating smoothly. Average waiting time is 25-30 minutes for Garbhagriha darshan.",
          priority: "Normal"
        },
        {
          title: "Gate No. 4 (Nandi Mandapam) Temporary Maintenance Closure",
          category: "Gate Status",
          status: "Closed",
          gateName: "Gate 4 - Nandi Hall",
          location: "Nandi Mandapam Entrance",
          reason: "Routine sanitization, flower decoration & security review before evening Sandhya Aarti.",
          description: "Gate 4 is closed from 2:00 PM to 4:30 PM. Pass holders are requested to divert to Gate No. 3.",
          priority: "High"
        },
        {
          title: "Gate No. 5 (VIP & Protocol Entry) Diverted",
          category: "Gate Status",
          status: "Diverted",
          gateName: "Gate 5 - Protocol",
          location: "VIP Car Pass Parking Side",
          reason: "Heavy footfall of special festival buses.",
          description: "Protocol visitors are requested to present original Photo ID and e-pass at Gate 3 counter.",
          priority: "Normal"
        },
        {
          title: "Bhasma Aarti Counter Advisory & Online Verification",
          category: "Bhasma Aarti",
          status: "Active",
          gateName: "Bhasma Aarti Cell",
          location: "Prashasnik Bhavan Counter 2",
          reason: "Offline counter quota filled for today.",
          description: "Bhasma Aarti offline counter token distribution is complete for today. Pilgrims with valid online e-passes can proceed for biometric verification between 10:00 PM to 1:00 AM.",
          priority: "Urgent"
        },
        {
          title: "Gate No. 2 (Siddhivinayak Entry) Fast-Track Clear",
          category: "Gate Status",
          status: "Open",
          gateName: "Gate 2 - Siddhivinayak",
          location: "Siddhivinayak Mandir Gate",
          reason: "Normal Flow - 10 Min Wait",
          description: "Gate No. 2 is open for senior citizens, quick darshan ticket holders, and families with small children.",
          priority: "Normal"
        },
        {
          title: "Shri Mahakal Lok Electric Golf Cart Service Operational",
          category: "Crowd Advisory",
          status: "Active",
          gateName: "Mahakal Lok Corridor",
          location: "Triveni Museum Plaza to Gate 1",
          reason: "Complimentary Pilgrim Assistance",
          description: "Complimentary battery-operated E-Carts are available continuously for elderly pilgrims, pregnant women, and differently-abled devotees.",
          priority: "Normal"
        }
      ];

      announcements = await Announcement.insertMany(initialNotices);
    }

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcements." });
  }
});

// Admin-protected routes
router.use(requireAdmin);

// POST /api/announcements (Create Announcement)
router.post('/', async (req, res) => {
  try {
    const { title, category, status, gateName, location, reason, description, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    const notice = await Announcement.create({
      title,
      category: category || 'Gate Status',
      status: status || 'Open',
      gateName: gateName || '',
      location: location || 'Shri Mahakaleshwar Temple Premises',
      reason: reason || '',
      description,
      priority: priority || 'Normal'
    });

    res.json({ message: "Announcement published successfully!", announcement: notice });
  } catch (err) {
    res.status(500).json({ error: "Failed to create announcement." });
  }
});

// PUT /api/announcements/:id (Update Announcement)
router.put('/:id', async (req, res) => {
  try {
    const notice = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) {
      return res.status(404).json({ error: "Announcement record not found." });
    }
    res.json({ message: "Announcement updated successfully!", announcement: notice });
  } catch (err) {
    res.status(500).json({ error: "Failed to update announcement." });
  }
});

// DELETE /api/announcements/:id (Delete Announcement)
router.delete('/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete announcement." });
  }
});

module.exports = router;
