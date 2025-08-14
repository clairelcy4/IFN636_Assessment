import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    petId: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    appointedBy: { type: String, required: true },
    vetName: { type: String, required: true },
    appointDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    reason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
