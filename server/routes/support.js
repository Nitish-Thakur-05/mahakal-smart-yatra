const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/adminAuth');

// POST /api/support - Submit a new support ticket (Authenticated Users Only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, category, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, Phone Number, and Message details are required.' });
    }

    const userId = req.user?.userId || req.user?.id || req.user?._id;

    const ticket = new SupportTicket({
      user: userId,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      category: category || 'General Inquiry',
      message: message.trim(),
      status: 'Pending'
    });

    await ticket.save();
    return res.status(201).json({ success: true, message: 'Support ticket logged successfully.', ticket });
  } catch (err) {
    console.error('Error creating support ticket:', err);
    return res.status(500).json({ error: err.message || 'Failed to create support ticket. Please try again.' });
  }
});

// GET /api/support/admin - Get all support tickets for Admin Dashboard
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    return res.json(tickets);
  } catch (err) {
    console.error('Error fetching support tickets for admin:', err);
    return res.status(500).json({ error: 'Failed to load support tickets.' });
  }
});

// PATCH /api/support/admin/:id/status - Update support ticket status
router.patch('/admin/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const existingTicket = await SupportTicket.findById(req.params.id);
    if (!existingTicket) {
      return res.status(404).json({ error: 'Support ticket not found.' });
    }

    if (existingTicket.status === 'Resolved' || existingTicket.status === 'Closed') {
      return res.status(400).json({ error: 'This query has already been resolved and cannot be changed.' });
    }

    existingTicket.status = status;
    await existingTicket.save();

    return res.json({ success: true, message: 'Ticket status updated.', ticket: existingTicket });
  } catch (err) {
    console.error('Error updating support ticket status:', err);
    return res.status(500).json({ error: 'Failed to update ticket status.' });
  }
});

module.exports = router;
