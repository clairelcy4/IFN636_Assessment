const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointedBy: { type: String, required: true },
    petName: { type: String, required: true },
    vetName: { type: String, required: true },
    appointDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String },
    reason: { type: String },

    // relationship with treatment
    treatments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
