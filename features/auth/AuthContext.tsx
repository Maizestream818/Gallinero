// src/features/auth/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Role = 'admin' | 'student' | null;

type AuthContextValue = {
  role: Role;
  token: string | null;
  githubId: number | null;
  isAuthenticated: boolean;
  login: (params: {
    role: Role;
    token: string;
    githubId: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void; // compat
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [token, setToken] = useState<string | null>(null);
  const [githubId, setGithubId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      const savedRole = await AsyncStorage.getItem('role');
      const savedGithubId = await AsyncStorage.getItem('githubId');

      if (savedToken && savedRole && savedGithubId) {
        setToken(savedToken);
        setRole(savedRole as Role);
        setGithubId(Number(savedGithubId));
        setIsAuthenticated(true);
      }
    };

    loadSession();
  }, []);

  const login = async ({
    role,
    token,
    githubId,
  }: {
    role: Role;
    token: string;
    githubId: number;
  }) => {
    setRole(role);
    setToken(token);
    setGithubId(githubId);
    setIsAuthenticated(true);

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('role', role || '');
    await AsyncStorage.setItem('githubId', githubId.toString());
  };

  const logout = async () => {
    setRole(null);
    setToken(null);
    setGithubId(null);
    setIsAuthenticated(false);

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('githubId');
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        githubId,
        isAuthenticated,
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
