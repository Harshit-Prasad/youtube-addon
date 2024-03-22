import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useUserInfoStore } from "../../services/store";
import toast from "react-hot-toast";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";
import { Hand, Mic, MicOff, X } from "lucide-react";
import WebRTCPeer, { WebRTCPeer as NewWebRTCPeer } from "../../services/webRTC";
import MediaPlayer from "../../components/MediaPlayer";
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
      toast.error('Please mute the video for better calling experience.', {
        icon: '⚠️',
        duration: 5000,
      })
      setSelectedAdmin(from);
      webRTCPeer.peer.setRemoteDescription(offer);
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
  }, [webRTCPeer, socket, userInfo.id, selectedAdmin]);

  // const handleNegotiationNeeded = useCallback(async () => {
  //   const offer = await webRTCPeer.getOffer();

  //   console.log("negotiation needed");

  //   socket.emit("nego-needed", {
  //     offer,
  //     to: selectedAdmin,
  //     from: userInfo.id,
  //   });
  // }, [webRTCPeer, selectedAdmin, socket, userInfo.id]);

  // const handleNegotiationIncoming = useCallback(
  //   async ({ from, offer }) => {
  //     console.log("negotiation incoming");

  //     const answer = await webRTCPeer.getAnswer(offer);
  //     socket.emit("nego-done", { to: from, answer, from: userInfo.id });
  //   },
  //   [webRTCPeer, socket, userInfo.id]
  // );

  // const handleNegotiationFinal = useCallback(
  //   async ({ answer }) => {
  //     console.log("negotiation final");

  //     await webRTCPeer.setLocalDescription(answer);
  //   },
  //   [webRTCPeer]
  // );

  const handleIncomingTracks = useCallback(
    (e) => {
      console.log("tracks received", e);
      const [stream] = e.streams;
      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  const handleCallEnded = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
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

    // socket.on("nego-incoming", handleNegotiationIncoming);
    // socket.on("nego-final", handleNegotiationFinal);
    // webRTCPeer.peer.addEventListener(
    //   "negotiationneeded",
    //   handleNegotiationNeeded
    // );

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
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    setRemoteStream(null);
    setLocalStream(null);
    setCallStarted(false);
    webRTCPeer.peer.close();
    setToggleRaiseHand(false);
    socket.emit("user-end-call", { from: userInfo.id, to: selectedAdmin });

    setSelectedAdmin(null);
    setWebRTCPeer(new NewWebRTCPeer());
  }, [selectedAdmin, socket, userInfo.id, webRTCPeer.peer, localStream]);

  return (
    <>
      <Link to="/welcome" className="button text-primary">
        To Home
      </Link>
      <LiveStream streamId={streamId} />
      <button
        onClick={handleRaiseHand}
        className="button text-primary flex items-center justify-center gap-3"
      >
        Hand Raised
        <span
          className={`flex justify-center items-center p-1 rounded-full border-2 border-solid ${
            toggleRaiseHand ? "border-white" : "border-transparent"
          }`}
        >
          <Hand />
        </span>
      </button>
      {selectedAdmin && (
        <button onClick={handleAnswerCall} className="button text-primary">
          Start Call
        </button>
      )}

      {localStream && <MediaPlayer muted={true} url={localStream} />}
      {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
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
            <X />{" "}
          </button>
        </>
      )}
      <LiveChat streamId={streamId} />
    </>
  );
}
