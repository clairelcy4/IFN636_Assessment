// src/pages/PetProfiles.jsx
import { useAuth } from "../context/AuthContext";
import PetProfilesStaff from "./PetProfilesStaff";
import PetProfilesReadOnly from "./PetProfilesReadOnly";

export default function PetProfiles() {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase().trim();

  // quick debug (remove later)
  // console.log("[PetProfiles] role:", user?.role, "→", role);

  if (role === "staff") return <PetProfilesStaff />;
  return <PetProfilesReadOnly />;
}

