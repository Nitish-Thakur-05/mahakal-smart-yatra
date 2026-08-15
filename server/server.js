require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  }),
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/temples", require("./routes/temples"));
app.use("/api/monastries", require("./routes/temples")); // Backward-compatibility alias
app.use("/api/events", require("./routes/events"));
app.use("/api/hotels", require("./routes/hotels"));
app.use("/api/itineraries", require("./routes/itineraries"));
app.use("/api/chat-bot", require("./routes/chatbot"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/support", require("./routes/support"));
app.use("/api/passes", require("./routes/passes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Mahakal Temple Express API" });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Mahakal Node.js Server running on http://127.0.0.1:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(
      `\n[NOTICE] Port ${PORT} is already in use by an active Mahakal server instance. The backend server is currently running and active!`,
    );
  } else {
    console.error("Server error:", err);
  }
});
