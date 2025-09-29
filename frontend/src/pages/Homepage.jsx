import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// calendar
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    appointedBy: "",
    petName: "",
    vetName: "",
    appointDate: "",
    duration: "",
    status: "",
    reason: "",
  });

  // 假資料 🔹
  const upcomingAppointments = [
    { time: "11:00", pet: "Harry", vet: "Ray" },
    { time: "11:30", pet: "Sasa", vet: "Elsa" },
    { time: "13:30", pet: "Katty", vet: "Bella" },
    { time: "14:30", pet: "Yuzu", vet: "Inori" },
    { time: "16:30", pet: "Hao", vet: "Gina" },
  ];

  const pendingBilling = [
    { amount: "$100", pet: "Luffy", vet: "Sang" },
    { amount: "$55", pet: "Amie", vet: "Emma" },
    { amount: "$235", pet: "CC", vet: "Klara" },
    { amount: "$99", pet: "Bekkie", vet: "Berry" },
    { amount: "$69", pet: "Debbie", vet: "Kevin" },
  ];

  // get appointment info
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/appointments", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchAppointments();
  }, [user]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingAppointment) {
        const response = await axiosInstance.put(
          `/appointments/${editingAppointment._id}`,
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
        const response = await axiosInstance.post("/appointments", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments([...appointments, response.data]);
      }

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

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAppointments(appointments.filter((a) => a._id !== id));
    } catch (error) {
      alert("Failed to delete appointment.");
    }
  };

  // transfer data to calendar format
  const calendarEvents = Array.isArray(appointments)
    ? appointments
        .filter((a) => a.status !== "Cancelled")
        .map((a) => ({
          id: a._id,
          title: `${a.petName} - ${a.vetName}`,
          start: new Date(a.appointDate),
          end: new Date(new Date(a.appointDate).getTime() + a.duration * 60000),
          allDay: false,
          status: a.status,
        }))
    : [];

  return (
    <div className="container mx-auto p-6 grid grid-cols-3 gap-6">
      {/* 左側資訊欄 🔹 */}
      <div className="col-span-1 space-y-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-3">Upcoming Appointment</h2>
          <ul className="space-y-2">
            {upcomingAppointments.map((item, idx) => (
              <li key={idx} className="text-sm">
                {item.time} {item.pet} / {item.vet}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-3">Pending Billing</h2>
          <ul className="space-y-2">
            {pendingBilling.map((bill, idx) => (
              <li key={idx} className="text-sm">
                {bill.amount} {bill.pet} / {bill.vet}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 右側主體內容 🔹 */}
      <div className="col-span-2">
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <>
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

                <input
                  type="text"
                  placeholder="Pet Name"
                  value={formData.petName}
                  onChange={(e) => handleChange("petName", e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                />

                <input
                  type="text"
                  placeholder="Vet Name"
                  value={formData.vetName}
                  onChange={(e) => handleChange("vetName", e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                />

                <input
                  type="text"
                  placeholder="Reason"
                  value={formData.reason}
                  onChange={(e) => handleChange("reason", e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                />

                <label className="font-bold block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full mb-4 p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

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

                <input
                  type="text"
                  placeholder="Appointed By (Admin Staff)"
                  value={formData.appointedBy}
                  onChange={(e) => handleChange("appointedBy", e.target.value)}
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

            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-xl font-bold mb-4">Appointments Calendar</h2>
              {calendarEvents.length > 0 ? (
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                  onSelectEvent={(event) => {
                    const appointment = appointments.find(
                      (a) => a._id === event.id
                    );
                    if (appointment) handleEdit(appointment);
                  }}
                />
              ) : (
                <p>No appointments to display on the calendar.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Appointments;