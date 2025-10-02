// src/pages/PetProfilesStaff.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PetProfilesStaff = () => {
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
  const navigate = useNavigate();

  const fetchPets = async () => {
    try {
      const res = await axiosInstance.get("/pets", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch pet profiles", err);
      alert("Failed to fetch pet profiles");
      setPets([]);
    }
  };

  useEffect(() => {
    if (user?.token) fetchPets();
  }, [user?.token]);

  const handleChange = (key, value) =>
    setFormData({ ...formData, [key]: value });

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing && currentPetId) {
        await axiosInstance.put(`/pets/${currentPetId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Pet profile updated successfully");
      } else {
        await axiosInstance.post("/pets", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert("Pet profile added successfully");
      }
      resetForm();
      fetchPets();
    } catch (err) {
      console.error(err);
      alert("Failed to save pet profile");
    }
  };

  const handleEdit = (pet) => {
    setFormData({
      name: pet.name || "",
      species: pet.species || "",
      age: pet.age || "",
      allergyMed: pet.allergyMed || pet.allergies || "",
      ownerName: pet.ownerName || "",
      ownerPhone: pet.ownerPhone || "",
      ownerEmail: pet.ownerEmail || "",
    });
    setCurrentPetId(pet._id);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await axiosInstance.delete(`/pets/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Pet profile deleted successfully");
      fetchPets();
    } catch (err) {
      console.error(err);
      alert("Failed to delete pet profile");
    }
  };

  if (!user?.token) return <p>Please log in.</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Edit Pet Profile" : "Add Pet Profile"}
      </h2>

      {/* Create / Edit form (STAFF only) */}
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

        {/* Owner/admin fields (staff only) */}
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

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-lg font-bold mt-6">Pet Profile List</h3>
      {/* updated table layout */}
      {Array.isArray(pets) && pets.length > 0 ? (
        <table className="min-w-full border border-gray-200 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">Pet Name</th>
              <th className="px-4 py-2 border-b">Species</th>
              <th className="px-4 py-2 border-b">Age</th>
              <th className="px-4 py-2 border-b">Allergy Med</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b font-semibold">{pet.name}</td>
                <td className="px-4 py-2 border-b">{pet.species || "—"}</td>
                <td className="px-4 py-2 border-b">{pet.age ?? "—"}</td>
                <td className="px-4 py-2 border-b">
                  {pet.allergyMed || pet.allergies || "—"}
                </td>
                <td className="px-4 py-2 border-b">
                  <div className="flex justify-center gap-2">
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
                    <button
                      onClick={() => navigate(`/appointments/pet/${pet.name}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Appointments{" "}
                    </button>
                    <button
                      onClick={() => navigate(`/treatments/pet/${pet.name}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Treatment Records
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          {pets.length === 0
            ? "No pet profiles found."
            : "Loading pet profiles..."}
        </p>
      )}
    </div>
  );
};

export default PetProfilesStaff;
