const express = require("express");
const router = express.Router();

const { getTopTeachers } = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/top-teachers", protect, getTopTeachers);

module.exports = router;