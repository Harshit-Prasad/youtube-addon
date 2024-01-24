import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../services/store";

export default function NotAuthorizedOnly() {
  const userInfo = useAuthStore((state) => state);

  return (
    <>
      {!userInfo.authorized && <Outlet />}
      {userInfo.role === "student" && <Navigate to="/welcome" replace />}
      {userInfo.role === "teacher" && <Navigate to="/dashboard" replace />}
    </>
  );
}
