const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Department = require("../models/Department");

// -------------------- STATS --------------------
router.get("/stats", async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// -------------------- DEPARTMENTS --------------------

router.get("/departments", async (req, res) => {
  try {
    const items = await Department.find().sort({ name: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// -------------------- DOCTORS CRUD --------------------
router.get("/doctors", async (req, res) => {
  try {
    const { q = "", departmentId = "" } = req.query;

    const filter = {};
    if (q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { specialization: { $regex: q.trim(), $options: "i" } },
      ];
    }
    if (departmentId) filter.department = departmentId;

    const docs = await Doctor.find(filter)
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/doctors", async (req, res) => {
  try {
    const payload = req.body;
    const doc = await Doctor.create(payload);
    const populated = await Doctor.findById(doc._id).populate("department", "name");
    res.status(201).json(populated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/doctors/:id", async (req, res) => {
  try {
    const updated = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("department", "name");

    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
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

// -------------------- PATIENTS CRUD  --------------------
router.get("/patients", async (req, res) => {
  try {
    const { q = "" } = req.query;

    const filter = { role: "patient" };
    if (q.trim()) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { email: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const patients = await User.find(filter).sort({ createdAt: -1 }).select("-passwordHash");
    res.json(patients);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/patients", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email) return res.status(400).json({ message: "Name + email required" });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password || "patient123", 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone || "",
      role: "patient",
      passwordHash,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put("/patients/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.role;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "patient" },
      update,
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "Patient not found" });
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/patients/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: "patient" });
    if (!user) return res.status(404).json({ message: "Patient not found" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// -------------------- APPOINTMENTS CRUD --------------------
router.get("/appointments", async (req, res) => {
  try {
    const { q = "", status = "" } = req.query;

    const filter = {};
    if (status) filter.status = status;

  
    const items = await Appointment.find(filter)
      .populate("doctor", "name specialization")
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    const qv = q.trim().toLowerCase();
    const finalItems = qv
      ? items.filter((a) => {
          const d = (a.doctor?.name || "").toLowerCase();
          const p = (a.patient?.name || "").toLowerCase();
          return d.includes(qv) || p.includes(qv);
        })
      : items;

    res.json(finalItems);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/appointments/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("doctor", "name specialization")
      .populate("patient", "name email");

    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
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