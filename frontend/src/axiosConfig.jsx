// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5002", // local
//   //baseURL: 'http://54.66.221.225:5001', // live
//   headers: { "Content-Type": "application/json" },
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
