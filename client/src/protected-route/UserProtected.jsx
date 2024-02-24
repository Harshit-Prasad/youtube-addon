import { useUserInfoStore } from "../services/store";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtected() {
  const { role } = useUserInfoStore((state) => state);

  return (
    <>{role === "user" ? <Outlet /> : <Navigate to="/dashboard" replace />}</>
  );
}
