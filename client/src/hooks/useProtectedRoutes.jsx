import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function useProtectedRoutes() {
  const authTokens = JSON.parse(localStorage.getItem("auth_tokens"));

  const axiosProtectedRoute = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${authTokens.token}`,
    },
  });

  return axiosProtectedRoute;
}
