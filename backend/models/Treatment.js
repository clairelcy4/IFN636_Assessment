const mongoose = require("mongoose");

const TreatmentSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  vetName: { type: String },
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
  treatDate: String,
  followUp: { type: Boolean, default: false },
  followUpDate: String,
  payment: String,
  isPaid: { type: Boolean, default: false },
});

module.exports =
  mongoose.models.Treatment || mongoose.model("Treatment", TreatmentSchema);
