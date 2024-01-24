import { create } from "zustand";

export const useAuthStore = create((set) => {
  const userInfoString = localStorage.getItem("user-info") || "";
  let userInfo;

  if (userInfoString) {
    userInfo = JSON.parse(userInfoString);
  }

  return {
    id: userInfo?.id || "",
    name: userInfo?.name || "",
    role: userInfo?.role || "",
    bgColor: userInfo?.bgColor || "",
    authorized: userInfo?.authorized || false,
  };
});

export const useUpcomingStreamsStore = create((set) => ({
  upcomingStreams: [],
  addNewUpcomingStreams: (upcomingStream) =>
    set((state) => ({
      upcomingStreams: [upcomingStream, ...state.upcomingStreams],
    })),
  removeStream: (streamID) =>
    set((state) => ({
      upcomingStreams: state.upcomingStreams.filter(
        (stream) => stream.id !== streamID
      ),
    })),
}));
