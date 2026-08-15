const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken, JWT_SECRET } = require("../middleware/auth");

function formatUserObj(user) {
  return {
    id: user._id,
    name: user.name ? user.name.replace(/Sancthan/g, 'Mahakal') : '',
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
    hotelName: user.hotelName || '',
    contactPhone: user.contactPhone || '',
    hotelAddress: user.hotelAddress || '',
    hotelDescription: user.hotelDescription || '',
    amenities: user.amenities || [],
    checkInTime: user.checkInTime || '12:00 PM',
    checkOutTime: user.checkOutTime || '11:00 AM',
    hotelImage: user.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
  };
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email address and password." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ 
        error: "We couldn't find an account registered with this email address. Please check your email or register a new account." 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: "The password you entered is incorrect. Please double-check your password and try again." 
      });
    }

    // Auto-grant official role for admin emails
    if (cleanEmail.includes('admin') && user.role !== 'official') {
      user.role = 'official';
      user.isApproved = true;
      await user.save();
    }

    // ENFORCE HOTEL PARTNER ADMIN APPROVAL RESTRICTION
    if (user.role === 'hotel' && !user.isApproved) {
      return res.status(403).json({
        error: "Account Under Verification: Your Hotel Partner account registration is currently pending review by Shri Mahakal Temple Administration. You will be able to sign in once your account is officially confirmed by Admin."
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Welcome back! Login successful.",
      token,
      user: formatUserObj(user)
    });
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred during login. Please try again." });
  }
});

// POST /api/auth/signup (Hotel Partner requires Admin Verification)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, hotelName, contactPhone } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: "Full Name, Email Address, and Password are all required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const selectedRole = ['devotee', 'hotel'].includes(role) ? role : 'devotee';
    const isApproved = selectedRole !== 'hotel'; // Hotel accounts require Admin approval first

    // Check if account already exists with this email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ 
        error: "An account with this email address already exists. Only one account can be registered per email. Please sign in to your existing account." 
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: selectedRole,
      isApproved,
      hotelName: hotelName || '',
      contactPhone: contactPhone || ''
    });

    if (selectedRole === 'hotel') {
      return res.json({
        pendingApproval: true,
        message: "Registration Application Received! Your Hotel Partner account has been submitted to Shri Mahakal Temple Administration for verification. You will be able to log in once your account is officially approved by Admin.",
        user: formatUserObj(user)
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Devotee account created successfully! Welcome to Shri Mahakal Portal.",
      token,
      user: formatUserObj(user)
    });
  } catch (err) {
    console.error("Signup Error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "An account with this email address already exists. Please sign in instead." 
      });
    }
    res.status(500).json({ error: err.message || "An unexpected error occurred during registration. Please try again." });
  }
});

// GET /api/auth/session
router.get("/session", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.json({ user: null });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ user: null });
    try {
      const user = await User.findById(decoded.userId);
      if (!user) return res.json({ user: null });
      res.json({ user: formatUserObj(user) });
    } catch {
      res.json({ user: null });
    }
  });
});

// PUT /api/auth/profile (Update User & Hotel Details)
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const {
      name,
      hotelName,
      contactPhone,
      hotelAddress,
      hotelDescription,
      amenities,
      checkInTime,
      checkOutTime,
      hotelImage
    } = req.body;

    if (name) user.name = name.trim();
    if (hotelName !== undefined) user.hotelName = hotelName.trim();
    if (contactPhone !== undefined) user.contactPhone = contactPhone.trim();
    if (hotelAddress !== undefined) user.hotelAddress = hotelAddress.trim();
    if (hotelDescription !== undefined) user.hotelDescription = hotelDescription.trim();
    if (Array.isArray(amenities)) user.amenities = amenities;
    if (checkInTime !== undefined) user.checkInTime = checkInTime.trim();
    if (checkOutTime !== undefined) user.checkOutTime = checkOutTime.trim();
    if (hotelImage !== undefined) user.hotelImage = hotelImage.trim();

    await user.save();

    res.json({
      message: "Hotel profile updated successfully!",
      user: formatUserObj(user)
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: err.message || "Failed to update hotel profile." });
  }
});

module.exports = router;
