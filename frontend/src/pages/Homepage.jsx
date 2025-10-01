import { useState, useEffect, useMemo } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// calendar
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

function parseAmount(val) {
  if (val === null || val === undefined) return 0;
  const n = Number(String(val).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const Appointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [treatments, setTreatments] = useState([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(true);
  const [treatmentsError, setTreatmentsError] = useState("");

  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showPending, setShowPending] = useState(false);

  const [formData, setFormData] = useState({
    appointedBy: "",
    petName: "",
    vetName: "",
    appointDate: "",
    duration: "",
    status: "",
    reason: "",
  });

  // ---- Fetch Appointments ----
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/appointments", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchAppointments();
  }, [user]);

  // ---- Fetch Treatments ----
  const fetchTreatments = async () => {
    if (!user?.token) return;
    setTreatmentsError("");
    setTreatmentsLoading(true);
    try {
      const res = await axiosInstance.get("/treatments", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setTreatments(
        data.map((t) => ({
          ...t,
          isPaid: Boolean(t.isPaid),
          payment: t.payment ?? "",
        }))
      );
    } catch (e) {
      console.error("Failed to fetch treatments:", e);
      setTreatments([]);
      setTreatmentsError("Failed to fetch pending bills.");
    } finally {
      setTreatmentsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchTreatments();
  }, [user?.token]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateForm = () => {
    const now = new Date();
    const selectedDate = new Date(formData.appointDate);
    if (isNaN(selectedDate.getTime())) {
      alert("Please select a valid appointment date and time.");
      return false;
    }
    if (selectedDate <= now) {
      alert("Appointment date must be in the future.");
      return false;
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
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
        const res = await axiosInstance.put(
          `/appointments/${editingAppointment._id}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setAppointments((prev) =>
          prev.map((a) => (a._id === editingAppointment._id ? res.data : a))
        );
        setEditingAppointment(null);
      } else {
        const res = await axiosInstance.post("/appointments", formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAppointments((prev) => [...prev, res.data]);
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
      console.error(error);
      alert("Failed to save appointment.");
    }
  };

  const handleEdit = (a) => {
    setEditingAppointment(a);
    setFormData({
      appointedBy: a.appointedBy || "",
      petName: a.petName || "",
      vetName: a.vetName || "",
      appointDate: a.appointDate || "",
      duration: a.duration || "",
      status: a.status || "",
      reason: a.reason || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete appointment.");
    }
  };

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => a.status !== "Cancelled" && new Date(a.appointDate) >= now)
      .sort((a, b) => new Date(a.appointDate) - new Date(b.appointDate))
      .slice(0, 5)
      .map((a) => ({
        id: a._id,
        time: moment(a.appointDate).format("HH:mm"),
        pet: a.petName,
        vet: a.vetName,
      }));
  }, [appointments]);

  const pendingBills = useMemo(() => {
    return treatments
      .filter((t) => !t.isPaid && parseAmount(t.payment) > 0)
      .map((t) => ({
        id: t._id,
        pet: t.petName || "-",
        vet: t.vetName || "-",
        date: t.treatDate ? new Date(t.treatDate) : null,
        amount: parseAmount(t.payment),
      }))
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
  }, [treatments]);

  const totalDue = useMemo(
    () => pendingBills.reduce((sum, b) => sum + b.amount, 0),
    [pendingBills]
  );

  const calendarEvents = appointments
    .filter((a) => a.status !== "Cancelled")
    .map((a) => ({
      id: a._id,
      title: `${a.petName} - ${a.vetName}`,
      start: new Date(a.appointDate),
      end: new Date(new Date(a.appointDate).getTime() + a.duration * 60000),
    }));

  return (
    <div className="container mx-auto p-6 grid grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="col-span-1 space-y-6">
        {/* Upcoming Card */}
        <div className="bg-white p-4 shadow rounded">
          <div className="flex items-center mb-3">
            <h2 className="font-bold">Upcoming Appointment</h2>
            <div className="flex-1" />
            <label className="flex items-center gap-2 text-sm ml-2">
              <input
                type="checkbox"
                checked={showUpcoming}
                onChange={(e) => setShowUpcoming(e.target.checked)}
              />
              <span>Show</span>
            </label>
          </div>
          {!showUpcoming ? (
            <div className="text-sm text-gray-400 italic">
              Preview — check "Show" to display items.
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <ul className="space-y-2">
              {upcomingAppointments.map((item) => (
                <li key={item.id} className="text-sm">
                  {item.time} {item.pet} / {item.vet}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No upcoming appointments</div>
          )}
        </div>

        {/* Pending Billing Card */}
        <div className="bg-white p-4 shadow rounded">
          <div className="flex items-center mb-3">
            <h2 className="font-bold">Pending Billing</h2>
            {showPending && (
              <div className="text-right ml-4">
                <div className="text-xs text-gray-500">Total Due</div>
                <div className="text-sm font-semibold">
                  {currency.format(totalDue)}
                </div>
              </div>
            )}
            <div className="flex-1" />
            <label className="flex items-center gap-2 text-sm ml-2">
              <input
                type="checkbox"
                checked={showPending}
                onChange={(e) => setShowPending(e.target.checked)}
              />
              <span>Show</span>
            </label>
          </div>
          {!showPending ? (
            <div className="text-sm text-gray-400 italic">
              Preview — check "Show" to display items.
            </div>
          ) : treatmentsLoading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : treatmentsError ? (
            <div className="text-sm text-red-600">{treatmentsError}</div>
          ) : pendingBills.length > 0 ? (
            <ul className="space-y-2">
              {pendingBills.map((bill) => (
                <li key={bill.id} className="text-sm flex justify-between">
                  <span>
                    {bill.pet} / {bill.vet}
                    {bill.date && ` · ${bill.date.toLocaleDateString("en-AU")}`}
                  </span>
                  <strong>{currency.format(bill.amount)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No pending bills</div>
          )}
        </div>
      </div>

      {/* Right Column */}
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

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {editingAppointment ? "Update" : "Add"}
                  </button>
                  {editingAppointment && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAppointment(null);
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
                      }}
                      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
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
