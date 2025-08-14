const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      employeeID: user.employeeID,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      specialty: user.specialty,
      licenseNum: user.licenseNum,
      university: user.university,
      address: user.address,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  // Debug logs
  console.log("=== UPDATE PROFILE REQUEST START ===");
  console.log("Headers:", req.headers);
  console.log("User from token:", req.user);
  console.log("Request body:", req.body);

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    const {
      employeeID,
      name,
      phoneNumber,
      email,
      specialty,
      licenseNum,
      university,
      address,
    } = req.body;

    user.employeeID = employeeID || user.employeeID;
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;
    user.specialty = specialty || user.specialty;
    user.licenseNum = licenseNum || user.licenseNum;
    user.university = university || user.university;
    user.address = address || user.address;

    const updatedUser = await user.save();
    console.log("User updated successfully:", updatedUser);

    res.json({
      id: updatedUser.id,
      employeeID: updatedUser.employeeID,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      email: updatedUser.email,
      specialty: updatedUser.specialty,
      licenseNum: updatedUser.licenseNum,
      university: updatedUser.university,
      address: updatedUser.address,
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
};
