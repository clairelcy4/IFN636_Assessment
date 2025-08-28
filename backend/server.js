const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const vetScheduleRoutes = require("./routes/vetScheduleRoutes");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const appointmentsRouter = require("./routes/appointments");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/vet-schedules", vetScheduleRoutes);
app.use("/api/appointments", appointmentsRouter);
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

if (process.env.NODE_ENV !== "test") {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
