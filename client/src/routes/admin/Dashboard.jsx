import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStreamsStore } from "../../services/store";
import useProtectedRoutes from "../../hooks/useProtectedRoutes";

export default function Dashboard() {
  const { streams, removeStream, setStreams } = useStreamsStore(
    (state) => state
  );
  const axiosProtectedRoute = useProtectedRoutes();
  const [getStreamLoading, setGetStreamLoading] = useState(true);
  const [deleteStreamLoading, setDeleteStreamLoading] = useState(false);

  useEffect(() => {
    try {
      (async () => {
        const streams = await axiosProtectedRoute.get("/api/stream/");

        setStreams(streams.data);
        setGetStreamLoading(false);
      })();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const upcomingStreams = streams.filter((stream) => !stream.ended);
  const endedStreams = streams.filter((stream) => stream.ended);

  return (
    <main className="h-dvh flex flex-col items-center gap-3 p-5">
      <div className="w-full  flex justify-between">
        <Link className="button text-primary" to="/">
          To Home
        </Link>
        <Link className="button text-primary" to="/settings">
          Settings
        </Link>
      </div>

      <div>
        <Link className="button text-primary" to="/create-page">
          Create a new Page
        </Link>
      </div>
      <h2 className="text-2xl py-5">Upcoming Streams</h2>
      {upcomingStreams.length === 0 && !getStreamLoading && (
        <p className="text-center">No upcoming streams</p>
      )}

      {getStreamLoading && <p>Loading...</p>}

      {upcomingStreams.length > 0 && (
        <div>
          {upcomingStreams.map((upcomingStream) => {
            if (!upcomingStream.ended) {
              return (
                <div
                  className="flex justify-evenly gap-5 mt-1"
                  key={upcomingStream._id}
                >
                  <h3 className="font-bold text-slate-800">
                    {upcomingStream.url}
                  </h3>
                  <div className="flex gap-2">
                    <Link
                      className="button text-primary"
                      to={`/admin-rah/${upcomingStream.url}`}
                    >
                      RHA
                    </Link>
                    <Link
                      className="button text-primary"
                      to={`/private-stream/${upcomingStream.url}`}
                    >
                      Go to create page
                    </Link>
                    <button
                      disabled={deleteStreamLoading}
                      className="button text-primary"
                      onClick={async () => {
                        try {
                          setDeleteStreamLoading(true);
                          const itemRemoved = await axiosProtectedRoute.patch(
                            `/api/stream/${upcomingStream._id}`
                          );

                          removeStream(upcomingStream._id);
                        } catch (error) {
                          console.log(error.message);
                        } finally {
                          setDeleteStreamLoading(false);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            }
            return <></>;
          })}
        </div>
      )}

      <h2 className="text-2xl py-5">History</h2>
      {endedStreams.length === 0 && !getStreamLoading && (
        <p className="text-center">Empty History</p>
      )}
      {endedStreams.length > 0 && (
        <div>
          {endedStreams.map((endedStream) => {
            return (
              <div className="flex justify-evenly gap-5" key={endedStream._id}>
                {endedStream._id}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
