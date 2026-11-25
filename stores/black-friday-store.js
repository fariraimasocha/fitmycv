import { create } from "zustand";
import { persist } from "zustand/middleware";

// popupDismissed persists so the first-visit modal never auto-opens again
// after close. popupOpen is session UI only.
export const useBlackFridayStore = create(
  persist(
    (set) => ({
      popupDismissed: false,
      popupOpen: false,

      openPopup: () => set({ popupOpen: true }),

      closePopup: () => set({ popupOpen: false, popupDismissed: true }),
    }),
    {
      name: "black-friday-store",
      partialize: (state) => ({ popupDismissed: state.popupDismissed }),
    },
  ),
);
