// src/features/auth/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

type Role = 'admin' | 'student' | null;

type AuthContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  // FIX: antes se pasaba logout() {} (función vacía) al Provider.
  // Ahora se pasa la función correcta que sí llama a setRole(null).
  const logout = () => {
    setRole(null);
  };
  return (
    <AuthContext.Provider value={{ role, setRole, logout }}>
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
