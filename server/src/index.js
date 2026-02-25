const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Models
const Department = require("./models/Department");
const Doctor = require("./models/Doctor");
const User = require("./models/User");

// Auth routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// For admin seed password
const bcrypt = require("bcryptjs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);

//  Test route
app.get("/", (req, res) => {
  res.send("HealthEase API is running...");
});


//  Auth
app.use("/api/auth", require("./routes/authRoutes"));

// Appointment routes
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// Get all departments (public)
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get all doctors (public)

app.get("/api/doctors", async (req, res) => {
  try {
    const { departmentId, q } = req.query;

    const filter = {};
    if (departmentId) filter.department = departmentId;

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
      ];
    }

    const doctors = await Doctor.find(filter)
      .populate("department", "name")
      .sort({ name: 1 });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get single doctor by ID (public)
app.get("/api/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("department", "name");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Seed departments + doctors + admin user
app.post("/api/seed", async (req, res) => {
  try {
    // 1) Clear old data
    await Department.deleteMany({});
    await Doctor.deleteMany({});

    // 2) Insert departments
    const departments = await Department.insertMany([
      { name: "Cardiology", description: "Heart and cardiovascular care" },
      { name: "Neurology", description: "Brain and nervous system care" },
      { name: "Orthopedics", description: "Bones, joints, and muscle care" },
      { name: "Pulmonology", description: "Lungs and respiratory care" },
      { name: "Ophthalmology", description: "Eye care and vision services" },
      { name: "Pediatrics", description: "Healthcare for infants and children" },
    ]);

    const deptId = (name) => departments.find((d) => d.name === name)._id;

    // 3) Insert doctors
    const doctors = await Doctor.insertMany([
      {
        name: "Dr. Sarah Johnson",
        specialization: "Cardiologist",
        department: deptId("Cardiology"),
        imageUrl:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
        rating: 4.9,
        reviews: 128,
        experienceYears: 15,
        availableStatus: "Available Today",
        nextSlot: "2:00 PM - 3:00 PM",
        location: "Main Hospital, Floor 3",
      },
      {
        name: "Dr. Michael Chen",
        specialization: "Neurologist",
        department: deptId("Neurology"),
        imageUrl:
          "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop",
        rating: 4.8,
        reviews: 95,
        experienceYears: 12,
        availableStatus: "Available Tomorrow",
        nextSlot: "10:00 AM - 11:00 AM",
        location: "Neurology Wing, Floor 2",
      },
      {
        name: "Dr. Emily Roberts",
        specialization: "Pediatrician",
        department: deptId("Pediatrics"),
        imageUrl:
          "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=400&h=400&fit=crop",
        rating: 4.9,
        reviews: 142,
        experienceYears: 10,
        availableStatus: "Available Today",
        nextSlot: "4:00 PM - 5:00 PM",
        location: "Children’s Center, Floor 1",
      },
      {
        name: "Dr. Amanda Foster",
        specialization: "Ophthalmologist",
        department: deptId("Ophthalmology"),
        imageUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        rating: 4.9,
        reviews: 134,
        experienceYears: 11,
        availableStatus: "Available Today",
        nextSlot: "11:00 AM - 12:00 PM",
        location: "Eye Care Center, Floor 3",
      },
      {
        name: "Dr. Robert Lee",
        specialization: "Gastroenterologist",
        department: deptId("Pulmonology"),
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        rating: 4.7,
        reviews: 102,
        experienceYears: 16,
        availableStatus: "Available Tomorrow",
        nextSlot: "2:30 PM - 3:30 PM",
        location: "Digestive Health, Floor 2",
      },
      {
        name: "Dr. Jennifer Adams",
        specialization: "Endocrinologist",
        department: deptId("Orthopedics"),
        imageUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        rating: 4.8,
        reviews: 119,
        experienceYears: 13,
        availableStatus: "Available Today",
        nextSlot: "1:00 PM - 2:00 PM",
        location: "Main Hospital, Floor 4",
      },
    ]);

    // 4)  CREATE ADMIN USER (only if not exists)
    const adminEmail = "admin@healthease.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const passwordHash = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: adminEmail,
        passwordHash,
        role: "admin",
      });
    }

    // 5) Return response
    res.status(201).json({
      message: "Seed success (Departments + Doctors + Admin created)",
      departmentsCount: departments.length,
      doctorsCount: doctors.length,
      adminLogin: {
        email: adminEmail,
        password: "admin123",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

//Server

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
