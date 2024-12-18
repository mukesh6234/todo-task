import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../api/MakeRequest";

const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  redirectTo: string;
}> = ({ element, redirectTo }) => {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to={redirectTo} />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
