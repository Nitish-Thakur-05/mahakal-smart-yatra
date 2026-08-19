const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const EntryPass = require("../models/EntryPass");
const AartiTicket = require("../models/AartiTicket");
const VipTicket = require("../models/VipTicket");
const { authenticateToken } = require("../middleware/auth");
const { invalidateCrowdCache } = require("../services/crowdDataset");
const { sendETicketEmail } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mahakal_jwt_secret_key_2026";

function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err && user) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
}

// Gates configuration & details
const GATE_CONFIG = {
  1: { number: 1, name: "Gate 1 - Bada Ganesh Dwar", distance: 850 },
  2: { number: 2, name: "Gate 2 - Nandi Dwar (Main Gate)", distance: 650 },
  3: { number: 3, name: "Gate 3 - VIP / Shankhadwar Gate", distance: 400 },
  4: { number: 4, name: "Gate 4 - Char Dham Dwar", distance: 1000 },
  5: { number: 5, name: "Gate 5 - Harsiddhi Gate", distance: 750 },
};

const CROWD_MULTIPLIERS = {
  Low: 1.0,
  Moderate: 1.4,
  High: 2.0,
  "Festival Peak": 2.8,
};

// Formula to compute validity time in minutes based on distance & crowd level
function calculatePassValidityMins(distanceMeters, crowdLevel) {
  const multiplier = CROWD_MULTIPLIERS[crowdLevel] || 1.4;
  const tWalk = (distanceMeters / 100) * 10 * multiplier;
  const tDarshan = 25 * multiplier;
  const tExit = 15;
  return Math.round(tWalk + tDarshan + tExit);
}

/**
 * Helper to auto-select the gate with the lowest active queue crowd in DB
 * and auto-calculate crowd level & festival status.
 */
async function getLowestCrowdGateAndMetrics() {
  const now = new Date();
  let activePasses = [];
  if (mongoose.connection.readyState === 1) {
    try {
      activePasses = await EntryPass.find({
        status: "active",
        expiryTime: { $gt: now },
      });
    } catch (e) {
      activePasses = [];
    }
  }

  const gateActiveCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalActiveCrowd = 0;

  activePasses.forEach((p) => {
    const persons = p.numberOfPersons || 1;
    const gNo = p.gateNumber || 1;
    if (gateActiveCounts[gNo] !== undefined) {
      gateActiveCounts[gNo] += persons;
    }
    totalActiveCrowd += persons;
  });

  // Find gate with lowest active queue crowd
  let minGateNo = 1;
  let minCount = Infinity;

  [1, 2, 3, 4, 5].forEach((gNo) => {
    if (gateActiveCounts[gNo] < minCount) {
      minCount = gateActiveCounts[gNo];
      minGateNo = gNo;
    }
  });

  const selectedGate = GATE_CONFIG[minGateNo];

  // Auto-determine Crowd Level based on active temple count & assigned gate queue
  let crowdLevel = "Low";
  if (minCount >= 60 || totalActiveCrowd >= 300) {
    crowdLevel = "Festival Peak";
  } else if (minCount >= 35 || totalActiveCrowd >= 180) {
    crowdLevel = "High";
  } else if (minCount >= 15 || totalActiveCrowd >= 70) {
    crowdLevel = "Moderate";
  }

  // Auto-detect festival time (e.g., Monday or Shivratri/Surge crowd)
  const isMonday = now.getDay() === 1;
  const isFestivalTime = isMonday || totalActiveCrowd >= 200;

  return {
    gate: selectedGate,
    currentGateQueueCount: minCount,
    totalActiveCrowd,
    crowdLevel,
    isFestivalTime,
    allGateQueues: gateActiveCounts,
  };
}

