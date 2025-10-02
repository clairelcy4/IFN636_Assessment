const express = require("express");
const router = express.Router();
const { TreatmentModel } = require("../models/Treatment");

// GET all
router.get("/", async (req, res) => {
  try {
    const treatments = await TreatmentModel.find();
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by ID
router.get("/:id", async (req, res) => {
  try {
    const treatment = await TreatmentModel.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const treatment = new TreatmentModel(req.body);
    const saved = await treatment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await TreatmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updated) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await TreatmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.json({ message: "Treatment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
