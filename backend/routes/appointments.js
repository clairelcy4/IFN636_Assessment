const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

const {
  StrictStrategy,
  BufferStrategy,
  RelaxedStrategy,
  PriorityStrategy,
  FlexibleStrategy,
} = require("../models/schedulingStrategies");

// Strategies
const strategies = {
  strict: new StrictStrategy(),
  buffer: new BufferStrategy(15),
  relaxed: new RelaxedStrategy(),
  priority: new PriorityStrategy(),
  flexible: new FlexibleStrategy(5),
};

let defaultStrategy = "buffer";

// Get all appointments 
router.get("/", async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Create appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);

    const chosen = (req.body.strategy || defaultStrategy).toLowerCase();
    const strategy = strategies[chosen] || strategies["buffer"];

    // load existing from DB
    const appointments = await Appointment.find();

    const valid = await strategy.validate(newAppointment, appointments);
    if (!valid) {
      return res.status(400).json({
        message: `Appointment conflicts under ${chosen} strategy`,
      });
    }

    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update appointment
router.put("/:id", async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// Delete appointment
router.delete("/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Appointment deleted" });
});

module.exports = router;
