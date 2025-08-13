import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const VetSchedule = () => {
  const { vetId } = useParams();
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    scheduleType: "work",
    startTime: "",
    endTime: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axiosInstance.get(`/api/vet-schedule/${vetId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSchedules(res.data);
      } catch (err) {
        alert("Failed to fetch schedules");
      }
    };
    fetchSchedules();
  }, [vetId, user.token]);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axiosInstance.put(
          `/api/vet-schedule/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setSchedules(
          schedules.map((s) => (s._id === editingId ? res.data : s))
        );
        setEditingId(null);
      } else {
        const res = await axiosInstance.post(
          "/api/vet-schedule",
          {
            vetId,
            ...formData,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setSchedules([...schedules, res.data]);
      }
      setFormData({ scheduleType: "work", startTime: "", endTime: "" });
    } catch (err) {
      alert("Failed to save schedule");
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({
      scheduleType: s.scheduleType,
      startTime: s.startTime.slice(0, 16),
      endTime: s.endTime.slice(0, 16),
    });
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/vet-schedule/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSchedules(schedules.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete schedule");
    }
  };

  // transfer schedule into event
  const calendarEvents = schedules.map((s) => ({
    id: s._id,
    title: s.scheduleType.toUpperCase(),
    start: new Date(s.startTime),
    end: new Date(s.endTime),
    allDay: false,
    resource: s,
  }));

  // scheduleType color
  const eventStyleGetter = (event) => {
    let backgroundColor = "#35c597ff"; // default: work
    if (event.resource.scheduleType === "off") backgroundColor = "#999";
    if (event.resource.scheduleType === "booked") backgroundColor = "#d97b4fff";
    return { style: { backgroundColor, color: "white" } };
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Vet Schedule</h1>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 shadow rounded"
      >
        <select
          value={formData.scheduleType}
          onChange={(e) => handleChange("scheduleType", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="work">Work</option>
          <option value="off">Off</option>
          <option value="booked">Booked</option>
        </select>

        <label>Start Time</label>
        <input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <label>End Time</label>
        <input
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) => handleChange("endTime", e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update Schedule" : "Add Schedule"}
        </button>
      </form>

      {/* calendar layout */}
      <div className="bg-white p-4 shadow rounded" style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default VetSchedule;
