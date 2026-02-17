const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    imageUrl: { type: String, default: "" },

    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 100 },

    experienceYears: { type: Number, default: 10 },

    availableStatus: {
      type: String,
      enum: ["Available Today", "Available Tomorrow", "Not Available"],
      default: "Available Today",
    },

    nextSlot: { type: String, default: "10:00 AM - 11:00 AM" },
    location: { type: String, default: "Main Hospital, Floor 1" },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
