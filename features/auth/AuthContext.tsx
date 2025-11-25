// src/features/auth/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

type Role = 'admin' | 'student' | null;

type AuthContextValue = {
  role: Role;
  setRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
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
