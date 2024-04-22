import React from "react";
import axios from "../../api/axios";
import { useAuth } from "../../providers/AuthProvider";
import { useUserInfoStore } from "../../services/store";
import { useGoogleLogin } from "@react-oauth/google";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function Login({ pathname }) {
  const { setIsAuth } = useAuth();
  const { setUserInfo } = useUserInfoStore((state) => state);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${codeResponse.access_token}` } }
        );

        const createdUser = await axios.post("/api/user/login", {
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
        });

        setIsAuth(true);
        setUserInfo({
          id: createdUser.data.user._id,
          name: createdUser.data.user.name,
          picture: createdUser.data.user.picture,
          role: createdUser.data.user.role,
          email: createdUser.data.user.email,
        });
        localStorage.setItem(
          "auth_tokens",
          JSON.stringify(createdUser.data.auth_tokens)
        );

        if (location.state.redirectToMain) {
          navigate(pathname || '/welcome', { state: { handRaise: true } });
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <div className="flex flex-col mt-2 gap-2 justify-center items-center text-white">
      <span>First time here?</span>
      <button
        className="flex bg-white text-black hover:bg-[#ddd] gap-4 justify-between items-center outline outline-1 outline-black p-2 rounded-lg"
        onClick={() => {
          login();
        }}
      >
        <img height={24} width={24} src="https://www.shareicon.net/data/2016/07/10/119930_google_512x512.png" alt="google logo" />
        <span>Login with Google</span>
      </button>
    </div>
  );
}
