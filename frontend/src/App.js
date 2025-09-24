import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import PetProfiles from "./pages/PetProfiles"; // ← switcher (staff vs read-only)
import Treatment from "./pages/Treatment";
import VetSchedule from "./pages/VetSchedule";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Default landing */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pets (now plural) */}
        <Route path="/pets" element={<PetProfiles />} />

        {/* Other features */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/treatment" element={<Treatment />} />
        <Route path="/treatment/:treatmentId" element={<Treatment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vet/:vetId/schedule" element={<VetSchedule />} />

        {/* Optional: 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

