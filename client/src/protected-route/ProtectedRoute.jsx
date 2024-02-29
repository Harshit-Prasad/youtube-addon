import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedRoute() {
  const { isAuth } = useAuth();
  const params = useParams();

  return (
    <>
      <>
        {isAuth ? (
          <Outlet />
        ) : (
          <>
            {params.roomId ? (
              <Navigate to={`/public-stream/${params.roomId}`} replace />
            ) : (
              <Navigate to="/auth" replace />
            )}
          </>
        )}
      </>
    </>
  );
}
