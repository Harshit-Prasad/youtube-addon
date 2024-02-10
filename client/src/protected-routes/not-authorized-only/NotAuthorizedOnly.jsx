import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useAuthStore } from "../../services/store";

export default function NotAuthorizedOnly() {
  const userInfo = useAuthStore((state) => state);
  const location = useLocation();
  console.log(">>", location);
  return (
    <>
      {!userInfo.authorized && <Outlet />}
      {userInfo.role === "student" && <Navigate to="/welcome" replace />}
      {userInfo.role === "teacher" && <Navigate to="/" replace />}
    </>
  );
}
