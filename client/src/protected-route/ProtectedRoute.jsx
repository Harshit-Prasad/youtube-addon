import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedRoute() {
  const { isAuth } = useAuth();

  return <>{isAuth ? <Outlet /> : <Navigate to="/auth" replace />}</>;
}
