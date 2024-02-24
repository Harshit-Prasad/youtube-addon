import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useUserInfoStore } from "../services/store";

export default function Home() {
  const { isAuth } = useAuth();
  const { role } = useUserInfoStore();

  return (
    <div className="flex justify-evenly p-2">
      {isAuth ? (
        <>
          {role === "admin" ? (
            <Link
              className="button bg-slate-800 hover:bg-slate-950"
              to="/dashboard"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              className="button bg-slate-800 hover:bg-slate-950"
              to="/navigate-to"
            >
              Join Room
            </Link>
          )}

          <Link
            to="/settings"
            className="button bg-slate-800 hover:bg-slate-950"
          >
            Settings
          </Link>
        </>
      ) : (
        <Link to="/auth" className="button bg-slate-800 hover:bg-slate-950">
          Authenticate
        </Link>
      )}
    </div>
  );
}
