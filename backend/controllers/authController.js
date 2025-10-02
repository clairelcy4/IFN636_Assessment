// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const sign = (u) =>
  jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

async function registerUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, password, role required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(409).json({ message: "Email already in use" });

    // NO manual bcrypt here — let the model pre('save') hash it
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password, // plain; pre-save hook will hash
      role: role.toLowerCase(),
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: sign(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const email = (req.body.email || "").toLowerCase().trim();
    const { password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: sign(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getProfile(req, res) {
  {
    /* unchanged */
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateUserProfile(req, res) {
  {
    /* unchanged, but see note below */
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.employeeID = req.body.employeeID || user.employeeID;
    user.name = req.body.name || user.name;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.specialty = req.body.specialty || user.specialty;
    user.licenseNum = req.body.licenseNum || user.licenseNum;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
