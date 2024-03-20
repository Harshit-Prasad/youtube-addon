import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LiveStream from "../components/LiveStream";
import LiveChat from "../components/LiveChat";
import AuthTabs from "../components/auth/AuthTabs";
import { useState } from "react";
import Popup from "../components/Popup";

export default function PublicStream() {
  const [isOpen, setIsOpen] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [_, streamId] = roomId.split(":");
  const location = useLocation();

  function handleOpenAuthTab() {
    toast.error("Must Sign up in order to use this feature.");
    setIsOpen(true);
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
            handleOpenAuthTab();
          }}
          className="button text-primary"
        >
          Raise a hand
        </button>
      </div>
      {createPortal(
        isOpen && (
          <Popup setIsOpen={setIsOpen}>
            <AuthTabs pathname={location.state.pathname} />
          </Popup>
        ),
        document.getElementById("auth-tab")
      )}
      <LiveChat streamId={streamId} />
    </div>
  );
}
