import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useUserInfoStore } from "../../services/store";
import toast from "react-hot-toast";
import LiveStream from "../../components/live-stream/LiveStream";
import LiveChat from "../../components/live-stream/LiveChat";
import { Hand, Mic, MicOff, X, Share2, VolumeX } from "lucide-react";
import WebRTCPeer, { WebRTCPeer as NewWebRTCPeer } from "../../services/webRTC";
import MediaPlayer from "../../components/ui/MediaPlayer";
import { createPortal } from "react-dom";
import Popup from "../../components/ui/Popup";
import Header from "../../components/layout/Header";
import MediaDevices from '../../components/ui/MediaDevices';

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
  const [mediaDevicesModal, setMediaDevicesModal] = useState(true);
  const [loadingMediaDevices, setLoadingMediaDevices] = useState(true);
  const [mediaDevices, setMediaDevices] = useState([]);
  const [selectedInputAudioDevice, setSelectedInputAudioDevice] = useState('default');

  const [wakeLock, setWakeLock] = useState(null);

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
      setSelectedAdmin(from);
      webRTCPeer.peer.setRemoteDescription(offer);
      setIsOpen(true);
    },
    [webRTCPeer]
  );

  const handleAnswerCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
        // audio: {
        //   deviceId: selectedInputAudioDevice
        // },
      });

      setLocalStream(stream);
      for (const track of stream.getTracks()) {
        webRTCPeer.peer.addTrack(track, stream);
      }

      const answer = await webRTCPeer.getAnswer();


      socket.emit("call-accepted", {
        answer,
        to: selectedAdmin,
        from: userInfo.id,
      });

      setCallStarted(true);
      setIsOpen(false);
    } catch (error) {
      toast.error(
        'Please grant microphone access in order to answer the call.',
        { icon: '⚠️', duration: 5000 }
      )
      handleCallEnded()
      setIsOpen(false);
      socket.emit("user-end-call", { from: userInfo.id, to: selectedAdmin, type: 'permission-not-granted' });
    }
  }, [webRTCPeer, socket, userInfo.id, selectedAdmin, selectedInputAudioDevice]);

  const handleIncomingTracks = useCallback(
    (e) => {
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
      if (ic) {
        webRTCPeer.peer.addIceCandidate(ic);
      }
    },
    [webRTCPeer]
  );

  const handleICECandidate = useCallback(
    (e) => {
      if (e.candidate) {
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
  ]);

  // Media Controls

  useEffect(() => {
    if (!localStream) return;
    const audioTrack = localStream
      .getTracks()
      .find((track) => track.kind === "audio");
    audioTrack.enabled = !muted;
  }, [muted, localStream]);

  const handleEndCall = useCallback((type = 'call-ended') => {
    const tracks = localStream?.getTracks();
    tracks?.forEach((track) => {
      track?.stop();
    });

    socket.emit("user-end-call", { from: userInfo.id, to: selectedAdmin, type });

    setRemoteStream(null);
    setLocalStream(null);
    setCallStarted(false);
    setIsOpen(false);
    webRTCPeer.peer.close();
    setToggleRaiseHand(false);
    console.log('-->');

    setSelectedAdmin(null);
    setWebRTCPeer(new NewWebRTCPeer());
  }, [selectedAdmin, socket, userInfo.id, webRTCPeer.peer, localStream]);

  useEffect(() => {
    (async function () {
      const userDevices = await navigator.mediaDevices.enumerateDevices()

      setMediaDevices(userDevices)
      setLoadingMediaDevices(false)
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if ('wakeLock' in navigator) {
        if (!wakeLock) {
          try {
            setWakeLock(await navigator.wakeLock.request('screen'));
          } catch (error) {
            toast.error('Something went wrong')
          }
        }

        wakeLock.addEventListener('release', (e) => {
          console.log(e);
        });
      } else {
        toast.error('Be sure to keep the screen active.')
      }
    })();

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    }
  }, [wakeLock])

  return (
    <>
      <div className="bg-main">
        <Header />
        <div className="live-stream-container">
          <div className="live-video-container">
            <LiveStream streamId={streamId} />
            <div className="live-video__controls-container">
              <button
                disabled={callStarted}
                onClick={handleRaiseHand}
                className="media-button text-primary flex items-center justify-center gap-3"
              >
                <span>{toggleRaiseHand ? "Asked to call" : "Ask to call"}</span>
                <span
                  className={`flex justify-center items-center p-1 rounded-full`}
                >
                  <Hand
                    style={{
                      filter: toggleRaiseHand
                        ? "drop-shadow(1px 1px 2px rgb(33, 111, 108))"
                        : "none",
                    }}
                    className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]"
                    strokeWidth={2}
                    color={toggleRaiseHand ? "rgba(159, 248, 245)" : "white"}
                  />
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
                  {/* <button
                    onClick={handleEndCall}
                    disabled={true}
                    className="media-button bg-red-700 hover:bg-red-500 rounded-full"
                  >
                    <X />
                  </button> */}
                </>
              )}
              <button
                className="media-button px-4 text-primary flex items-center justify-center gap-3"
                onClick={handleShareLink}
              >
                <span>Share</span>
                <span className="flex justify-center items-center p-1 rounded-full">
                  <Share2 className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]" />
                </span>
              </button>
            </div>
          </div>
          <LiveChat streamId={streamId} />
        </div>
      </div>
      {localStream && <MediaPlayer muted={true} url={localStream} />}
      {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
      {selectedAdmin &&
        createPortal(
          isOpen && (
            <Popup closeBtn={false}>
              <h1 className="text-2xl text-center">Youtuber calling...</h1>
              <div className="flex justify-between items-center py-6">
                <button
                  onClick={handleAnswerCall}
                  className="button text-primary"
                >
                  Accept Call
                </button>
                <button
                  onClick={() => {
                    handleEndCall('call-rejected')
                  }}
                  className="button bg-red-700 hover:bg-red-500"
                >
                  Reject Call
                </button>
              </div>
              <span>
                Please&ensp;
                <strong>
                  mute <VolumeX className="inline-block" />
                  &ensp;
                </strong>
                the youtube video for better calling experience.
              </span>
            </Popup>
          ),
          document.getElementById("incoming-call")
        )}

      {/* {mediaDevicesModal && createPortal(<Popup setIsOpen={setMediaDevicesModal} >
        {loadingMediaDevices ? <span>Loading...</span> :
          <MediaDevices
            setModalDisplay={setMediaDevicesModal}
            setSelectedInputAudioDevice={setSelectedInputAudioDevice}
            mediaDevices={mediaDevices}
          />
        }
      </Popup>,
        document.getElementById('media-device-settings'))
      } */}
    </>
  );
}