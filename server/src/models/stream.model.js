import mongoose from "mongoose";

const streamsSchema = mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    url: String,
    ended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Stream = mongoose.model("Stream", streamsSchema);

export default Stream;
