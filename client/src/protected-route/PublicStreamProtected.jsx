import React from "react";
import { useAuth } from "../providers/AuthProvider";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useUserInfoStore } from "../services/store";

export default function PublicStreamProtected() {
  const params = useParams();
  const { isAuth } = useAuth();
  const { role } = useUserInfoStore((state) => state);
  const location = useLocation();

  return (
    <>
      {isAuth ? (
        <>
          {role === "user" ? (
            <Navigate
              to={`/main-stream/${params.roomId}`}
              state={{ handRaise: location.state?.handRaise || false }}
            />
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
