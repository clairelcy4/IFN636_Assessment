const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
import vetScheduleRoutes from "./routes/vetScheduleRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/pets", require("./routes/petRoutes"));
app.use("/api/treatments", require("./routes/treatmentRoutes"));
app.use("/api/vet-schedules", vetScheduleRoutes);

// Export the app object for testing
if (require.main === module) {
  connectDB();
  // If the file is run directly, start the server
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
