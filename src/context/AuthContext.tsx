import {
  clearTokens,
  getAccessToken,
  getUser,
  setAccessToken,
  setUserLocalStorage,
} from "@/lib/tokenService";
import { createContext, type ReactNode, useEffect, useState } from "react";
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

// Helper function to check if JWT token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    return true; // If we can't parse the token, consider it expired
  }
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getAccessToken();
    const userData = getUser();

    if (token && userData) {
      try {
        if (isTokenExpired(token)) {
          clearTokens();
          setUser(null);
        } else {
          setUser(JSON.parse(userData));
        }
      } catch {
        clearTokens();
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setAccessToken(response.accessToken);
    setUserLocalStorage(JSON.stringify(response.user));
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setAccessToken(response.accessToken);
    setUserLocalStorage(JSON.stringify(response.user));
    setUser(response.user);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
