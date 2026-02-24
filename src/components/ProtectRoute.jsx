import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function ProtectRoute({ children }) {
  const { userAuth } = useAuth();
  if (!userAuth) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
