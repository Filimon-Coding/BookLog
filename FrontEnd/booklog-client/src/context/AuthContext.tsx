import React, { createContext, useContext, useMemo, useState } from "react";
import type { Role, UserDto } from "../types/models";
import { loginApi, registerApi } from "../api/authApi";

type AuthContextValue = {
  user: UserDto | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "booklog_token";
const USER_KEY = "booklog_user";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserDto | null>(() => safeJsonParse<UserDto>(localStorage.getItem(USER_KEY)));

  const saveAuth = (newToken: string, newUser: UserDto) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    const t = res.accessToken ?? res.token;
    if (!t) throw new Error("No token returned from server.");
    saveAuth(t, res.user);
  };

  const register = async (username: string, password: string, role: Role) => {
    // backend only allows Reader/Author self-register, so keep it strict here too
    if (role !== "Reader" && role !== "Author") {
      throw new Error("Role must be Reader or Author.");
    }

    const res = await registerApi(username, password, role);
    const t = res.accessToken ?? res.token;
    if (!t) throw new Error("No token returned from server.");
    saveAuth(t, res.user);
  };

  const logout = () => {
    clearAuth();
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoggedIn: !!token && !!user,
      login,
      register,
      logout,
      hasRole,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}
