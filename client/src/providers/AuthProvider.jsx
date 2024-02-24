import { createContext, useState, useContext, useEffect } from "react";
import useVerifyTokens from "../hooks/useVerifyTokens";
import { useUserInfoStore } from "../services/store";

const AuthContext = createContext({});

export const useAuth = () => {
  const authValues = useContext(AuthContext);

  return authValues;
};

export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const { setUserInfo } = useUserInfoStore((state) => state);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const axiosVerifyTokens = useVerifyTokens(setIsAuth);

  useEffect(() => {
    (async function () {
      try {
        const auth_tokens = window.localStorage.getItem("auth_tokens");
        if (auth_tokens) {
          const verifiedUser = await axiosVerifyTokens.post(
            "/api/user/verify-tokens",
            {
              auth_tokens: JSON.parse(auth_tokens),
            }
          );

          if (verifiedUser) {
            setIsAuth(true);

            setUserInfo({
              id: verifiedUser.data.user.id,
              name: verifiedUser.data.user.name,
              picture: verifiedUser.data.user.picture,
              role: verifiedUser.data.user.role,
              email: verifiedUser.data.user.email,
            });

            localStorage.setItem(
              "auth_tokens",
              JSON.stringify(verifiedUser.data.auth_tokens)
            );
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
