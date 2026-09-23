import axios from "axios";

const apiClient = axios.create({
  // Use relative path so Vite proxy catches it and browsers treat it as exact same origin
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Allows sending and receiving HTTP-Only cookies
});

// --- RESPONSE INTERCEPTOR ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Don't try to refresh if the refresh endpoint itself failed
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
        
        // Prevent infinite redirect loop!
        // If the original request was /auth/me, it means we are just checking auth on page load.
        // If it fails, we let AuthContext handle it (set user to null), rather than forcing a hard browser reload.
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