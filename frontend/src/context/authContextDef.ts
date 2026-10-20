import { createContext } from 'react';
import type { AuthUser, UserRole } from '../types';

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TOKEN_KEY = 'hireflow_token';
export const USER_KEY = 'hireflow_user';
