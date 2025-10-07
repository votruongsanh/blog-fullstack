import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import {
  MutationCache,
  onlineManager,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";

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
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
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
      networkMode: "online",
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

onlineManager.setEventListener((setOnline) => {
  if (typeof window !== "undefined") {
    const onlineListener = () => setOnline(true);
    const offlineListener = () => setOnline(false);

    window.addEventListener("online", onlineListener);
    window.addEventListener("offline", offlineListener);

    return () => {
      window.removeEventListener("online", onlineListener);
      window.removeEventListener("offline", offlineListener);
    };
  }
});

// Tự động refetch khi online lại
onlineManager.subscribe(() => {
  if (onlineManager.isOnline()) {
    queryClient.refetchQueries({ type: "active" });
  }
});
