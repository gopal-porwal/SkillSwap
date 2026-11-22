const User = require("../models/user");
const { success, error } = require("../utils/apiResponse");

exports.findMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const allUsers = await User.find({
      _id: { $ne: currentUser._id }
    });

    const matches = [];

    allUsers.forEach((user) => {

      const teachMatch = currentUser.skillsTeach.filter(skill =>
        user.skillsLearn.some(s => s.name === skill.name)
      );

      const learnMatch = currentUser.skillsLearn.filter(skill =>
        user.skillsTeach.some(s => s.name === skill.name)
      );

      if (teachMatch.length > 0 && learnMatch.length > 0) {
        matches.push({
          userId: user._id,
          name: user.name,
          email: user.email,
          matchedTeachSkills: teachMatch,
          matchedLearnSkills: learnMatch
        });
      }

    });

    return success(res, "Matches fetched successfully", matches);

  } catch (err) {
    console.error("MATCH FIND ERROR:", err);
    return error(res);
  }
};