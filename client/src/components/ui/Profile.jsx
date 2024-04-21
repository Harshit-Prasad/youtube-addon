import { useUserInfoStore } from "../../services/store";
import { useAuth } from "../../providers/AuthProvider";

export default function Profile() {
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
    <div className="flex flex-col justify-center items-center max-w-[400px] ">
      <ul className="flex flex-col p-4 gap-4">
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
        <li><strong>Name:</strong> {userInfo.name}</li>
        <li><strong>Email:</strong> {userInfo.email}</li>
      </ul>
      <br />
      <button
        className="button bg-red-500 hover:bg-red-700 text-white px-12"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  )
}
