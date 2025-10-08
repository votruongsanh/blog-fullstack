export const ROUTE_PAGES = {
  HOME: "/",
  GALLERY: "/gallery",
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
  },
  POSTS: {
    LIST: "/posts",
    CREATE: "/posts/create",
    DETAIL: (id: string | number) => `/posts/${id}`,
    EDIT: (id: string | number) => `/posts/${id}/edit`,
    MY_POSTS: "/my-posts",
  },
} as const;
