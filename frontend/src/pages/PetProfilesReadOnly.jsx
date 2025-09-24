// src/pages/PetProfilesReadOnly.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const PetProfilesReadOnly = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);

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

  if (!user?.token) return <p>Please log in.</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Pet Profiles (Read-only)</h2>

      {/* No create/edit form here */}

      <h3 className="text-lg font-bold mt-2">Pet List</h3>
      {Array.isArray(pets) && pets.length > 0 ? (
        pets.map((pet) => (
          <div key={pet._id} className="bg-gray-100 p-4 my-2 rounded shadow">
            <div className="font-semibold">{pet.name}</div>
            <div>Species: {pet.species || "—"}</div>
            <div>Age: {pet.age ?? "—"}</div>
            <div>Allergy Med: {pet.allergyMed || pet.allergies || "—"}</div>

            {/* Intentionally hide PII/admin fields */}
            {/* Owner Name/Phone/Email NOT shown */}
            {/* No edit/delete buttons */}
          </div>
        ))
      ) : (
        <p>{pets.length === 0 ? "No pet profiles found." : "Loading pet profiles..."}</p>
      )}

      <p className="text-sm text-gray-500 mt-4">Read-only • Vet/Nurse</p>
    </div>
  );
};

export default PetProfilesReadOnly;
