const { expect } = require("chai");
const { Animal, Pet } = require("../models/Pet");

describe("Animal & Pet Inheritance", () => {
  it("Animal.getInfo() should return name and species", () => {
    const lion = new Animal({ name: "Leo", species: "Lion" });
    const info = lion.getInfo();
    expect(info).to.equal("Name: Leo, Species: Lion");
  });

  it("Pet.getInfo() should include owner info", () => {
    const dog = new Pet({ name: "Buddy", species: "Dog", ownerName: "Alice" });
    const info = dog.getInfo();
    expect(info).to.equal("Name: Buddy, Species: Dog, Owner: Alice");
  });

  it("Pet should inherit fields from Animal", () => {
    const pet = new Pet({ name: "Coco", species: "Cat", ownerName: "Bob" });
    expect(pet).to.have.property("name", "Coco");     
    expect(pet).to.have.property("species", "Cat");   
    expect(pet).to.have.property("ownerName", "Bob"); 
  });
});
