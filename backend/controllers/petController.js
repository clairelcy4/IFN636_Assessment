// testing
// let pets = [];
const Pet = require("../models/Pet");

// GET all
const getPets = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const pets = await Pet.find({ ownerId: req.user.id });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET one
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const addPet = async (req, res) => {
  try {
    const pet = await Pet.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPets, getPetById, addPet, updatePet, deletePet };
