const User = require("../models/user");
const { success, error } = require("../utils/apiResponse");

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return error(res, "User not found", 404);
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.availability = req.body.availability || user.availability;

    if (req.body.skillsTeach) {
      user.skillsTeach = req.body.skillsTeach.map(skill =>
        typeof skill === "string"
          ? { name: skill.trim() }
          : skill
      );
    }

    if (req.body.skillsLearn) {
      user.skillsLearn = req.body.skillsLearn.map(skill =>
        typeof skill === "string"
          ? { name: skill.trim() }
          : skill
      );
    }

    const updatedUser = await user.save();

    return success(res, "Profile updated successfully", updatedUser);

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return error(res);
  }
};


// ================= GET MY PROFILE =================
exports.getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return error(res, "User not found", 404);
    }

    return success(res, "Profile fetched successfully", user);

  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return error(res);
  }
};