const handleBookPassRequest = async (req, res) => {
  try {
    const userId = (req.user && req.user.userId) ? req.user.userId : new mongoose.Types.ObjectId();
    const primaryDevoteeName = req.body.primaryDevoteeName || "Devotee";
    const contactPhone = req.body.contactPhone || "9876543210";
    const passengers = req.body.passengers;
    const { bookingDate, aartiId, aartiName } = req.body;

    // Validate passengers array (Max 6 persons)
    const devoteesList =
      Array.isArray(passengers) && passengers.length > 0
        ? passengers
        : [
            {
              name: primaryDevoteeName,
              age: 30,
              gender: "Other",
              idProof: "Aadhar/Govt ID",
            },
          ];

    if (devoteesList.length > 6) {
      return res
        .status(400)
        .json({
          error:
            "Booking limit exceeded! Maximum 6 passes can be booked in one entry pass request.",
        });
    }

    // Validate 30-Day Booking Window (1 Month Forward)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxAllowedDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days max

    let selectedBookingDate = today;
    let targetBookingDateStr = bookingDate ? bookingDate.trim() : today.toISOString().substring(0, 10);

    if (bookingDate) {
      const parts = bookingDate.trim().split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        selectedBookingDate = new Date(year, month, day);
      }
    }

    // AUTO-ASSIGN GATE WITH LOWEST CROWD QUEUE IN DB & AUTO-CALCULATE METRICS
    const { gate, isFestivalTime, currentGateQueueCount } =
      await getLowestCrowdGateAndMetrics();

    // FETCH AI CROWD FORECAST FOR SELECTED BOOKING DATE
    let predictedCrowdLevel = "LOW";
    let predictedExpectedCrowd = 140;

    try {
      const forecast = await fetchChronosForecast();
      if (forecast.tomorrow && forecast.tomorrow.date === targetBookingDateStr) {
        predictedCrowdLevel = forecast.tomorrow.crowdLevel || "LOW";
        predictedExpectedCrowd = forecast.tomorrow.expectedCrowd || 140;
      } else if (
        forecast.upcomingDays &&
        Array.isArray(forecast.upcomingDays)
      ) {
        const matchDay = forecast.upcomingDays.find(
          (d) => d.date === targetBookingDateStr,
        );
        if (matchDay) {
          predictedCrowdLevel = matchDay.crowdLevel || "LOW";
          predictedExpectedCrowd = matchDay.expectedCrowd || 140;
        }
      }
    } catch (aiErr) {
      console.warn("AI forecast lookup note:", aiErr.message);
    }

    let validityMins = 300;
    const normLevel = (predictedCrowdLevel || "LOW").toUpperCase();
    if (normLevel === "CRITICAL") validityMins = 120;
    else if (normLevel === "HIGH") validityMins = 150;
    else if (normLevel === "MEDIUM") validityMins = 180;
    else validityMins = 300;

    const entryDateObj = new Date(selectedBookingDate);
    entryDateObj.setHours(now.getHours(), now.getMinutes(), 0, 0);

    const expiryDateObj = new Date(
      entryDateObj.getTime() + validityMins * 60 * 1000,
    );

    const generatedPassId =
      "MPASS-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(100000 + Math.random() * 900000);

    const qrPayload = JSON.stringify({
      passId: generatedPassId,
      gateNo: gate.number,
      gateName: gate.name,
      primaryDevotee: primaryDevoteeName,
      personsCount: devoteesList.length,
      entryTime: entryDateObj.toISOString(),
      expiryTime: expiryDateObj.toISOString(),
      validityMins,
      predictedCrowdLevel,
      verifiable: "SHRI_MAHAKAL_TEMPLE_UJJAIN_OFFICIAL",
    });

    const passObj = await EntryPass.create({
      passId: generatedPassId,
      userId,
      primaryDevoteeName: primaryDevoteeName.trim(),
      contactPhone: contactPhone.trim(),
      passengers: devoteesList,
      numberOfPersons: devoteesList.length,
      gateNumber: gate.number,
      gateName: gate.name,
      gateDistance: gate.distance,
      crowdLevel: predictedCrowdLevel,
      bookingDate: targetBookingDateStr,
      aartiId: aartiId || 'dadhodak',
      aartiName: aartiName || 'Dadhodak Aarti (Naivedya Aarti)',
      entryTime: entryDateObj,
      expiryTime: expiryDateObj,
      validityMins,
      isFestivalTime,
      status: "active",
      qrPayload,
    });

    // Also persist into dedicated 'artiestickets' collection on MongoDB
    try {
      await AartiTicket.create({
        ticketId: 'AARTI-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
        userId: userId || null,
        aartiId: aartiId || 'dadhodak',
        aartiName: aartiName || 'Dadhodak Aarti (Naivedya Aarti)',
        bookingDate: targetBookingDateStr,
        ticketsCount: devoteesList.length,
        primaryDevoteeName: primaryDevoteeName.trim(),
        contactPhone: contactPhone.trim(),
        status: 'confirmed'
      });
      console.log(`✅ Saved AartiTicket in 'artiestickets' collection for ${targetBookingDateStr} (${aartiId || 'dadhodak'})!`);
    } catch (atErr) {
      console.warn("AartiTicket collection save note:", atErr.message);
    }

    // Invalidate Chronos-2 AI Crowd forecast cache to trigger dynamic re-forecasting
    invalidateCrowdCache();

    // Auto-send official E-Ticket HTML email to devotee
    const targetEmail = req.body.primaryEmail || req.body.email || (req.user && req.user.email) || "";
    if (targetEmail) {
      try {
        await sendETicketEmail({
          toEmail: targetEmail,
          ticketType: aartiName ? `OFFICIAL MAHAKAL AARTI PASS` : "OFFICIAL MAHAKAL DARSHAN E-PASS",
          ticketDetails: {
            passId: generatedPassId,
            primaryName: primaryDevoteeName,
            contactPhone,
            bookingDate: targetBookingDateStr,
            aartiName: aartiName || "Shri Mahakal General Darshan Pass",
            gateName: gate.name,
            gateNumber: gate.number,
            numberOfPersons: devoteesList.length,
          },
        });
      } catch (eErr) {
        console.error("Pass email dispatch error:", eErr.message);
      }
    }

    const formattedBookingDateStr = selectedBookingDate.toLocaleDateString(
      "en-US",
      { weekday: "short", month: "short", day: "numeric" },
    );

    res.json({
      success: true,
      message: `Mahakal Entry Pass booked for ${formattedBookingDateStr}! Auto-Assigned Gate: ${gate.name}. Pass validity: ${validityMins / 60} hours (Calculated from AI Predicted ${predictedCrowdLevel} crowd level).`,
      pass: passObj,
    });
  } catch (err) {
    console.error("Book pass error:", err);
    res
      .status(500)
      .json({
        error: err.message || "Failed to book entry pass. Please try again.",
      });
  }
};

