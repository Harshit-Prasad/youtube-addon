import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../services/store";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";

export default function PublicStream() {
  const userInfo = useAuthStore((state) => state);
  const params = useParams();

  const [_, streamId] = params.idx.split("_");
  return (
    <>
      <Link className="button" to={`/auth?streamId=${params.idx}`}>
        Login
      </Link>
      <LiveStream streamId={streamId} />
      <button disabled={true} className="button">
        Raise hand
      </button>
      <LiveChat streamId={streamId} />
    </>
  );
}
