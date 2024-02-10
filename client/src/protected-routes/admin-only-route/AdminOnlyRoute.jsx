import React from "react";
import { useAuthStore } from "../../services/store";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminOnlyRoute() {
  const userInfo = useAuthStore((state) => state);

  return (
    <>
      {userInfo.role === "teacher" ? (
        <Outlet />
      ) : (
        <Navigate to="/welcome" replace />
      )}
    </>
  );
}
