import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import LiveStream from "../components/live-stream/LiveStream";
import LiveChat from "../components/live-stream/LiveChat";
import AuthTabs from "../components/auth/AuthTabs";
import { useState } from "react";
import Popup from "../components/ui/Popup";
import Header from "../components/layout/Header";
import { Hand } from "lucide-react";

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
    <div className="bg-main">
      <Header />
      <div className="live-stream-container">
        <div className="live-video-container">
          <LiveStream streamId={streamId} />
          <div className="live-video__controls-container">
            <button
              onClick={() => {
                handleOpenAuthTab();
              }}
              className="button text-primary flex items-center gap-3"
            >
              <span>Raise a hand</span>
              <span
                className={`flex justify-center items-center p-1 rounded-full`}
              >
                <Hand className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]" />
              </span>
            </button>
          </div>
        </div>

        {createPortal(
          isOpen && (
            <Popup setIsOpen={setIsOpen} closeBtn={true}>
              <AuthTabs pathname={location.state.pathname} />
            </Popup>
          ),
          document.getElementById("auth-tab")
        )}
        <LiveChat streamId={streamId} />
      </div>
    </div>
  );
}
