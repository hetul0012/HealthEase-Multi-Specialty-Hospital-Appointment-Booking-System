const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Models
const Department = require("./models/Department");
const Doctor = require("./models/Doctor");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("HealthEase API is running...");
});

/**
 * PUBLIC: GET departments
 */
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 *  PUBLIC: GET doctors
 * /api/doctors?q=&departmentId=&sort=recommended|rating|experience
 */
app.get("/api/doctors", async (req, res) => {
  try {
    const { q, departmentId, sort } = req.query;

    const filter = { status: "Active" };

    if (departmentId) filter.department = departmentId;

    if (q && q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { specialization: { $regex: q.trim(), $options: "i" } },
      ];
    }

    let query = Doctor.find(filter).populate("department", "name");

    if (sort === "rating") query = query.sort({ rating: -1, reviews: -1 });
    else if (sort === "experience") query = query.sort({ experienceYears: -1 });
    else query = query.sort({ createdAt: -1 }); // recommended

    const doctors = await query;
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUBLIC: GET single doctor
 */
app.get("/api/doctors/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("department", "name");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Inserts departments + doctors (run once)
 */
app.post("/api/seed", async (req, res) => {
  try {
    // clear old
    await Doctor.deleteMany({});
    await Department.deleteMany({});

    // insert departments
    const departments = await Department.insertMany([
      {
        name: "Cardiology",
        description:
          "Expert heart care with state-of-the-art diagnostic and treatment facilities.",
      },
      {
        name: "Neurology",
        description:
          "Advanced neurological care for brain and nervous system disorders.",
      },
      {
        name: "Orthopedics",
        description:
          "Comprehensive bone and joint care with minimally invasive procedures.",
      },
      {
        name: "Pulmonology",
        description:
          "Specialized respiratory care for lung and breathing disorders.",
      },
      {
        name: "Ophthalmology",
        description:
          "Complete eye care services from routine exams to complex surgeries.",
      },
      {
        name: "Pediatrics",
        description:
          "Dedicated healthcare for children from infancy through adolescence.",
      },
    ]);

    const deptId = (name) => departments.find((d) => d.name === name)._id;

    // insert doctors
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

    return res.status(201).json({
      message: "Seed success",
      departmentsCount: departments.length,
      doctorsCount: doctors.length,
    });
  } catch (err) {
    return res.status(500).json({ message: "Seed failed", error: err.message });
  }
});

// Start server AFTER DB connected
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
