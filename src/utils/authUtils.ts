// src/utils/authUtils.ts

/**
 * Lấy token từ localStorage hoặc cookie
 */
export function getToken(): string | null {
  // 1. Check localStorage
  const token = localStorage.getItem("access_token");
  if (token) return token;

  // 2. Check cookie
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith("access_token="));
  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }

  return null;
}

/**
 * Kiểm tra đã đăng nhập hay chưa
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Xóa token khi logout
 */
export function clearAuth() {
  localStorage.removeItem("access_token");
  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
