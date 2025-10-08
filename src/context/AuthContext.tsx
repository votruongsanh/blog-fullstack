import {
  clearTokens,
  getAccessToken,
  getUser,
  isTokenExpired,
  setAccessToken,
  setUserLocalStorage,
} from "@/lib/tokenService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useMemo, type ReactNode } from "react";
import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../interface/userInterface";
import { authService } from "../services/authService";

interface AuthContextType {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest, redirectTo?: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // ---- Load user on app start ----
  const { data: authUser, isFetching } = useQuery<Partial<User> | null>({
    queryKey: ["auth"],
    queryFn: async () => {
      console.log("queryFn auth ______refetch");
      const token = getAccessToken();
      const storedUser = getUser();
      if (!token || !storedUser) return null;
      if (isTokenExpired(token)) {
        clearTokens();
        return null;
      }
      return JSON.parse(storedUser);
    },
    staleTime: Infinity,
    gcTime: 2 * 60 * 1000,
  });

  // ---- Login ----
  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      const res = await authService.login(data);
      setAccessToken(res.accessToken);
      setUserLocalStorage(JSON.stringify(res.user));

      queryClient.setQueryData(["auth"], res.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "none",
      });
    },
    [queryClient]
  );

  // ---- Register ----
  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      const res = await authService.register(data);
      setAccessToken(res.accessToken);
      setUserLocalStorage(JSON.stringify(res.user));

      queryClient.setQueryData(["auth"], res.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "none",
      });
    },
    [queryClient]
  );

  // ---- Logout ----
  const handleLogout = useCallback(() => {
    // 1. Clear storage sync
    clearTokens();
    // 2. Optimistic null immediate
    // 3. Xóa cache
    queryClient.setQueryData(["auth"], null);
    queryClient.invalidateQueries({
      queryKey: ["auth"],
      refetchType: "active",
    });
  }, [queryClient]);

  // ✅ Auto update isAuthenticated in real time
  const currentUser = useMemo(() => authUser ?? null, [authUser]);
  // Debug logs
  console.log("authUser", authUser);
  console.log("currentUser", currentUser);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading: isFetching,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
