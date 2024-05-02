import { Link, useParams } from "react-router-dom";
import LiveStream from "../../components/live-stream/LiveStream";
import LiveChat from "../../components/live-stream/LiveChat";
import Header from "../../components/layout/Header";
import { Copy, DoorOpen } from "lucide-react";
import LinkCopyButton from '../../components/ui/LinkCopyButton';

export default function PrivateStream() {
  const { roomId } = useParams();
  const [userId, streamId] = roomId.split(":");

  const streamLink = `${import.meta.env.VITE_CLIENT_URL
    }/main-stream/${userId}:${streamId}`;



  return (
    <div className="bg-main">
      <Header />
      <div className="live-stream-container">
        <div className="live-video-container">
          <LiveStream streamId={streamId} />
          <div className="live-video__controls-container">
            <LinkCopyButton streamLink={streamLink} type="media-button" />
            <Link
              className="media-button flex items-center text-primary gap-3 bg-[#272727] hover:bg-[#767676]"
              to={`/admin-rah/${userId}:${streamId}`}
            >
              <span className='text-2xl'>Speak To Audience</span>
              <span
                className={`flex justify-center items-center p-1 rounded-full`}
              >
                <DoorOpen className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]" />
              </span>
            </Link>
          </div>
        </div>

        <LiveChat streamId={streamId} />
      </div>
    </div>
  );
}

// @apply flex text - white py - 1 px - 3 md: py - 2 md: px - 4 rounded - full transition - colors duration - 300 ease -in -out bg - [#272727] hover: bg - [#767676];
