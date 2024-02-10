import React from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";

export default function PrivateStream() {
  const { idx } = useParams();
  const [userId, streamId] = idx.split("_");

  const streamLink = `${
    import.meta.env.VITE_CLIENT_URL
  }/public-stream/${userId}_${streamId}`;

  async function handleCopyLink(e) {
    try {
      await navigator.clipboard.writeText(streamLink);
      toast.success("Link Copied");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="bg-slate-300 p-5">
      <Link to={"/"} className="button">
        Go back
      </Link>
      <LiveStream streamId={streamId} />
      <div className="flex justify-center items-center gap-5 my-5">
        <button onClick={handleCopyLink} className="button">
          Copy Stream Link
        </button>
        <span>Stream Link: {streamLink}</span>
      </div>
      <LiveChat streamId={streamId} />
    </div>
  );
}
