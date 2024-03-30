import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LiveStream from "../../components/live-stream/LiveStream";
import LiveChat from "../../components/live-stream/LiveChat";
import Header from "../../components/layout/Header";
import { Copy, DoorOpen } from "lucide-react";

export default function PrivateStream() {
  const { roomId } = useParams();
  const [userId, streamId] = roomId.split(":");

  const streamLink = `${
    import.meta.env.VITE_CLIENT_URL
  }/main-stream/${userId}:${streamId}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(streamLink);
      toast.success("Link Copied");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="bg-main">
      <Header />
      <div className="live-stream-container">
        <div className="live-video-container">
          <LiveStream streamId={streamId} />
          <div className="live-video__controls-container">
            <button
              onClick={handleCopyLink}
              className="button flex items-center text-primary gap-3"
            >
              <span>Copy Stream Link</span>
              <span
                className={`flex justify-center items-center p-1 rounded-full`}
              >
                <Copy className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]" />
              </span>
            </button>
            <Link
              className="button flex items-center text-primary gap-3"
              to={`/admin-rah/${userId}:${streamId}`}
            >
              <span>To RAH Page</span>
              <span
                className={`flex justify-center items-center p-1 rounded-full`}
              >
                <DoorOpen className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]" />
              </span>
            </Link>
          </div>
        </div>

        <LiveChat streamId={streamId} />
      </div>
    </div>
  );
}
