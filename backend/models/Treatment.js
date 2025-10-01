const mongoose = require("mongoose");

class Treatment {
  #isPaid; // private for OOP Principle "Encapsulation"

  constructor({
    petName,
    vetName,
    nurseName,
    diagnosisRecords = [],
    medication = [],
    vaccination = [],
    treatDate,
    followUp = false,
    followUpDate,
    payment = "",
  }) {
    this.petName = petName;
    this.vetName = vetName;
    this.nurseName = nurseName;
    this.diagnosisRecords = diagnosisRecords;
    this.medication = medication;
    this.vaccination = vaccination;
    this.treatDate = treatDate;
    this.followUp = followUp;
    this.followUpDate = followUpDate;
    this.payment = payment;
    this.#isPaid = false;
  }

  // Encapsulation: access to private state
  markAsPaid() {
    this.#isPaid = true;
  }

  isPaid() {
    return this.#isPaid;
  }
}

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

module.exports = {
  TreatmentClass: Treatment, // Encapsulation
  TreatmentModel:
    mongoose.models.Treatment || mongoose.model("Treatment", TreatmentSchema),
};
