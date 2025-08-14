import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    petName: { type: String, required: true },
    vetName: { type: String, required: true },
    nurseName: { type: String },
    diagnosisRecords: [
      {
        weight: String,
        temperature: String,
        symptoms: String,
        mediExam: String,
        diagnosis: String,
      },
    ],
    medication: [
      {
        medicationName: String,
        dose: String,
        frequency: String,
        duration: String,
        instruction: String,
        sideEffect: String,
      },
    ],
    vaccination: [
      {
        vaccineName: String,
        vaccinationDate: String,
        nextVacDate: String,
        observation: String,
        notes: String,
      },
    ],
    treatDate: { type: String },
    followUp: { type: Boolean, default: false },
    followUpDate: { type: String },
    payment: { type: String },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Treatment", treatmentSchema);
