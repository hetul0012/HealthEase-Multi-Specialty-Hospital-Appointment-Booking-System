const User = require("../models/User");
const Department = require("../models/Department");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

exports.stats = async (req, res) => {
  const [departments, doctors, patients, appointments] = await Promise.all([
    Department.countDocuments(),
    Doctor.countDocuments(),
    User.countDocuments({ role: "patient" }),
    Appointment.countDocuments()
  ]);

  const todays = await Appointment.countDocuments({ date: new Date().toISOString().slice(0, 10) });

  res.json({ departments, doctors, patients, appointments, todays });
};
