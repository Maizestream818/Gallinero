// features/auth/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Role = 'admin' | 'student';

export type AuthUser = {
  objectId: string;
  email: string;
  fullName?: string;
  career?: string;
  studentId?: string;
  gender?: string;
  age?: number;
};

type AuthContextValue = {
  user: AuthUser | null;
  role: Role | null;
  setAuth: (auth: { user: AuthUser; role: Role }) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const setAuth = ({ user, role }: { user: AuthUser; role: Role }) => {
    setUser(user);
    setRole(role);
  };

  const clearAuth = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return ctx;
}
