import asyncHandler from "express-async-handler";
import Stream from "../models/stream.model.js";

const getAllStreams = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const userStreams = await Stream.find({ adminId: userId.toString() });

  res.send(userStreams);
});

const addStream = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = user._id;

  const streamUrl = req.body.url;
  const newStream = {
    adminId: userId.toString(),
    url: streamUrl,
  };

  const createdStream = await Stream.create(newStream);

  res.send(createdStream);
});

const removeStream = asyncHandler(async (req, res) => {
  const streamId = req.params.streamId;

  const updatedEnded = {
    ended: true,
  };

  const updated = await Stream.updateOne(
    { _id: streamId },
    { $set: updatedEnded }
  );

  res.send(updated);
});

export { getAllStreams, addStream, removeStream };
