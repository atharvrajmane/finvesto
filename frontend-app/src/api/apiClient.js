import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        console.warn("Access token expired. Attempting silent refresh...");
        await apiClient.post('/auth/refresh');
        console.log("Silent refresh successful! Retrying original request...");
        return apiClient(originalRequest);

              } catch (refreshError) {
        console.error("Session completely expired. Logging out...", refreshError);

        if (!originalRequest.url.includes('/auth/me') && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = "/login";
        }

                return Promise.reject(refreshError);
      }
    }

        return Promise.reject(error);
  }
);

export default apiClient;