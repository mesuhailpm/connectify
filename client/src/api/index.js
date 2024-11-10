import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000", // Default to localhost if env is missing
});
// const token = localStorage.getItem("token");
// API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

API.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem("token");
    if (token){
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error, ' inside api request interceptor')
    return Promise.reject(error)
  }
)

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data.message;
      if (errorMessage === "Token expired") {
        toast.error("Your session has expired. Please log in again.",{autoClose: 2000}); // Display a toast message
        // Token expired, handle the situation here
        // For example, you can log the user out, clear the token, and redirect them
        localStorage.removeItem("token"); // Clear the expired token
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(new Error("Token expired, please log in again."));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
