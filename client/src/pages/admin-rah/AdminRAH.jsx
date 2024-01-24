import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useAuthStore } from "../../services/store";

export default function AdminRAH() {
  const params = useParams();
  const socket = useSocket();
  const userInfo = useAuthStore((state) => state);
  const [users, setUsers] = useState([]);

  const adminConnected = useCallback(() => {
    socket.emit("admin-connected", { id: userInfo.id, streamId: params.idx });
  }, []);

  const adminDisconnected = useCallback(() => {
    socket.emit("admin-disconnected", {
      id: userInfo.id,
      streamId: params.idx,
    });
  }, []);

  const userConnected = useCallback(({ id, name }) => {
    console.log(id, name);
    setUsers((prev) => [{ id, name }, ...prev]);
  }, []);

  const userDisconnected = useCallback(({ id }) => {
    console.log(id);
  }, []);

  useEffect(() => {
    console.log(socket.connected);

    socket.on("connect", adminConnected);
    socket.on("disconnect", adminDisconnected);
    socket.on("user-connected", userConnected);
    socket.on("user-disconnected", userDisconnected);

    return () => {
      socket.off("connect", adminConnected);
      socket.off("disconnect", adminDisconnected);
      socket.off("user-connected", userConnected);
      socket.off("user-disconnected", userDisconnected);
    };
  }, [adminConnected, adminDisconnected, userDisconnected]);

  return (
    <>
      <h1>AdminRAH</h1>
      <h2>{params.idx}</h2>
      {users.length === 0 && <p>No users joined</p>}
      <div className="w-full flex justify-center items-center flex-col">
        {users.map((user) => {
          return (
            <div key={user.id}>
              <p>Name: {user.name} </p>
              <p>ID: {user.id} </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
