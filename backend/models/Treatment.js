const express = require("express");
const router = express.Router();
const Treatment = require("../models/Treatment");

// CREATE
router.post("/", async (req, res) => {
  try {
    const treatment = new Treatment(req.body);
    const saved = await treatment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const treatments = await Treatment.find();
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
