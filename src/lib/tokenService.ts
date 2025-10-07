export const TOKEN_KEY = "auth_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user_data";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getUser = () => localStorage.getItem(USER_KEY);

export const setAccessToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);
export const setRefreshToken = (token: string) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
export const setUserLocalStorage = (user: string) =>
  localStorage.setItem(USER_KEY, user);

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => !!getAccessToken();

// Helper function to check if JWT token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    return true; // If we can't parse the token, consider it expired
  }
};
