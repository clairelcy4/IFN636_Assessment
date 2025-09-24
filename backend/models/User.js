const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  employeeID: { type: String },
  name: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["staff","vet","nurse"], required: true } ,// <- add
  specialty: { type: String },
  licenseNum: { type: String },
  password: { type: String, required: true },
  university: { type: String },
  address: { type: String },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
