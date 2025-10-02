// src/pages/PetProfilesReadOnly.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PetProfilesReadOnly = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
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

  if (!user?.token) return <p>Please log in.</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Pet Profiles (Read-only)</h2>

      {/* No create/edit form here */}

      <h3 className="text-lg font-bold mt-2">Pet List</h3>

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
                  {/* Intentionally hide PII/admin fields */}
                  {/* Owner Name/Phone/Email NOT shown */}
                  {/* No edit/delete buttons */}

                  {/* association */}
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/appointments/pet/${pet.name}`)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Appointments
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

      <p className="text-sm text-gray-500 mt-4">Read-only • Vet/Nurse</p>
    </div>
  );
};

export default PetProfilesReadOnly;
