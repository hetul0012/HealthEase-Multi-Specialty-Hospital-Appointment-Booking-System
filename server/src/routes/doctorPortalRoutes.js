const router = require("express").Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

// helper
function getDoctorIdFromUser(req) {
  return req.user?.doctorId || null;
}

// GET /api/doctor/me
router.get("/me", async (req, res) => {
  try {
    const doctorId = getDoctorIdFromUser(req);
    if (!doctorId) return res.status(400).json({ message: "Doctor account is not linked to a doctor profile." });

    const doctor = await Doctor.findById(doctorId).populate("department", "name");
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found." });

    res.json(doctor);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT /api/doctor/me  (doctor profile update)
router.put("/me", async (req, res) => {
  try {
    const doctorId = getDoctorIdFromUser(req);
    if (!doctorId) return res.status(400).json({ message: "Doctor account is not linked to a doctor profile." });

    const allowed = [
      "name",
      "specialization",
      "experienceYears",
      "location",
      "nextSlot",
      "availableStatus",
      "imageUrl",
    ];

    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const updated = await Doctor.findByIdAndUpdate(doctorId, update, {
      new: true,
      runValidators: true,
    }).populate("department", "name");

    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// GET /api/doctor/appointments
router.get("/appointments", async (req, res) => {
  try {
    const doctorId = getDoctorIdFromUser(req);
    if (!doctorId) return res.status(400).json({ message: "Doctor account is not linked to a doctor profile." });

    const { status = "", q = "" } = req.query;

    const filter = { doctor: doctorId };
    if (status) filter.status = status;

    const items = await Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 });

    const qv = q.trim().toLowerCase();
    const filtered = qv
      ? items.filter((a) => {
          const pn = (a.patient?.name || "").toLowerCase();
          const pe = (a.patient?.email || "").toLowerCase();
          return pn.includes(qv) || pe.includes(qv);
        })
      : items;

    res.json(filtered);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PATCH /api/doctor/appointments/:id
router.patch("/appointments/:id", async (req, res) => {
  try {
    const doctorId = getDoctorIdFromUser(req);
    if (!doctorId) return res.status(400).json({ message: "Doctor account is not linked to a doctor profile." });

    const allowedStatus = ["Booked", "Pending", "Confirmed", "Completed", "Cancelled", "Rescheduled"];
    const { status } = req.body;

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed: ${allowedStatus.join(", ")}` });
    }

    const appt = await Appointment.findOne({ _id: req.params.id, doctor: doctorId });
    if (!appt) return res.status(404).json({ message: "Appointment not found for this doctor." });

    if (status) appt.status = status;
    await appt.save();

    const populated = await Appointment.findById(appt._id)
      .populate("patient", "name email phone")
      .populate("doctor", "name specialization");

    res.json(populated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;