import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  redirectTo: string;
}> = ({ element, redirectTo }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
