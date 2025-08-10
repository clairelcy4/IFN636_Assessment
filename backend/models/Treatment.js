import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    petName: { type: String, required: true },
    vetName: { type: String, required: true },
    nurseName: { type: String },
    diagnosisRecords: [
      {
        weight: Number,
        temperature: Number,
        symptoms: String,
        mediExam: String,
        diagnosis: String,
      },
    ],
    medication: [
      {
        medicationName: String,
        dose: Number,
        frequency: String,
        duration: Number,
        instruction: String,
        sideEffect: String,
      },
    ],
    vaccination: [
      {
        vaccineName: String,
        vaccinationDate: Date,
        needNextVac: Boolean,
        nextVacDate: Date,
        observation: String,
        notes: String,
      },
    ],
    treatDate: { type: Date, required: true },
    followUp: { type: Boolean, default: false },
    followUpDate: Date,
    payment: String,
    isPaid: { type: Boolean, default: false },

    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Treatment", treatmentSchema);
