const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: "" },
    status: { type: String, enum: ["Booked", "Completed", "Cancelled"], default: "Booked" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
