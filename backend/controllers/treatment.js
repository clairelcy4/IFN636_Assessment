const { TreatmentModel } = require("../models/Treatment");

// READ all
const getTreatments = async (req, res) => {
  try {
    const treatments = await TreatmentModel.find();
    res.status(200).json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ one
const getTreatmentById = async (req, res) => {
  try {
    const treatment = await TreatmentModel.findById(req.params.id);
    if (!treatment) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json(treatment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
const addTreatment = async (req, res) => {
  try {
    const treatment = new TreatmentModel(req.body);
    const saved = await treatment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
const updateTreatment = async (req, res) => {
  try {
    const updated = await TreatmentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
const deleteTreatment = async (req, res) => {
  try {
    const deleted = await TreatmentModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json({ message: "Treatment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTreatments,
  addTreatment,
  updateTreatment,
  deleteTreatment,
};
