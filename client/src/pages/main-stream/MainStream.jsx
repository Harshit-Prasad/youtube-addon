import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useAuthStore } from "../../services/store";
import toast from "react-hot-toast";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";
import { Hand } from "lucide-react";
import webRTCPeer from "../../services/webRTC";
import ReactPlayer from "react-player";
import AmountSlider from "../../components/AmountSlider";

export default function MainStream() {
  const userInfo = useAuthStore((state) => state);
  const params = useParams();
  const [adminId, streamId] = params.idx.split("_");
  const socket = useSocket();
  const [toggleRaiseHand, setToggleRaiseHand] = useState(false);
  const [localStream, setLocalStream] = useState();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [startPaymentProcess, setStartPaymentProcess] = useState(false);

  const userConnected = useCallback(() => {
    socket.emit("user-connected", {
      userInfo: {
        id: userInfo.id,
        name: userInfo.name,
        handRaised: toggleRaiseHand,
        role: userInfo.role,
      },
      adminId,
      streamId: params.idx,
    });
  }, [toggleRaiseHand]);

  const adminConnected = useCallback(() => {
    toast.success("Admin connected");
  }, []);

  const adminDisconnected = useCallback(() => {
    toast.error("Admin disconnected");
  }, []);

  const handleRaiseHand = useCallback(() => {
    setStartPaymentProcess(true);
    socket.emit("hand-raised", {
      id: userInfo.id,
      adminId,
      handRaised: !toggleRaiseHand,
    });

    setToggleRaiseHand(!toggleRaiseHand);
  }, [toggleRaiseHand]);

  useEffect(() => {
    socket.on("connect", userConnected);
    socket.on("admin-connected", adminConnected);
    socket.on("admin-disconnected", adminDisconnected);

    return () => {
      socket.off("connect", userConnected);
      socket.off("admin-connected", adminConnected);
      socket.off("admin-disconnected", adminDisconnected);
    };
  }, [userConnected, adminConnected, adminDisconnected]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  // WebRTC

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.applyConstraints({
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    });
    setLocalStream(stream);
    const answer = await webRTCPeer.getAnswer(offer);
    setSelectedAdmin(from);
    socket.emit("call-accepted", { answer, to: from, from: userInfo.id });
  }, []);

  const sendStream = useCallback(() => {
    for (const track of localStream.getTracks()) {
      webRTCPeer.peer.addTrack(track, localStream);
    }
  }, [localStream, webRTCPeer]);

  const handleAnswerCall = useCallback(() => {
    sendStream();
  }, [sendStream]);

  const handleNegotiationNeeded = useCallback(
    async (e) => {
      console.log(e);
      const offer = await webRTCPeer.getOffer();
      socket.emit("nego-needed", {
        offer,
        to: selectedAdmin,
        from: userInfo.id,
      });
    },
    [webRTCPeer, selectedAdmin]
  );

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await webRTCPeer.getAnswer(offer);
      socket.emit("nego-done", { to: from, answer, from: userInfo.id });
    },
    [webRTCPeer]
  );

  const handleNegotiationFinal = useCallback(
    async ({ answer }) => {
      await webRTCPeer.setLocalDescription(answer);
    },
    [webRTCPeer]
  );

  const handleIncomingTracks = useCallback(
    (e) => {
      const [stream] = e.streams;
      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  useEffect(() => {
    socket.on("incoming-call", handleIncomingCall);
    socket.on("nego-incoming", handleNegotiationIncoming);
    socket.on("nego-final", handleNegotiationFinal);

    webRTCPeer.peer.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded
    );
    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("nego-incoming", handleNegotiationIncoming);
      socket.off("nego-final", handleNegotiationFinal);

      webRTCPeer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
    };
  }, [
    webRTCPeer,
    handleIncomingCall,
    handleNegotiationNeeded,
    handleNegotiationFinal,
    handleIncomingTracks,
  ]);

  console.log(remoteStream);

  return (
    <>
      <Link to="/welcome" className="button">
        To Home
      </Link>
      <LiveStream streamId={streamId} />
      <button
        onClick={handleRaiseHand}
        className="button flex items-center justify-center gap-3"
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
      {startPaymentProcess && <AmountSlider />}
      {selectedAdmin && (
        <button onClick={handleAnswerCall} className="button">
          Start Call
        </button>
      )}

      {localStream && (
        <ReactPlayer
          width={0}
          height={0}
          muted={true}
          playing
          url={localStream}
        ></ReactPlayer>
      )}
      {remoteStream && (
        <ReactPlayer
          width={0}
          height={0}
          muted={false}
          playing
          url={remoteStream}
        ></ReactPlayer>
      )}

      <LiveChat streamId={streamId} />
    </>
  );
}
