const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    location: { type: String, default: "Main Hospital" },

    availableStatus: {
      type: String,
      enum: ["Available Today", "Available Tomorrow", "Not Available"],
      default: "Available Today"
    },

    nextSlot: { type: String, default: "10:00 AM - 11:00 AM" },

    fee: { type: Number, default: 100 },
    experience: { type: Number, default: 5 },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