// Register both /book and /generate-epass routes for seamless frontend integration
router.post("/book", optionalAuth, handleBookPassRequest);
router.post("/generate-epass", optionalAuth, handleBookPassRequest);

// POST /api/passes/book-vip-ticket - Book VIP Darshan Ticket into 'viptickets' MongoDB collection
router.post("/book-vip-ticket", optionalAuth, async (req, res) => {
  try {
    const {
      bookingDate,
      pkgId,
      pkgName,
      passesCount,
      pricePerPass,
      totalAmount,
      primaryName,
      primaryEmail,
      primaryPhone,
      gateNumber,
      gateName,
      timeSlot
    } = req.body;

    const targetDateStr = bookingDate ? bookingDate.trim() : new Date().toISOString().substring(0, 10);
    const count = Number(passesCount) || 1;

    const ticketObj = await VipTicket.create({
      ticketId: 'VIP-MAHAKAL-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
      userId: (req.user && req.user.userId) ? req.user.userId : null,
      pkgId: pkgId || 'sheeta-gate-express',
      pkgName: pkgName || 'Sheeta Dwar Fast-Track Pass',
      gateNumber: gateNumber || 4,
      gateName: gateName || 'Gate 4',
      bookingDate: targetDateStr,
      timeSlot: timeSlot || '06:00 AM - 08:00 AM',
      passesCount: count,
      pricePerPass: pricePerPass || 250,
      totalAmount: totalAmount || (count * (pricePerPass || 250)),
      primaryName: primaryName || 'Devotee',
      primaryEmail: primaryEmail || '',
      primaryPhone: primaryPhone || '',
      status: 'confirmed'
    });

    console.log(`👑 Saved VipTicket in 'viptickets' collection for ${targetDateStr} (${pkgName}, ${count} pass)!`);

    // Auto-send official VIP E-Ticket email to devotee
    const targetVipEmail = primaryEmail || (req.user && req.user.email) || "";
    if (targetVipEmail) {
      sendETicketEmail({
        toEmail: targetVipEmail,
        ticketType: "VIP PROTOCOL DARSHAN PASS",
        ticketDetails: {
          passId: ticketObj.ticketId,
          primaryName: primaryName || "Devotee",
          contactPhone: primaryPhone,
          bookingDate: targetDateStr,
          timeSlot,
          gateName: gateName || "Gate 4",
          gateNumber,
          numberOfPersons: count,
          totalAmount: totalAmount || (count * (pricePerPass || 250)),
        },
      });
    }

    res.json({
      success: true,
      message: `VIP Darshan Ticket issued for ${targetDateStr}!`,
      ticket: ticketObj
    });
  } catch (err) {
    console.error("VIP Ticket save error:", err);
    res.status(500).json({ error: "Failed to book VIP ticket." });
  }
});

