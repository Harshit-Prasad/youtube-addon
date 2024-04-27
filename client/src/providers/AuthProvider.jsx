import { createContext, useState, useContext, useEffect } from "react";
import { useUserInfoStore } from "../services/store";
import axios from '../api/axios';

const AuthContext = createContext({});

export const useAuth = () => {
  const authValues = useContext(AuthContext);

  return authValues;
};

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const { setUserInfo } = useUserInfoStore((state) => state);
  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    (async function () {
      try {
        const auth_tokens = window.localStorage.getItem("auth_tokens");
        const user_info = window.localStorage.getItem('user_info')
        if (auth_tokens) {
          // const verifiedUser = await axiosVerifyTokens.post(
          //   "/api/user/verify-tokens",
          //   {
          //     auth_tokens: JSON.parse(auth_tokens),
          //   }
          // );
          const verifiedUser = await axios.post(
            "/api/user/verify-token/v2",
            {
              auth_token: JSON.parse(auth_tokens),
              user_info: JSON.parse(user_info)
            }
          );

          if (verifiedUser.status === 200) {
            setUserInfo({
              id: verifiedUser.data.user.id,
              name: verifiedUser.data.user.name,
              picture: verifiedUser.data.user.picture,
              role: verifiedUser.data.user.role,
              email: verifiedUser.data.user.email,
            });

            setIsAuth(true)
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setVerificationLoading(false);
      }
    })();
  }, []);

  const value = {
    isAuth,
    setIsAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {verificationLoading ? <>Verifing User</> : <>{children}</>}
    </AuthContext.Provider>
  );
}
