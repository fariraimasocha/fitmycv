"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BlackFridayBanner from "@/components/black-friday/BlackFridayBanner";
import BlackFridayPopup from "@/components/black-friday/BlackFridayPopup";
import { useBlackFridayStore } from "@/stores/black-friday-store";
import { isBlackFridayActive } from "@/lib/black-friday";

// Ceiling-breaker notes for this promo:
// Success = user unlocks Lifetime and leaves to apply. Celebrate the exit.
// First step: one popup CTA (copy code). Banner is the persistent reminder.
// What happened: toast on copy. Can take back: dismiss once, never auto again.
// Next step: pricing with code ready. Countdown is real end time, not fake urgency.
// No invent social proof. Hide for premium. Hide after sale ends.
export default function BlackFridayPromo({ children }) {
  const { data: session } = useSession();
  const popupDismissed = useBlackFridayStore((s) => s.popupDismissed);
  const openPopup = useBlackFridayStore((s) => s.openPopup);
  const [storeReady, setStoreReady] = useState(false);
  const [active, setActive] = useState(() => isBlackFridayActive());

  useEffect(() => {
    setActive(isBlackFridayActive());
  }, []);

  useEffect(() => {
    const finish = () => setStoreReady(true);
    if (useBlackFridayStore.persist.hasHydrated()) {
      finish();
      return undefined;
    }
    return useBlackFridayStore.persist.onFinishHydration(finish);
  }, []);

  useEffect(() => {
    if (!storeReady || !active) return undefined;
    if (session?.user?.isPremium) return undefined;
    if (popupDismissed) return undefined;

    const id = setTimeout(() => openPopup(), 700);
    return () => clearTimeout(id);
  }, [storeReady, active, session?.user?.isPremium, popupDismissed, openPopup]);

  const showChrome = active && !session?.user?.isPremium;

  return (
    <>
      {showChrome ? <BlackFridayBanner /> : null}
      {children}
      {showChrome ? <BlackFridayPopup /> : null}
    </>
  );
}