// Auto-correct existing VIP tickets for 2026-08-31 to ensure count = 1
async function sanitizeVipTickets() {
  try {
    if (mongoose.connection.readyState === 1) {
      await VipTicket.updateMany(
        { bookingDate: '2026-08-31', passesCount: 4 },
        { $set: { passesCount: 1, totalAmount: 250 } }
      );
    }
  } catch (err) {
    // silent
  }
}
setTimeout(sanitizeVipTickets, 2000);

// Auto-seed initial VipTicket into 'viptickets' collection so collection exists immediately in MongoDB
async function seedInitialVipTickets() {
  try {
    if (mongoose.connection.readyState === 1) {
      await VipTicket.createCollection();
      const count = await VipTicket.countDocuments();
      if (count === 0) {
        await VipTicket.create([
          {
            ticketId: 'VIP-MAHAKAL-2026-829001',
            pkgId: 'sheeta-gate-express',
            pkgName: 'Sheeta Dwar Fast-Track Pass',
            gateNumber: 4,
            gateName: 'Gate 4 (Sheeta Dwar)',
            bookingDate: '2026-08-29',
            timeSlot: '06:00 AM - 08:00 AM',
            passesCount: 2,
            pricePerPass: 250,
            totalAmount: 500,
            primaryName: 'Vikram Singh',
            primaryEmail: 'vikram@example.com',
            primaryPhone: '9876543210',
            status: 'confirmed'
          },
          {
            ticketId: 'VIP-MAHAKAL-2026-829002',
            pkgId: 'garbhagriha-protocol',
            pkgName: 'Protocol Garbhagriha View Pass',
            gateNumber: 1,
            gateName: 'Gate 1 (Avantika Dwar)',
            bookingDate: '2026-08-29',
            timeSlot: '09:00 AM - 11:00 AM',
            passesCount: 1,
            pricePerPass: 750,
            totalAmount: 750,
            primaryName: 'Sunita Rao',
            primaryEmail: 'sunita@example.com',
            primaryPhone: '9876543211',
            status: 'confirmed'
          }
        ]);
        console.log("🌱 Auto-created 'viptickets' collection in MongoDB and seeded initial VIP passes for 2026-08-29!");
      }
    }
  } catch (err) {
    console.warn("VipTicket init note:", err.message);
  }
}
setTimeout(seedInitialVipTickets, 1500);

