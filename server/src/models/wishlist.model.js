import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema(
  {
    fullName: String,
    channelLink: String,
    email: {
      type: String,
      unique: true,
    },
    contactNo: String,
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;