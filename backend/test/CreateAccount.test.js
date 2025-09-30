const chai = require("chai");
const sinon = require("sinon");

const { expect } = chai;


const { registerUser } = require("../controllers/authController");


const User = require("../models/User");
const jwt = require("jsonwebtoken");

describe("Unit Test: Create Account (registerUser)", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    req = {
      body: {
        name: "Alice Vet",
        email: "Alice@Example.com", // mixed case to verify normalization
        password: "Passw0rd!",
        role: "Vet",                
      },
    };

    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };

    
    sandbox.stub(User, "findOne").resolves(null);

   
    sandbox.stub(User, "create").resolves({
      _id: "user_123",
      name: "Alice Vet",
      email: "alice@example.com",  
      role: "vet",                
    });

 
    sandbox.stub(jwt, "sign").returns("fake.jwt.token");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("#R1: registers a new user and returns token + role", async () => {
    await registerUser(req, res);

    expect(User.findOne.calledOnceWith({ email: "alice@example.com" })).to.be.true;
    expect(User.create.calledOnce).to.be.true;

 
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const payload = res.json.firstCall.args[0];
    expect(payload).to.include.keys(["id", "name", "email", "role", "token"]);
    expect(payload.name).to.equal("Alice Vet");
    expect(payload.email).to.equal("alice@example.com");
    expect(payload.role).to.equal("vet");
    expect(payload.token).to.equal("fake.jwt.token");
  });
});