// GET /api/passes/my-passes - Get passes for current logged-in user
router.get("/my-passes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const email = req.user.email;
    const name = req.user.name;

    let passes = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const queryConditions = [{ userId }];
        if (email) queryConditions.push({ userEmail: email });
        if (name) queryConditions.push({ primaryDevoteeName: name });
        passes = await EntryPass.find({ $or: queryConditions }).sort({ createdAt: -1 });
      } catch (err) {
        passes = [];
      }
    }

    // Auto-update expired passes
    const now = new Date();
    for (let pass of passes) {
      if (pass.status === "active" && now > pass.expiryTime) {
        pass.status = "expired";
        await pass.save();
      }
    }

    const lastPass = passes[0];
    let cooldownActive = false;
    let remainingMs = 0;
    if (lastPass) {
      const COOLDOWN_MS = 5 * 60 * 60 * 1000;
      const timeSince = Date.now() - new Date(lastPass.createdAt).getTime();
      if (timeSince < COOLDOWN_MS) {
        cooldownActive = true;
        remainingMs = COOLDOWN_MS - timeSince;
      }
    }

    res.json({
      passes,
      cooldown: {
        active: cooldownActive,
        remainingMs,
        nextAllowedTime: cooldownActive
          ? new Date(Date.now() + remainingMs)
          : null,
      },
    });
  } catch (err) {
    console.error("Fetch passes error:", err);
    res.status(500).json({ error: "Failed to load entry passes." });
  }
});

// GET /api/passes/my-vip-tickets - Get VIP tickets for current logged-in user
router.get("/my-vip-tickets", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const email = req.user.email;
    const name = req.user.name;

    let vipTickets = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const queryConditions = [{ userId }];
        if (email) queryConditions.push({ primaryEmail: email });
        if (name) queryConditions.push({ primaryName: name });
        vipTickets = await VipTicket.find({ $or: queryConditions }).sort({ createdAt: -1 });
      } catch (err) {
        vipTickets = [];
      }
    }
    res.json({ vipTickets });
  } catch (err) {
    res.status(500).json({ error: "Failed to load VIP tickets." });
  }
});

// GET /api/passes/gates - Get current active crowd per gate
router.get("/gates", async (req, res) => {
  try {
    const gateMetrics = await getLowestCrowdGateAndMetrics();
    res.json({
      gates: Object.values(GATE_CONFIG),
      suggestedGate: gateMetrics.gate,
      gateQueues: gateMetrics.allGateQueues,
    });
  } catch (err) {
    res.json({ gates: Object.values(GATE_CONFIG) });
  }
});

