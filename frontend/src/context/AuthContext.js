// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore parse errors */ }
  }, []);

  const saveUserToLocalStorage = (data) => {
    if (!data?.token) {
      console.error("No token received from backend:", data);
      throw new Error("Token missing in response");
    }
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // -------- Register: DO NOT auto-login here --------
  const register = async (userData) => {
    try {
      // Ensure role is present (backend requires it)
      if (!userData?.role) {
        throw new Error("Role is required (vet, nurse, or staff).");
      }
      const res = await axiosInstance.post("/auth/register", userData);
      // Do NOT call saveUserToLocalStorage(res.data) here
      return res.data; // caller can redirect to /login
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 409
          ? "Email already in use"
          : "Registration failed");
      console.error("Registration error:", err);
      throw new Error(msg);
    }
  };

  // -------- Login: this one DOES auto-login --------
  const login = async (userData) => {
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      saveUserToLocalStorage(res.data);
      return res.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Login failed. Check your credentials.";
      console.error("Login error:", err);
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

