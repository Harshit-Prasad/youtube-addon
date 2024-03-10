import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useUserInfoStore } from "../../services/store";
import axios from "../../api/axios";
import WebRTCPeer, { WebRTCPeer as NewWebRTCPeer } from "../../services/webRTC";
import MediaPlayer from "../../components/MediaPlayer";

export default function AdminRAH() {
  const socket = useSocket();
  const params = useParams();
  const navigate = useNavigate();
  const userInfo = useUserInfoStore((state) => state);
  const [users, setUsers] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [callStarted, setCallStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const [webRTCPeer, setWebRTCPeer] = useState(WebRTCPeer);
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const adminConnected = useCallback(() => {
    socket.emit("admin-connected", { userInfo, streamId: params.roomId });
  }, [params.roomId, socket, userInfo]);

  const userConnected = useCallback((userInfo) => {
    setUsers((prev) => [
      {
        id: userInfo.id,
        name: userInfo.name,
        picture: userInfo.picture,
        handRaised: userInfo.handRaised,
      },
      ...prev,
    ]);
  }, []);

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
        console.log(response);
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

  // const sendStream = useCallback((localStream, webRTCPeer) => {
  //   for (const track of localStream.getTracks()) {
  //     webRTCPeer.peer.addTrack(track, localStream);
  //   }
  // }, []);

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

      console.log("offer created", offer.sdp);

      socket.emit("call-peer", { from: userInfo.id, to: userId, offer });

      setCallStarted(true);
    },
    [webRTCPeer, socket, userInfo.id]
  );

  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      console.log(answer.sdp);
      await webRTCPeer.peer.setRemoteDescription(answer);
    },
    [webRTCPeer]
  );

  // const handleNegotiationNeeded = useCallback(async () => {
  //   const offer = await webRTCPeer.getOffer();

  //   console.log("negotiation needed");

  //   socket.emit("nego-needed", {
  //     offer,
  //     to: selectedUser,
  //     from: userInfo.id,
  //   });
  // }, [webRTCPeer, selectedUser, socket, userInfo.id]);

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
      const [stream] = e.streams;

      console.log("tracks received", e);

      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  const handleCallEnded = useCallback(
    ({ from: userId }) => {
      const tracks = localStream?.getTracks();
      tracks?.forEach((track) => {
        track.stop();
      });

      webRTCPeer.peer.close();
      setRemoteStream(null);
      setLocalStream(null);
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
      const recentInteraction = users.find((user) => user.id === userId);
      recentInteraction.handRaised = false;
      setRecentInteractions((interactions) => {
        return [recentInteraction, ...interactions];
      });
    },
    [webRTCPeer, localStream, users]
  );

  const handleIncomingICECandidate = useCallback(
    ({ ic }) => {
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
        console.log("ice candidates sent");
        // setTimeout(() => {
        socket.emit("add-ice-candidate", {
          from: userInfo.id,
          to: selectedUser,
          ic: e.candidate,
        });
        // }, 5000);
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

    // socket.on("nego-incoming", handleNegotiationIncoming);
    // socket.on("nego-final", handleNegotiationFinal);
    // webRTCPeer.peer.addEventListener(
    //   "negotiationneeded",
    //   handleNegotiationNeeded
    //   );
    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("user-call-ended", handleCallEnded);
      socket.off("add-ice-candidate", handleIncomingICECandidate);

      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
      webRTCPeer.peer.removeEventListener("icecandidate", handleICECandidate);
    };
    // socket.off("nego-incoming", handleNegotiationIncoming);
    // socket.off("nego-final", handleNegotiationFinal);
    // webRTCPeer.peer.removeEventListener(
    //   "negotiationneeded",
    //   handleNegotiationNeeded
    // );
  }, [
    webRTCPeer,
    handleCallAccepted,
    handleIncomingTracks,
    handleCallEnded,
    handleICECandidate,
    handleIncomingICECandidate,
    socket,
    // handleNegotiationNeeded,
    // handleNegotiationIncoming,
    // handleNegotiationFinal,
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
        <div className="flex items-center m-4">
          <Link
            className="button bg-slate-800 hover:bg-slate-950"
            to="/dashboard"
          >
            Dashboard
          </Link>
          <div className="flex-grow">
            <h1 className="text-center font-bold text-lg">Raise a hand</h1>
          </div>
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
                <div key={user.id + i}>
                  <button
                    onClick={() => handleCallAudience(user.id)}
                    className="button bg-slate-800 hover:bg-slate-950"
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
                        className="button bg-slate-800 hover:bg-slate-950"
                      >
                        {muted ? "Unmute" : "Mute"}
                      </button>
                      <button
                        onClick={() => {
                          handleEndCall(user.id);
                        }}
                        className="button bg-red-700 hover:bg-red-500"
                      >
                        End Call
                      </button>
                    </>
                  )}
                </div>
              );
            }

            return null;
          })}
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
      )}
      {selectedUser && <></>}
      {localStream && <MediaPlayer muted={true} url={localStream} />}
      {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
    </>
  );
}
