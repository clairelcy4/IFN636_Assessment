const express = require("express");
const router = express.Router();

// test GET
router.get("/", (req, res) => {
  res.json([{ name: "Test Pet", species: "Dog" }]);
});

module.exports = router;

// test POST
router.post("/", (req, res) => {
  const newPet = req.body;
  console.log("create new pet profile：", newPet);
  res.status(201).json({ ...newPet, _id: Date.now().toString() });
});

module.exports = router;
