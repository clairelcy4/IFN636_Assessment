import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const PetProfiles = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    allergyMed: "",
    ownerName: "",
    ownerContactNum: "",
    ownerContactEmail: "",
  });

  // get pet info
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axiosInstance.get("/api/pets", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets(response.data);
      } catch (error) {
        alert("Failed to fetch pet profiles.");
      }
    };

    fetchPets();
  }, [user]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.age <= 0) {
      alert("Age must be greater than 0");
      return;
    }

    try {
      if (editingPet) {
        // if existed then just update
        const response = await axiosInstance.put(
          `/api/pets/${editingPet._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setPets(
          pets.map((pet) => (pet._id === editingPet._id ? response.data : pet))
        );
        setEditingPet(null);
      } else {
        // if not existed then create
        const response = await axiosInstance.post("/api/pets", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPets([...pets, response.data]);
      }
      // reset
      setFormData({
        name: "",
        species: "",
        age: "",
        allergyMed: "",
        ownerName: "",
        ownerContactNum: "",
        ownerContactEmail: "",
      });
    } catch (error) {
      alert("Failed to save pet profile.");
    }
  };

  // modify
  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      age: pet.age,
      allergyMed: pet.allergyMed,
      ownerName: pet.ownerName,
      ownerContactNum: pet.ownerContactNum,
      ownerContactEmail: pet.ownerContactEmail,
    });
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPets(pets.filter((pet) => pet._id !== id));
    } catch (error) {
      alert("Failed to delete pet profile.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded mb-6"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingPet ? "Edit Pet Profile" : "Add Pet Profile"}
        </h2>
        {[
          { name: "name", placeholder: "Pet Name" },
          { name: "species", placeholder: "Species" },
          { name: "age", placeholder: "Age (years)", type: "number" },
          { name: "allergyMed", placeholder: "Allergy Medication" },
          { name: "ownerName", placeholder: "Owner Name" },
          { name: "ownerContactNum", placeholder: "Owner Contact Number" },
          { name: "ownerContactEmail", placeholder: "Owner Contact Email" },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type || "text"}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) =>
              setFormData({ ...formData, [field.name]: e.target.value })
            }
            className="w-full mb-4 p-2 border rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingPet ? "Update" : "Add"}
        </button>
      </form>

      {/* Pet profile list */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Pet Profile List</h2>
        {pets.length === 0 ? (
          <p>No pet profiles available.</p>
        ) : (
          pets.map((pet) => (
            <div
              key={pet._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <strong>{pet.name}</strong> ({pet.species}), Age: {pet.age}
                <br />
                Allergy Med: {pet.allergyMed || "None"}
                <br />
                Owner: {pet.ownerName} | {pet.ownerContactNum} |{" "}
                {pet.ownerContactEmail}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(pet)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pet._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PetProfiles;
