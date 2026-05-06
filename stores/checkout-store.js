import { create } from "zustand";
import { persist } from "zustand/middleware";

const TEN_MINUTES = 10 * 60 * 1000;

export const useCheckoutStore = create(
  persist(
    (set, get) => ({
      pendingCheckout: false,
      pendingCheckoutTimestamp: null,
      pendingCheckoutPlan: null,

      setPendingCheckout: (value, plan = "month") =>
        set({
          pendingCheckout: value,
          pendingCheckoutTimestamp: value ? Date.now() : null,
          pendingCheckoutPlan: value ? plan : null,
        }),

      getPendingCheckout: () => {
        const { pendingCheckout, pendingCheckoutTimestamp } = get();
        if (!pendingCheckout || !pendingCheckoutTimestamp) return false;
        if (Date.now() - pendingCheckoutTimestamp > TEN_MINUTES) {
          set({ pendingCheckout: false, pendingCheckoutTimestamp: null, pendingCheckoutPlan: null });
          return false;
        }
        return true;
      },

      getPendingCheckoutPlan: () => {
        const { pendingCheckout, pendingCheckoutTimestamp, pendingCheckoutPlan } = get();
        if (!pendingCheckout || !pendingCheckoutTimestamp) return null;
        if (Date.now() - pendingCheckoutTimestamp > TEN_MINUTES) {
          set({ pendingCheckout: false, pendingCheckoutTimestamp: null, pendingCheckoutPlan: null });
          return null;
        }
        return pendingCheckoutPlan ?? "month";
      },
    }),
    {
      name: "checkout-store",
    }
  )
);
