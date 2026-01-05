import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { JSX } from "react";

interface RequireAuthProps {
  children?: JSX.Element;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const user = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children || null;
};
