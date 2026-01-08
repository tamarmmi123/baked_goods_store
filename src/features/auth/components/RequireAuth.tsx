import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { JSX } from "react";

type Role = "admin" | "user";

interface RequireAuthProps {
  children: JSX.Element;
  roles?: Role[];
}

export const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const user = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
