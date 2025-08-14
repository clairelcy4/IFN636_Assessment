const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    species: { type: String },
    breed: { type: String },
    age: { type: Number },
    allergyMed: { type: String },
    ownerName: { type: String },
    ownerPhone: { type: String },
    ownerEmail: { type: String },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
