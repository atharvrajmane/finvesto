// src/api/apiClient.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

/* =======================
   REQUEST INTERCEPTOR
======================= */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ correct key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 AUTO LOGOUT LOGIC
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
