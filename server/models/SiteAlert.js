const mongoose = require("mongoose");

const siteAlertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      default:
        "🚩 OFFICIAL ANNOUNCEMENT: Shri Mahakaleshwar Temple Bhasma Aarti online booking for upcoming festival season is open. Please carry original Photo ID for entry.",
    },
    isActive: { type: Boolean, default: true },
    alertType: {
      type: String,
      enum: ["warning", "info", "danger", "success"],
      default: "warning",
    },
    speed: { type: Number, default: 25 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteAlert", siteAlertSchema);
