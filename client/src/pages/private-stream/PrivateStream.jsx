import React from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function PrivateStream() {
  const { idx } = useParams();
  const [userId, streamId] = idx.split("_");

  const streamLink = `${
    import.meta.env.VITE_CLIENT_URL
  }/main-stream/${userId}_${streamId}`;

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
      <div className="aspect-video max-w-[800px] mx-auto my-2">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${streamId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex justify-center items-center gap-5 my-5">
        <button onClick={handleCopyLink} className="button">
          Copy Stream Link
        </button>
        <span>Stream Link: {streamLink}</span>
      </div>
      <div className="aspect-square max-w-[400px] mx-auto">
        {/* <iframe
            width="520"
            height="616"
            src={`https://www.youtube.com/live_chat?v=${
              streamId
            }&amp;embed_domain=${import.meta.env.VITE_CLIENT_URL}`}
          ></iframe> */}
      </div>
    </div>
  );
}
