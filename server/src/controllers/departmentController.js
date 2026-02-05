const Department = require("../models/Department");

exports.getAll = async (req, res) => {
  const data = await Department.find().sort({ name: 1 });
  res.json(data);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) return res.status(400).json({ message: "name & description required" });
  const dept = await Department.create({ name, description });
  res.status(201).json(dept);
};

exports.update = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!dept) return res.status(404).json({ message: "Not found" });
  res.json(dept);
};

exports.remove = async (req, res) => {
  const dept = await Department.findByIdAndDelete(req.params.id);
  if (!dept) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
