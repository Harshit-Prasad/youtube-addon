import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../services/store";

export default function PublicStream() {
  const userInfo = useAuthStore.getState();
  const params = useParams();
  return (
    <>
      {!userInfo?.authrized && <>{params.idx}</>}
      <Link className="button" to="/auth">
        Login
      </Link>
    </>
  );
}
