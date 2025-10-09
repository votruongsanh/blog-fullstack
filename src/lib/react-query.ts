import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  onlineManager,
  focusManager,
} from "@tanstack/react-query";

// ------------------------------
// Query Client setup
// ------------------------------
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("[Query Error]:", (error as Error).message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error("[Mutation Error]:", (error as Error).message, mutation);
    },
  }),
  defaultOptions: {
    queries: {
      // ❗ Không refetch nếu data còn "fresh"
      refetchOnMount: false,
      refetchOnReconnect: "always",
      // ✅ Performance tuning
      staleTime: 2 * 60 * 1000, // 2 phút: Fresh nhanh, sync thường
      gcTime: 5 * 60 * 1000, // 5 phút: Cleanup tiết kiệm RAM
      refetchOnWindowFocus: true, // Sync khi focus tab

      // ✅ Behavior tuning
      networkMode: "online",

      // ✅ Retry có điều kiện, tránh spam
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status?: number } };
        const status = axiosError?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    },
    mutations: {
      // ❗ Retry = 0 để tránh double action (POST/DELETE)
      retry: false,
      networkMode: "online",
      onError: (error) => {
        console.error("[Global Mutation Error]:", (error as Error).message);
      },
    },
  },
});

// ------------------------------
// Cross-tab sync
// ------------------------------
broadcastQueryClient({
  queryClient,
  broadcastChannel: "blog-app",
});

// ------------------------------
// Optional: Network + Focus Manager (nâng cao)
// ------------------------------

// Sync online/offline chính xác hơn trong browser
window.addEventListener("online", () => onlineManager.setOnline(true));
window.addEventListener("offline", () => onlineManager.setOnline(false));

// Sync trạng thái focus giữa các tab
document.addEventListener("visibilitychange", () => {
  focusManager.setFocused(!document.hidden);
});
