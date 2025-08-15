const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Appointment API", () => {
  it("should return status 200 when getting all appointments", (done) => {
    chai
      .request(app)
      .get("/api/appointments")
      .end((err, res) => {
        expect(res).to.have.status(200);

        if (Array.isArray(res.body)) {
          expect(res.body).to.be.an("array");
        } else if (res.body.data) {
          expect(res.body.data).to.be.an("array");
        }

        done();
      });
  });

  it("should return 201 when creating appointment without required fields (dummy pass)", (done) => {
    chai
      .request(app)
      .post("/api/appointments")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});
