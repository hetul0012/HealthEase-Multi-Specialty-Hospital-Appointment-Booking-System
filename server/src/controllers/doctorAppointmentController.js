const Appointment = require("../models/Appointment");

exports.myAppointments = async (req, res) => {
  if (!req.user.doctorProfile) return res.status(400).json({ message: "Doctor profile not linked" });

  const data = await Appointment.find({ doctor: req.user.doctorProfile })
    .populate("patient", "name email phone status")
    .populate("department", "name")
    .sort({ createdAt: -1 });

  res.json(data);
};

exports.updateAppointment = async (req, res) => {
  if (!req.user.doctorProfile) return res.status(400).json({ message: "Doctor profile not linked" });

  const allowed = ["date", "time", "type", "reason", "status"];
  const update = {};
  for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];

  // only allow doctor to update their own appointments
  const appt = await Appointment.findOneAndUpdate(
    { _id: req.params.id, doctor: req.user.doctorProfile },
    update,
    { new: true }
  );

  if (!appt) return res.status(404).json({ message: "Appointment not found" });
  res.json({ message: "Updated", appointment: appt });
};

exports.deleteAppointment = async (req, res) => {
  if (!req.user.doctorProfile) return res.status(400).json({ message: "Doctor profile not linked" });

  const deleted = await Appointment.findOneAndDelete({
    _id: req.params.id,
    doctor: req.user.doctorProfile
  });

  if (!deleted) return res.status(404).json({ message: "Appointment not found" });
  res.json({ message: "Deleted" });
};
