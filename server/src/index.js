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

const socketToUserID = new Map();
const usersInRooms = new Map();

io.on("connection", (socket) => {
  socket.on("user-connected", ({ userInfo, adminId, streamId }) => {
    socketToUserID.set(socket.id, { ...userInfo, adminId, streamId });
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
    socketToUserID.set(socket.id, { ...userInfo, streamId });
    socket.join(userInfo.id);
    socket.join(streamId);
    socket.broadcast.to(streamId).emit("admin-connected");
  });

  socket.on("hand-raised", ({ id, adminId, handRaised }) => {
    const userInfo = socketToUserID.get(socket.id);
    userInfo.handRaised = handRaised;
    socketToUserID.set(socket.id, userInfo);
    io.to(adminId).emit("hand-raised", { id, handRaised });
  });

  socket.on("disconnect", () => {
    const userInfo = socketToUserID.get(socket.id);

    if (userInfo?.role === "admin") {
      socketToUserID.delete(socket.id);
      socket.broadcast.to(userInfo.streamId).emit("admin-disconnected");
    }

    if (userInfo?.role === "user") {
      io.to(userInfo.adminId).emit("user-disconnected", { id: userInfo.id });
      usersInRooms.get(userInfo.streamId).delete(socket.id);
      socketToUserID.delete(socket.id);
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

  socket.on("admin-end-call", ({ to, from }) => {
    const userInfo = socketToUserID.get(socket.id);
    userInfo.handRaised = false;
    socketToUserID.set(socket.id, userInfo);

    io.to(to).emit("admin-ended-call", { from });
  });

  socket.on("user-end-call", ({ to, from }) => {
    const userInfo = socketToUserID.get(socket.id);
    userInfo.handRaised = false;
    socketToUserID.set(socket.id, userInfo);

    io.to(to).emit("user-ended-call", { from });
  });
});

app.get("/api/audience-list/:streamId", (req, res) => {
  const streamId = req.params.streamId;
  console.log(streamId);
  const streamAudience = usersInRooms.get(streamId);
  let audienceList = [];

  if (streamAudience) {
    const audience = streamAudience.values();

    for (let cur of audience) {
      const { id, name, handRaised } = socketToUserID.get(cur);
      audienceList.push({ id, name, handRaised });
    }
  }

  return res.json(audienceList);
});

// Error
app.use(notFound);
app.use(errorHandler);
