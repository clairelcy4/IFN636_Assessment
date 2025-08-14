import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import PetProfiles from "./pages/PetProfiles";
import Treatment from "./pages/Treatment";
import VetSchedule from "./pages/VetSchedule";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pet" element={<PetProfiles />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/treatment" element={<Treatment />} />
        <Route path="/treatment/:treatmentId" element={<Treatment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vet/:vetId/schedule" element={<VetSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
