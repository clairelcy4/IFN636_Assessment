import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import vetScheduleRoutes from "./routes/vetScheduleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import treatmentRoutes from "./routes/treatmentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/vet-schedules", vetScheduleRoutes);

if (process.env.NODE_ENV !== "test") {
  connectDB();
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
