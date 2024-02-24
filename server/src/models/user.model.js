import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: String,
    picture: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
