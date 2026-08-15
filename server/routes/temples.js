const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Temple = require('../models/Temple');

// GET all temples directly from MongoDB
router.get('/', async (req, res) => {
  try {
    const temples = await Temple.find({});
    res.json(temples);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch temples from MongoDB' });
  }
});

// GET single temple by id directly from MongoDB with CastError protection
router.get('/:id', async (req, res) => {
  try {
    const paramId = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
    
    let query = isObjectId 
      ? { $or: [{ id: paramId }, { _id: paramId }] }
      : { id: paramId };

    let temple = await Temple.findOne(query);

    // Fallback search by slug or name if not found directly
    if (!temple) {
      const allTemples = await Temple.find({});
      temple = allTemples.find(t => 
        t.id === paramId || 
        t._id.toString() === paramId ||
        (t.name && t.name.toLowerCase().replace(/\s+/g, '-').includes(paramId.toLowerCase()))
      );
    }

    if (!temple) {
      return res.status(404).json({ error: 'Temple not found' });
    }
    res.json(temple);
  } catch (err) {
    console.error("Fetch temple error:", err);
    res.status(500).json({ error: 'Failed to fetch temple details' });
  }
});

// POST review directly to MongoDB
router.post('/:id/review', async (req, res) => {
  try {
    const paramId = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(paramId);
    let query = isObjectId 
      ? { $or: [{ id: paramId }, { _id: paramId }] }
      : { id: paramId };

    let temple = await Temple.findOne(query);

    if (!temple) {
      const allTemples = await Temple.find({});
      temple = allTemples.find(t => t.id === paramId || t._id.toString() === paramId);
    }

    if (!temple) {
      return res.status(404).json({ error: 'Temple not found' });
    }
    const newReview = {
      user: req.body.user || 'Devotee',
      rating: req.body.rating || 5,
      comment: req.body.comment || ''
    };
    temple.reviews.push(newReview);
    await temple.save();
    res.json({ message: 'Review added successfully', reviews: temple.reviews });
  } catch (err) {
    console.error("Review post error:", err);
    res.status(500).json({ error: 'Failed to post review to MongoDB' });
  }
});

module.exports = router;
