const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    specialization: { type: String, required: true, trim: true },

    experienceYears: { type: Number, default: 10 },
    rating: { type: Number, default: 4.8 },

    location: { type: String, default: "Main Hospital" },
    availableStatus: { type: String, enum: ["Available Today", "Available Tomorrow", "On Leave", "Busy"], default: "Available Today" },

    availableDays: [{ type: String }], // ["Mon","Wed","Fri"]
    nextSlot: { type: String, default: "2:00 PM - 3:00 PM" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
