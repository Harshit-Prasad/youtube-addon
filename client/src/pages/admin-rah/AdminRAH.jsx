import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { useSocket } from "../../providers/SocketProvider";
import { useAuthStore } from "../../services/store";
import axios from "axios";
import webRTCPeer from "../../services/webRTC";

export default function AdminRAH() {
  const params = useParams();
  const socket = useSocket();
  const userInfo = useAuthStore((state) => state);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState(null);

  const adminConnected = useCallback(() => {
    socket.emit("admin-connected", { userInfo, streamId: params.idx });
  }, []);

  const userConnected = useCallback(
    (userInfo) => {
      console.log("-->");
      setUsers((prev) => [
        {
          id: userInfo.id,
          name: userInfo.name,
          handRaised: userInfo.handRaised,
        },
        ...prev,
      ]);
    },
    [users]
  );

  const userDisconnected = useCallback(
    ({ id }) => {
      let disconnectedUserId;
      console.log(users);

      users.forEach((cur, i) => {
        console.log(cur);
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
  }, []);

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
  }, [adminConnected, userConnected, userDisconnected, userHandRaised]);

  useEffect(() => {
    getCurrentAudience();

    return () => {
      socket.disconnect();
    };
  }, []);

  // WebRTC

  const handleCallAudience = useCallback(async (userId) => {
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
  }, []);

  const sendStream = useCallback(() => {
    for (const track of localStream.getTracks()) {
      webRTCPeer.peer.addTrack(track, localStream);
    }
  }, [localStream, webRTCPeer]);

  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      await webRTCPeer.setLocalDescription(answer);
      sendStream();
    },
    [sendStream, webRTCPeer]
  );

  const handleNegotiationNeeded = useCallback(
    async (e) => {
      console.log(e);
      const offer = await webRTCPeer.getOffer();
      socket.emit("nego-needed", {
        offer,
        to: selectedUser,
        from: userInfo.id,
      });
    },
    [webRTCPeer, selectedUser]
  );

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      console.log("nego-incoming-teacher");
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
    socket.on("call-accepted", handleCallAccepted);
    socket.on("nego-incoming", handleNegotiationIncoming);
    socket.on("nego-final", handleNegotiationFinal);

    webRTCPeer.peer.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded
    );

    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("nego-incoming", handleNegotiationIncoming);
      socket.off("nego-final", handleNegotiationFinal);
      webRTCPeer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded,
        handleNegotiationIncoming,
        handleNegotiationFinal
      );
      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
    };
  }, [
    webRTCPeer,
    handleCallAccepted,
    handleNegotiationNeeded,
    handleNegotiationIncoming,
    handleIncomingTracks,
  ]);

  console.log(remoteStream);

  return (
    <>
      <header>
        <div className="flex items-center m-4">
          <Link className="button" to="/">
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
              <button
                onClick={() => handleCallAudience(user.id)}
                className="button"
                key={user.id}
                disabled={selectedUser !== null}
              >
                <p>{user.name} </p>
              </button>
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
      <h1>YOU</h1>
      {localStream && (
        <ReactPlayer
          width={0}
          height={0}
          playing
          muted={false}
          url={localStream}
        ></ReactPlayer>
      )}
      <h1>REMOTE USER</h1>
      {remoteStream && (
        <ReactPlayer
          width={0}
          height={0}
          playing
          muted={false}
          url={remoteStream}
        ></ReactPlayer>
      )}
    </>
  );
}
