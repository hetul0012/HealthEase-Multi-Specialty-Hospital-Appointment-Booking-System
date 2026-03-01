const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },

    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },

    experienceYears: { type: Number, default: 0 },
    location: { type: String, default: "" },
    nextSlot: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

  
    availableStatus: {
      type: String,
      enum: ["Available Today", "Available Tomorrow", "Available", "On Leave"],
      default: "Available",
    },

    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);