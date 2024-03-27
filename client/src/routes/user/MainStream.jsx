import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useUserInfoStore } from "../../services/store";
import toast from "react-hot-toast";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";
import { Hand, Mic, MicOff, X, Share2 } from "lucide-react";
import WebRTCPeer, { WebRTCPeer as NewWebRTCPeer } from "../../services/webRTC";
import MediaPlayer from "../../components/MediaPlayer";
import { createPortal } from "react-dom";
import Popup from "../../components/Popup";
import StreamContainer from "../../components/StreamContainer";
import UserNavbar from "../../components/navbars/UserNavbar";
// import AmountSlider from "../../components/AmountSlider";

export default function MainStream() {
  const userInfo = useUserInfoStore((state) => state);
  const params = useParams();
  const navigate = useNavigate();
  const [adminId, streamId] = params.roomId.split(":");
  const socket = useSocket();
  const location = useLocation();
  const [toggleRaiseHand, setToggleRaiseHand] = useState(
    location.state?.handRaise || false
  );
  const [webRTCPeer, setWebRTCPeer] = useState(WebRTCPeer);
  const [localStream, setLocalStream] = useState();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [callStarted, setCallStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleShareLink = useCallback(async (e) => {
    try {
      await navigator.clipboard.writeText(
        `${import.meta.env.VITE_CLIENT_URL}/main-stream/${params.roomId}`
      );
      toast.success("Link Copied");
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const userConnected = useCallback(() => {
    socket.emit("user-connected", {
      userInfo: {
        id: userInfo.id,
        name: userInfo.name,
        handRaised: toggleRaiseHand,
        picture: userInfo.picture,
        role: userInfo.role,
      },
      adminId,
      streamId: params.roomId,
    });
  }, [
    toggleRaiseHand,
    socket,
    userInfo.id,
    userInfo.name,
    userInfo.role,
    userInfo.picture,
    adminId,
    params.roomId,
  ]);

  const adminConnected = useCallback(() => {
    toast.success("Admin connected");
  }, []);

  const adminDisconnected = useCallback(() => {
    toast.error("Admin disconnected");
  }, []);

  const handleRaiseHand = useCallback(() => {
    // setStartPaymentProcess(true);
    socket.emit("hand-raised", {
      id: userInfo.id,
      adminId,
      handRaised: !toggleRaiseHand,
    });

    setToggleRaiseHand(!toggleRaiseHand);
  }, [toggleRaiseHand, socket, adminId, userInfo.id]);

  useEffect(() => {
    socket.on("connect", userConnected);
    socket.on("admin-connected", adminConnected);
    socket.on("admin-disconnected", adminDisconnected);

    return () => {
      socket.off("connect", userConnected);
      socket.off("admin-connected", adminConnected);
      socket.off("admin-disconnected", adminDisconnected);
    };
  }, [userConnected, adminConnected, adminDisconnected, socket]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // WebRTC

  // const sendStream = useCallback(() => {

  // }, [localStream, webRTCPeer]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      toast.error("Please mute the video for better calling experience.", {
        icon: "⚠️",
        duration: 5000,
      });
      setSelectedAdmin(from);
      webRTCPeer.peer.setRemoteDescription(offer);
      setIsOpen(true);
    },
    [webRTCPeer]
  );

  const handleAnswerCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    setLocalStream(stream);
    for (const track of stream.getTracks()) {
      webRTCPeer.peer.addTrack(track, stream);
    }

    const answer = await webRTCPeer.getAnswer();

    console.log(answer.sdp);

    socket.emit("call-accepted", {
      answer,
      to: selectedAdmin,
      from: userInfo.id,
    });

    setCallStarted(true);
    setIsOpen(false);
  }, [webRTCPeer, socket, userInfo.id, selectedAdmin]);

  const handleIncomingTracks = useCallback(
    (e) => {
      console.log("tracks received", e);
      const [stream] = e.streams;
      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  const handleCallEnded = useCallback(() => {
    const tracks = localStream?.getTracks();
    tracks?.forEach((track) => {
      track?.stop();
    });
    setRemoteStream(null);
    setLocalStream(null);
    webRTCPeer.peer.close();
    setCallStarted(false);
    setToggleRaiseHand(false);
    setSelectedAdmin(null);

    setWebRTCPeer(new NewWebRTCPeer());
  }, [webRTCPeer, localStream]);

  const handleIncomingICECandidate = useCallback(
    ({ from, ic }) => {
      console.log("ice candidates incoming");
      if (ic) {
        webRTCPeer.peer.addIceCandidate(ic);
      }
    },
    [webRTCPeer]
  );

  const handleICECandidate = useCallback(
    (e) => {
      if (e.candidate) {
        console.log("ice candidates sent", selectedAdmin);
        socket.emit("add-ice-candidate", {
          from: userInfo.id,
          to: selectedAdmin,
          ic: e.candidate,
        });
      }
    },
    [socket, userInfo.id, selectedAdmin]
  );

  const handleStreamEnded = useCallback(() => {
    socket.emit("user-end-stream", { userId: userInfo.id });
    navigate("/welcome", {
      replace: true,
    });
  }, [navigate, socket, userInfo.id]);

  useEffect(() => {
    socket.on("incoming-call", handleIncomingCall);
    socket.on("admin-ended-call", handleCallEnded);
    socket.on("add-ice-candidate", handleIncomingICECandidate);
    socket.on("stream-ended", handleStreamEnded);

    webRTCPeer.peer.addEventListener("icecandidate", handleICECandidate);
    webRTCPeer.peer.addEventListener("signalingstatechange", () => {
      console.log(webRTCPeer.peer.signalingState);
    });
    webRTCPeer.peer.addEventListener("icecandidateerror", (e) => {
      console.log(e);
    });

    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("admin-ended-call", handleCallEnded);
      socket.off("add-ice-candidate", handleIncomingICECandidate);
      socket.off("stream-ended", handleStreamEnded);

      webRTCPeer.peer.removeEventListener("icecandidate", handleICECandidate);
      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);

      // socket.off("nego-incoming", handleNegotiationIncoming);
      // socket.off("nego-final", handleNegotiationFinal);
      // webRTCPeer.peer.removeEventListener(
      //   "negotiationneeded",
      //   handleNegotiationNeeded
      // );
    };
  }, [
    webRTCPeer,
    handleIncomingCall,
    handleIncomingTracks,
    handleCallEnded,
    handleIncomingICECandidate,
    handleICECandidate,
    handleStreamEnded,
    socket,
    // handleNegotiationNeeded,
    // handleNegotiationFinal,
    // handleNegotiationIncoming,
  ]);

  // Media Controls

  useEffect(() => {
    if (!localStream) return;
    console.log(localStream);
    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");
    audioTrack.enabled = !muted;
  }, [muted, localStream]);

  const handleEndCall = useCallback(() => {
    const tracks = localStream?.getTracks();
    tracks?.forEach((track) => {
      track?.stop();
    });

    setRemoteStream(null);
    setLocalStream(null);
    setCallStarted(false);
    setIsOpen(false);
    webRTCPeer.peer.close();
    setToggleRaiseHand(false);
    socket.emit("user-end-call", { from: userInfo.id, to: selectedAdmin });

    setSelectedAdmin(null);
    setWebRTCPeer(new NewWebRTCPeer());
  }, [selectedAdmin, socket, userInfo.id, webRTCPeer.peer, localStream]);

  return (
    <StreamContainer>
      <UserNavbar />
      <div className="flex-grow stream-layout bg-[#0f0f0f] flex flex-col">
        <div className="flex flex-col gap-2 md:p-4">
          <LiveStream streamId={streamId} />
          <div className="flex justify-evenly items-center gap-2 md:gap-4">
            <button
              disabled={callStarted}
              onClick={handleRaiseHand}
              className="button text-primary flex items-center justify-center gap-3"
            >
              <span className="hidden md:inline-block">Hand Raised</span>
              <span
                className={`flex justify-center items-center p-1 rounded-full border-2 border-solid ${
                  toggleRaiseHand ? "border-white" : "border-transparent"
                }`}
              >
                <Hand />
              </span>
            </button>
            {callStarted && (
              <>
                <button
                  onClick={() => {
                    setMuted((prev) => !prev);
                  }}
                  className="media-button text-primary rounded-full"
                >
                  {muted ? <MicOff /> : <Mic />}
                </button>
                <button
                  onClick={handleEndCall}
                  className="media-button bg-red-700 hover:bg-red-500 rounded-full"
                >
                  <X />
                </button>
              </>
            )}
            <button
              className="button text-primary flex items-center justify-center gap-3"
              onClick={handleShareLink}
            >
              <span className="hidden md:inline-block">Share</span>
              <span className="flex justify-center items-center p-1 rounded-full">
                <Share2 />
              </span>
            </button>
          </div>
        </div>

        {selectedAdmin &&
          createPortal(
            isOpen && (
              <Popup closeBtn={false}>
                <div className="flex justify-between items-center py-6">
                  <button
                    onClick={handleAnswerCall}
                    className="button text-primary"
                  >
                    Accept Call
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="media-button bg-red-700 hover:bg-red-500"
                  >
                    Reject Call
                  </button>
                </div>
              </Popup>
            ),
            document.getElementById("incoming-call")
          )}
        {localStream && <MediaPlayer muted={true} url={localStream} />}
        {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
        <LiveChat streamId={streamId} />
      </div>
    </StreamContainer>
  );
}
