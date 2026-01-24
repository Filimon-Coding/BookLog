import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthResponseDto, Role, UserDto } from "../types/models";
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

function saveAuth(data: AuthResponseDto) {
  localStorage.setItem("booklog_token", data.accessToken);
  localStorage.setItem("booklog_user", JSON.stringify(data.user));
}

function clearAuth() {
  localStorage.removeItem("booklog_token");
  localStorage.removeItem("booklog_user");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("booklog_token"));
  const [user, setUser] = useState<UserDto | null>(() => {
    const raw = localStorage.getItem("booklog_user");
    return raw ? (JSON.parse(raw) as UserDto) : null;
  });

  useEffect(() => {
    setToken(localStorage.getItem("booklog_token"));
  }, []);

  const login = async (username: string, password: string) => {
    const data = await loginApi(username, password);
    saveAuth(data);
    setToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (username: string, password: string, role: Role) => {
    const data = await registerApi(username, password, role);
    saveAuth(data);
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
