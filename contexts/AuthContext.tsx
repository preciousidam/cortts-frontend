import { createContext, useContext } from 'react';
import { LoginRes } from '@/types';
// Define the shape of the context
type RoleType = LoginRes['role'] | undefined;

interface AuthContextType {
  login: (data: FormData) => void;
  register: (data: FormData) => void;
  logout: () => void;
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
  isAuthenticated: false,
  role: undefined,
  isError: false,
  isPending: false,
  isLoading: false,
});


// Custom hook for consuming auth state
export const useAuth = () => useContext(AuthContext);