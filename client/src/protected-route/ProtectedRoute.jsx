import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedRoute() {
  const { isAuth } = useAuth();
  const params = useParams();
  const location = useLocation();

  return (
    <>
      <>
        {isAuth ? (
          <Outlet />
        ) : (
          <>
            {params.roomId ? (
              <Navigate
                to={`/public-stream/${params.roomId}`}
                state={{ redirectToMain: true, pathname: location.pathname }}
              />
            ) : (
              <Navigate to="/auth" replace />
            )}
          </>
        )}
      </>
    </>
  );
}
