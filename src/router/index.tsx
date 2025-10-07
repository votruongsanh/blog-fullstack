import Loading from "@/components/common/Loading";
import RootLayout from "@/components/common/RootLayout";
import { editPostLoader } from "@/loaders/postLoader";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter, Navigate, type RouteObject } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    hydrateFallbackElement: <Loading />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        lazy: async () => {
          const mod = await import("@/pages/home/Home");
          return {
            Component: mod.default,
          };
        },
      },
      {
        element: <PublicRoute />,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        // loader: protectedLoader,
        element: <ProtectedRoute />,
        children: [
          {
            path: "posts",
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
            path: "posts/:id",
            lazy: async () => {
              const mod = await import("@/pages/posts/detail");
              return { Component: mod.default };
            },
          },
          {
            path: "posts/:id/edit",
            lazy: async () => {
              const mod = await import("@/pages/posts/edit");
              return {
                Component: mod.default,
                loader: editPostLoader,
              };
            },
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
