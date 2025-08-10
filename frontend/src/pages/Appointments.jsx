import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    appointedBy: "",
    petName: "",
    vetName: "",
    appointDate: "",
    duration: "",
    status: "",
    reason: "",
  });

  // get appointment info
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/api/appointments", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        alert("Failed to fetch appointments.");
      }
    };

    fetchAppointments();
  }, [user]);

  // form
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // validation
  const validateForm = () => {
    const now = new Date();
    const selectedDate = new Date(formData.appointDate);

    if (selectedDate <= now) {
      alert("Appointment date must be in the future.");
      return false;
    }
    if (parseInt(formData.duration) <= 0) {
      alert("Duration must be greater than 0 minutes.");
      return false;
    }
    return true;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(
          `/api/appointments/${editingAppointment._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setAppointments(
          appointments.map((a) =>
            a._id === editingAppointment._id ? response.data : a
          )
        );
        setEditingAppointment(null);
      } else {
        const response = await axiosInstance.post(
          "/api/appointments",
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setAppointments([...appointments, response.data]);
      }

      // reset
      setFormData({
        appointedBy: "",
        petName: "",
        vetName: "",
        appointDate: "",
        duration: "",
        status: "",
        reason: "",
      });
      setShowForm(false);
    } catch (error) {
      alert("Failed to save appointment.");
    }
  };

  // edit
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      appointedBy: appointment.appointedBy,
      petName: appointment.petName,
      vetName: appointment.vetName,
      appointDate: appointment.appointDate,
      duration: appointment.duration,
      status: appointment.status,
      reason: appointment.reason,
    });
    setShowForm(true);
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (error) {
      alert("Failed to delete appointment.");
    }
  };

  // transfer data to calendar format
  const calendarEvents = appointments.map((a) => ({
    id: a._id,
    title: `${a.petName} - ${a.vetName}`,
    start: new Date(a.appointDate),
    end: new Date(new Date(a.appointDate).getTime() + a.duration * 60000),
    allDay: false,
  }));

  return (
    <div className="container mx-auto p-6">
      {/* form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        {showForm ? "Hide Appointment Form" : "Add Appointment"}
      </button>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 shadow rounded mb-6"
        >
          <h2 className="text-xl font-bold mb-4">
            {editingAppointment ? "Edit Appointment" : "Add Appointment"}
          </h2>

          {[
            { key: "petName", label: "Pet Name" },
            { key: "vetName", label: "Vet Name" },
            { key: "status", label: "Status" },
            { key: "reason", label: "Reason" },
            { key: "appointedBy", label: "Appointed By (Admin Staff)" },
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

          <label className="font-bold block mb-1">
            Appointment Date & Time
          </label>
          <input
            type="datetime-local"
            value={formData.appointDate}
            onChange={(e) => handleChange("appointDate", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingAppointment ? "Update" : "Add"}
          </button>
        </form>
      )}

      {/* calendar layout*/}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-bold mb-4">Appointments Calendar</h2>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default Appointments;
