const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // Make sure server.js exports app
const { expect } = chai;

chai.use(chaiHttp);

describe("Appointments API with Strategies", () => {
  let createdId;

  // ✅ Strict Strategy
  it("should create appointment under strict strategy", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "Alice",
        petName: "Buddy",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:00:00.000Z",
        duration: 30,
        status: "Scheduled",
        reason: "Checkup",
        strategy: "strict"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        createdId = res.body._id;
        done();
      });
  });

  it("should reject overlapping appointment under strict strategy", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "Bob",
        petName: "Charlie",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:00:00.000Z", // same time as Alice
        duration: 30,
        status: "Scheduled",
        reason: "Vaccination",
        strategy: "strict"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // ✅ Buffer Strategy
  it("should reject appointments within buffer time", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "Eve",
        petName: "Milo",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:20:00.000Z", // within 15min buffer
        duration: 30,
        status: "Scheduled",
        reason: "Surgery",
        strategy: "buffer"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // ✅ Relaxed Strategy
  it("should allow overlapping appointment under relaxed strategy", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "Sam",
        petName: "Luna",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:00:00.000Z", // overlaps but relaxed allows
        duration: 30,
        status: "Scheduled",
        reason: "Follow-up",
        strategy: "relaxed"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  // ✅ Priority Strategy
  it("should allow emergency appointment even if overlapping", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "EmergencyUser",
        petName: "Rocky",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:00:00.000Z", // overlaps, but emergency
        duration: 30,
        status: "Scheduled",
        reason: "Emergency",
        strategy: "priority"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  // ✅ Flexible Strategy
  it("should allow small overlaps under flexible strategy", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "John",
        petName: "Max",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:25:00.000Z", // 5 min overlap allowed
        duration: 30,
        status: "Scheduled",
        reason: "Checkup",
        strategy: "flexible"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  it("should reject large overlaps under flexible strategy", (done) => {
    chai.request(server)
      .post("/api/appointments")
      .send({
        appointedBy: "Kate",
        petName: "Bella",
        vetName: "Dr. Smith",
        appointDate: "2025-09-30T10:10:00.000Z", // overlaps too much
        duration: 30,
        status: "Scheduled",
        reason: "Checkup",
        strategy: "flexible"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  // ✅ Clean up
  it("should delete appointment", (done) => {
    chai.request(server)
      .delete(`/api/appointments/${createdId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("Appointment deleted");
        done();
      });
  });
});
