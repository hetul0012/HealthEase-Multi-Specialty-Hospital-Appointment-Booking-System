const router = require("express").Router();
const { protect, requireRole } = require("../middleware/auth");
const c = require("../controllers/doctorAppointmentController");

router.get("/appointments", protect, requireRole("doctor"), c.myAppointments);
router.put("/appointments/:id", protect, requireRole("doctor"), c.updateAppointment);
router.delete("/appointments/:id", protect, requireRole("doctor"), c.deleteAppointment);

module.exports = router;
