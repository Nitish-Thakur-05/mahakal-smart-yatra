const express = require('express');
const router = express.Router();

const knowledgeBase = [
  {
    keywords: ["bhasma", "aarti", "time", "pass", "4am", "morning"],
    response: "The daily Bhasma Aarti at Shri Mahakaleshwar Temple starts at 04:00 AM. Advance online booking pass is required via the official temple counter or portal. Devotees should arrive by 03:00 AM wearing traditional attire (Dhoti for men, Saree for women)."
  },
  {
    keywords: ["timing", "open", "darshan", "hours"],
    response: "Shri Mahakaleshwar Temple is open daily from 04:00 AM to 11:00 PM. General Darshan is available throughout the day except during specific Aarti offerings."
  },
  {
    keywords: ["corridor", "lok", "mahakal lok", "statue"],
    response: "Shri Mahakal Lok Corridor is a 900-meter grand heritage corridor adorned with over 108 elaborate murals and statues depicting Lord Shiva's stories from the Shiva Purana. Entry to the corridor is free for all visitors."
  },
  {
    keywords: ["hotel", "stay", "room", "dharamshala"],
    response: "Ujjain offers various stays including Hotel Mahakal Palace (0.2 km from temple), MP Tourism Shipra Residency, and Shree Mahakal Dham Yatri Nivas. You can view & reserve stays in our Stays section."
  },
  {
    keywords: ["event", "festival", "shivratri", "sawan"],
    response: "Major festivals at Mahakal include Mahashivratri (Grand 9-day Shiv Navratri), Sawan Somvar Royal Swari palanquin processions every Monday of Sawan, and Simhastha Kumbh Mela. Check our Cultural Events section for passes!"
  },
  {
    keywords: ["kal bhairav", "liquor", "shrine"],
    response: "Kal Bhairav Temple is located on Jail Road, Ujjain. It is famous for the ancient tradition of offering liquor to Lord Kal Bhairav, the guardian deity of Avantika."
  },
  {
    keywords: ["shaktipeeth", "harsiddhi", "lamp"],
    response: "Harsiddhi Mata Temple is one of the 51 sacred Shaktipeeths where Goddess Sati's elbow fell. Don't miss the evening lighting of the two 13th-century Deepstambha lamp towers!"
  }
];

router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Greetings from Mahakal Portal! How may I assist your pilgrimage to Ujjain today?" });
  }

  const query = message.toLowerCase();
  let match = knowledgeBase.find(kb => kb.keywords.some(k => query.includes(k)));

  if (match) {
    res.json({ reply: match.response });
  } else {
    res.json({
      reply: "Jai Shri Mahakal! Shri Mahakaleshwar Temple in Ujjain is the south-facing (Dakshinamukhi) Jyotirlinga. You can inquire about Bhasma Aarti timings, temple darshan, Mahakal Lok corridor, hotels, or festival schedules."
    });
  }
});

module.exports = router;
