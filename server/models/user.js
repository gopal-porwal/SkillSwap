const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    skillsTeach: [
      {
        name: String,
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
        },
      },
    ],

    skillsLearn: [
      {
        name: String,
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
        },
      },
    ],

    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],

    // ⭐ Rating System Fields
    averageRating: {
      type: Number,
      default: 0,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: String,
      },
    ],

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);