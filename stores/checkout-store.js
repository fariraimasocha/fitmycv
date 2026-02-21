import { create } from "zustand";
import { persist } from "zustand/middleware";

const TEN_MINUTES = 10 * 60 * 1000;

export const useCheckoutStore = create(
  persist(
    (set, get) => ({
      pendingCheckout: false,
      pendingCheckoutTimestamp: null,

      setPendingCheckout: (value) =>
        set({
          pendingCheckout: value,
          pendingCheckoutTimestamp: value ? Date.now() : null,
        }),

      getPendingCheckout: () => {
        const { pendingCheckout, pendingCheckoutTimestamp } = get();
        if (!pendingCheckout || !pendingCheckoutTimestamp) return false;
        if (Date.now() - pendingCheckoutTimestamp > TEN_MINUTES) {
          set({ pendingCheckout: false, pendingCheckoutTimestamp: null });
          return false;
        }
        return true;
      },
    }),
    {
      name: "checkout-store",
    }
  )
);
