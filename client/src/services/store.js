import { create } from "zustand";

export const useUserInfoStore = create((set) => {
  return {
    id: "",
    name: "",
    role: "",
    picture: "",
    email: "",
    setUserInfo: (authVal) => set(authVal),
    setRole: (role) =>
      set((state) => ({
        ...state,
        role,
      })),
  };
});

export const useStreamsStore = create((set) => ({
  streams: [],
  setStreams: (streams) => set({ streams }),
  addNewStreams: (stream) =>
    set((state) => ({
      streams: [stream, ...state.streams],
    })),
  removeStream: (streamID) =>
    set((state) => {
      const removedStream = state.streams.find((s) => s._id === streamID);

      removedStream.ended = true;

      return state;
    }),
}));
