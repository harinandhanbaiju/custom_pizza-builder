const express = require("express");
const router = express.Router();
const {
	getInventory,
	seedInventory,
	createInventoryItem,
	updateInventoryItem,
	deleteInventoryItem,
} = require("../controllers/inventoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getInventory);
router.post("/seed", seedInventory);
router.post("/admin/item", protect, adminOnly, createInventoryItem);
router.patch("/admin/item/:id", protect, adminOnly, updateInventoryItem);
router.delete("/admin/item/:id", protect, adminOnly, deleteInventoryItem);

module.exports = router;
