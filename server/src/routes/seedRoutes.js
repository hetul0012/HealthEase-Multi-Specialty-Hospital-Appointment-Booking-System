const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");

router.post("/", async (req, res) => {
  await Doctor.deleteMany({});
  await Department.deleteMany({});

  const depts = await Department.insertMany([
    { name: "Cardiology", description: "Expert heart care and diagnosis." },
    { name: "Neurology", description: "Brain and nervous system care." },
    { name: "Orthopedics", description: "Bones, joints and muscle care." },
    { name: "Pediatrics", description: "Healthcare for children and teens." }
  ]);

  const byName = Object.fromEntries(depts.map(d => [d.name, d]));

  await Doctor.insertMany([
    { name: "Dr. Sarah Johnson", department: byName.Cardiology._id, specialization: "Cardiologist", experienceYears: 15, rating: 4.9, availableStatus: "Available Today", nextSlot: "2:00 PM - 3:00 PM", location: "Main Hospital, Floor 3" },
    { name: "Dr. Michael Chen", department: byName.Neurology._id, specialization: "Neurologist", experienceYears: 12, rating: 4.8, availableStatus: "Available Tomorrow", nextSlot: "10:00 AM - 11:00 AM", location: "Neurology Wing, Floor 2" },
    { name: "Dr. Emily Roberts", department: byName.Pediatrics._id, specialization: "Pediatrician", experienceYears: 10, rating: 4.9, availableStatus: "Available Today", nextSlot: "4:00 PM - 5:00 PM", location: "Children's Center, Floor 1" },
    { name: "Dr. James Wilson", department: byName.Orthopedics._id, specialization: "Orthopedic Surgeon", experienceYears: 18, rating: 4.7, availableStatus: "Available Today", nextSlot: "1:00 PM - 2:00 PM", location: "Orthopedic Center, Floor 4" }
  ]);

  const adminEmail = "admin@healthease.com";
  const exists = await User.findOne({ email: adminEmail });

  if (!exists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ name: "HealthEase Admin", email: adminEmail, password: hashed, role: "admin" });
  }

  res.json({ message: "Seed done", admin: { email: adminEmail, password: "admin123" } });
});

module.exports = router;
