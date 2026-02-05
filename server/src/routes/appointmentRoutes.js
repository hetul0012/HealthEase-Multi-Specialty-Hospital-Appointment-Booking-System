const router = require("express").Router();
const { protect, requireRole } = require("../middleware/auth");
const c = require("../controllers/appointmentController");

router.post("/book", protect, requireRole("patient"), c.book);
router.get("/mine", protect, requireRole("patient"), c.mine);

router.get("/all", protect, requireRole("admin"), c.all);
router.put("/:id/status", protect, requireRole("admin"), c.updateStatus);

module.exports = router;
