import axios from "axios";
import { getAccessToken } from "./tokenService";
import { HttpClient } from "@/api/http-client";
import { Api } from "@/api/api";

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

const httpClient = new HttpClient({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://e3947094ee0e.ngrok-free.app/api",
  secure: true,
});

httpClient.instance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!navigator.onLine) {
    return Promise.reject(new Error("Offline"));
  }
  return config;
});

httpClient.instance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

// Tạo instance Api
export const api = new Api(httpClient);

console.log("httpClient", httpClient);
console.log("api", api);
