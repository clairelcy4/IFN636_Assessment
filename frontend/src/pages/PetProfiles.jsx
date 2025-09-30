// src/pages/PetProfiles.jsx
import { useAuth } from "../context/AuthContext";
import PetProfilesStaff from "./PetProfilesStaff";
import PetProfilesReadOnly from "./PetProfilesReadOnly";

export default function PetProfiles() {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "staff") return <PetProfilesStaff />;   // original, full access
  return <PetProfilesReadOnly />;                      // vet/nurse → reduced, read-only
}
