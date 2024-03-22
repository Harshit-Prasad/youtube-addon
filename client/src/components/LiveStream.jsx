import React from "react";

export default function LiveStream({ streamId }) {
  return (
    <div className="aspect-video max-w-[800px] mx-auto my-2">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${streamId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen="false"
      ></iframe>
    </div>
  );
}
