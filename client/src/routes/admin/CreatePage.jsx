import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUserInfoStore, useStreamsStore } from "../../services/store";
import useProtectedRoutes from "../../hooks/useProtectedRoutes";

export default function CreatePage() {
  const [videoLink, setVideoLink] = useState("");
  const [getStreamsLoading, setGetStreamsLoading] = useState(false);
  const navigate = useNavigate();
  const { addNewStreams } = useStreamsStore((state) => state);
  const userInfo = useUserInfoStore((state) => state);
  const axiosProtectedRoute = useProtectedRoutes();

  function handleURLInputChange(e) {
    e.preventDefault();

    setVideoLink(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setGetStreamsLoading(true);
      const url = new URL(videoLink);
      const idFromURLBar = url.searchParams.get("v");
      let streamId;

      if (idFromURLBar) {
        streamId = `${userInfo.id}:${idFromURLBar}`;
      } else {
        const segments = url.pathname.split("/");
        const youtubeStreamId = segments[segments.length - 1];
        streamId = `${userInfo.id}:${youtubeStreamId}`;
      }

      const addedStream = await axiosProtectedRoute.post(`/api/stream/`, {
        url: streamId,
      });

      addNewStreams(addedStream.data);
      navigate(`/private-stream/${streamId}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVideoLink("");
      setGetStreamsLoading(false);
    }
  }

  return (
    <div className="h-dvh flex justify-center items-center landing-page__bg text-white">
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
            className="outline outline-2 text-black py-2 px-4 rounded-lg"
            type="text"
            placeholder="Your Video Link"
            onChange={handleURLInputChange}
          />
        </div>
        <button type="submit" className="button text-black">
          Create new page
        </button>
        {getStreamsLoading && <p className="text-center">Loading...</p>}
      </form>
    </div>
  );
}
