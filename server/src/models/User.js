const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "admin", "doctor"],
      default: "patient",
    },

    // optional link if user is a doctor account
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
