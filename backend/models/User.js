const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    employeeID: { type: String },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ["staff", "vet", "nurse"], required: true },
    specialty: { type: String },
    licenseNum: { type: String },

    
    password: { type: String, required: true, select: false },

    university: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});




userSchema.methods.checkPassword = async function (plain) {
  
  const hash = this.password
    ? this.password
    : (await this.constructor.findById(this._id).select("+password"))?.password;

  if (!hash) return false;
  return bcrypt.compare(plain, hash);
};


userSchema.methods.updatePassword = async function (newPlain) {
  this.password = newPlain;
  await this.save();
  return true;
};


userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);

