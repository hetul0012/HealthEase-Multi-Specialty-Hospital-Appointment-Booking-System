const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const Department = require("./models/Department");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => res.send("HealthEase API is running..."));

//  GET departments (public)
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEED departments
app.post("/api/seed", async (req, res) => {
  try {
    await Department.deleteMany({});

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

    res.status(201).json({
      message: "Seed success",
      count: departments.length,
      departments,
    });
  } catch (err) {
    res.status(500).json({ message: "Seed failed", error: err.message });
  }
});

// start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  });
