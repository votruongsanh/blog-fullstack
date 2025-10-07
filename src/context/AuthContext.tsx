import {
  clearTokens,
  getAccessToken,
  getUser,
  isTokenExpired,
  setAccessToken,
  setUserLocalStorage,
} from "@/lib/tokenService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  const [optimisticUser, setOptimisticUser] = useState<Partial<User> | null>(
    null
  );

  // ---- Load user on app start ----
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

  // ---- Login ----
  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      const res = await authService.login(data);
      setAccessToken(res.accessToken);
      setUserLocalStorage(JSON.stringify(res.user));

      setOptimisticUser(res.user);
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

      setOptimisticUser(res.user);
      queryClient.setQueryData(["auth"], res.user);
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "none",
      });
    },
    [queryClient]
  );

  // ---- Logout ----
  const handleLogout = () => {
    clearTokens();
    setOptimisticUser(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
  };

  // ✅ Auto update isAuthenticated in real time
  const currentUser = useMemo(
    () => optimisticUser ?? authUser ?? null,
    [optimisticUser, authUser]
  );

  console.log("authUser", authUser);
  console.log("optimisticUser", optimisticUser);

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
