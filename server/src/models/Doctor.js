const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    specialization: { type: String, required: true, trim: true },
    availableDays: [{ type: String }],
    availableTime: { type: String, default: "10:00 AM - 2:00 PM" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
