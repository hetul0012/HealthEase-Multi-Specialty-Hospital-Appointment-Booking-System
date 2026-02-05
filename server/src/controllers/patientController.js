const User = require("../models/User");

exports.getAllPatients = async (req, res) => {
  const q = req.query.q || "";
  const filter = {
    role: "patient",
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } }
    ]
  };
  const patients = await User.find(filter).select("-password").sort({ createdAt: -1 });
  res.json(patients);
};

exports.updatePatient = async (req, res) => {
  const patient = await User.findOneAndUpdate(
    { _id: req.params.id, role: "patient" },
    req.body,
    { new: true }
  ).select("-password");

  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
};
