const chai = require("chai");
const sinon = require("sinon");
const { TreatmentModel: Treatment } = require("../models/Treatment");
const {
  getTreatments,
  addTreatment,
  updateTreatment,
  deleteTreatment,
} = require("../controllers/treatment");

const { assert, expect } = chai;

describe("Unit Test of Treatment Records", () => {
  let req, res, sandbox;
  // unit test and simulate the req&res
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {}, params: {} };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
  });
  // ensure not affected by old test
  afterEach(() => {
    sandbox.restore();
  });

  // ensure not null in column
  it("#T1: should fail if Pet Name is empty", async () => {
    req.body = { petName: "", vetName: "Doctor Dolittle" };
    const treatment = new Treatment(req.body);
    try {
      await treatment.validate();
      assert.fail("Validation should have failed");
    } catch (err) {
      assert.include(err.message, "petName");
    }
  });
  it("#T2: should fail if Vet Name is empty", async () => {
    req.body = { petName: "Habaobao", vetName: "" };
    const treatment = new Treatment(req.body);
    try {
      await treatment.validate();
      assert.fail("Validation should have failed");
    } catch (err) {
      assert.include(err.message, "vetName");
    }
  });
  it("#T3: should fail if Nurse Name is empty", async () => {
    req.body = {
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "",
    };
    const treatment = new Treatment(req.body);
    try {
      await treatment.validate();
      assert.fail("Validation should have failed");
    } catch (err) {
      assert.include(err.message, "nurseName");
    }
  });
  it("#T4: should have Diagnosis Record", async () => {
    req.body = {
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      diagnosisRecords: [
        { weight: "1.9", temperature: "38.5", symptoms: "cough" },
      ],
    };
    const treatment = new Treatment(req.body);
    await treatment.validate();
  });

  it("#T5: should have Medication", async () => {
    req.body = {
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      medication: [
        {
          medicationName: "Antibiotic",
          dose: "5mg",
          frequency: "2 pills per day",
        },
      ],
    };
    const treatment = new Treatment(req.body);
    await treatment.validate();
  });

  it("#T6: should have Vaccination", async () => {
    req.body = {
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      vaccination: [
        { vaccineName: "Triple Vaccine", vaccinationDate: "2025-09-27" },
      ],
    };
    const treatment = new Treatment(req.body);
    await treatment.validate();
  });
  it("#T7: if have followUp and followUpDate", async () => {
    req.body = {
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      followUp: true,
      followUpDate: "2025-10-20",
    };
    const treatment = new Treatment(req.body);
    await treatment.validate();
  });
  it("#T8: should include Payment and check isPaid", async () => {
    req.body = {
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      payment: "111",
      isPaid: true,
    };
    const treatment = new Treatment(req.body);
    await treatment.validate();
  });

  //  CREATE
  it("#T9: should add a new treatment", async () => {
    req.body = { petName: "Habaobao", vetName: "Doctor Dolittle" };
    const fakeTreatment = { ...req.body, _id: "001" };

    sandbox.stub(Treatment.prototype, "save").resolves(fakeTreatment);

    await addTreatment(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(fakeTreatment)).to.be.true;
  });

  // READ
  it("#T10: should return all treatments", async () => {
    const fakeList = [{ _id: "001", petName: "Habaobao" }];
    sandbox.stub(Treatment, "find").resolves(fakeList);

    await getTreatments(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeList)).to.be.true;
  });

  // UPDATE
  it("#T11: should update a treatment", async () => {
    req.params.id = "001";
    req.body = { vetName: "Doctor Dolittle" };
    const fakeUpdated = {
      _id: "001",
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
    };

    sandbox.stub(Treatment, "findByIdAndUpdate").resolves(fakeUpdated);

    await updateTreatment(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeUpdated)).to.be.true;
  });

  // DELETE
  it("#T12: should delete a treatment", async () => {
    req.params.id = "001";

    sandbox.stub(Treatment, "findByIdAndDelete").resolves({ _id: "001" });

    await deleteTreatment(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: "Treatment deleted" })).to.be
      .true;
  });
  it("#T13: should remove a Diagnosis Record", async () => {
    const treatment = new Treatment({
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      diagnosisRecords: [
        { weight: "1.9", temperature: "38.5", symptoms: "cough" },
      ],
    });
    sandbox.stub(Treatment.prototype, "save").resolves(treatment);

    await treatment.save();

    treatment.diagnosisRecords.id(treatment.diagnosisRecords[0]._id).remove();

    await treatment.save();

    expect(treatment.diagnosisRecords).to.have.lengthOf(0);
  });
  it("#T14: should remove a Medication", async () => {
    const treatment = new Treatment({
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      medication: [
        {
          medicationName: "Antibiotic",
          dose: "5mg",
          frequency: "2 pills per day",
        },
      ],
    });

    sandbox.stub(Treatment.prototype, "save").resolves(treatment);

    await treatment.save();

    treatment.medication.id(treatment.medication[0]._id).remove();

    await treatment.save();

    expect(treatment.medication).to.have.lengthOf(0);
  });
  it("#T15: should remove a Vaccination", async () => {
    const treatment = new Treatment({
      petName: "Habaobao",
      vetName: "Doctor Dolittle",
      nurseName: "Nancy",
      vaccination: [
        { vaccineName: "Triple Vaccine", vaccinationDate: "2025-09-27" },
      ],
    });

    sandbox.stub(Treatment.prototype, "save").resolves(treatment);

    await treatment.save();

    treatment.vaccination.id(treatment.vaccination[0]._id).remove();

    await treatment.save();

    expect(treatment.vaccination).to.have.lengthOf(0);
  });
});
