import { useUserInfoStore } from "../services/store";
import { useAuth } from "../providers/AuthProvider";
import { Link } from "react-router-dom";

export default function ProtectedRoute() {
  const userInfo = useUserInfoStore((state) => state);
  const { setIsAuth } = useAuth();
  const { setUserInfo } = useUserInfoStore();

  const logout = () => {
    localStorage.removeItem("auth_tokens");

    setUserInfo({
      id: "",
      name: "",
      role: "",
      picture: "",
      email: "",
    });

    setIsAuth(false);
  };

  return (
    <div className="h-dvh items-start flex flex-col p-2">
      <>
        {userInfo.role === "user" ? (
          <Link
            className="button bg-slate-800 hover:bg-slate-950"
            to="/navigate-to"
          >
            Join Room
          </Link>
        ) : (
          <Link
            className="button bg-slate-800 hover:bg-slate-950"
            to="/dashboard"
          >
            Dashboard
          </Link>
        )}
      </>
      <div className="flex w-full grow flex-col justify-center items-center">
        <div className="flex flex-col max-w-[400px] ">
          <ul className="flex flex-col p-4 gap-4">
            <li>Name: {userInfo.name}</li>
            <li>Email: {userInfo.email}</li>
            <li>User ID: {userInfo.id}</li>
            <li className="h-24 w-24 mx-auto">
              <img
                height="100%"
                width="100%"
                className="rounded-full"
                src={userInfo.picture}
                alt="Profile photo"
                loading="lazy"
              />
            </li>
          </ul>
          <br />
          <button
            className="button bg-red-700 hover:bg-red-500"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
