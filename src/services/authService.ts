import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "@/interface/userInterface";
import { API_ENDPOINTS } from "../config/api";
import axiosClient from "../lib/axios";

export const authService = {
  login: async (data: LoginRequest): Promise<UserResponse> => {
    const response = await axiosClient.post<UserResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const { confirmPassword, ...registerData } = data;
    const response = await axiosClient.post<UserResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      registerData
    );
    return response.data;
  },
};
