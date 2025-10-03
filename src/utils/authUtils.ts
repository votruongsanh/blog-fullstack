import { TOKEN_KEY } from "@/config/api";

/**
 * Lấy token từ localStorage hoặc cookie
 */
export function getToken(): string | null {
  // 1. Check localStorage
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  // 2. Check cookie
  const cookies = document.cookie.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith(TOKEN_KEY));
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
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
