"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  registerCompany as registerCompanyRequest,
} from "@/lib/api";

import type {
  AuthResponse,
  CompanyRegistrationRequest,
  LoginRequest,
  UserResponse,
} from "@/lib/types";

interface AuthContextType {
  user: UserResponse | null;
  company: AuthResponse["company"] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  registerCompany: (registration: CompanyRegistrationRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [company, setCompany] = useState<AuthResponse["company"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      setUser(response.user);
      setCompany(response.company);
    } catch {
      setUser(null);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginRequest) => {
    const response = await loginRequest(credentials);

    setUser(response.user);
    setCompany(response.company);
  };

  const registerCompany = async (registration: CompanyRegistrationRequest) => {
    await registerCompanyRequest(registration);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setCompany(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isLoading,
        isAuthenticated: !!user,
        login,
        registerCompany,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
