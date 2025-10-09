import React from "react";
import { matchPath, useLocation } from "react-router-dom";

export type Route = {
  label: string;
  icon?: React.ReactNode;
  route: string;
  routePattern: string[];
  children?: Route[];
};

export const useMatchRoute = (routes: Route[]): Route | null => {
  const { pathname } = useLocation();

  const findMatch = (routesToSearch: Route[]): Route | null => {
    let bestMatch: { route: Route; length: number } | null = null;

    for (const route of routesToSearch) {
      // Kiểm tra patterns của route hiện tại
      for (const pattern of route.routePattern) {
        const match = matchPath(
          { path: pattern, end: !pattern.endsWith("/*") },
          pathname
        );

        if (match) {
          const len = pattern.length;
          if (!bestMatch || len > bestMatch.length) {
            bestMatch = { route, length: len };
          }
        }
      }

      // Kiểm tra children nếu có
      if (Array.isArray(route.children) && route.children.length > 0) {
        const childMatch = findMatch(route.children);
        if (childMatch) return childMatch;
      }
    }

    return bestMatch?.route || null;
  };

  return React.useMemo(() => findMatch(routes), [routes, pathname]);
};
