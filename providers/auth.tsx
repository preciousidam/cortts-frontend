import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
const AuthContext = createContext({
  isAuthenticated: false,
  role: null as 'admin' | 'agent' | 'client' | null,
  login: (_role: 'admin' | 'agent' | 'client') => {},
  logout: () => {}
});

// AuthProvider wraps the app and provides context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'admin' | 'agent' | 'client' | null>(null);

  const login = (newRole: 'admin' | 'agent' | 'client') => {
    setIsAuthenticated(true);
    setRole(newRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };

  return <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming auth state
export const useAuth = () => useContext(AuthContext);
