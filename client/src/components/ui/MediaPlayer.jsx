import React from "react";
import ReactPlayer from "react-player";

export default function MediaPlayer({ muted, url }) {
  return (
    <ReactPlayer
      width={0}
      height={0}
      muted={muted}
      playing
      url={url}
    ></ReactPlayer>
  );
}
