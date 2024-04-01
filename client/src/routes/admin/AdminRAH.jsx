import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useUserInfoStore } from "../../services/store";
import axios from "../../api/axios";
import WebRTCPeer, { WebRTCPeer as NewWebRTCPeer } from "../../services/webRTC";
import MediaPlayer from "../../components/ui/MediaPlayer";
import { Mic, MicOff, X } from "lucide-react";
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';

export default function AdminRAH() {
  const socket = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const userInfo = useUserInfoStore((state) => state);
  const [users, setUsers] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [callStarted, setCallStarted] = useState(false);
  const [callStatus, setCallStatus] = useState('')
  const [muted, setMuted] = useState(false);

  const [webRTCPeer, setWebRTCPeer] = useState(WebRTCPeer);
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const adminConnected = useCallback(() => {
    socket.emit("admin-connected", { userInfo, streamId: params.roomId });
  }, [params.roomId, socket, userInfo]);

  const userConnected = useCallback(
    ({ id, name, picture, handRaised }) => {
      const exists = users.find((userInfo) => userInfo.id === id);
      if (!exists) {
        setUsers((prev) => [
          {
            id,
            name,
            picture,
            handRaised,
          },
          ...prev,
        ]);
      }
    },
    [users]
  );

  const userDisconnected = useCallback(
    ({ id }) => {
      let disconnectedUserId;

      users.forEach((cur, i) => {
        if (cur.id === id) {
          disconnectedUserId = i;
        }
      });

      if (disconnectedUserId !== undefined) {
        setUsers((prev) => {
          const updatedUsers = prev.slice();
          updatedUsers.splice(disconnectedUserId, 1);
          return updatedUsers;
        });
      }
    },
    [users]
  );

  const userHandRaised = useCallback(({ id, handRaised }) => {
    setUsers((users) => {
      const u = users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            handRaised,
          };
        }

        return user;
      });
      return u;
    });
  }, []);

  const getCurrentAudience = useCallback(async () => {
    try {
      const response = await axios.get(`/api/audience-list/${params.roomId}`);

      if (response?.data) {
        setUsers(response.data.audienceList);
        setRecentInteractions(response.data.recentInteractionsList);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [params.roomId]);

  useEffect(() => {
    socket.on("connect", adminConnected);
    socket.on("user-connected", userConnected);
    socket.on("user-disconnected", userDisconnected);
    socket.on("hand-raised", userHandRaised);

    return () => {
      socket.off("connect", adminConnected);
      socket.off("user-connected", userConnected);
      socket.off("user-disconnected", userDisconnected);
      socket.off("hand-raised", userHandRaised);
    };
  }, [adminConnected, userConnected, userDisconnected, userHandRaised, socket]);

  useEffect(() => {
    getCurrentAudience();

    return () => {
      socket.disconnect();
    };
  }, [getCurrentAudience, socket]);

  // WebRTC

  const handleCallAudience = useCallback(
    async (userId) => {
      setSelectedUser(userId);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });

      setLocalStream(stream);

      for (const track of stream.getTracks()) {
        webRTCPeer.peer.addTrack(track, stream);
      }

      const offer = await webRTCPeer.getOffer();

      socket.emit("call-peer", { from: userInfo.id, to: userId, offer });

      setCallStarted(true);

      setCallStatus('Ringing...')
    },
    [webRTCPeer, socket, userInfo.id]
  );

  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      await webRTCPeer.peer.setRemoteDescription(answer);
      setCallStatus('Connected...');
      setTimeout(() => {
        setCallStatus('You May Speak...')
      }, 1000);
      setTimeout(() => {
        setCallStatus('')
      }, 3000);
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

  const resetRecentInteractions = useCallback((userId) => {
      const recentInteraction = users.find((user) => user.id === userId);

      if(recentInteraction?.handRaised) {
        recentInteraction.handRaised = false;
      }
      
      setRecentInteractions((interactions) => {
        return [recentInteraction, ...interactions];
      });
  }, [users])

  const handleCallEnded = useCallback(
    ({ from: userId, type }) => {
      const tracks = localStream?.getTracks();
      tracks?.forEach((track) => {
        track.stop();
      });

      webRTCPeer?.peer.close();
      setRemoteStream(null);
      setLocalStream(null);
      setCallStarted(false);
      setWebRTCPeer(new NewWebRTCPeer());
      setSelectedUser(null);

      setUsers((prevUsers) => {
        const u = prevUsers.slice().map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              handRaised: false,
            };
          }

          return user;
        });

        return u;
      });

      if (type === 'call-rejected') {
        toast.error('Viewer rejected the call.', {
          icon: '🔴'
        })
      }

      if (type === 'permission-not-granted') {
        toast.error('Tell viewer to grant microphone permission.', {
          icon: '⚠️'
        })
      }

      if (type === 'call-ended') {
        resetRecentInteractions(userId)
      }
    },
    [webRTCPeer, localStream, users]
  );

  const handleIncomingICECandidate = useCallback(
    ({ ic }) => {

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
          to: selectedUser,
          ic: e.candidate,
        });
      }
    },
    [socket, userInfo.id, selectedUser]
  );

  const handleEndStream = useCallback(() => {
    socket.emit("end-stream", { streamId: params.roomId });
    navigate("/dashboard", {
      replace: true,
    });
  }, [socket, params.roomId, navigate]);

  useEffect(() => {
    socket.on("call-accepted", handleCallAccepted);
    socket.on("user-ended-call", handleCallEnded);
    socket.on("add-ice-candidate", handleIncomingICECandidate);

    webRTCPeer.peer.addEventListener("icecandidate", handleICECandidate);
    webRTCPeer.peer.addEventListener("signalingstatechange", () => {
      console.log(webRTCPeer.peer.signalingState);
    });

    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("user-call-ended", handleCallEnded);
      socket.off("add-ice-candidate", handleIncomingICECandidate);

      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
      webRTCPeer.peer.removeEventListener("icecandidate", handleICECandidate);
    };
  }, [
    webRTCPeer,
    handleCallAccepted,
    handleIncomingTracks,
    handleCallEnded,
    handleICECandidate,
    handleIncomingICECandidate,
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

  const handleEndCall = useCallback(
    (userId) => {
      const tracks = localStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });

      setRemoteStream(null);
      setLocalStream(null);
      webRTCPeer.peer.close();
      socket.emit("admin-end-call", { to: selectedUser, from: userInfo.id });
      setCallStarted(false);
      setWebRTCPeer(new NewWebRTCPeer());
      setSelectedUser(null);

      setUsers((users) => {
        const u = users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              handRaised: false,
            };
          }

          return user;
        });
        return u;
      });

      setRecentInteractions((interactions) => {
        const recentInteraction = users.find((user) => user.id === userId);
        recentInteraction.handRaised = false;
        return [recentInteraction, ...interactions];
      });
    },
    [webRTCPeer, selectedUser, localStream, socket, userInfo.id, users]
  );

  return (
    <>
      <header>
        <div className="flex items-center justify-between m-4">
          <Link className="button text-primary" to="/dashboard">
            Dashboard
          </Link>
          
          <button
            onClick={handleEndStream}
            className="button bg-red-800 hover:bg-red-800"
          >
            End Stream
          </button>
        </div>
      </header>
      {users.length === 0 ? (
        <p className="text-center">No user joined</p>
      ) : (
        <div className="w-full flex justify-center items-center flex-col">
          <h2 className="text-center font-bold text-lg">Raised hand</h2>
          {users.map((user, i) => {
            if (user.handRaised) {
              return (
                <div
                  key={user.id + i}
                  className="flex items-center justify-center"
                >
                  <button
                    onClick={() => handleCallAudience(user.id)}
                    className="button text-primary"
                    key={user.id}
                    disabled={selectedUser !== null}
                  >
                    <p>{user.name} </p>
                  </button>
                  {selectedUser === user.id && callStarted && (
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
                        onClick={() => {
                          handleEndCall(user.id);
                        }}
                        className="media-button bg-red-700 hover:bg-red-500 rounded-full"
                      >
                        <X />
                      </button>
                    </>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      )}
      {recentInteractions.length > 0 && 
        <div className='w-full flex justify-center items-center flex-col'>
          <h2 className="text-center font-bold text-lg">Recent Interactions</h2>
          {recentInteractions.map((user, i) => {
            if (!user.handRaised) {
              return (
                <div key={user.id + i}>
                  <p>{user.name} </p>
                </div>
              );
            }

            return null;
          })}
        </div>
      }
      {selectedUser && <></>}
      {localStream && <MediaPlayer muted={true} url={localStream} />}
      {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
      {callStarted && callStatus && createPortal(<div className="relative h-dvh w-full">
        <strong className='absolute bottom-0 left-0 m-4 p-2 bg-white shadow-md shadow-black rounded-md'>{callStatus}</strong>,
      </div> , document.getElementById('call-status'))}
    </>
  );
}
