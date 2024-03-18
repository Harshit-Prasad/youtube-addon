import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import LiveStream from "../components/LiveStream";
import LiveChat from "../components/LiveChat";

export default function PublicStream() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [_, streamId] = roomId.split(":");

  function handleRedirect() {
    toast.error("Must Sign up in order to use this feature.");
    navigate("/auth");
  }

  return (
    <div className="p-5">
      <Link to={"/dashboard"} className="button text-primary">
        Go back
      </Link>
      <LiveStream streamId={streamId} />
      <div className="flex justify-center items-center gap-5 my-5">
        <button
          onClick={() => {
            handleRedirect();
          }}
          className="button text-primary"
        >
          Raise a hand
        </button>
      </div>
      <LiveChat streamId={streamId} />
    </div>
  );
}
