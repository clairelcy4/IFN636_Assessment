// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5001", // local
//   //baseURL: 'http://54.66.221.225:5001', // live
//   headers: { "Content-Type": "application/json" },
// });

// export default axiosInstance;

// src/api/axios.js
import axios from "axios";

// Build base URL safely
const base = (process.env.REACT_APP_API_URL || "").replace(/\/+$/,""); // trim trailing /
const api = axios.create({
  baseURL: `${base}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach JWT from localStorage (expects { token } in "user")
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const { token } = JSON.parse(raw) || {};
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch { /* ignore */ }
  return config;
});

// Basic 401 handler (optional)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // e.g. token expired → clear and redirect (optional)
      // localStorage.removeItem("user");
      // window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;

