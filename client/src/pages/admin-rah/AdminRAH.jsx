import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useAuthStore } from "../../services/store";
import axios from "axios";
import WebRTCPeer from "../../services/webRTC";
import MediaPlayer from "../../components/MediaPlayer";

export default function AdminRAH() {
  const params = useParams();
  const socket = useSocket();
  const userInfo = useAuthStore((state) => state);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [callStarted, setCallStarted] = useState(false);

  const [webRTCPeer, setWebRTCPeer] = useState(new WebRTCPeer());
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const adminConnected = useCallback(() => {
    socket.emit("admin-connected", { userInfo, streamId: params.idx });
  }, [params.idx, socket, userInfo]);

  const userConnected = useCallback((userInfo) => {
    setUsers((prev) => [
      {
        id: userInfo.id,
        name: userInfo.name,
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
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/audience-list/${params.idx}`
      );

      if (response?.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [params.idx]);

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
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.applyConstraints({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      setLocalStream(stream);
      const offer = await webRTCPeer.getOffer();
      socket.emit("call-peer", { from: userInfo.id, to: userId, offer });
      setCallStarted(true);
    },
    [webRTCPeer, socket, userInfo.id]
  );

  const sendStream = useCallback(() => {
    for (const track of localStream.getTracks()) {
      webRTCPeer.peer.addTrack(track, localStream);
    }
  }, [localStream, webRTCPeer]);

  const handleCallAccepted = useCallback(
    async ({ answer }) => {
      await webRTCPeer.setLocalDescription(answer);
      sendStream();
    },
    [sendStream, webRTCPeer]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await webRTCPeer.getOffer();
    socket.emit("nego-needed", {
      offer,
      to: selectedUser,
      from: userInfo.id,
    });
  }, [webRTCPeer, selectedUser, socket, userInfo.id]);

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await webRTCPeer.getAnswer(offer);
      socket.emit("nego-done", { to: from, answer, from: userInfo.id });
    },
    [webRTCPeer, socket, userInfo.id]
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
      setWebRTCPeer(new WebRTCPeer());
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
    },
    [webRTCPeer, localStream]
  );

  console.log(localStream);

  useEffect(() => {
    socket.on("call-accepted", handleCallAccepted);
    socket.on("nego-incoming", handleNegotiationIncoming);
    socket.on("nego-final", handleNegotiationFinal);
    socket.on("user-ended-call", handleCallEnded);

    webRTCPeer.peer.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded
    );

    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("nego-incoming", handleNegotiationIncoming);
      socket.off("nego-final", handleNegotiationFinal);
      socket.off("user-call-ended", handleCallEnded);

      webRTCPeer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
    };
  }, [
    webRTCPeer,
    handleCallAccepted,
    handleNegotiationNeeded,
    handleNegotiationIncoming,
    handleNegotiationFinal,
    handleIncomingTracks,
    handleCallEnded,
    socket,
  ]);

  // Media Controls

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
      setWebRTCPeer(new WebRTCPeer());
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
    },
    [webRTCPeer, selectedUser, localStream, socket, userInfo.id]
  );

  return (
    <>
      <header>
        <div className="flex items-center m-4">
          <Link className="button bg-slate-800 hover:bg-slate-950" to="/">
            To Home
          </Link>
          <div className="flex-grow">
            <h1 className="text-center font-bold text-lg">Raise a hand</h1>
          </div>
        </div>
      </header>
      {users.length === 0 && <p>No users joined</p>}
      <div className="w-full flex justify-center items-center flex-col">
        <h2 className="text-center font-bold text-lg">Raised hand</h2>
        {users.map((user) => {
          if (user.handRaised) {
            return (
              <div key={user.id}>
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
                    <button className="button bg-slate-800 hover:bg-slate-950">
                      Mute
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
        <h2 className="text-center font-bold text-lg">Live users</h2>
        {users.map((user) => {
          if (!user.handRaised) {
            return (
              <div key={user.id}>
                <p>{user.name} </p>
              </div>
            );
          }

          return null;
        })}
      </div>
      {selectedUser && <></>}
      {localStream && <MediaPlayer muted={true} url={localStream} />}
      {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
    </>
  );
}
