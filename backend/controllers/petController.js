// testing
// let pets = [];
const Pet = require("../models/Pet");

const getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ ownerId: req.user.id }); // ADD
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addPet = async (req, res) => {
  try {
    const pet = await Pet.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }); // ADD
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id); // ADD
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPets, addPet, updatePet, deletePet };
