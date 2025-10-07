import {
  QueryClient,
  QueryCache,
  MutationCache,
  onlineManager,
} from "@tanstack/react-query";
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";

// ------------------------------
// Query Client setup
// ------------------------------
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Global Query Error:", (error as Error).message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, mutation) => {
      console.error(
        "Global Mutation Error:",
        (error as Error).message,
        mutation
      );
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status?: number } };
        if (
          axiosError?.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          return false; // không retry lỗi client
        }
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      staleTime: 2 * 60 * 1000, // 2 phút
      gcTime: 10 * 60 * 1000, // 10 phút
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: "always",
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status?: number } };
        if (
          axiosError?.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          return false;
        }
        return failureCount < 1;
      },
      networkMode: "online", // mặc định đã là online → không cần set lại
    },
  },
});

// ------------------------------
// Cross-tab sync
// ------------------------------
broadcastQueryClient({
  queryClient,
  broadcastChannel: "blog-app", // Tên channel sync cache giữa tabs
});
