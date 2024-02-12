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
      <Link
        className="button bg-slate-800 hover:bg-slate-950"
        to={`/auth?streamId=${params.idx}`}
      >
        Login
      </Link>
      <LiveStream streamId={streamId} />
      <button
        disabled={true}
        className="button bg-slate-800 hover:bg-slate-950"
      >
        Raise hand
      </button>
      <LiveChat streamId={streamId} />
    </>
  );
}
