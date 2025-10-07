import axios from "axios";
import {
  clearTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./tokenService";

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

export const onTokenRefreshed = (cb: (token: string) => void) => {
  subscribers.push(cb);
};

const notifySubscribers = (token: string) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) return new Promise((resolve) => onTokenRefreshed(resolve));

  isRefreshing = true;
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("Missing refresh token");

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
      { refreshToken }
    );

    const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    notifySubscribers(newAccess);
    return newAccess;
  } catch (err) {
    clearTokens();
    return null;
  } finally {
    isRefreshing = false;
  }
};
