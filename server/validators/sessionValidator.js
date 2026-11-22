const { body } = require("express-validator");

exports.sessionRequestValidation = [
  body("receiverId")
    .notEmpty()
    .withMessage("Receiver ID is required"),

  body("skill")
    .notEmpty()
    .withMessage("Skill is required"),
];

exports.sessionResponseValidation = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required"),

  body("action")
    .isIn(["accepted", "rejected"])
    .withMessage("Action must be accepted or rejected"),
];

exports.ratingValidation = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required"),

  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
];