import { useEffect } from "react";
import axios from "../api/axios";
import { useUserInfoStore } from "../services/store";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function useVerifyTokens(setIsAuth) {
  const { setUserInfo } = useUserInfoStore((state) => state);

  const axiosVerifyTokens = axios.create({
    baseURL: BASE_URL,
  });

  useEffect(() => {
    const responseInterceptor = axiosVerifyTokens.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response.status === 403) {
          const authTokens = JSON.parse(localStorage.getItem("auth_tokens"));
          const body = {
            refresh_token: authTokens.refresh_token,
            id: authTokens.id,
          };
          const refreshTokens = await axios.post(
            "/api/user/refresh-token",
            body
          );

          if (refreshTokens) {
            setIsAuth(true);

            setUserInfo({
              id: refreshTokens.data.user.id,
              name: refreshTokens.data.user.name,
              picture: refreshTokens.data.user.picture,
              role: refreshTokens.data.user.role,
              email: refreshTokens.data.user.email,
            });

            localStorage.setItem(
              "auth_tokens",
              JSON.stringify(refreshTokens.data.auth_tokens)
            );
          }
        }

        return Promise.reject(`err: ${JSON.stringify(err)}`);
      }
    );

    return () => {
      axiosVerifyTokens.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosVerifyTokens;
}
