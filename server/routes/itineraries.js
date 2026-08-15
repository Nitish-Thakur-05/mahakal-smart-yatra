const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Itinerary = require("../models/Itinerary");

// Try imports for official Google AI SDKs
let GoogleGenAI, GoogleGenerativeAI;
try {
  GoogleGenAI = require("@google/genai").GoogleGenAI;
} catch (e) {}
try {
  GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
} catch (e) {}

// GET all static itineraries from MongoDB
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find({});
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch itineraries from MongoDB" });
  }
});

// POST generate dynamic AI itinerary using Google Gemini API
router.post("/generate", async (req, res) => {
  try {
    // Dynamically re-read .env file to pick up newly pasted API key
    dotenv.config({ override: true });

    const {
      days = "1",
      travelPace = "Standard",
      groupType = "Family",
      interests = [],
      customNotes = "",
    } = req.body || {};

    const numDays = Math.min(Math.max(parseInt(days, 10) || 1, 1), 7);
    const selectedInterests =
      Array.isArray(interests) && interests.length > 0
        ? interests
        : ["Bhasma Aarti", "Mahakal Lok Corridor", "Shipra River Aarti"];

    // Generate a unique variation seed for every request so Gemini produces a fresh version
    const variationSeed = Date.now() + "_" + Math.floor(Math.random() * 100000);

    // Check for Google Gemini API key in environment variables
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("placeholder")) {
      console.log(
        `>>> [GEMINI AI] Initiating live Gemini LLM call (Seed: ${variationSeed})...`,
      );

      const promptText = `You are an expert AI pilgrimage planner for Shri Mahakaleshwar Temple and Ujjain (Avantika Kshetra), Madhya Pradesh.
Generate a NEW, UNIQUE, and DYNAMIC day-by-day pilgrimage itinerary.

TRIP CONFIGURATION:
- Number of Days: ${numDays} Day(s)
- Travel Pace: ${travelPace}
- Group Type: ${groupType}
- Selected Interests & Must-Visit Shrines: ${selectedInterests.join(", ")}
- Custom Notes: ${customNotes || "None"}
- Unique Variation Seed: ${variationSeed}

REGENERATION & DYNAMIC VARIATION RULES:
1. Provide a tailored itinerary for exactly ${numDays} day(s).
2. DO NOT return a repetitive or static response. Generate fresh activity descriptions, unique insider pilgrim tips, varied timing recommendations, and distinct authentic food spots in Ujjain.
3. For each day, create 5 to 8 detailed, chronological activities with realistic timings, accurate Ujjain locations, and engaging step-by-step descriptions.
4. USER SPECIAL REQUEST / CUSTOM NOTES: "${customNotes || "None"}". If any special request or custom notes are specified above, you MUST explicitly address and fulfill them in the activity descriptions, dining spots, and pilgrim tips (e.g. wheelchair accessibility, Jain satvik food, specific photo locations, elderly assistance, or custom timing preferences).
5. Output MUST be a SINGLE VALID JSON object strictly adhering to this structure:

{
  "title": "${numDays}-Day ${groupType} Ujjain Pilgrimage Plan",
  "subtitle": "Tailored for ${groupType} • ${travelPace} Travel Pace",
  "summary": "Personalized overview covering ${selectedInterests.join(", ")}...",
  "days": [
    {
      "dayNumber": 1,
      "theme": "Theme of Day 1",
      "tip": "Customized pilgrim tip for Day 1",
      "schedule": [
        {
          "time": "04:00 AM - 06:00 AM",
          "title": "Activity Title",
          "location": "Location in Ujjain",
          "description": "Step by step activity details...",
          "category": "Sacred Ritual"
        }
      ]
    }
  ]
}`;

      // 1. Try GoogleGenAI SDK (Latest @google/genai)
      if (GoogleGenAI) {
        try {
          const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
          const genModels = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-2.5-pro",
            "gemini-1.5-flash-8b",
          ];

          for (const m of genModels) {
            try {
              let responseText;
              if (
                ai.models &&
                typeof ai.models.generateContent === "function"
              ) {
                const res = await ai.models.generateContent({
                  model: m,
                  contents: promptText,
                });
                responseText = res.text;
              } else if (
                ai.interactions &&
                typeof ai.interactions.create === "function"
              ) {
                const interaction = await ai.interactions.create({
                  model: m,
                  input: promptText,
                });
                responseText = interaction.output_text;
              }

              if (responseText) {
                let parsed = JSON.parse(
                  responseText.replace(/```json|```/g, "").trim(),
                );
                return res.json({
                  source: "gemini-ai",
                  model: `${m} (@google/genai)`,
                  seed: variationSeed,
                  plan: parsed,
                });
              }
            } catch (errM) {
              // silent retry next model
            }
          }
        } catch (sdkErr1) {
          // silent retry
        }
      }

      // 2. Try GoogleGenerativeAI SDK (@google/generative-ai)
      if (GoogleGenerativeAI) {
        const modelsToTrySDK = [
          "gemini-2.5-flash",
          "gemini-2.0-flash",
          "gemini-2.5-pro",
        ];

        for (const modelName of modelsToTrySDK) {
          try {
            const genAI = new GoogleGenerativeAI(apiKey.trim());
            const model = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: {
                temperature: 1.1,
                topP: 0.95,
                responseMimeType: "application/json",
              },
            });

            const result = await model.generateContent(promptText);
            const candidateText = result.response?.text();

            if (candidateText) {
              let parsed = JSON.parse(candidateText.trim());
              return res.json({
                source: "gemini-ai",
                model: `${modelName} (SDK)`,
                seed: variationSeed,
                plan: parsed,
              });
            }
          } catch (sdkErr) {
            // silent retry next model
          }
        }
      }

      // 3. Direct REST API Driver Fallback
      const restEndpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`,
      ];

      for (const geminiUrl of restEndpoints) {
        try {
          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 1.1,
                topP: 0.95,
              },
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const candidateText =
              data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              let cleanJson = candidateText.replace(/```json|```/g, "").trim();
              let parsed = JSON.parse(cleanJson);
              return res.json({
                source: "gemini-ai",
                model: `Gemini REST`,
                seed: variationSeed,
                plan: parsed,
              });
            }
          }
        } catch (modelErr) {
          // silent retry
        }
      }
    } else {
      console.log(
        ">>> [GEMINI AI] No active GEMINI_API_KEY found in process.env.",
      );
    }

    // Truly Dynamic Generator Engine (Fallback if key is missing or invalid)
    console.log(
      ">>> [DYNAMIC ENGINE] Generating fresh random dynamic itinerary variation.",
    );
    const dynamicPlan = buildDynamicItineraryFallback(
      numDays,
      travelPace,
      groupType,
      selectedInterests,
      customNotes,
    );
    return res.json({
      source: "dynamic-generator",
      seed: variationSeed,
      plan: dynamicPlan,
    });
  } catch (globalErr) {
    console.error("Error in /generate endpoint:", globalErr);
    const fallbackPlan = buildDynamicItineraryFallback(
      1,
      "Standard",
      "Family",
      ["Bhasma Aarti", "Mahakal Lok"],
      "",
    );
    return res.json({ source: "fallback", plan: fallbackPlan });
  }
});

// Dynamic Intelligent Itinerary Builder with Full Randomization & Shuffle
function buildDynamicItineraryFallback(
  numDays,
  travelPace,
  groupType,
  interests,
  customNotes,
) {
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const optionId = Math.floor(Math.random() * 900 + 100);

  const dayThemes = [
    "Shri Mahakaleshwar Sanctum, Bhasma Aarti & Sacred River Dip",
    "Mahakal Lok Heritage, Shaktipeeth Shrines & Evening Aarti",
    "Ancient Avantika Circuit, Vedic Astronomy & Sacred Ghats",
    "Divine Jyotirlinga Darshan & Heritage Promenade Exploration",
  ];

  const tipsList = [
    `Pace set to ${travelPace}. Keep original Aadhaar card and digital pass ready at Gate 1. ${customNotes ? `Note: "${customNotes}".` : ""}`,
    `Pro Tip for ${groupType}: Use battery carts at Rudra Sagar promenade for comfortable corridor walk.`,
    `Devotional Advice: Attend evening Shipra Aarti at Ram Ghat by 06:45 PM for prime seating.`,
    `Local Guidance: Try authentic Ujjaini Sev & Poha at Mahakal Marg outlets right after morning darshan.`,
  ];

  const breakfastOptions = [
    {
      title: "Authentic Ujjaini Poha-Jalebi & Coconut Water",
      loc: "Mahakal Marg Outlets",
      desc: "Enjoy steaming hot Ujjaini Poha topped with Ratlami Sev, fresh coriander, and crisp golden Jalebis.",
    },
    {
      title: "Traditional Malwi Samosa & Masala Chai Breakfast",
      loc: "Freeganj Tower Chowk Stalls",
      desc: "Savor spicy Malwi samosas, khasta kachori, and hot ginger kulhad chai at iconic Ujjain breakfast hubs.",
    },
    {
      title: "Satvik Ashram Sabudana Khichdi & Herbal Tea",
      loc: "Ram Ghat Annakshetra Counter",
      desc: "Healthy satvik breakfast featuring fresh coconut water, sabudana khichdi, and herbal digestive tea.",
    },
    {
      title: "Ujjaini Bedmi Poori & Aloo Sabzi Breakfast",
      loc: "Sarafa Bazaar Food Lane",
      desc: "Traditional crisp lentil-stuffed poori served with tangy spicy potato curry and sweet lassi.",
    },
  ];

  const lunchOptions = [
    {
      title: "Traditional Malwi Daal Bafla Thali",
      loc: "Tower Chowk Bhojanalaya",
      desc: "Iconic Malwi feast with ghee-dipped wheat Bafla, 5-pulse Daal, spicy Kadhi, and Desi Ghee Churma Ladoo.",
    },
    {
      title: "Mahakal Annakshetra Free Satvik Bhandara",
      loc: "Mahakal Annakshetra Complex",
      desc: "Blessed temple trust satvik prasadam thali served with love, affection, and pure devotion.",
    },
    {
      title: "Heritage Malwi-Rajasthani Special Thali",
      loc: "Sarafa Market Food Center",
      desc: "Generous thali featuring Gatte ki Sabzi, Daal Baati, Ker Sangri, P Papad, and sweet Rabdi.",
    },
    {
      title: "Pure Veg Sattvik Thali & Chhachh",
      loc: "Mahakal Gate 1 Dining Hall",
      desc: "Light digestive satvik meal with chapati, seasonal sabzi, daal fry, rice, and fresh spiced buttermilk.",
    },
  ];

  const KATALOG = {
    "Bhasma Aarti": {
      time:
        travelPace === "Fast Track"
          ? "03:00 AM - 06:00 AM"
          : "03:30 AM - 06:00 AM",
      title: "Shri Mahakaleshwar Bhasma Aarti Darshan",
      location: "Mahakal Temple Gate No. 1 & Nandi Hall",
      description: `Early morning security assembly at Gate 1 with QR pass. Witness the divine pyre ash ritual and Dakshinamukhi Jyotirlinga darshan tailored for ${groupType}.`,
      category: "Primary Darshan",
    },
    "Mahakal Lok Corridor": {
      time: "09:00 AM - 11:30 AM",
      title: "Shri Mahakal Lok Heritage Corridor Exploration",
      location: "Rudra Sagar Lake Promenade",
      description: `Walk past 108 grand ornate stone pillars, 200+ Shiva Purana murals, and musical fountains. ${groupType === "Senior Citizens" ? "Battery carts available for senior devotees." : ""}`,
      category: "Heritage Corridor",
    },
    "Kal Bhairav Shrine": {
      time: "04:30 PM - 06:00 PM",
      title: "Kal Bhairav Guardian Commander Shrine",
      location: "Jail Road, Bhairav Garh (4 km)",
      description:
        "Pay homage to the ancient guardian deity of Avantika where traditional sacred offerings are made.",
      category: "Guardian Shrine",
    },
    "Harsiddhi Deepstambha": {
      time: "06:30 PM - 07:30 PM",
      title: "Harsiddhi Mata 51 Shaktipeeth & Deepstambha Glow",
      location: "Harsiddhi Temple Complex",
      description:
        "Witness the magnificent 13th-century twin stone towers lit with hundreds of traditional clay oil lamps.",
      category: "Shaktipeeth Shrine",
    },
    "Shipra River Aarti": {
      time: "07:30 PM - 08:30 PM",
      title: "Grand Evening Shipra River Maha Aarti & Deep Dan",
      location: "Ram Ghat, Shipra River Bank",
      description:
        "Attend divine river Aarti with 108 brass lamps, shankhnad, and floating oil diyas along sacred Ram Ghat.",
      category: "River Aarti",
    },
    "Vedic Observatory": {
      time: "11:30 AM - 01:00 PM",
      title: "Vedh Shala (Jantar Mantar Solar Observatory)",
      location: "Chintaman Road, Ujjain",
      description:
        "Explore Asia's oldest operational solar observatory built by Sawai Jai Singh II in 1719 for planetary calculations.",
      category: "Vedic Science",
    },
    "Omkareshwar Excursion": {
      time: "06:30 AM - 04:00 PM",
      title: "Twin Jyotirlinga Day Excursion to Omkareshwar",
      location: "Narmada River Mandhata Island (135 km)",
      description:
        "Scenic highway trip to Omkareshwar Jyotirlinga, Narmada boat ride, and Mamleshwar temple darshan.",
      category: "Day Excursion",
    },
    "Chintaman Ganesh": {
      time: "08:30 AM - 10:00 AM",
      title: "Chintaman Ganesh Swayambhu Shrine",
      location: "Fatehabad Road (5 km)",
      description:
        "Pray at the 11th-century self-manifested Ganesha shrine to dissolve all life worries and obstacles.",
      category: "Ancient Shrine",
    },
    "Sandipani Ashram": {
      time: "02:30 PM - 04:00 PM",
      title: "Maharshi Sandipani Ashram & Gomti Kund",
      location: "Mangalnath Road",
      description:
        "Explore the ancient Gurukul where Lord Krishna, Balarama, and Sudama learned 64 Vedic arts.",
      category: "Vedic Heritage",
    },
    "Mangalnath Temple": {
      time: "10:30 AM - 12:00 PM",
      title: "Mangalnath Temple (Birthplace of Mars)",
      location: "Mangalnath Marg, Shipra Bank",
      description:
        "Visit the astrological epicenter for Mars (Bhaum Seva) and planetary harmony rituals.",
      category: "Astrological Shrine",
    },
  };

  const daysArr = [];

  for (let d = 1; d <= numDays; d++) {
    let daySchedule = [];
    const theme = getRandom(dayThemes);
    const tip = getRandom(tipsList);

    const selectedBfast = getRandom(breakfastOptions);
    const selectedLunch = getRandom(lunchOptions);

    if (numDays === 1) {
      if (interests.includes("Bhasma Aarti")) {
        daySchedule.push(KATALOG["Bhasma Aarti"]);
      } else {
        daySchedule.push({
          time: "06:30 AM",
          title: getRandom([
            "Morning Shipra River Bath & Mangala Darshan",
            "Ram Ghat Holy Dip & Morning Surya Arghya",
          ]),
          location: "Ram Ghat, Shipra River",
          description:
            "Perform sacred morning bath at Ram Ghat followed by Surya Namaskar and temple entry.",
          category: "Sacred Bath",
        });
      }

      daySchedule.push({
        time: "08:00 AM",
        title: selectedBfast.title,
        location: selectedBfast.loc,
        description: `${selectedBfast.desc} ${customNotes.toLowerCase().includes("jain") || customNotes.toLowerCase().includes("veg") ? "Pure Satvik Jain options available." : ""}`,
        category: "Dining",
      });

      if (interests.includes("Mahakal Lok Corridor"))
        daySchedule.push(KATALOG["Mahakal Lok Corridor"]);
      if (interests.includes("Chintaman Ganesh"))
        daySchedule.push(KATALOG["Chintaman Ganesh"]);
      if (interests.includes("Mangalnath Temple"))
        daySchedule.push(KATALOG["Mangalnath Temple"]);
      if (interests.includes("Vedic Observatory"))
        daySchedule.push(KATALOG["Vedic Observatory"]);

      daySchedule.push({
        time: "01:30 PM",
        title: selectedLunch.title,
        location: selectedLunch.loc,
        description: selectedLunch.desc,
        category: "Dining",
      });

      if (interests.includes("Sandipani Ashram"))
        daySchedule.push(KATALOG["Sandipani Ashram"]);
      if (interests.includes("Kal Bhairav Shrine"))
        daySchedule.push(KATALOG["Kal Bhairav Shrine"]);

      if (customNotes && customNotes.trim() !== "") {
        daySchedule.push({
          time: "05:00 PM",
          title: `Special Request Fulfilled: ${customNotes.trim()}`,
          location: "Mahakal Temple Gate 1 & Sacred Complex",
          description: `Custom arrangements prepared for your request: "${customNotes.trim()}". Dedicated assistance, tailored facilities, and specialized guidance provided for your group.`,
          category: "Special Request",
        });
      }

      if (interests.includes("Harsiddhi Deepstambha"))
        daySchedule.push(KATALOG["Harsiddhi Deepstambha"]);
      if (interests.includes("Shipra River Aarti")) {
        daySchedule.push(KATALOG["Shipra River Aarti"]);
      } else {
        daySchedule.push({
          time: "08:00 PM",
          title: "Mahakal Temple Evening Shringar Aarti & Darshan",
          location: "Mahakaleshwar Sanctum",
          description:
            "Conclude your day pilgrimage with evening lamp Aarti and divine blessings.",
          category: "Evening Aarti",
        });
      }
    } else {
      if (d === 1) {
        daySchedule = [
          KATALOG["Bhasma Aarti"],
          {
            time: "07:30 AM",
            title: selectedBfast.title,
            location: selectedBfast.loc,
            description: selectedBfast.desc,
            category: "Dining",
          },
          KATALOG["Mahakal Lok Corridor"],
          KATALOG["Kal Bhairav Shrine"],
          KATALOG["Shipra River Aarti"],
        ];
      } else {
        daySchedule = [
          KATALOG["Chintaman Ganesh"],
          KATALOG["Mangalnath Temple"],
          KATALOG["Sandipani Ashram"],
          KATALOG["Harsiddhi Deepstambha"],
        ];
      }
    }

    daysArr.push({
      dayNumber: d,
      theme: `Day ${d}: ${theme}`,
      tip: tip,
      schedule: daySchedule,
    });
  }

  return {
    title: `${numDays}-Day ${groupType} Ujjain Pilgrimage Plan`,
    subtitle: `Tailored for ${groupType} • ${travelPace} Travel Pace`,
    summary: `Personalized ${numDays}-day Ujjain pilgrimage schedule crafted for ${groupType}.`,
    days: daysArr,
  };
}

module.exports = router;
