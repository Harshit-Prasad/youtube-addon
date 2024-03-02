import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import userStream from "./routes/stream.route.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

// CORS
const whiteList = [process.env.CLIENT_URL];
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const server = createServer(app);

// Socket io init
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true,
  },
});

// Routes
app.use("/api/stream", userStream);
app.use("/api/user", userRoute);

server.listen(PORT, function () {
  console.log("Server Started on PORT: " + PORT);
});

// Socket io event emmitters

const userIDToSocketID = new Map();
const socketIDToUserID = new Map();
const usersInRooms = new Map();
const recentInteractions = new Map();

io.on("connection", (socket) => {
  socket.on("user-connected", ({ userInfo, adminId, streamId }) => {
    userIDToSocketID.set(userInfo.id, socket.id);
    socketIDToUserID.set(socket.id, { ...userInfo, adminId, streamId });

    if (usersInRooms.get(streamId) === undefined) {
      const set = new Set([socket.id]);
      usersInRooms.set(streamId, set);
    } else {
      usersInRooms.get(streamId).add(socket.id);
    }

    socket.join(userInfo.id);
    socket.join(streamId);
    io.to(adminId).emit("user-connected", userInfo);
  });

  socket.on("admin-connected", ({ userInfo, streamId }) => {
    socketIDToUserID.set(socket.id, { ...userInfo, streamId });
    socket.join(userInfo.id);
    socket.join(streamId);
    socket.broadcast.to(streamId).emit("admin-connected");
  });

  socket.on("hand-raised", ({ id, adminId, handRaised }) => {
    const userInfo = socketIDToUserID.get(socket.id);
    userInfo.handRaised = handRaised;
    socketIDToUserID.set(socket.id, userInfo);
    io.to(adminId).emit("hand-raised", { id, handRaised });
  });

  socket.on("disconnect", () => {
    const userInfo = socketIDToUserID.get(socket.id);

    if (userInfo?.role === "admin") {
      socketIDToUserID.delete(socket.id);
      socket.broadcast.to(userInfo.streamId).emit("admin-disconnected");
    }

    if (userInfo?.role === "user") {
      io.to(userInfo.adminId).emit("user-disconnected", { id: userInfo.id });
      usersInRooms.get(userInfo.streamId).delete(socket.id);
      socketIDToUserID.delete(socket.id);
    }
  });

  // WebRTC

  socket.on("call-peer", ({ from, to, offer }) => {
    io.to(to).emit("incoming-call", { from, offer });
  });

  socket.on("call-accepted", ({ answer, to, from }) => {
    io.to(to).emit("call-accepted", { from, answer });
  });

  socket.on("nego-needed", ({ offer, to, from }) => {
    io.to(to).emit("nego-incoming", { from, offer });
  });

  socket.on("nego-done", ({ answer, to, from }) => {
    io.to(to).emit("nego-final", { from, answer });
  });

  socket.on("add-ice-candidate", ({ to, from, ic }) => {
    console.log(to, from, ic);
    io.to(to).emit("add-ice-candidate", { from, ic });
  });

  socket.on("admin-end-call", ({ to, from }) => {
    const userSocketID = userIDToSocketID.get(to);
    const userInfo = socketIDToUserID.get(userSocketID);
    userInfo.handRaised = false;
    socketIDToUserID.set(userSocketID, userInfo);

    const room = recentInteractions.get(userInfo.streamId);

    if (room) {
      recentInteractions.get(userInfo.streamId).unshift(userSocketID);
    } else {
      const room = [];
      room.unshift(userSocketID);
      recentInteractions.set(userInfo.streamId, room);
    }

    io.to(to).emit("admin-ended-call", { from });
  });

  socket.on("user-end-call", ({ to, from }) => {
    const userInfo = socketIDToUserID.get(socket.id);
    userInfo.handRaised = false;
    socketIDToUserID.set(socket.id, userInfo);

    const room = recentInteractions.get(userInfo.streamId);

    if (room) {
      recentInteractions.get(userInfo.streamId).unshift(socket.id);
    } else {
      const room = [];
      room.unshift(socket.id);
      recentInteractions.set(userInfo.streamId, room);
    }

    io.to(to).emit("user-ended-call", { from });
  });
});

app.get("/api/audience-list/:streamId", (req, res) => {
  const streamId = req.params.streamId;
  const streamAudience = usersInRooms.get(streamId);
  const streamRecentInteractions = recentInteractions.get(streamId);
  let audienceList = [];
  let recentInteractionsList = [];

  if (streamAudience) {
    const audience = streamAudience.values();

    for (let cur of audience) {
      const { id, name, handRaised, picture } = socketIDToUserID.get(cur);
      audienceList.push({ id, name, handRaised, picture });
    }
  }

  if (streamRecentInteractions) {
    for (let cur of streamRecentInteractions) {
      const { id, name, handRaised, picture } = socketIDToUserID.get(cur);
      recentInteractionsList.push({ id, name, handRaised, picture });
    }
  }

  return res.json({ audienceList, recentInteractionsList });
});

// Error
app.use(notFound);
app.use(errorHandler);
