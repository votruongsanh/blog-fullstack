import {
  clearTokens,
  getAccessToken,
  getUser,
  isTokenExpired,
  setAccessToken,
  setUserLocalStorage,
} from "@/lib/tokenService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, type ReactNode } from "react";
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
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // ---- Core: load user on app start ----
  const { data: authUser, isFetching } = useQuery<Partial<User> | null>({
    queryKey: ["auth"],
    queryFn: async () => {
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
    gcTime: Infinity,
  });

  // ---- Auth actions ----
  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      const res = await authService.login(data);
      setAccessToken(res.accessToken);
      setUserLocalStorage(JSON.stringify(res.user));

      queryClient.setQueryData(["auth"], res.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "none",
      }); // broadcast sync
    },
    [queryClient]
  );

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

  const handleLogout = useCallback(() => {
    clearTokens();
    queryClient.setQueryData(["auth"], null);
    queryClient.invalidateQueries({ queryKey: ["auth"], refetchType: "none" });
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: authUser ?? null,
        isAuthenticated: !!authUser,
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
