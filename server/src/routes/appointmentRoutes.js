const router = require("express").Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { auth } = require("../middleware/auth");

// Create booking (Patient)
router.post("/", auth, async (req, res) => {
  try {
    const { doctorId, date, time, reason, notes } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: "doctorId, date, time, reason are required" });
    }

    const doctor = await Doctor.findById(doctorId).populate("department");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    
    const exists = await Appointment.findOne({ doctor: doctorId, date, time, status: "Booked" });
    if (exists) return res.status(409).json({ message: "This slot is already booked" });

    const appt = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      department: doctor.department?._id,
      date,
      time,
      reason,
      notes: notes || "",
    });

    return res.status(201).json({ message: "Booked", appointment: appt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// My appointments (Patient)
router.get("/mine", auth, async (req, res) => {
  try {
    const list = await Appointment.find({ patient: req.user.id })
      .populate({ path: "doctor", populate: { path: "department" } })
      .sort({ createdAt: -1 });

    return res.json(list);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// Cancel appointment (Patient)
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, patient: req.user.id });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });

    appt.status = "Cancelled";
    await appt.save();

    return res.json({ message: "Cancelled", appointment: appt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;