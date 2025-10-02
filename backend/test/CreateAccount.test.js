const chai = require("chai");
const sinon = require("sinon");
const { expect } = chai;

/** Controllers under test **/
const {
  registerUser,
  loginUser,
  updateUserProfile,
} = require("../controllers/authController");
const {
  addPet,
  updatePet,
  deletePet,
} = require("../controllers/petController");

/** Models + deps we’ll stub **/
const User = require("../models/User");
const Pet = require("../models/Pet");
const jwt = require("jsonwebtoken");

describe("App Flow Unit Tests (Register → Login → Edit Profile → Pet CRUD)", () => {
  let sandbox;
  let req, res;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Fresh req/res each test
    req = { body: {}, params: {}, user: {} };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  /** ======================
   *  AUTH: REGISTER (R1)
   *  ====================== */
  it("R1: Register → creates account and returns token & role", async () => {
    req.body = {
      name: "Alice Vet",
      email: "Alice@Example.com",    // verify normalization
      password: "Passw0rd!",
      role: "Vet",                   // verify normalization
    };

    // Email not in use
    sandbox.stub(User, "findOne").resolves(null);

    // Created user returned by model
    sandbox.stub(User, "create").resolves({
      _id: "user_123",
      name: "Alice Vet",
      email: "alice@example.com",
      role: "vet",
    });

    sandbox.stub(jwt, "sign").returns("fake.jwt.token");

    await registerUser(req, res);

    expect(User.findOne.calledOnceWith({ email: "alice@example.com" })).to.be.true;
    expect(User.create.calledOnce).to.be.true;

    expect(res.status.calledWith(201)).to.be.true;
    const payload = res.json.firstCall.args[0];
    expect(payload).to.include.keys(["id", "name", "email", "role", "token"]);
    expect(payload.email).to.equal("alice@example.com");
    expect(payload.role).to.equal("vet");
  });

  /** ======================
   *  AUTH: LOGIN
   *  ====================== */
  it("Login: accepts valid credentials (encapsulation: checkPassword)", async () => {
    req.body = { email: "alice@example.com", password: "Passw0rd!" };

    // When controller does: await User.findOne({email}).select("+password")
    // we must return an object with .select() -> Promise<user>
    const fakeUser = {
      _id: "user_123",
      name: "Alice Vet",
      email: "alice@example.com",
      role: "vet",
      checkPassword: sandbox.stub().resolves(true), // encapsulated check
    };
    const selectStub = sandbox.stub().returns(Promise.resolve(fakeUser));
    sandbox.stub(User, "findOne").returns({ select: selectStub });

    sandbox.stub(jwt, "sign").returns("fake.jwt.token");

    await loginUser(req, res);

    expect(User.findOne.calledOnceWith({ email: "alice@example.com" })).to.be.true;
    expect(selectStub.calledOnceWith("+password")).to.be.true;

    expect(fakeUser.checkPassword.calledOnceWith("Passw0rd!")).to.be.true;

    expect(res.status.called).to.be.false; // should be 200 implicitly
    const body = res.json.firstCall.args[0];
    expect(body).to.include.keys(["id", "name", "email", "role", "token"]);
    expect(body.email).to.equal("alice@example.com");
  });

  /** ======================
   *  AUTH: EDIT PROFILE
   *  ====================== */
  it("Edit profile: updates basic fields and returns user (no password leak)", async () => {
    req.user = { id: "user_123" };
    req.body = { name: "Alice Updated", phoneNumber: "0400123456" };

    const updated = {
      _id: "user_123",
      name: "Alice Updated",
      email: "alice@example.com",
      role: "vet",
      phoneNumber: "0400123456",
    };

    sandbox
      .stub(User, "findByIdAndUpdate")
      .resolves(updated); // controller usually does .select("-password") or similar

    await updateUserProfile(req, res);

    expect(User.findByIdAndUpdate.calledOnce).to.be.true;
    expect(res.status.called).to.be.false; // 200 default
    const body = res.json.firstCall.args[0];
    expect(body).to.include({ name: "Alice Updated", email: "alice@example.com" });
    expect(body).to.not.have.property("password");
  });

  /** ======================
   *  PET: CREATE
   *  ====================== */
  it("Pet: Create → adds a new pet for the current user", async () => {
    req.user = { id: "user_123", role: "staff" };
    req.body = {
      name: "Buddy",
      species: "Dog",
      age: 3,
      allergyMed: "None",
      ownerName: "Alice",
      ownerPhone: "0400123456",
      ownerEmail: "alice@example.com",
    };

    const created = {
      _id: "pet_001",
      ...req.body,
      ownerId: "user_123",
    };

    sandbox.stub(Pet, "create").resolves(created);

    await addPet(req, res);

    expect(Pet.create.calledOnce).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  /** ======================
   *  PET: UPDATE
   *  ====================== */
  it("Pet: Update → edits a pet by id", async () => {
    req.user = { id: "user_123", role: "staff" };
    req.params.id = "pet_001";
    req.body = { age: 4 };

    const updatedPet = {
      _id: "pet_001",
      name: "Buddy",
      species: "Dog",
      age: 4,
      ownerId: "user_123",
    };

    sandbox.stub(Pet, "findByIdAndUpdate").resolves(updatedPet);

    await updatePet(req, res);

    expect(Pet.findByIdAndUpdate.calledOnce).to.be.true;
    expect(res.status.called).to.be.false; // 200 default
    expect(res.json.calledWith(updatedPet)).to.be.true;
  });

  /** ======================
   *  PET: REMOVE
   *  ====================== */
  it("Pet: Remove → deletes a pet by id", async () => {
    req.user = { id: "user_123", role: "staff" };
    req.params.id = "pet_001";

    sandbox.stub(Pet, "findByIdAndDelete").resolves({ _id: "pet_001" });

    await deletePet(req, res);

    expect(Pet.findByIdAndDelete.calledOnceWith("pet_001")).to.be.true;
    expect(res.status.called).to.be.false; // 200 default
    expect(res.json.calledWithMatch({ message: "Pet deleted" })).to.be.true;
  });
});

