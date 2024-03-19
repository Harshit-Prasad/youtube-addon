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
            <Link className="button text-primary" to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <Link className="button text-primary" to="/navigate-to">
              Join Room
            </Link>
          )}

          <Link to="/settings" className="button text-primary">
            Settings
          </Link>

          <Link to="/welcome" className="button text-primary">
            Profile
          </Link>
        </>
      ) : (
        <Link to="/auth" className="button text-primary">
          Authenticate
        </Link>
      )}
    </div>
  );
}
