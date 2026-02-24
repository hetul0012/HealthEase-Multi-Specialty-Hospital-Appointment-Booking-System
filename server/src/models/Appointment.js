const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

    date: { type: String, required: true },     // "2026-02-11"
    time: { type: String, required: true },     // "09:00 AM"
    reason: { type: String, required: true },   // "Follow-up Visit"
    notes: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);