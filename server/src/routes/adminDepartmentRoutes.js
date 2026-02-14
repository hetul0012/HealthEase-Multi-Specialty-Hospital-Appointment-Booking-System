const router = require("express").Router();
const Department = require("../models/Department");
const { protect, requireRole } = require("../middleware/auth");

//  ADMIN ONLY: create
router.post("/", protect, requireRole("admin"), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN ONLY: update
router.put("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN ONLY: delete
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
