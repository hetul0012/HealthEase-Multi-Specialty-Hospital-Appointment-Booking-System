const bcrypt = require("bcrypt");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

exports.createDoctorUser = async (req, res) => {
  const { doctorId, name, email, password } = req.body;
  if (!doctorId || !name || !email || !password)
    return res.status(400).json({ message: "doctorId, name, email, password required" });

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "doctor",
    doctorProfile: doctor._id
  });

  res.status(201).json({
    message: "Doctor user created",
    user: { id: user._id, name: user.name, email: user.email, role: user.role, doctorProfile: user.doctorProfile }
  });
};
