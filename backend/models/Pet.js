const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String },
    breed: { type: String },
    age: { type: Number },
    allergyMed: { type: String },
  },
  {
    timestamps: true,
    discriminatorKey: "kind",
  }
);

animalSchema.methods.getInfo = function () {
  return `Name: ${this.name}, Species: ${this.species}`;
};

const Animal = mongoose.model("Animal", animalSchema);

const petSchema = new mongoose.Schema({
  ownerName: { type: String },
  ownerPhone: { type: String },
  ownerEmail: { type: String },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

petSchema.methods.getInfo = function () {
  return `Name: ${this.name}, Species: ${this.species}, Owner: ${this.ownerName}`;
};

const Pet = Animal.discriminator("Pet", petSchema);

module.exports = { Animal, Pet };
