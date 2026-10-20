import { apiClient } from './apiClient';
import type { LoginCredentials, LoginResponse, RegisterData, UserResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/users/login', {
      email: credentials.email.trim(),
      password: credentials.password,
    });
  },

  register: async (data: RegisterData): Promise<UserResponse> => {
    return apiClient.post<UserResponse>('/api/users', {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    });
  },
};
