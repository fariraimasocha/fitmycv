"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const ONBOARDING_PATH = "/dashboard/onboarding";
const JUST_COMPLETED_KEY = "onboardingJustCompleted";

// Nothing in this tab mutates the flag behind our back, so there is no change
// to subscribe to. The snapshot is re-read on every render, which is what
// makes the value current after a navigation.
const subscribe = () => () => {};

function readJustCompleted() {
  try {
    return sessionStorage.getItem(JUST_COMPLETED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function OnboardingGuard({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // sessionStorage has no server equivalent, so it cannot be read during
  // render directly (that was a hydration mismatch, seen as the black "This
  // page couldn't load" error on localhost). useSyncExternalStore reads it
  // safely: false during SSR and hydration, the real value on every client
  // render after that.
  //
  // Reading it per render also fixes the bounce. This guard lives in the
  // dashboard layout and stays mounted across the onboarding to tailor hop,
  // so the previous mount-only read ran long before completeOnboarding wrote
  // the flag and never saw it. Users who had just finished onboarding were
  // sent back to step 1 and made to upload their CV a second time.
  const justCompleted = useSyncExternalStore(
    subscribe,
    readJustCompleted,
    () => false,
  );

  const isInitialLoad = status === "loading" && !session;
  // Allow a just-completed onboarding through even though the JWT has not
  // refreshed yet. completeOnboarding sets the flag before router.replace.
  const needsOnboarding =
    status === "authenticated" &&
    session?.user?.onboardingCompleted === false &&
    pathname !== ONBOARDING_PATH &&
    !justCompleted;

  useEffect(() => {
    if (needsOnboarding) {
      router.replace(ONBOARDING_PATH);
    }
  }, [needsOnboarding, router]);

  // Once the refreshed JWT carries the completed state the flag has done its
  // job. Drop it so a later session in the same tab is guarded normally.
  useEffect(() => {
    if (status === "authenticated" && session?.user?.onboardingCompleted) {
      try {
        sessionStorage.removeItem(JUST_COMPLETED_KEY);
      } catch {}
    }
  }, [status, session?.user?.onboardingCompleted]);

  if (isInitialLoad || needsOnboarding) {
    return <Loader />;
  }

  return children;
}
