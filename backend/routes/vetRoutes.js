// backend/routes/vetRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET all vets
router.get("/", protect, async (req, res) => {
  try {
    const vets = await User.find({ role: "vet" }).select("-password");
    res.json(vets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;   
