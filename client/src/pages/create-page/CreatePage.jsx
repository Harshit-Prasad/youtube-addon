import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useUpcomingStreamsStore } from "../../services/store";

export default function CreatePage() {
  const [videoLink, setVideoLink] = useState("");
  const navigate = useNavigate();
  const { addNewUpcomingStreams } = useUpcomingStreamsStore((state) => state);
  const userInfo = useAuthStore((state) => state);

  function handleURLInputChange(e) {
    e.preventDefault();

    setVideoLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    try {
      const url = new URL(videoLink);
      const searchParam = url.searchParams.get("v");
      const idx = `${userInfo.id}_${searchParam}`;
      addNewUpcomingStreams({ id: idx });
      navigate(`/private-stream/${idx}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVideoLink("");
    }
  }

  return (
    <div className="h-dvh flex justify-center items-center bg-slate-300">
      <form
        className="w-[400px] p-5 flex flex-col justify-between items-center gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-3 items-center">
          <label className="font-bold" htmlFor="video-link">
            Video Link
          </label>
          <input
            id="video-link"
            className="outline outline-2 outline-slate-950 py-2 px-4 rounded-lg"
            type="text"
            placeholder="Your Video Link"
            onChange={handleURLInputChange}
          />
        </div>

        <button type="submit" className="button">
          Create new page
        </button>
      </form>
    </div>
  );
}
