import React from "react";

export default function LiveStream({ streamId }) {
  return (
    <div className="aspect-video md:aspect-auto w-full md:mb-4 flex-1 relative">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${streamId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
      <div className="absolute bottom-0 top-[80%] right-0 w-[15%] sm:hidden"></div>
    </div>
  );
}
