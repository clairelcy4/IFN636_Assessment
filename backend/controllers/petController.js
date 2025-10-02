// backend/controllers/petController.js
const Pet = require("../models/Pet");

// debug
// console.log("DEBUG Pet model:", typeof Pet, Pet.modelName);

// Fields vets/nurses can see (adjust to your schema)
const REDUCED_FIELDS =
  "name species breed sex age weight photo lastVisit vaccineSummary allergies";

// GET all
const getPets = async (req, res) => {
  try {
    // Keep your existing behavior (owner-scoped).
    // If staff should see ALL pets, change filter to {} for staff.
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let select;
    let filter;

    if (req.user.role === "staff") {
      // staff see the most
      select = undefined;
      filter = {};
    } else if (req.user.role === "vet" || req.user.role === "nurse") {
      // vet or nurse sees no personal info
      select = REDUCED_FIELDS;
      filter = {};
    } else {
      // exception  for old data
      select = REDUCED_FIELDS;
      filter = { ownerId: req.user._id };
    }

    const pets = await Pet.find(filter).select(select);
    return res.json(pets);
  } catch (error) {
    // debug
    console.error("getPets error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// GET one
const getPetById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const select = req.user.role === "staff" ? undefined : REDUCED_FIELDS;
    const pet = await Pet.findById(req.params.id).select(select);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Enforce ownership for non-staff (optional; mirrors your list behavior)
    if (
      req.user.role === "user" &&
      String(pet.ownerId) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(pet);
  } catch (error) {
    // debug
    console.error("getPetById error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// CREATE (staff only via router)
const addPet = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const pet = await Pet.create({
      ...req.body,
      ownerId: req.user._id || null,
    });
    return res.status(201).json(pet);
  } catch (error) {
    console.error("addPet error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE (staff only via router)
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    return res.json(pet);
  } catch (error) {
    console.error("updatePet error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// DELETE (staff only via router)
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    return res.json({ message: "Pet deleted" });
  } catch (error) {
    console.error("deletePet error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPets,
  getPetById,
  addPet,
  updatePet,
  deletePet,
};
