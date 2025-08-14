const express = require("express");
const VetSchedule = require("../models/VetSchedule");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET
router.get("/:vetId", protect, async (req, res) => {
  try {
    const schedules = await VetSchedule.find({ vetId: req.params.vetId }).sort({
      startTime: 1,
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
});

// POST
router.post("/", protect, async (req, res) => {
  try {
    const { vetId, scheduleType, startTime, endTime } = req.body;
    const schedule = new VetSchedule({
      vetId,
      scheduleType,
      startTime,
      endTime,
    });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Failed to create schedule" });
  }
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const { scheduleType, startTime, endTime } = req.body;
    const updatedSchedule = await VetSchedule.findByIdAndUpdate(
      req.params.id,
      { scheduleType, startTime, endTime },
      { new: true, runValidators: true }
    );
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Failed to update schedule" });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await VetSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete schedule" });
  }
});

module.exports = router;
