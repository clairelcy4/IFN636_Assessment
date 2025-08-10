const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
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
  treatDate: Date,
  followUp: Boolean,
  followUpDate: Date,
  payment: String,
  isPaid: Boolean,

  // relationship with appointment
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
});

module.exports = mongoose.model("Treatment", treatmentSchema);
