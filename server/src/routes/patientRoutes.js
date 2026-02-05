const router = require("express").Router();
const { protect, requireRole } = require("../middleware/auth");
const c = require("../controllers/patientController");

router.get("/", protect, requireRole("admin"), c.getAllPatients);
router.put("/:id", protect, requireRole("admin"), c.updatePatient);

module.exports = router;
