import { createContext, useContext } from 'react';
import { ForgotPasswordReq, LoginRes, RegisterReq, ResetPasswordReq, VerifyReq } from '@/types';
// Define the shape of the context
type RoleType = LoginRes['role'] | undefined;

interface AuthContextType {
  login: (data: FormData) => void;
  register: (data: RegisterReq) => void;
  verify: (data: VerifyReq) => void;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordReq) => void;
  resetPassword: (data: ResetPasswordReq) => void;
  isAuthenticated: boolean;
  role: RoleType;
  isError: boolean;
  isPending: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  register: () => {},
  logout: () => {},
  verify: () => {},
  forgotPassword: () => {},
  resetPassword: () => {},
  isAuthenticated: false,
  role: undefined,
  isError: false,
  isPending: false,
  isLoading: false,
});


// Custom hook for consuming auth state
export const useAuth = () => useContext(AuthContext);