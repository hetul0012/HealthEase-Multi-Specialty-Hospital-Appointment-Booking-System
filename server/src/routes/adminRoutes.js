const router = require("express").Router();
const { protect, requireRole } = require("../middleware/auth");
const c = require("../controllers/adminController");

router.get("/stats", protect, requireRole("admin"), c.stats);

module.exports = router;
