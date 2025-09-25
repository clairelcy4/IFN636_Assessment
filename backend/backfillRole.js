// backend/backfillRole.js
const path = require("path");

// Load env from backend/.env
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const mongoose = require("mongoose");

// 🔴 If your model file is named differently (e.g. userModel.js), change the last segment below.
const User = require(path.resolve(__dirname, "models", "User"));

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in backend/.env");
    console.log("Connecting to Mongo…");
    await mongoose.connect(process.env.MONGO_URI);

    // Backfill missing/empty role to "vet"
    const res1 = await User.updateMany(
      { $or: [{ role: { $exists: false } }, { role: null }, { role: "" }] },
      { $set: { role: "vet" } }
    );

    // Normalize role to lowercase
    const res2 = await User.updateMany({}, [{ $set: { role: { $toLower: "$role" } } }]);

    console.log("Backfilled roles → 'vet':", res1.modifiedCount);
    console.log("Normalized role to lowercase:", res2.modifiedCount);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();

