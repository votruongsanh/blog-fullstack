import ProtectedRoute from "@/components/ProtectedRoute";
import RootLayout from "@/components/RootLayout";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter, Navigate, type RouteObject } from "react-router";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "home",
        lazy: async () => {
          const mod = await import("@/pages/home/Home");
          return {
            Component: () => (
              <ProtectedRoute>
                <mod.default />
              </ProtectedRoute>
            ),
          };
        },
      },
      {
        path: "posts",
        children: [
          {
            index: true,
            lazy: async () => {
              const mod = await import("@/pages/posts/list");
              return { Component: mod.default };
            },
          },
          {
            path: "create",
            lazy: async () => {
              const mod = await import("@/pages/posts/create");
              return { Component: mod.default };
            },
          },
          {
            path: ":id/edit",
            lazy: async () => {
              const mod = await import("@/pages/posts/edit");
              return { Component: mod.default };
            },
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
