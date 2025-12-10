/// features/auth/AuthContext.tsx
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
  avatarUri?: string;
  department?: string;
  position?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  role: Role | null;

  // ✅ ya existentes
  setAuth: (auth: { user: AuthUser; role: Role }) => void;
  clearAuth: () => void;

  // ✅ NUEVOS (agregados sin romper nada)
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  // -------------------------------------------------------
  // ✅ YA EXISTENTE
  // -------------------------------------------------------
  const setAuth = ({ user, role }: { user: AuthUser; role: Role }) => {
    setUser(user);
    setRole(role);
  };

  // -------------------------------------------------------
  // ✅ YA EXISTENTE
  // -------------------------------------------------------
  const clearAuth = () => {
    setUser(null);
    setRole(null);
  };

  // -------------------------------------------------------
  // ✅ NUEVO — ACTUALIZAR PERFIL EN MEMORIA
  // -------------------------------------------------------
  const updateProfile = async (data: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...data,
      };
    });
  };

  // -------------------------------------------------------
  // ✅ NUEVO — CERRAR SESIÓN
  // -------------------------------------------------------
  const signOut = async () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setAuth,
        clearAuth,
        updateProfile,
        signOut,
      }}
    >
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
