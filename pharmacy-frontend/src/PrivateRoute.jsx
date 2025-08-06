import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
  const { customer, pharmacy } = useAuth();
  if (!customer && !pharmacy) {
    return <Navigate to="/customer-auth" replace />;
  }
  return children;
} 