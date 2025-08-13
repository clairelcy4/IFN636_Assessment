const express = require("express");
const router = express.Router();

let appointments = [];

// GET
router.get("/", (req, res) => {
  res.json(appointments);
});

// POST
router.post("/", (req, res) => {
  const newAppointment = { _id: Date.now().toString(), ...req.body };
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

// UPDATE
router.put("/:id", (req, res) => {
  const { id } = req.params;
  appointments = appointments.map((a) =>
    a._id === id ? { ...a, ...req.body } : a
  );
  const updatedAppointment = appointments.find((a) => a._id === id);
  res.json(updatedAppointment);
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  appointments = appointments.filter((a) => a._id !== id);
  res.json({ message: "Appointment deleted" });
});

module.exports = router;
