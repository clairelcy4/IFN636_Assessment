// test/appointments.test.js

const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { expect } = chai;
const app = require("../server");
const Appointment = require("../models/Appointment");

describe("Appointments API with Strategies", () => {

  // Reset DB before each test
  beforeEach(async () => {
    await Appointment.deleteMany({});
  });

  // Strict Strategy
  it("should create appointment under strict strategy", (done) => {
    chai.request(app)
      .post("/api/appointments")
      .send({
        appointedBy: "Alice",
        petName: "Buddy",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:00:00.000Z",
        duration: 30,
        status: "Scheduled",
        reason: "Checkup",
        strategy: "strict",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("_id");
        done();
      });
  });

  it("should reject overlapping appointment under strict strategy", async () => {
    await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).post("/api/appointments").send({
      appointedBy: "Bob",
      petName: "Charlie",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
      reason: "Vaccination",
      strategy: "strict",
    });
    expect(res).to.have.status(400);
  });

  // Buffer Strategy
  it("should reject appointments within buffer time", async () => {
    await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).post("/api/appointments").send({
      appointedBy: "Eve",
      petName: "Milo",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:20:00.000Z", // within 15min buffer
      duration: 30,
      status: "Scheduled",
      reason: "Surgery",
      strategy: "buffer",
    });
    expect(res).to.have.status(400);
  });

  // Relaxed Strategy
  it("should allow overlapping appointment under relaxed strategy", async () => {
    await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).post("/api/appointments").send({
      appointedBy: "Sam",
      petName: "Luna",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z", // overlaps but relaxed allows
      duration: 30,
      status: "Scheduled",
      reason: "Follow-up",
      strategy: "relaxed",
    });
    expect(res).to.have.status(201);
  });

  // Priority Strategy
  it("should allow emergency appointment even if overlapping", async () => {
    await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).post("/api/appointments").send({
      appointedBy: "EmergencyUser",
      petName: "Rocky",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z", // overlaps, but emergency
      duration: 30,
      status: "Scheduled",
      reason: "Emergency",
      strategy: "priority",
    });
    expect(res).to.have.status(201);
  });

  // Flexible Strategy
  it("should allow small overlaps under flexible strategy", async () => {
    await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).post("/api/appointments").send({
      appointedBy: "John",
      petName: "Max",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:25:00.000Z", // 5 min overlap
      duration: 30,
      status: "Scheduled",
      reason: "Checkup",
      strategy: "flexible",
    });
    expect(res).to.have.status(201);
  });

  it("should reject large overlaps under flexible strategy", async () => {
    await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).post("/api/appointments").send({
      appointedBy: "Kate",
      petName: "Bella",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:10:00.000Z", // too big overlap
      duration: 30,
      status: "Scheduled",
      reason: "Checkup",
      strategy: "flexible",
    });
    expect(res).to.have.status(400);
  });

  // Delete
  it("should delete appointment", async () => {
    const saved = await Appointment.create({
      appointedBy: "Alice",
      petName: "Buddy",
      vetName: "Dr. Smith",
      appointDate: "2025-09-30T10:00:00.000Z",
      duration: 30,
      status: "Scheduled",
    });

    const res = await chai.request(app).delete(`/api/appointments/${saved._id}`);
    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Appointment deleted");
  });
});
