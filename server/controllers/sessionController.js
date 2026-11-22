const mongoose = require("mongoose");
const Session = require("../models/session");
const generateMeetLink = require("../config/googleMeet");
const cloudinary = require("../config/cloudinary");
const Rating = require("../models/rating");
const User = require("../models/user");
const Notification = require("../models/notification");
const { updateUserBadges } = require("../utils/badgeService");
const { success, error } = require("../utils/apiResponse");


// ================= SEND SESSION REQUEST =================
exports.sendSessionRequest = async (req, res) => {
  try {
    const { receiverId, skill } = req.body;

    // 🔒 Check for existing active request (duplicate protection)
    const existingSession = await Session.findOne({
      sender: req.user._id,
      receiver: receiverId,
      skill: skill,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingSession) {
      return error(res, "Session request already exists for this skill", 400);
    }

    const session = await Session.create({
      sender: req.user._id,
      receiver: receiverId,
      skill,
    });

    await Notification.create({
      user: receiverId,
      type: "SESSION_REQUEST",
      message: `New session request for ${skill}`,
      link: `/sessions/${session._id}`,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("notification", {
        type: "SESSION_REQUEST",
        message: `New session request for ${skill}`,
      });
    }

    return success(res, "Session request sent", session, 201);

  } catch (error) {
    console.error("SEND SESSION ERROR:", error);
    return error(res);
  }
};


// ================= ACCEPT / REJECT SESSION =================
exports.respondToSession = async (req, res) => {
  try {

    const { sessionId, action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return error(res, "Invalid session ID", 400);
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return error(res, "Session not found", 404);
    }

    if (session.receiver.toString() !== req.user._id.toString()) {
      return error(res, "Not authorized", 403);
    }

    if (!["accepted", "rejected"].includes(action)) {
      return error(res, "Invalid action", 400);
    }

    session.status = action;

    if (action === "accepted") {
      const meetLink = await generateMeetLink(
        `SkillSwap Session - ${session.skill}`
      );
      session.meetLink = meetLink;
    }

    await session.save();

    await Notification.create({
      user: session.sender,
      type: action === "accepted" ? "SESSION_ACCEPTED" : "SESSION_REJECTED",
      message: `Your session for ${session.skill} was ${action}`,
      link: `/sessions/${session._id}`,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const senderSocket = onlineUsers.get(session.sender.toString());

    if (senderSocket) {
      io.to(senderSocket).emit("notification", {
        type: action === "accepted" ? "SESSION_ACCEPTED" : "SESSION_REJECTED",
        message: `Your session for ${session.skill} was ${action}`,
      });
    }

    return success(res, "Session updated", session);

  } catch (error) {
    console.error("RESPOND SESSION ERROR:", error);
    return error(res);
  }
};


// ================= GET MY SESSIONS =================
exports.getMySessions = async (req, res) => {
  try {

    const sessions = await Session.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
      .populate("sender", "name email averageRating")
      .populate("receiver", "name email averageRating")
      .sort({ createdAt: -1 });

    return success(res, "Sessions fetched", sessions);

  } catch (error) {
    console.error("GET MY SESSIONS ERROR:", error);
    return error(res);
  }
};


// ================= GET SENT SESSIONS =================
exports.getSentSessions = async (req, res) => {
  try {

    const sessions = await Session.find({ sender: req.user._id })
      .populate("receiver", "name email averageRating")
      .sort({ createdAt: -1 });

    return success(res, "Sent sessions fetched", sessions);

  } catch (error) {
    console.error("GET SENT SESSIONS ERROR:", error);
    return error(res);
  }
};


// ================= GET RECEIVED SESSIONS =================
exports.getReceivedSessions = async (req, res) => {
  try {

    const sessions = await Session.find({ receiver: req.user._id })
      .populate("sender", "name email averageRating")
      .sort({ createdAt: -1 });

    return success(res, "Received sessions fetched", sessions);

  } catch (error) {
    console.error("GET RECEIVED SESSIONS ERROR:", error);
    return error(res);
  }
};


// ================= UPLOAD RECORDING =================
exports.uploadRecording = async (req, res) => {
  try {

    const { sessionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return error(res, "Invalid session ID", 400);
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return error(res, "Session not found", 404);
    }

    if (
      session.sender.toString() !== req.user._id.toString() &&
      session.receiver.toString() !== req.user._id.toString()
    ) {
      return error(res, "Not authorized", 403);
    }

    if (!req.file) {
      return error(res, "No file uploaded", 400);
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    session.recordingUrl = result.secure_url;
    await session.save();

    const otherUser =
      session.sender.toString() === req.user._id.toString()
        ? session.receiver
        : session.sender;

    await Notification.create({
      user: otherUser,
      type: "RECORDING_UPLOADED",
      message: `Recording uploaded for ${session.skill} session`,
      link: `/sessions/${session._id}`,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocket = onlineUsers.get(otherUser.toString());

    if (receiverSocket) {
      io.to(receiverSocket).emit("notification", {
        type: "RECORDING_UPLOADED",
        message: `Recording uploaded for ${session.skill} session`,
      });
    }

    return success(res, "Recording uploaded successfully", {
      recordingUrl: result.secure_url,
    });

  } catch (error) {
    console.error("UPLOAD RECORDING ERROR:", error);
    return error(res);
  }
};


// ================= COMPLETE SESSION =================
exports.completeSession = async (req, res) => {
  try {

    const { sessionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return error(res, "Invalid session ID", 400);
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return error(res, "Session not found", 404);
    }

    if (
      session.sender.toString() !== req.user._id.toString() &&
      session.receiver.toString() !== req.user._id.toString()
    ) {
      return error(res, "Not authorized", 403);
    }

    if (session.status !== "accepted") {
      return error(res, "Only accepted sessions can be completed", 400);
    }

    session.status = "completed";
    await session.save();

    return success(res, "Session marked as completed", {
      session,
    });

  } catch (error) {
    console.error("COMPLETE SESSION ERROR:", error);
    return error(res);
  }
};


// ================= SUBMIT RATING =================
exports.submitRating = async (req, res) => {
  try {

    const { sessionId, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return error(res, "Invalid session ID", 400);
    }

    if (!rating || rating < 1 || rating > 5) {
      return error(res, "Rating must be between 1 and 5", 400);
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return error(res, "Session not found", 404);
    }

    if (session.status !== "completed") {
      return error(res, "Session must be completed before rating", 400);
    }

    let toUser;

    if (session.sender.toString() === req.user._id.toString()) {
      toUser = session.receiver;
    } else {
      toUser = session.sender;
    }

    const existingRating = await Rating.findOne({
      session: sessionId,
      fromUser: req.user._id,
    });

    if (existingRating) {
      return error(res, "You already rated this session", 400);
    }

    const newRating = await Rating.create({
      session: sessionId,
      fromUser: req.user._id,
      toUser,
      rating,
      comment,
    });

    const userToUpdate = await User.findById(toUser);

    userToUpdate.totalRatings += 1;

    userToUpdate.averageRating =
      (userToUpdate.averageRating * (userToUpdate.totalRatings - 1) + rating) /
      userToUpdate.totalRatings;

    await userToUpdate.save();

    await updateUserBadges(toUser);

    await Notification.create({
      user: toUser,
      type: "RATING_RECEIVED",
      message: `You received a ${rating}⭐ rating`,
      link: `/sessions/${session._id}`,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocket = onlineUsers.get(toUser.toString());

    if (receiverSocket) {
      io.to(receiverSocket).emit("notification", {
        type: "RATING_RECEIVED",
        message: `You received a ${rating}⭐ rating`,
      });
    }

    return success(res, "Rating submitted successfully", {
      rating: newRating,
      updatedUserRating: userToUpdate.averageRating,
    });

  } catch (error) {
    console.error("RATING ERROR:", error);
    return error(res);
  }
};