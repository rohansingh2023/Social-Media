import { create } from "zustand";

interface NotificationPanelState {
  isOn: boolean;
  toggle: () => void;
}

export const useNavigationPanelState = create<NotificationPanelState>()(
  (set) => ({
    isOn: false,
    toggle: () => set((state) => ({ isOn: !state.isOn })),
  })
);
