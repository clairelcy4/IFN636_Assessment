import React, { createContext, useContext, useState, useEffect } from "react";

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
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      saveUserToLocalStorage(data);
      return data;
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    }
  };

  const login = async (userData) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      saveUserToLocalStorage(data);
      return data;
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
