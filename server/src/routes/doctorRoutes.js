const router = require("express").Router();
const Doctor = require("../models/Doctor");

// /api/doctors?q=&departmentId=&sort=recommended|rating|experience
router.get("/", async (req, res) => {
  try {
    const { q, departmentId, sort } = req.query;

    const filter = { status: "Active" };

    if (departmentId) filter.department = departmentId;

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
      ];
    }

    let query = Doctor.find(filter).populate("department", "name");

    // sorting (matches dropdown)
    if (sort === "rating") query = query.sort({ rating: -1, reviews: -1 });
    else if (sort === "experience") query = query.sort({ experienceYears: -1 });
    else query = query.sort({ createdAt: -1 }); // recommended

    const doctors = await query;
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUBLIC: single doctor
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("department", "name");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
