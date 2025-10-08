import Loading from "@/components/common/Loading";
import RootLayout from "@/components/common/RootLayout";
import { ROUTE_PAGES } from "@/config/routePage";
import { editPostLoader } from "@/loaders/postLoader";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { createBrowserRouter, type RouteObject } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const routes: RouteObject[] = [
  {
    path: ROUTE_PAGES.HOME,
    element: <RootLayout />,
    hydrateFallbackElement: <Loading />,
    children: [
      {
        index: true,
        path: ROUTE_PAGES.HOME,
        lazy: async () => {
          const mod = await import("@/pages/home/Home");
          return {
            Component: mod.default,
          };
        },
      },
      {
        path: ROUTE_PAGES.GALLERY,
        lazy: async () => {
          const mod = await import("@/pages/gallery/Gallery");
          return {
            Component: mod.default,
          };
        },
      },
      {
        element: <PublicRoute />,
        children: [
          { path: ROUTE_PAGES.AUTH.LOGIN, Component: Login },
          { path: ROUTE_PAGES.AUTH.REGISTER, Component: Register },
        ],
      },
      {
        path: ROUTE_PAGES.POSTS.LIST,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            lazy: async () => {
              const mod = await import("@/pages/posts/list");
              return { Component: mod.default };
            },
          },
          {
            path: ROUTE_PAGES.POSTS.CREATE,
            lazy: async () => {
              const mod = await import("@/pages/posts/create");
              return { Component: mod.default };
            },
          },
          {
            path: ROUTE_PAGES.POSTS.DETAIL(":id"),
            lazy: async () => {
              const mod = await import("@/pages/posts/detail");
              return { Component: mod.default };
            },
          },
          {
            path: ROUTE_PAGES.POSTS.EDIT(":id"),
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
