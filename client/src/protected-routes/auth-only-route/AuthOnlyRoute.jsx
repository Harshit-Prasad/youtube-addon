import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../services/store";

export default function AuthOnlyRoute() {
  const userInfo = useAuthStore.getState();

  return (
    <>
      {userInfo?.authorized ? (
        <>
          <Outlet />
        </>
      ) : (
        <Navigate to="/auth" />
      )}
    </>
  );
}
