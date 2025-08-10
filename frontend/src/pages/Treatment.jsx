import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
// relevant to Appointments
import { useParams } from "react-router-dom";
const { appointmentId } = useParams();

const Treatment = () => {
  const { user } = useAuth();
  const [treatments, setTreatments] = useState([]);
  const [editingTreatment, setEditingTreatment] = useState(null);
  // default hidden the medication and vaccination
  const [showMedication, setShowMedication] = useState(false);
  const [showVaccination, setShowVaccination] = useState(false);
  const [formData, setFormData] = useState({
    appointmentId: appointmentId || "",
    petName: "",
    vetName: "",
    nurseName: "",
    diagnosisRecords: [
      {
        weight: "",
        temperature: "",
        symptoms: "",
        mediExam: "",
        diagnosis: "",
      },
    ],
    medication: [
      {
        medicationName: "",
        dose: "",
        frequency: "",
        duration: "",
        instruction: "",
        sideEffect: "",
      },
    ],
    vaccination: [
      {
        vaccineName: "",
        vaccinationDate: "",
        nextVacDate: "",
        observation: "",
        notes: "",
      },
    ],
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

  // normal input
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // sub form input (medication and vaccination)
  const handleArrayChange = (key, index, field, value) => {
    const updated = [...formData[key]];
    updated[index][field] = value;
    setFormData({ ...formData, [key]: updated });
  };
  const addArrayField = (key) => {
    let newItem = {};
    if (key === "diagnosisRecords") {
      newItem = {
        weight: "",
        temperature: "",
        symptoms: "",
        mediExam: "",
        diagnosis: "",
      };
    } else if (key === "medication") {
      newItem = {
        medicationName: "",
        dose: "",
        frequency: "",
        duration: "",
        instruction: "",
        sideEffect: "",
      };
    } else if (key === "vaccination") {
      newItem = {
        vaccineName: "",
        vaccinationDate: "",
        nextVacDate: "",
        observation: "",
        notes: "",
      };
    }
    setFormData({ ...formData, [key]: [...formData[key], newItem] });
  };

  // remove array
  const removeArrayField = (key, index) => {
    const updated = [...formData[key]];
    updated.splice(index, 1);
    setFormData({ ...formData, [key]: updated });
  };

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
        {/* normal columns */}
        {[
          { key: "petName", label: "Pet Name" },
          { key: "vetName", label: "Vet Name" },
          { key: "nurseName", label: "Nurse Name" },
          { key: "diagnosis", label: "Diagnosis" },
        ].map(({ key, label }) => (
          <input
            key={key}
            type="text"
            placeholder={label}
            value={formData[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
        ))}

        {/* diagnosis */}
        <label className="font-bold block mb-2">Diagnosis Records</label>
        {formData.diagnosisRecords.map((diag, idx) => (
          <div
            key={`diag-${idx}`}
            className="mb-4 p-3 border rounded bg-gray-50"
          >
            <input
              type="number"
              step="0.01"
              placeholder="Weight (kg)"
              value={diag.weight}
              onChange={(e) =>
                handleArrayChange(
                  "diagnosisRecords",
                  idx,
                  "weight",
                  e.target.value
                )
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Temperature (°C)"
              value={diag.temperature}
              onChange={(e) =>
                handleArrayChange(
                  "diagnosisRecords",
                  idx,
                  "temperature",
                  e.target.value
                )
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Symptoms"
              value={diag.symptoms}
              onChange={(e) =>
                handleArrayChange(
                  "diagnosisRecords",
                  idx,
                  "symptoms",
                  e.target.value
                )
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Medical Examination"
              value={diag.mediExam}
              onChange={(e) =>
                handleArrayChange(
                  "diagnosisRecords",
                  idx,
                  "mediExam",
                  e.target.value
                )
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Diagnosis"
              value={diag.diagnosis}
              onChange={(e) =>
                handleArrayChange(
                  "diagnosisRecords",
                  idx,
                  "diagnosis",
                  e.target.value
                )
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeArrayField("diagnosisRecords", idx)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("diagnosisRecords")}
          className="bg-gray-300 px-2 py-1 rounded mb-4"
        >
          + Add Diagnosis Record
        </button>

        {/* medication */}

        <label className="font-bold block mb-2">Medication</label>
        {!showMedication ? (
          <button
            type="button"
            onClick={() => setShowMedication(true)}
            className="bg-gray-300 px-2 py-1 rounded mb-4"
          >
            + Add Medication
          </button>
        ) : (
          <>
            {formData.medication.map((med, idx) => (
              <div
                key={`med-${idx}`}
                className="mb-4 p-3 border rounded bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={med.medicationName}
                  onChange={(e) =>
                    handleArrayChange(
                      "medication",
                      idx,
                      "medicationName",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Dose"
                  value={med.dose}
                  onChange={(e) =>
                    handleArrayChange("medication", idx, "dose", e.target.value)
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) =>
                    handleArrayChange(
                      "medication",
                      idx,
                      "frequency",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Duration (days)"
                  value={med.duration}
                  onChange={(e) =>
                    handleArrayChange(
                      "medication",
                      idx,
                      "duration",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Instruction"
                  value={med.instruction}
                  onChange={(e) =>
                    handleArrayChange(
                      "medication",
                      idx,
                      "instruction",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Side Effect"
                  value={med.sideEffect}
                  onChange={(e) =>
                    handleArrayChange(
                      "medication",
                      idx,
                      "sideEffect",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("medication", idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("medication")}
              className="bg-gray-300 px-2 py-1 rounded mb-4"
            >
              + Add Medication
            </button>
          </>
        )}

        {/* vaccination */}
        <label className="font-bold block mb-2">Vaccination</label>
        {!showVaccination ? (
          <button
            type="button"
            onClick={() => setShowVaccination(true)}
            className="bg-gray-300 px-2 py-1 rounded mb-4"
          >
            + Add Vaccination
          </button>
        ) : (
          <>
            {formData.vaccination.map((vac, idx) => (
              <div
                key={`vac-${idx}`}
                className="mb-4 p-3 border rounded bg-gray-50"
              >
                <input
                  type="text"
                  placeholder="Vaccine Name"
                  value={vac.vaccineName}
                  onChange={(e) =>
                    handleArrayChange(
                      "vaccination",
                      idx,
                      "vaccineName",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />

                <label className="font-bold block mb-1">Vaccination Date</label>
                <input
                  type="date"
                  value={vac.vaccinationDate}
                  onChange={(e) =>
                    handleArrayChange(
                      "vaccination",
                      idx,
                      "vaccinationDate",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />

                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={vac.needNextVac || false}
                    onChange={(e) =>
                      handleArrayChange(
                        "vaccination",
                        idx,
                        "needNextVac",
                        e.target.checked
                      )
                    }
                    className="mr-2"
                  />
                  Need Next Vaccination
                </label>

                {vac.needNextVac && (
                  <>
                    <label className="font-bold block mb-1">
                      Next Vaccination Date
                    </label>
                    <input
                      type="date"
                      value={vac.nextVacDate}
                      onChange={(e) =>
                        handleArrayChange(
                          "vaccination",
                          idx,
                          "nextVacDate",
                          e.target.value
                        )
                      }
                      className="w-full mb-2 p-2 border rounded"
                    />
                  </>
                )}

                <input
                  type="text"
                  placeholder="Observation"
                  value={vac.observation}
                  onChange={(e) =>
                    handleArrayChange(
                      "vaccination",
                      idx,
                      "observation",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={vac.notes}
                  onChange={(e) =>
                    handleArrayChange(
                      "vaccination",
                      idx,
                      "notes",
                      e.target.value
                    )
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("vaccination", idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("vaccination")}
              className="bg-gray-300 px-2 py-1 rounded mb-4"
            >
              + Add Vaccination
            </button>
          </>
        )}

        {/* other columns */}
        <label className="font-bold block mb-1">Treatment Date</label>
        <input
          type="date"
          value={formData.treatDate}
          onChange={(e) => handleChange("treatDate", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.followUp}
            onChange={(e) => handleChange("followUp", e.target.checked)}
            className="mr-2"
          />
          Need Follow Up
        </label>

        {formData.followUp && ( // conditional show up
          <>
            <label className="font-bold block mb-1">Follow-up Date</label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => handleChange("followUpDate", e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />
          </>
        )}

        <input
          type="text"
          placeholder="Payment （$AUD）"
          value={formData.payment}
          onChange={(e) => handleChange("payment", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.isPaid}
            onChange={(e) => handleChange("isPaid", e.target.checked)}
            className="mr-2"
          />
          Is Paid
        </label>

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
