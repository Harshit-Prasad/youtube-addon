import React from "react";
import { useAuthStore } from "../../services/store";
import { Navigate, Outlet, useParams } from "react-router-dom";

export default function UserOnlyRoute() {
  const userInfo = useAuthStore((state) => state);
  const params = useParams();

  return (
    <>
      {userInfo?.role === "student" && <Outlet />}
      {userInfo?.role === "teacher" && (
        <Navigate to={`/private-stream/${params.idx}`} replace />
      )}
      {!userInfo?.authorized && (
        <Navigate to={`/public-stream/${params.idx}`} replace />
      )}
    </>
  );
}
