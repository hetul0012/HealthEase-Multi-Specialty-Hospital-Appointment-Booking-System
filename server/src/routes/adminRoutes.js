const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const Appointment = require("../models/Appointment");
const { auth, requireRole } = require("../middleware/auth");

router.use(auth, requireRole("admin"));

router.get("/stats", async (req, res) => {
  try {
    const [totalDoctors, totalPatients, totalAppointments] = await Promise.all([
      Doctor.countDocuments(),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
    ]);

    // upcoming
    const recentBookings = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("doctor", "name specialization")
      .populate("department", "name")
      .populate("patient", "name email");

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      recentBookings,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.get("/departments", async (req, res) => {
  try {
    const items = await Department.find().sort({ name: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.get("/doctors", async (req, res) => {
  try {
    const { q = "", departmentId = "" } = req.query;

    const filter = {};
    if (departmentId) filter.department = departmentId;
    if (q.trim()) {
      filter.$or = [
        { name: new RegExp(q.trim(), "i") },
        { specialization: new RegExp(q.trim(), "i") },
      ];
    }

    const items = await Doctor.find(filter)
      .sort({ createdAt: -1 })
      .populate("department", "name");

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/doctors", async (req, res) => {
  try {
    const {
      name,
      specialization,
      department,
      experienceYears = 0,
      location = "",
      availableStatus = "Available",
      nextSlot = "",
      rating = 5,
      reviews = 0,
      imageUrl = "",
    } = req.body;

    if (!name || !specialization || !department) {
      return res.status(400).json({ message: "name, specialization, department are required" });
    }

    const created = await Doctor.create({
      name,
      specialization,
      department,
      experienceYears,
      location,
      availableStatus,
      nextSlot,
      rating,
      reviews,
      imageUrl,
    });

    const populated = await Doctor.findById(created._id).populate("department", "name");
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/doctors/:id", async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("department", "name");

    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/doctors/:id", async (req, res) => {
  try {
    const deleted = await Doctor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.get("/patients", async (req, res) => {
  try {
    const { q = "" } = req.query;
    const filter = { role: "patient" };

    if (q.trim()) {
      filter.$or = [
        { name: new RegExp(q.trim(), "i") },
        { email: new RegExp(q.trim(), "i") },
      ];
    }

    const items = await User.find(filter).select("-passwordHash").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/patients", async (req, res) => {
  try {
    const { name, email, phone = "", address = "", password = "patient123" } = req.body;

    if (!name || !email) return res.status(400).json({ message: "name and email are required" });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone,
      address,
      role: "patient",
      passwordHash,
    });

    const safe = await User.findById(created._id).select("-passwordHash");
    res.status(201).json(safe);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/patients/:id", async (req, res) => {
  try {
    const { password, ...rest } = req.body;

    if (password) {
      rest.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await User.findOneAndUpdate(
      { _id: req.params.id, role: "patient" },
      rest,
      { new: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ message: "Patient not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/patients/:id", async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, role: "patient" });
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const { q = "", status = "" } = req.query;
    const filter = {};
    if (status) filter.status = status;

  
    let items = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .populate("doctor", "name specialization")
      .populate("department", "name")
      .populate("patient", "name email");

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      items = items.filter((a) => {
        const dn = (a.doctor?.name || "").toLowerCase();
        const pn = (a.patient?.name || "").toLowerCase();
        const pe = (a.patient?.email || "").toLowerCase();
        return dn.includes(qq) || pn.includes(qq) || pe.includes(qq);
      });
    }

    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/appointments/:id", async (req, res) => {
  try {
    const { status, date, time } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...(status ? { status } : {}), ...(date ? { date } : {}), ...(time ? { time } : {}) },
      { new: true }
    )
      .populate("doctor", "name specialization")
      .populate("department", "name")
      .populate("patient", "name email");

    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/appointments/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;