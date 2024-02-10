import React from "react";
import { useAuthStore } from "../../services/store";

export default function WelcomePage() {
  const userInfo = useAuthStore((state) => state);

  return <div>{JSON.stringify(userInfo)}</div>;
}
