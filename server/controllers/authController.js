const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { success, error } = require("../utils/apiResponse");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, "User already exists", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return success(res, "User registered successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    }, 201);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return error(res);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return error(res, "Invalid Credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, "Invalid Credentials", 400);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return success(res, "Login successful", {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return error(res);
  }
};