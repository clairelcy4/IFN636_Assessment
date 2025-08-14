import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const PetProfiles = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    allergyMed: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
  });
  const [editing, setEditing] = useState(false);
  const [currentPetId, setCurrentPetId] = useState(null);

  const fetchPets = async () => {
    try {
      const res = await axiosInstance.get("/api/pets", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPets(res.data);
    } catch (err) {
      alert("Failed to fetch pet profiles");
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchPets();
    }
  }, [user]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing && currentPetId) {
        // UPDATE
        await axiosInstance.put(`/api/pets/${currentPetId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Pet profile updated successfully");
      } else {
        // CREATE
        await axiosInstance.post("/api/pets", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Pet profile added successfully");
      }
      setFormData({
        name: "",
        species: "",
        age: "",
        allergyMed: "",
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",
      });
      setEditing(false);
      setCurrentPetId(null);
      fetchPets();
    } catch (err) {
      alert("Failed to save pet profile");
    }
  };

  const handleEdit = (pet) => {
    setFormData({
      name: pet.name,
      species: pet.species,
      age: pet.age,
      allergyMed: pet.allergyMed,
      ownerName: pet.ownerName,
      ownerPhone: pet.ownerPhone,
      ownerEmail: pet.ownerEmail,
    });
    setCurrentPetId(pet._id);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await axiosInstance.delete(`/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Pet profile deleted successfully");
      fetchPets();
    } catch (err) {
      alert("Failed to delete pet profile");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Edit Pet Profile" : "Add Pet Profile"}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
        <input
          type="text"
          placeholder="Pet Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Species"
          value={formData.species}
          onChange={(e) => handleChange("species", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => handleChange("age", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Allergy Med"
          value={formData.allergyMed}
          onChange={(e) => handleChange("allergyMed", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Owner Name"
          value={formData.ownerName}
          onChange={(e) => handleChange("ownerName", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Owner Phone"
          value={formData.ownerPhone}
          onChange={(e) => handleChange("ownerPhone", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Owner Email"
          value={formData.ownerEmail}
          onChange={(e) => handleChange("ownerEmail", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editing ? "Update" : "Add"}
        </button>
      </form>

      <h3 className="text-lg font-bold mt-6">Pet Profile List</h3>
      {pets.map((pet) => (
        <div key={pet._id} className="bg-gray-100 p-4 my-2 rounded shadow">
          {pet.name} ({pet.species}), Age: {pet.age}
          <br />
          Allergy Med: {pet.allergyMed}
          <br />
          Owner: {pet.ownerName} | {pet.ownerPhone} | {pet.ownerEmail}
          <div className="mt-2">
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
      ))}
    </div>
  );
};

export default PetProfiles;
