// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5001", // local
//   //baseURL: 'http://54.66.221.225:5001', // live
//   headers: { "Content-Type": "application/json" },
// });

// frontend/src/axiosConfig.jsx
import axios from "axios";

// CRA proxy in package.json points to http://localhost:5001
// So use a relative base here and CRA will forward.
const api = axios.create({
  baseURL: "/api", // <-- important
  headers: { "Content-Type": "application/json" },
});

export default api;
