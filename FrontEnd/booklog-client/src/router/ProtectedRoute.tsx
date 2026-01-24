import React from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../types/models";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Role[];
}) {
  const { isLoggedIn, hasRole } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
