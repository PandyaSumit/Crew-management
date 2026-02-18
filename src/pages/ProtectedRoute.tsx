import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
