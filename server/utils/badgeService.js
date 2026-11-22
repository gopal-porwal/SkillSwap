const User = require("../models/user");

exports.updateUserBadges = async (userId) => {
  const user = await User.findById(userId);

  if (!user) return;

  const badges = [];

  if (user.averageRating >= 4.8 && user.totalRatings >= 5) {
    badges.push("Top Mentor");
  }

  if (user.averageRating >= 4.5 && user.totalRatings >= 3) {
    badges.push("Rising Mentor");
  }

  if (user.totalRatings >= 10) {
    badges.push("Active Teacher");
  }

  user.badges = badges;

  await user.save();
};