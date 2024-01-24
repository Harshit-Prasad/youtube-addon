import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

import userRoute from "./routes/user.route.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

// CORS
const whiteList = ["http://localhost:5173"];
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
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

app.use("/api/user", userRoute);

// Routes

// Error

server.listen(PORT, function () {
  console.log("Server Started on PORT: " + PORT);
});

// Socket io event emmitters

io.on("connection", (socket) => {
  socket.on("user-connected", ({ userInfo, adminId, streamId }) => {
    socket.join(userInfo.id);
    socket.join(streamId);
    io.to(adminId).emit("user-connected", userInfo);
    console.log("user connected");
  });

  socket.on("user-disconnected", ({ id, adminId, streamId }) => {
    console.log(id);
    socket.leave(id);
    socket.leave(streamId);
    io.to(adminId).emit("user-disconnected", { id });
  });

  socket.on("admin-connected", ({ id, streamId }) => {
    socket.join(id);
    socket.join(streamId);
    socket.broadcast.to(streamId).emit("admin-connected");
    console.log("admin connected");
  });

  socket.on("admin-disconnected", ({ id, streamId }) => {
    socket.leave(id);
    socket.leave(streamId);
    socket.broadcast.to(streamId).emit("admin-disconnected");
  });
});
