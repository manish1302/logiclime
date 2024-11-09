import axios from "axios";

// Create an Axios instance with default settings
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL.trim(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token automatically
apiInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("logiclimetoken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiInstance;
