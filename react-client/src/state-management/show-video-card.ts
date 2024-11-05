import { create } from "zustand";

interface ShowVideoCardState {
  showVideoChatCard: boolean;
  setShowVideoChatCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useVideoCardState = create<ShowVideoCardState>()((set) => ({
  showVideoChatCard: false,
  setShowVideoChatCard: () =>
    set((state) => ({ showVideoChatCard: !state.showVideoChatCard })),
}));
