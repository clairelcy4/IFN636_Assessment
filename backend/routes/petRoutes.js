const express = require("express");
const router = express.Router();
const {
  getPets,
  addPet,
  updatePet,
  deletePet,
} = require("../controllers/petController");

// CRUD API
router.get("/", getPets);
router.post("/", addPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

// TEST ONLY
router.get("/test", (req, res) => {
  res.json([{ name: "Test Pet", species: "Dog" }]);
});

router.post("/test", (req, res) => {
  const newPet = req.body;
  console.log("create new pet profile：", newPet);
  res.status(201).json({ ...newPet, _id: Date.now().toString() });
});

module.exports = router;
