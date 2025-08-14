const express = require("express");
const router = express.Router();

let treatments = [];

// GET
router.get("/", (req, res) => {
  res.json(treatments);
});

// GET
router.get("/:id", (req, res) => {
  const treatment = treatments.find((t) => t._id === req.params.id);
  if (!treatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }
  res.json(treatment);
});

// CREATE
router.post("/", (req, res) => {
  const newTreatment = {
    _id: Date.now().toString(),
    petName: req.body.petName,
    treatmentType: req.body.treatmentType,
    medication: req.body.medication,
    notes: req.body.notes,
    diagnosisRecords: req.body.diagnosisRecords || [],
    vaccination: req.body.vaccination || [],
    treatDate: req.body.treatDate || "",
    followUp: req.body.followUp || false,
    followUpDate: req.body.followUpDate || "",
    payment: req.body.payment || "",
    isPaid: req.body.isPaid || false,
  };
  treatments.push(newTreatment);
  res.status(201).json(newTreatment);
});

// UPDATE
router.put("/:id", (req, res) => {
  const { id } = req.params;
  let updatedTreatment = null;
  treatments = treatments.map((t) => {
    if (t._id === id) {
      updatedTreatment = { ...t, ...req.body };
      return updatedTreatment;
    }
    return t;
  });
  if (!updatedTreatment) {
    return res.status(404).json({ message: "Treatment not found" });
  }
  res.json(updatedTreatment);
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const exists = treatments.some((t) => t._id === id);
  treatments = treatments.filter((t) => t._id !== id);
  if (!exists) {
    return res.status(404).json({ message: "Treatment not found" });
  }
  res.json({ message: "Treatment deleted" });
});

module.exports = router;
