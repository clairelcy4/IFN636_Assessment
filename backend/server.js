// server.js
require("dotenv").config({ path: __dirname + "/.env" }); // 1) load env FIRST

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const vetScheduleRoutes = require("./routes/vetScheduleRoutes");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const treatmentRoutes = require("./routes/treatmentRoutes");
const appointmentsRouter = require("./routes/appointments");
const vetRoutes = require("./routes/vetRoutes");

const app = express();

// 2) core middleware
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or listed ones
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// explicitly respond to preflight OPTIONS
app.options("*", cors(corsOptions));

app.use(express.json()); // needed to read JSON bodies

// 3) connect DB before routes (safe)
connectDB();

// 4) routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/vet-schedules", vetScheduleRoutes);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/vets", vetRoutes);

// (optional) serve build in production
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// 5) centralized error handler – turns cryptic 500s into useful responses
app.use((err, req, res, next) => {
  console.error(" Error caught by handler:", err);

  // Duplicate key (e.g., email unique) -> 409 Conflict
  if (err && (err.code === 11000 || err.code === "11000")) {
    return res.status(409).json({ message: "Email already registered" });
  }

  // CORS errors
  if (err.message && err.message.includes("CORS")) {
    return res.status(403).json({ message: "CORS policy error: " + err.message });
  }

  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ message });
});

// 6) start server (skip in tests)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
}

module.exports = app;