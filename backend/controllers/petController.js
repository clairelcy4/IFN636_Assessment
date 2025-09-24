// backend/controllers/petController.js
const Pet = require("../models/Pet");

// Fields vets/nurses can see (adjust to your schema)
const REDUCED_FIELDS =
  "name species breed sex age weight photo lastVisit vaccineSummary allergies";

// GET all
const getPets = async (req, res) => {
  try {
    const select = req.user.role === "staff" ? undefined : REDUCED_FIELDS;

    // Keep your existing behavior (owner-scoped).
    // If staff should see ALL pets, change filter to {} for staff.
    const filter =
      req.user.role === "staff" ? { ownerId: req.user.id } : { ownerId: req.user.id };

    const pets = await Pet.find(filter).select(select);
    return res.json(pets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET one
const getPetById = async (req, res) => {
  try {
    const select = req.user.role === "staff" ? undefined : REDUCED_FIELDS;
    const pet = await Pet.findById(req.params.id).select(select);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    // Enforce ownership for non-staff (optional; mirrors your list behavior)
    if (String(pet.ownerId) !== String(req.user.id) && req.user.role !== "staff") {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(pet);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CREATE (staff only via router)
const addPet = async (req, res) => {
  try {
    const pet = await Pet.create({ ...req.body, ownerId: req.user.id });
    return res.status(201).json(pet);
  } catch (error) {
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
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getPets, getPetById, addPet, updatePet, deletePet };

