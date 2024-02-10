import React from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuthStore } from "../../services/store";

export default function NotAuthorizedOnlyStream() {
  const userInfo = useAuthStore((state) => state);
  const params = useParams();
  return (
    <>
      {!userInfo.authorized && <Outlet />}
      {userInfo.role === "student" && (
        <Navigate to={`/main-stream/${params.idx}`} replace />
      )}
      {userInfo.role === "teacher" && (
        <Navigate to={`/private-stream/${params.idx}`} replace />
      )}
    </>
  );
}
