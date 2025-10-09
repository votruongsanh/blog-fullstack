import axios from "axios";
import { getAccessToken } from "./tokenService";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!navigator.onLine) {
    return Promise.reject(new Error("Offline"));
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export default axiosClient;
