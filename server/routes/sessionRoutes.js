const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  sendSessionRequest,
  respondToSession,
  getMySessions,
  getSentSessions,
  getReceivedSessions,
  uploadRecording,
  completeSession,
  submitRating
} = require("../controllers/sessionController");

const {
  sessionRequestValidation,
  sessionResponseValidation,
  ratingValidation
} = require("../validators/sessionValidator");

const validateRequest = require("../middleware/validateRequest");


// Send session request
router.post(
  "/request",
  protect,
  sessionRequestValidation,
  validateRequest,
  sendSessionRequest
);

// Accept / Reject session
router.put(
  "/respond",
  protect,
  sessionResponseValidation,
  validateRequest,
  respondToSession
);

// Get all sessions (sent + received)
router.get("/my", protect, getMySessions);

// Get only sent sessions
router.get("/sent", protect, getSentSessions);

// Get only received sessions
router.get("/received", protect, getReceivedSessions);

// Upload recording
router.post(
  "/upload-recording",
  protect,
  upload.single("recording"),
  uploadRecording
);

// Mark session completed
router.put("/complete", protect, completeSession);

// Submit rating
router.post(
  "/rate",
  protect,
  ratingValidation,
  validateRequest,
  submitRating
);

module.exports = router;