// GET /api/passes/analytics - Aggregate visitor metrics: Hourly, Daily, Festival, Monthly
router.get("/analytics", async (req, res) => {
  try {
    let passes = [];
    if (mongoose.connection.readyState === 1) {
      try {
        passes = await EntryPass.find({});
      } catch (err) {
        passes = [];
      }
    }

    const hourlyData = Array(24).fill(0);
    const dayOfWeekData = {
      Sun: 0,
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
    };
    const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let festivalVisitors = 0;
    let normalVisitors = 0;

    const monthlyVisitors = Array(12).fill(0);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const gateVisitors = {
      "Gate 1 (Bada Ganesh)": 0,
      "Gate 2 (Nandi Dwar)": 0,
      "Gate 3 (VIP Shankhadwar)": 0,
      "Gate 4 (Char Dham)": 0,
      "Gate 5 (Harsiddhi)": 0,
    };

    let totalVisitorsCount = 0;
    let activePassesCount = 0;

    // Load 1-Year Historical Dataset from mockPrevYearData.json
    const { loadOrGenerateMockPrevYearData } = require('../services/crowdDataset');
    const mockBaseline = loadOrGenerateMockPrevYearData();

    // Seed historical baseline from mockPrevYearData.json
    mockBaseline.forEach((pt) => {
      const ptDt = new Date(pt.timestamp);
      const hour = ptDt.getHours();
      const dayIdx = ptDt.getDay();
      const monthIdx = ptDt.getMonth();
      const crowd = pt.crowd || 0;

      hourlyData[hour] += crowd;
      dayOfWeekData[dayKeys[dayIdx]] += crowd;
      monthlyVisitors[monthIdx] += crowd;
      totalVisitorsCount += crowd;

      if (pt.isSawanMonth || pt.isFestival || pt.isMonday) {
        festivalVisitors += crowd;
      } else {
        normalVisitors += crowd;
      }
    });

    const now = new Date();
    const todayStr = now.toISOString().substring(0, 10);

    // Calculate Gate-Wise Visitors STRICTLY from real active, non-expired passes booked FOR TODAY
    passes.forEach((p) => {
      const entryDate = new Date(p.entryTime || p.createdAt);
      const passBookingDate = p.bookingDate || entryDate.toISOString().substring(0, 10);
      const hour = entryDate.getHours();
      const dayIdx = entryDate.getDay();
      const monthIdx = entryDate.getMonth();
      const persons = p.numberOfPersons || 1;

      hourlyData[hour] += persons;
      dayOfWeekData[dayKeys[dayIdx]] += persons;
      monthlyVisitors[monthIdx] += persons;
      totalVisitorsCount += persons;

      const isFestiveOrSurge =
        Boolean(p.isFestivalTime) ||
        dayIdx === 1 ||
        p.gateNumber === 3 ||
        p.gateNumber === 2 ||
        (hour >= 4 && hour <= 6) ||
        (hour >= 17 && hour <= 20);

      if (isFestiveOrSurge) {
        festivalVisitors += persons;
      } else {
        normalVisitors += persons;
      }

      // Check if pass is active, NOT expired, AND booked FOR TODAY
      const isActiveToday =
        p.status === "active" &&
        new Date() <= new Date(p.expiryTime) &&
        passBookingDate === todayStr;

      if (isActiveToday) {
        activePassesCount += persons;

        // Gate-wise distribution strictly tracks real active devotees on that gate TODAY
        const gateNo = p.gateNumber || 1;
        if (gateNo === 1) gateVisitors["Gate 1 (Bada Ganesh)"] += persons;
        else if (gateNo === 2) gateVisitors["Gate 2 (Nandi Dwar)"] += persons;
        else if (gateNo === 3) gateVisitors["Gate 3 (VIP Shankhadwar)"] += persons;
        else if (gateNo === 4) gateVisitors["Gate 4 (Char Dham)"] += persons;
        else if (gateNo === 5) gateVisitors["Gate 5 (Harsiddhi)"] += persons;
      }
    });

    const hourlyFormatted = hourlyData.map((count, hr) => {
      const formattedHr =
        hr === 0
          ? "12 AM"
          : hr < 12
            ? `${hr} AM`
            : hr === 12
              ? "12 PM"
              : `${hr - 12} PM`;
      return { hourLabel: formattedHr, hour: hr, count };
    });

    const monthlyFormatted = monthNames.map((name, idx) => ({
      month: name,
      count: monthlyVisitors[idx],
    }));

    res.json({
      summary: {
        totalPassesIssued: passes.length,
        totalVisitorsCount,
        activePassesCount,
        festivalVisitors,
        normalVisitors,
      },
      hourly: hourlyFormatted,
      dayOfWeek: Object.keys(dayOfWeekData).map((k) => ({
        day: k,
        count: dayOfWeekData[k],
      })),
      monthly: monthlyFormatted,
      gateDistribution: Object.keys(gateVisitors).map((g) => ({
        gate: g,
        count: gateVisitors[g],
      })),
      festivalVsNormal: [
        { category: "Festival / Special Days", count: festivalVisitors },
        { category: "Regular Days", count: normalVisitors },
      ],
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to generate visitor analytics." });
  }
});

// GET /api/passes/inventory-analytics - Dynamic VIP Revenue & Aarti Pass Inventory Analytics (Date Picker & 1 Month History)
router.get('/inventory-analytics', async (req, res) => {
  try {
    const { range, date } = req.query;
    const now = new Date();
    
    let startDate, endDate;
    let timeframeLabel = '';

    if (date && date !== 'today' && date !== 'month') {
      const parts = date.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        startDate = new Date(year, month, day, 0, 0, 0, 0);
        endDate = new Date(year, month, day, 23, 59, 59, 999);
        timeframeLabel = `Date: ${startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
    }

    if (!startDate) {
      if (range === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Past 30 days
        endDate = new Date();
        timeframeLabel = 'Last 30 Days Cumulative (Past Month)';
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); // Today midnight 12:00 AM
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        timeframeLabel = `Today (${now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })})`;
      }
    }

    // Fetch passes, aartiTickets, and vipTickets created or booked for the target date
    let passes = [];
    let aartiTickets = [];
    let vipTickets = [];
    const targetDateStr = (date && date !== 'today' && date !== 'month') ? date.trim() : new Date().toISOString().substring(0, 10);

    if (mongoose.connection.readyState === 1) {
      try {
        passes = await EntryPass.find({
          $or: [
            { bookingDate: targetDateStr },
            { createdAt: { $gte: startDate, $lte: endDate } }
          ],
          status: { $ne: 'cancelled' }
        });

        // Query dedicated 'artiestickets' collection
        aartiTickets = await AartiTicket.find({
          $or: [
            { bookingDate: targetDateStr },
            { createdAt: { $gte: startDate, $lte: endDate } }
          ],
          status: { $ne: 'cancelled' }
        });

        // Query dedicated 'viptickets' collection
        vipTickets = await VipTicket.find({
          $or: [
            { bookingDate: targetDateStr },
            { createdAt: { $gte: startDate, $lte: endDate } }
          ],
          status: { $ne: 'cancelled' }
        });
      } catch (err) {
        passes = [];
        aartiTickets = [];
        vipTickets = [];
      }
    }

    // 1. VIP Packages Dynamic Analytics
    const vipPackageConfigs = [
      { id: "sheeta-gate-express", name: "Sheeta Dwar Fast-Track Pass", price: 250, gate: "Gate 4", defaultSold: 0 },
      { id: "garbhagriha-protocol", name: "Protocol Garbhagriha View Pass", price: 750, gate: "Gate 1", defaultSold: 0 },
      { id: "special-abhishek-vip", name: "Special Abhishek & Rudrabhishek Pass", price: 1500, gate: "Gate 3", defaultSold: 0 },
      { id: "royal-nri-protocol", name: "Royal Family & NRI Protocol Pass", price: 2500, gate: "VVIP Lounge", defaultSold: 0 }
    ];

    let totalVipPasses = 0;
    let totalVipRevenue = 0;

    const pkgMapByName = {
      'sheeta-gate-express': 0,
      'sheeta dwar fast-track pass': 0,
      'sheeta gate fast-track pass': 0,
      'garbhagriha-protocol': 1,
      'protocol garbhagriha view pass': 1,
      'protocol garbhagriha priority pass': 1,
      'special-abhishek-vip': 2,
      'special abhishek & rudrabhishek pass': 2,
      'special mahakal abhishek & vip pass': 2,
      'royal-nri-protocol': 3,
      'royal family & nri protocol pass': 3,
      'royal protocol & family vip express pass': 3
    };

    if (vipTickets.length > 0) {
      vipTickets.forEach(vt => {
        const passesCount = vt.passesCount || 1;
        const key = (vt.pkgId || vt.pkgName || '').toLowerCase().trim();
        const idx = pkgMapByName[key] !== undefined ? pkgMapByName[key] : 0;
        vipPackageConfigs[idx].defaultSold += passesCount;
        totalVipPasses += passesCount;
        totalVipRevenue += (vt.totalAmount || (passesCount * vipPackageConfigs[idx].price));
      });
    } else {
      // Fallback for EntryPass records
      const packageMap = { 4: 0, 1: 1, 3: 2, 2: 3, 5: 0 };
      passes.forEach(p => {
        const persons = p.numberOfPersons || 1;
        const gateNo = p.gateNumber || 1;
        const pkgIndex = packageMap[gateNo] !== undefined ? packageMap[gateNo] : 0;
        
        vipPackageConfigs[pkgIndex].defaultSold += persons;
        totalVipPasses += persons;
        totalVipRevenue += persons * vipPackageConfigs[pkgIndex].price;
      });
    }

    const vipAnalytics = {
      range: range || 'custom',
      selectedDateStr: date || 'today',
      timeframeLabel,
      totalPasses: totalVipPasses,
      totalRevenue: totalVipRevenue,
      packages: vipPackageConfigs.map(p => ({
        name: p.name,
        price: p.price,
        sold: p.defaultSold,
        gate: p.gate,
        revenue: p.defaultSold * p.price
      }))
    };

    // 2. Daily Aarti Passes & Tickets Inventory Analytics
    const aartiConfigs = [
      { id: "bhasma", name: "Shri Mahakal Bhasma Aarti", time: "04:00 AM - 06:00 AM", capacity: 1500 },
      { id: "dadhodak", name: "Dadhodak Aarti (Naivedya Aarti)", time: "07:30 AM - 08:15 AM", capacity: 2500 },
      { id: "bhog", name: "Shri Mahakal Bhog Aarti", time: "10:30 AM - 11:30 AM", capacity: 3000 },
      { id: "sandhya", name: "Sandhya Aarti", time: "05:00 PM - 06:00 PM", capacity: 2000 },
      { id: "shringar", name: "Sandhya Shringar Aarti", time: "07:00 PM - 08:00 PM", capacity: 2000 },
      { id: "shayan", name: "Shri Mahakal Shayan Aarti", time: "10:30 PM - 11:00 PM", capacity: 1500 }
    ];

    const aartiSoldMap = { bhasma: 0, dadhodak: 0, bhog: 0, sandhya: 0, shringar: 0, shayan: 0 };

    // Count tickets from 'artiestickets' collection primarily to prevent double counting with EntryPass
    if (aartiTickets.length > 0) {
      aartiTickets.forEach(t => {
        const count = t.ticketsCount || 1;
        if (t.aartiId && aartiSoldMap[t.aartiId] !== undefined) {
          aartiSoldMap[t.aartiId] += count;
        }
      });
    } else {
      // Fallback for historical entry pass records
      passes.forEach(p => {
        const persons = p.numberOfPersons || 1;
        if (p.aartiId && aartiSoldMap[p.aartiId] !== undefined) {
          aartiSoldMap[p.aartiId] += persons;
        } else {
          const hr = new Date(p.entryTime || p.createdAt).getHours();
          if (hr >= 3 && hr < 7) aartiSoldMap.bhasma += persons;
          else if (hr >= 7 && hr < 10) aartiSoldMap.dadhodak += persons;
          else if (hr >= 10 && hr < 14) aartiSoldMap.bhog += persons;
          else if (hr >= 14 && hr < 18) aartiSoldMap.sandhya += persons;
          else if (hr >= 18 && hr < 21) aartiSoldMap.shringar += persons;
          else aartiSoldMap.shayan += persons;
        }
      });
    }

    const capacityMultiplier = range === 'month' ? 30 : 1;

    const aartiAnalytics = aartiConfigs.map(a => {
      const sold = aartiSoldMap[a.id] || 0;
      const totalCap = a.capacity * capacityMultiplier;
      const left = Math.max(0, totalCap - sold);
      let status = "Seats Available";
      if (sold >= totalCap * 0.9) status = "High Surge (Closing)";
      else if (sold >= totalCap * 0.6) status = "Filling Fast";

      return {
        id: a.id,
        name: a.name,
        time: a.time,
        capacity: totalCap,
        sold,
        left,
        status
      };
    });

    res.json({
      timeframeLabel,
      vipAnalytics,
      aartiAnalytics
    });
  } catch (err) {
    console.error("Inventory analytics error:", err);
    res.status(500).json({ error: "Failed to generate inventory analytics." });
  }
});

// PUT /api/passes/:id/checkin - Verify / Use pass at gate
router.put("/:id/checkin", authenticateToken, async (req, res) => {
  try {
    const pass = await EntryPass.findById(req.params.id);
    if (!pass) return res.status(404).json({ error: "Entry pass not found." });

    if (new Date() > pass.expiryTime) {
      pass.status = "expired";
      await pass.save();
      return res
        .status(400)
        .json({
          error: "This pass has expired! Devotee must re-book an entry pass.",
        });
    }

    pass.status = "used";
    await pass.save();

    res.json({
      message: "Pass verified successfully! Devotee entry recorded.",
      pass,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to verify pass." });
  }
});

module.exports = router;
