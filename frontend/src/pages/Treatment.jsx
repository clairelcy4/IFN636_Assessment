import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const Treatment = () => {
  const { user } = useAuth();
  const [treatments, setTreatments] = useState([]);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [formData, setFormData] = useState({
    petName: "",
    vetName: "",
    nurseName: "",
    diagnosis: "",
    medication: "",
    vaccination: "",
    treatDate: "",
    followUp: false,
    followUpDate: "",
    payment: "",
    isPaid: false,
  });

  // get treatment info
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axiosInstance.get("/api/treatments", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTreatments(response.data);
      } catch (error) {
        alert("Failed to fetch treatments.");
      }
    };

    fetchTreatments();
  }, [user]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTreatment) {
        const response = await axiosInstance.put(
          `/api/treatments/${editingTreatment._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setTreatments(
          treatments.map((t) =>
            t._id === editingTreatment._id ? response.data : t
          )
        );
        setEditingTreatment(null);
      } else {
        const response = await axiosInstance.post("/api/treatments", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTreatments([...treatments, response.data]);
      }
      setFormData({
        petName: "",
        vetName: "",
        nurseName: "",
        diagnosis: "",
        medication: "",
        vaccination: "",
        treatDate: "",
        followUp: false,
        followUpDate: "",
        payment: "",
        isPaid: false,
      });
    } catch (error) {
      alert("Failed to save treatment record.");
    }
  };

  // edit
  const handleEdit = (t) => {
    setEditingTreatment(t);
    setFormData({
      petName: t.petName,
      vetName: t.vetName,
      nurseName: t.nurseName,
      diagnosis: t.diagnosis,
      medication: t.medication,
      vaccination: t.vaccination,
      treatDate: t.treatDate,
      followUp: t.followUp,
      followUpDate: t.followUpDate,
      payment: t.payment,
      isPaid: t.isPaid,
    });
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/treatments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTreatments(treatments.filter((t) => t._id !== id));
    } catch (error) {
      alert("Failed to delete treatment record.");
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
          {editingTreatment ? "Edit Treatment" : "Add Treatment"}
        </h2>
        {Object.keys(formData).map((key) =>
          typeof formData[key] === "boolean" ? (
            <label key={key} className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.checked })
                }
                className="mr-2"
              />
              {key} {/* hint */}
            </label>
          ) : (
            <input
              key={key}
              type={
                key === "treatDate" || key === "followUpDate" ? "date" : "text"
              }
              placeholder={key}
              value={formData[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />
          )
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingTreatment ? "Update" : "Add"}
        </button>
      </form>

      {/* list */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Treatment Records</h2>
        {treatments.length === 0 ? (
          <p>No treatment records available.</p>
        ) : (
          treatments.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <strong>{t.petName}</strong> - Vet: {t.vetName}
                <br />
                Appointed By: {t.appointedBy}
                <br />
                Date: {t.appointDate} | Duration: {t.duration} mins
                <br />
                Status: {t.status} | Reason: {t.reason}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
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

export default Treatment;
