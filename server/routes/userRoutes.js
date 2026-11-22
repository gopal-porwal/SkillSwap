const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { updateProfile, getMyProfile } = require("../controllers/userController");

// Get logged-in user profile (from DB)
router.get("/me", protect, getMyProfile);

// Get logged-in user profile (from token)
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// Update logged-in user profile
router.put("/profile", protect, updateProfile);

module.exports = router;