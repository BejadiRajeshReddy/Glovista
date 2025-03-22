import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth);

  if (!isLoggedIn || !userInfo?.is_superuser) {
    return <Navigate to="/login" />;
  }

  return children;
};
