// testing
let pets = [];

const getPets = (req, res) => {
  res.json(pets);
};

const addPet = (req, res) => {
  const pet = { id: Date.now().toString(), ...req.body };
  pets.push(pet);
  res.status(201).json(pet);
};

const updatePet = (req, res) => {
  const index = pets.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Pet not found" });
  }
  pets[index] = { ...pets[index], ...req.body };
  res.json(pets[index]);
};

const deletePet = (req, res) => {
  const index = pets.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Pet not found" });
  }
  const deletedPet = pets.splice(index, 1);
  res.json({ message: "Pet deleted", pet: deletedPet });
};

module.exports = { getPets, addPet, updatePet, deletePet };
