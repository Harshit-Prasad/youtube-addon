import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useAuthStore } from "../../services/store";
import toast from "react-hot-toast";

export default function MainStream() {
  const userInfo = useAuthStore((state) => state);
  const params = useParams();
  const socket = useSocket();

  const [adminId, _] = params.idx.split("_");

  const userConnected = useCallback(() => {
    socket.emit("user-connected", {
      userInfo: {
        id: userInfo.id,
        name: userInfo.name,
      },
      adminId,
      streamId: params.idx,
    });
  }, []);

  const userDisconnected = useCallback(() => {
    socket.emit("user-disconnected", {
      id: userInfo.id,
      adminId,
      streamId: params.idx,
    });
  }, []);

  const adminConnected = useCallback(() => {
    toast.success("Admin connected");
  }, []);

  const adminDisconnected = useCallback(() => {
    toast.error("Admin disconnected");
  }, []);

  useEffect(() => {
    socket.on("connect", userConnected);
    socket.on("disconnect", userDisconnected);
    socket.on("admin-connected", adminConnected);
    socket.on("admin-disconnected", adminDisconnected);

    return () => {
      socket.off("connect", userConnected);
      socket.off("disconnect", userDisconnected);
      socket.off("admin-connected", adminConnected);
      socket.off("admin-disconnected", adminDisconnected);
    };
  }, [userConnected, userDisconnected, adminConnected, adminDisconnected]);

  return (
    <>
      <h1>Stream ID: {params.idx}</h1>
      <h1>User ID: {userInfo.id}</h1>
    </>
  );
}
