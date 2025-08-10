const express = require("express");
const router = express.Router();

// testing
let treatments = [];

// GET
router.get("/", (req, res) => {
  res.json(treatments);
});

// POST
router.post("/", (req, res) => {
  const newTreatment = { _id: Date.now().toString(), ...req.body };
  treatments.push(newTreatment);
  res.status(201).json(newTreatment);
});

// UPDATE
router.put("/:id", (req, res) => {
  const { id } = req.params;
  treatments = treatments.map((t) =>
    t._id === id ? { ...t, ...req.body } : t
  );
  const updatedTreatment = treatments.find((t) => t._id === id);
  res.json(updatedTreatment);
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  treatments = treatments.filter((t) => t._id !== id);
  res.json({ message: "Treatment deleted" });
});

module.exports = router;
