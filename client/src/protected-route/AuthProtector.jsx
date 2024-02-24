import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useUserInfoStore } from "../services/store";

export default function AuthProtector() {
  const { isAuth } = useAuth();
  const { role } = useUserInfoStore();

  return (
    <>
      {isAuth ? (
        role ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/settings" replace />
        )
      ) : (
        <Outlet />
      )}
    </>
  );
}
