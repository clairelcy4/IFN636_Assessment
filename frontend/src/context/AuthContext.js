import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const saveUserToLocalStorage = (data) => {
    if (!data.token) {
      console.error("No token received from backend:", data);
      throw new Error("Token missing in response");
    }
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    console.log("User saved to localStorage:", data);
  };

  const register = async (userData) => {
    try {
      const res = await axiosInstance.post("/auth/register", userData);
      console.log("AuthContext register response:", res.data); // debug why failed
      saveUserToLocalStorage(res.data);
      return res.data;
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  const login = async (userData) => {
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      console.log("AuthContext login response:", res.data); // debug why failed
      saveUserToLocalStorage(res.data);
      return res.data;
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    console.log("🚪 User logged out");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
