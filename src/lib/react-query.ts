import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Global Query Error:", (error as Error).message);
      // e.g. toast.error("Có lỗi xảy ra");
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, mutation) => {
      console.error("Global Mutation Error:", (error as Error).message);
      console.log("Mutation Error:", mutation);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
