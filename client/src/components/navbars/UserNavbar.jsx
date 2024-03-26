import { useCallback, useState } from "react";
import { useUserInfoStore } from "../../services/store";

export default function UserNavbar() {
  const [toggleProfile, setToggleProfile] = useState(false);
  const userInfo = useUserInfoStore((state) => state);

  const handleToggleProfile = useCallback(() => {
    setToggleProfile((prev) => !prev);
  }, []);

  return (
    <header className="hidden bg-[#0f0f0f] p-2 md:flex justify-between items-center w-full">
      <h1 className="text-xl text-white">Logo.</h1>

      <div className="relative">
        {toggleProfile && (
          <div className="absolute bg-[#282828] rounded-lg p-2 text-white bottom-0 left-0 translate-y-[75%] translate-x-[-105%] flex flex-col gap-1 justify-center items-start">
            <span className="rounded-full inline-block h-[36px] w-[36px]">
              <img
                className="rounded-full"
                width="100%"
                height="100%"
                src={userInfo.picture}
                alt={userInfo.name}
              />
            </span>
            <span>{userInfo.name}</span>
            <span>{userInfo.email}</span>
          </div>
        )}

        <button
          onClick={handleToggleProfile}
          className="rounded-full inline-block h-[36px] w-[36px] hover:outline hover:outline-3 hover:outline-[#fff] transition-colors duration-300 ease-in"
        >
          <img
            className="rounded-full"
            width="100%"
            height="100%"
            src={userInfo.picture}
            alt={userInfo.name}
          />
        </button>
      </div>
    </header>
  );
}
