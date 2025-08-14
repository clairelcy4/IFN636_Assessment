const express = require("express");
const mongoose = require("mongoose");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getPets,
  addPet,
  updatePet,
  deletePet,
  getPetById,
} = require("../controllers/petController");

router.get("/", protect, getPets);
router.get(
  "/:id",
  protect,
  async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  },
  getPetById
);
router.post("/", protect, addPet);
router.put(
  "/:id",
  protect,
  async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  },
  updatePet
);

// GET all
router.get("/", getPets);

// GET one by ID
router.get(
  "/:id",
  async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  },
  getPetById
);

// CREATE
router.post("/", addPet);

// UPDATE
router.put(
  "/:id",
  async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  },
  updatePet
);

// DELETE
router.delete(
  "/:id",
  protect,
  async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    next();
  },
  deletePet
);
module.exports = router;
