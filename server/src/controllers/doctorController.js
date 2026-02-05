const Doctor = require("../models/Doctor");

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.departmentId) filter.department = req.query.departmentId;
  if (req.query.q) filter.name = { $regex: req.query.q, $options: "i" };

  const data = await Doctor.find(filter).populate("department", "name").sort({ name: 1 });
  res.json(data);
};

exports.getOne = async (req, res) => {
  const doc = await Doctor.findById(req.params.id).populate("department", "name description");
  if (!doc) return res.status(404).json({ message: "Doctor not found" });
  res.json(doc);
};

exports.create = async (req, res) => {
  const doc = await Doctor.create(req.body);
  res.status(201).json(doc);
};

exports.update = async (req, res) => {
  const doc = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
};

exports.remove = async (req, res) => {
  const doc = await Doctor.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
