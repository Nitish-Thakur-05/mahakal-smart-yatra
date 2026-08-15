const express = require("express");
const router = express.Router();
const EntryPass = require("../models/EntryPass");
const { authenticateToken } = require("../middleware/auth");
const { invalidateCrowdCache } = require("../services/crowdDataset");

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
  const activePasses = await EntryPass.find({
    status: "active",
    expiryTime: { $gt: now },
  });

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

// POST /api/passes/book - Book E-Pass (Auto Gate Assignment & Auto Expiration Formula)
router.post("/book", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { primaryDevoteeName, contactPhone, passengers } = req.body;

    if (!primaryDevoteeName || !contactPhone) {
      return res
        .status(400)
        .json({
          error: "Primary Devotee Name and Contact Phone are required.",
        });
    }

    // Check 5-hour cooldown for the user
    const lastPass = await EntryPass.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (lastPass) {
      const COOLDOWN_MS = 5 * 60 * 60 * 1000; // 5 hours in ms
      const timeSinceLastBooking =
        Date.now() - new Date(lastPass.createdAt).getTime();

      if (timeSinceLastBooking < COOLDOWN_MS) {
        const remainingMs = COOLDOWN_MS - timeSinceLastBooking;
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMins = Math.ceil(
          (remainingMs % (1000 * 60 * 60)) / (1000 * 60),
        );

        return res.status(429).json({
          error: `5-Hour Cooldown Active: You can book your next entry pass in ${remainingHours}h ${remainingMins}m. To manage temple crowds, users may book 1 pass batch (up to 6 persons) every 5 hours.`,
          cooldownRemainingMs: remainingMs,
          nextAllowedTime: new Date(Date.now() + remainingMs),
        });
      }
    }

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

    // Validate 5-Day Booking Window
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxAllowedDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days max

    let selectedBookingDate = today;
    const { bookingDate } = req.body;

    if (bookingDate) {
      const parsedDate = new Date(bookingDate);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({
            error: "Invalid booking date format. Please select a valid date.",
          });
      }

      const selectedDayStart = new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
      );

      if (selectedDayStart < today) {
        return res
          .status(400)
          .json({ error: "Booking date cannot be in the past." });
      }

      if (selectedDayStart > maxAllowedDate) {
        return res
          .status(400)
          .json({
            error:
              "Booking limit: E-Passes can only be booked for today and up to the next 5 days max.",
          });
      }

      selectedBookingDate = selectedDayStart;
    }

    // AUTO-ASSIGN GATE WITH LOWEST CROWD QUEUE IN DB & AUTO-CALCULATE METRICS
    const { gate, isFestivalTime, currentGateQueueCount } =
      await getLowestCrowdGateAndMetrics();

    // FETCH AI CROWD FORECAST FOR SELECTED BOOKING DATE
    let predictedCrowdLevel = "LOW";
    let predictedExpectedCrowd = 140;

    try {
      const forecast = await fetchChronosForecast();
      const targetDateStr = selectedBookingDate.toISOString().substring(0, 10);

      if (forecast.tomorrow && forecast.tomorrow.date === targetDateStr) {
        predictedCrowdLevel = forecast.tomorrow.crowdLevel || "LOW";
        predictedExpectedCrowd = forecast.tomorrow.expectedCrowd || 140;
      } else if (
        forecast.upcomingDays &&
        Array.isArray(forecast.upcomingDays)
      ) {
        const matchDay = forecast.upcomingDays.find(
          (d) => d.date === targetDateStr,
        );
        if (matchDay) {
          predictedCrowdLevel = matchDay.crowdLevel || "LOW";
          predictedExpectedCrowd = matchDay.expectedCrowd || 140;
        }
      }
    } catch (aiErr) {
      console.warn("AI forecast lookup note:", aiErr.message);
    }

    // Dynamic Validity Mins based on AI Crowd Prediction for Selected Day
    // CRITICAL: 120m (2h), HIGH: 150m (2.5h), MEDIUM: 180m (3h), LOW: 300m (5h)
    let validityMins = 300;
    const normLevel = (predictedCrowdLevel || "LOW").toUpperCase();
    if (normLevel === "CRITICAL") validityMins = 120;
    else if (normLevel === "HIGH") validityMins = 150;
    else if (normLevel === "MEDIUM") validityMins = 180;
    else validityMins = 300;

    // Set entry time for selected booking date
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

    const targetBookingDateStr = selectedBookingDate.toISOString().substring(0, 10);

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
      entryTime: entryDateObj,
      expiryTime: expiryDateObj,
      validityMins,
      isFestivalTime,
      status: "active",
      qrPayload,
    });

    // Invalidate Chronos-2 AI Crowd forecast cache to trigger dynamic re-forecasting
    invalidateCrowdCache();

    const formattedBookingDateStr = selectedBookingDate.toLocaleDateString(
      "en-US",
      { weekday: "short", month: "short", day: "numeric" },
    );

    res.json({
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
});

// GET /api/passes/my-passes - Get passes for current logged-in user
router.get("/my-passes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const passes = await EntryPass.find({ userId }).sort({ createdAt: -1 });

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
    const passes = await EntryPass.find({});

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

    // Fetch passes created/active within the timeframe
    const passes = await EntryPass.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    });

    // 1. VIP Packages Dynamic Analytics
    const vipPackageConfigs = [
      { name: "Sheeta Dwar Fast-Track Pass", price: 250, gate: "Gate 4", defaultSold: 0 },
      { name: "Protocol Garbhagriha View Pass", price: 750, gate: "Gate 1", defaultSold: 0 },
      { name: "Special Abhishek & Rudrabhishek Pass", price: 1500, gate: "Gate 3", defaultSold: 0 },
      { name: "Royal Family & NRI Protocol Pass", price: 2500, gate: "VVIP Lounge", defaultSold: 0 }
    ];

    let totalVipPasses = 0;
    let totalVipRevenue = 0;

    const packageMap = {
      4: 0, // Sheeta Dwar (Gate 4)
      1: 1, // Protocol Garbhagriha (Gate 1)
      3: 2, // Special Abhishek (Gate 3)
      2: 3, // Royal Family (Gate 2/VVIP)
      5: 0  // Gate 5 default
    };

    passes.forEach(p => {
      const persons = p.numberOfPersons || 1;
      const gateNo = p.gateNumber || 1;
      const pkgIndex = packageMap[gateNo] !== undefined ? packageMap[gateNo] : 0;
      
      vipPackageConfigs[pkgIndex].defaultSold += persons;
      totalVipPasses += persons;
      totalVipRevenue += persons * vipPackageConfigs[pkgIndex].price;
    });

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

    passes.forEach(p => {
      const persons = p.numberOfPersons || 1;
      const hr = new Date(p.entryTime || p.createdAt).getHours();
      
      if (hr >= 3 && hr < 7) aartiSoldMap.bhasma += persons;
      else if (hr >= 7 && hr < 10) aartiSoldMap.dadhodak += persons;
      else if (hr >= 10 && hr < 14) aartiSoldMap.bhog += persons;
      else if (hr >= 14 && hr < 18) aartiSoldMap.sandhya += persons;
      else if (hr >= 18 && hr < 21) aartiSoldMap.shringar += persons;
      else aartiSoldMap.shayan += persons;
    });

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
