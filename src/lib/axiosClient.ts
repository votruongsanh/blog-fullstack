// src/api/axiosClient.ts
import axios from "axios";
import { getAccessToken, clearTokens } from "./tokenService";
import { refreshAccessToken, onTokenRefreshed } from "./refreshTokenHandler";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/* 🧠 Danh sách AbortController để cancel request */
let controllers: AbortController[] = [];

export const cancelAllRequests = () => {
  controllers.forEach((c) => c.abort());
  controllers = [];
};

/* 🧩 Request interceptor */
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Gắn signal cho mỗi request
  const controller = new AbortController();
  config.signal = controller.signal;
  controllers.push(controller);

  return config;
});

/* 🧩 Response interceptor */
axiosClient.interceptors.response.use(
  (response) => {
    // Dọn controller khi request hoàn tất
    controllers = controllers.filter(
      (c) => c.signal !== response.config.signal
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Dọn controller nếu lỗi
    controllers = controllers.filter(
      (c) => c.signal !== originalRequest?.signal
    );

    // Nếu token hết hạn → refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        return new Promise((resolve) => {
          onTokenRefreshed((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          });
        });
      } else {
        clearTokens();
        window.location.href = "/login";
      }
    }

    // Nếu offline → cancel toàn bộ
    if (!navigator.onLine) {
      cancelAllRequests();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
