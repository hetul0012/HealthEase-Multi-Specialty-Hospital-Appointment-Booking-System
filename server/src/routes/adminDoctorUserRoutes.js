const router = require("express").Router();
const { protect, requireRole } = require("../middleware/auth");
const c = require("../controllers/adminDoctorUserController");

router.post("/doctor-users", protect, requireRole("admin"), c.createDoctorUser);

module.exports = router;
