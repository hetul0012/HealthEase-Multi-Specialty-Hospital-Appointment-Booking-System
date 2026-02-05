const router = require("express").Router();
const { protect, requireRole } = require("../middleware/auth");
const c = require("../controllers/departmentController");

router.get("/", c.getAll);
router.post("/", protect, requireRole("admin"), c.create);
router.put("/:id", protect, requireRole("admin"), c.update);
router.delete("/:id", protect, requireRole("admin"), c.remove);

module.exports = router;
