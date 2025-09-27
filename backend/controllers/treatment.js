import Treatment from "../models/Treatment.js";

// READ all
export const getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find();
    res.status(200).json(treatments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
export const addTreatment = async (req, res) => {
  try {
    const treatment = new Treatment(req.body);
    const saved = await treatment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
export const updateTreatment = async (req, res) => {
  try {
    const updated = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteTreatment = async (req, res) => {
  try {
    const deleted = await Treatment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Treatment not found" });
    }
    res.status(200).json({ message: "Treatment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
