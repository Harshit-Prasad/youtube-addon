import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";

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
    <div className="bg-slate-300 p-5">
      {/* <Link to={"/dashboard"} className="button text-primary">
        Go back
      </Link> */}
      <LiveStream streamId={streamId} />
      <div className="flex justify-center items-center gap-5 my-5">
        <button onClick={handleCopyLink} className="button text-primary">
          Copy Stream Link
        </button>
        <Link
          className="button text-primary"
          to={`/admin-rah/${userId}:${streamId}`}
        >
          To RAH Page
        </Link>
      </div>
      <LiveChat streamId={streamId} />
    </div>
  );
}
