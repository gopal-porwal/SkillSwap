const Notification = require("../models/notification");
const { success, error } = require("../utils/apiResponse");


// GET ALL NOTIFICATIONS (WITH PAGINATION)
exports.getNotifications = async (req, res) => {
try {

const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;

const skip = (page - 1) * limit;

const notifications = await Notification.find({
user: req.user._id
})
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit);

const total = await Notification.countDocuments({
user: req.user._id
});

return success(res, "Notifications fetched", {
page,
limit,
total,
notifications
});

} catch (err) {
console.error("GET NOTIFICATIONS ERROR:", err);
return error(res);
}
};


// UNREAD COUNT
exports.getUnreadCount = async (req, res) => {
try {

const count = await Notification.countDocuments({
user: req.user._id,
isRead: false
});

return success(res, "Unread notification count fetched", { unread: count });

} catch (err) {
console.error("UNREAD COUNT ERROR:", err);
return error(res);
}
};


// MARK AS READ
exports.markAsRead = async (req, res) => {
try {

const notification = await Notification.findById(req.params.id);

if (!notification) {
return error(res, "Notification not found", 404);
}

notification.isRead = true;

await notification.save();

return success(res, "Notification marked as read");

} catch (err) {
console.error("MARK READ ERROR:", err);
return error(res);
}
};


// MARK ALL AS READ
exports.markAllAsRead = async (req, res) => {
try {

await Notification.updateMany(
{ user: req.user._id },
{ isRead: true }
);

return success(res, "All notifications marked as read");

} catch (err) {
console.error("MARK ALL READ ERROR:", err);
return error(res);
}
};