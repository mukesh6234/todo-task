import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../api/MakeRequest";

interface PublicRouteProps {
  element: React.ReactNode;
  redirectTo: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ element, redirectTo }) => {
  const token = getAuthToken();

  if (token) {
    return <Navigate to={redirectTo} />;
  }

  return <>{element}</>;
};

export default PublicRoute;
