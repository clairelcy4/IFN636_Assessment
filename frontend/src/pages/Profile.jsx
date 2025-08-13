import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeID: "",
    name: "",
    phoneNumber: "",
    email: "",
    specialty: "",
    licenseNum: "",
  });

  // role including "Vet", "Nurse", "AdminStaff"
  const role = user?.role || "";

  // personal info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile(res.data);
        setFormData({
          employeeID: res.data.employeeID || "",
          name: res.data.name || "",
          phoneNumber: res.data.phoneNumber || "",
          email: res.data.email || "",
          specialty: res.data.specialty || "",
          licenseNum: res.data.licenseNum || "",
        });
      } catch (err) {
        alert("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateForm = () => {
    if (!formData.employeeID) {
      alert("Employee ID is required");
      return false;
    }
    if (!formData.name) {
      alert("Name is required");
      return false;
    }
    if (!formData.phoneNumber) {
      alert("Phone Number is required");
      return false;
    }
    if (!formData.email) {
      alert("Email is required");
      return false;
    }

    // different required fields
    if (role === "VET" && !formData.specialty) {
      alert("Specialty is required for VET");
      return false;
    }
    if ((role === "VET" || role === "NURSE") && !formData.licenseNum) {
      alert("License Number is required for VET or NURSE");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axiosInstance.put("/api/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProfile(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
        <input
          type="number"
          placeholder="Employee ID"
          value={formData.employeeID}
          onChange={(e) => handleChange("employeeID", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* only a vet need specialty */}
        {role === "VET" && (
          <input
            type="text"
            placeholder="Specialty"
            value={formData.specialty}
            onChange={(e) => handleChange("specialty", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
        )}

        {/* only a vet or a nurse has license number */}
        {(role === "VET" || role === "NURSE") && (
          <input
            type="text"
            placeholder="License Number"
            value={formData.licenseNum}
            onChange={(e) => handleChange("licenseNum", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Profile
        </button>
      </form>
      {/* vet schedule */}
      {role === "VET" && (
        <button
          type="button"
          onClick={() => navigate(`/vet-schedule/${user._id}`)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Schedule
        </button>
      )}
    </div>
  );
};

export default Profile;
