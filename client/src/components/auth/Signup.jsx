import { useGoogleLogin } from "@react-oauth/google";
import axios from "../../api/axios";
import { useAuth } from "../../providers/AuthProvider";
import { useUserInfoStore } from "../../services/store";
import { useLocation, useNavigate } from "react-router-dom";

export default function Signup({ pathname }) {
  const { setIsAuth } = useAuth();
  const { setUserInfo } = useUserInfoStore((state) => state);
  const navigate = useNavigate();
  const location = useLocation();

  const signup = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${codeResponse.access_token}` } }
        );

        const createdUser = await axios.post("/api/user/signup", {
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
          navigate(pathname, { state: { handRaise: true } });
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4 justify-center items-center">
      <button
        className="button text-primary"
        onClick={() => {
          signup();
        }}
      >
        Signup
      </button>
    </div>
  );
}
