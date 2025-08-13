const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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

if (process.env.NODE_ENV !== "test") {
  connectDB();
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
