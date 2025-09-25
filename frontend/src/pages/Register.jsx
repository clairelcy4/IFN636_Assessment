import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "vet", // default role
  });
  const [err, setErr] = useState("");

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setErr("All fields including role are required.");
      return;
    }
    try {
      await register(formData);            // must send { name, email, password, role }
      navigate("/login");                  // or navigate("/pets") if you auto-login on register
    } catch (err) {
      setErr(err?.message || "Registration failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      {err && (
        <div className="mb-3 p-2 rounded bg-red-50 text-red-700 border border-red-200">
          {err}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        {/* NEW: Role selector */}
        <label className="block text-sm text-gray-600 mb-1">Role</label>
        <select
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        >
          <option value="vet">Vet</option>
          <option value="nurse">Nurse</option>
          <option value="staff">Staff</option>
        </select>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

