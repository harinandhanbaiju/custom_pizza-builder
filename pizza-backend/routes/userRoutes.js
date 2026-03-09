const express = require("express");
const router = express.Router();
const { registerUser, verifyUserEmail } = require("../controllers/userController");

router.post("/", registerUser);
router.get("/verify/:token", verifyUserEmail);

module.exports = router;
