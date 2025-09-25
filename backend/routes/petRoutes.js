// backend/routes/petRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getPets,
  addPet,
  updatePet,
  deletePet,
  getPetById,
} = require("../controllers/petController");

const router = express.Router();

// Reusable ObjectId validator
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};

// All routes require a valid JWT
router.use(protect);

// READ: list all pets (scoped in controller)
router.get("/", getPets);

// READ: single pet
router.get("/:id", validateObjectId, getPetById);

// CREATE: staff only
router.post("/", authorize("staff"), addPet);

// UPDATE: staff only
router.put("/:id", authorize("staff"), validateObjectId, updatePet);

// DELETE: staff only
router.delete("/:id", authorize("staff"), validateObjectId, deletePet);

module.exports = router;

