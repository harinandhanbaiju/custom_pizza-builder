const express = require("express");
const router = express.Router();
const { protect, requireVerifiedUser, adminOnly } = require("../middleware/authMiddleware");
const {
	getAdminDashboard,
	getAllUsersForAdmin,
	deleteUserByAdmin,
} = require("../controllers/userController");

router.get("/", protect, requireVerifiedUser, adminOnly, getAdminDashboard);
router.get("/users", protect, requireVerifiedUser, adminOnly, getAllUsersForAdmin);
router.delete("/users/:id", protect, requireVerifiedUser, adminOnly, deleteUserByAdmin);

module.exports = router;
