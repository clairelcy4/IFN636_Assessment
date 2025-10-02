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
import Homepage from "./pages/Homepage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* before login */}
        <Route path="/" element={<Login />} />
        {/* after login? */}
        <Route path="/homepage" element={<Homepage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/pets" element={<PetProfiles />} />

        <Route path="/appointments" element={<Appointments />} />
        {/* association  for appointment*/}
        <Route path="/appointments/pet/:petName" element={<Appointments />} />

        <Route path="/treatment" element={<Treatment />} />
        <Route path="/treatment/:treatmentId" element={<Treatment />} />
        {/* association  for treatment*/}
        <Route path="/treatments/pet/:petName" element={<Treatment />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/vet/:vetId/schedule" element={<VetSchedule />} />

        <Route
          path="*"
          element={<div style={{ padding: 24 }}>Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
