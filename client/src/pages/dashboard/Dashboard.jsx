import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUpcomingStreamsStore } from "../../services/store";

export default function Dashboard() {
  const { upcomingStreams, removeStream } = useUpcomingStreamsStore(
    (state) => state
  );
  const navigate = useNavigate();

  return (
    <main className="h-dvh flex flex-col items-center gap-3 p-5">
      <div>
        <Link className="button" to="/create-page">
          Create a new Page
        </Link>
      </div>

      <div>
        <h2 className="text-2xl py-5">Upcoming Streams</h2>
        {upcomingStreams.length === 0 && (
          <p className="text-center">No upcoming streams</p>
        )}
        {upcomingStreams.length > 0 && (
          <div>
            {upcomingStreams.map((upcomingStream) => {
              return (
                <div
                  className="flex justify-evenly gap-5"
                  key={upcomingStream.id}
                >
                  <h3 className="font-bold text-slate-800">
                    {upcomingStream.id}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      className="button"
                      onClick={() => {
                        navigate(`/admin-rah/${upcomingStream.id}`);
                      }}
                    >
                      RHA
                    </button>
                    <Link
                      className="button"
                      to={`/private-stream/${upcomingStream.id}`}
                    >
                      Go to create page
                    </Link>
                    <button
                      className="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeStream(upcomingStream.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}