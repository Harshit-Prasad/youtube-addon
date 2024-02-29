import React from "react";
import { useAuth } from "../providers/AuthProvider";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useUserInfoStore } from "../services/store";

export default function PublicStreamProtected() {
  const params = useParams();
  const { isAuth } = useAuth();
  const { role } = useUserInfoStore((state) => state);

  return (
    <>
      {isAuth ? (
        <>
          {role === "user" ? (
            <Navigate to={`/main-stream/${params.roomId}`} />
          ) : (
            <Navigate to={`/private-stream/${params.roomId}`} />
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}
