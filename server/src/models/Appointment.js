const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },

    date: { type: String, required: true }, // "2026-01-30"
    time: { type: String, required: true }, // "10:30 AM"
    type: { type: String, default: "Consultation" },

    reason: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" }
  },
  { timestamps: true }
);

// avoid same slot booking for same doctor
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
