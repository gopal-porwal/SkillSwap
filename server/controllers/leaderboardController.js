const User = require("../models/user");
const { success, error } = require("../utils/apiResponse");

// ================= TOP TEACHERS LEADERBOARD =================
exports.getTopTeachers = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {
      totalRatings: { $gte: 1 }
    };

    if (req.query.skill) {
      filter["skillsTeach.name"] = req.query.skill;
    }

    const users = await User.find(filter)
      .select("name email averageRating totalRatings badges")
      .sort({ averageRating: -1, totalRatings: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    return success(res, "Leaderboard fetched", {
      page,
      limit,
      total,
      users
    });

  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    return error(res);
  }
};