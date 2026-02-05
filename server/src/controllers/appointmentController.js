const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

exports.book = async (req, res) => {
  const { doctorId, date, time, type, reason } = req.body;
  if (!doctorId || !date || !time) return res.status(400).json({ message: "doctorId, date, time required" });

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  try {
    const appt = await Appointment.create({
      patient: req.user.id,
      doctor: doctor._id,
      department: doctor.department,
      date,
      time,
      type: type || "Consultation",
      reason: reason || ""
    });

    res.status(201).json({ message: "Booked", appointment: appt });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Slot already booked" });
    throw e;
  }
};

exports.mine = async (req, res) => {
  const appts = await Appointment.find({ patient: req.user.id })
    .populate("doctor", "name specialization nextSlot availableStatus")
    .populate("department", "name")
    .sort({ createdAt: -1 });

  res.json(appts);
};

exports.all = async (req, res) => {
  const appts = await Appointment.find()
    .populate("patient", "name email phone status")
    .populate("doctor", "name specialization")
    .populate("department", "name")
    .sort({ createdAt: -1 });
  res.json(appts);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const appt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!appt) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Updated", appointment: appt });
};
