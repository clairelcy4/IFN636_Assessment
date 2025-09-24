const express = require("express");
const router = express.Router();
const {
  StrictStrategy,
  BufferStrategy,
  RelaxedStrategy,
  PriorityStrategy,
  FlexibleStrategy,
} = require("../models/schedulingStrategies");

// Available strategies
const strategies = {
  strict: new StrictStrategy(),
  buffer: new BufferStrategy(15), // 15 min buffer
  relaxed: new RelaxedStrategy(),
  priority: new PriorityStrategy(),
  flexible: new FlexibleStrategy(5), // 5 min overlap allowed
};

// Default strategy = buffer
let defaultStrategy = "buffer";

// Store appointments in-memory (for demo; in real app this should use DB)
let appointments = [];

// ✅ Get all appointments
router.get("/", (req, res) => {
  res.json(appointments);
});

// ✅ Set default strategy at runtime
router.post("/set-strategy", (req, res) => {
  const { type } = req.body;
  if (!strategies[type]) {
    return res.status(400).json({ message: "Unknown strategy type" });
  }
  defaultStrategy = type;
  res.json({ message: `Strategy switched to ${type}` });
});

// ✅ Get current strategy
router.get("/current-strategy", (req, res) => {
  res.json({ currentStrategy: defaultStrategy });
});

// ✅ Create appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = { _id: Date.now().toString(), ...req.body };

    // Pick strategy: request body overrides default
    const chosen = (req.body.strategy || defaultStrategy).toLowerCase();
    const strategy = strategies[chosen] || strategies["buffer"];

    // Validate using selected strategy
    const valid = await strategy.validate(newAppointment, appointments);
    if (!valid) {
      return res.status(400).json({
        message: `Appointment conflicts under ${chosen} strategy`,
      });
    }

    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update appointment
router.put("/:id", (req, res) => {
  const { id } = req.params;
  appointments = appointments.map((a) =>
    a._id === id ? { ...a, ...req.body } : a
  );
  const updated = appointments.find((a) => a._id === id);
  res.json(updated);
});

// ✅ Delete appointment
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  appointments = appointments.filter((a) => a._id !== id);
  res.json({ message: "Appointment deleted" });
});

module.exports = router;
