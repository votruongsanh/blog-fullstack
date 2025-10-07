export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
  },
  POSTS: {
    LIST: "/api/v1/posts",
    DETAIL: (id: string) => `/api/v1/posts/${id}`,
    CREATE: "/api/v1/posts",
    UPDATE: (id: string) => `/api/v1/posts/${id}`,
    DELETE: (id: string) => `/api/v1/posts/${id}`,
  },
} as const;
