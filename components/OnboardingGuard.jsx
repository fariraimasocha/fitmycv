"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const ONBOARDING_PATH = "/dashboard/onboarding";

export default function OnboardingGuard({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [hasJustCompleted, setHasJustCompleted] = useState(false);

  // Read the one-time flag after mount so server and first client render
  // match (avoids hydration mismatch that showed the black "This page
  // couldn't load" error on localhost).
  useEffect(() => {
    try {
      setHasJustCompleted(sessionStorage.getItem("onboardingJustCompleted") === "1");
    } catch {}
  }, []);

  const isInitialLoad = status === "loading" && !session;
  // Allow a just-completed onboarding to navigate to /dashboard/tailor even
  // before the JWT has been refreshed. completeOnboarding sets a one-time
  // sessionStorage flag before router.replace, and we clear it after the
  // navigation settles.
  const needsOnboarding =
    status === "authenticated" &&
    session?.user?.onboardingCompleted === false &&
    pathname !== ONBOARDING_PATH &&
    !hasJustCompleted;

  useEffect(() => {
    if (needsOnboarding) {
      router.replace(ONBOARDING_PATH);
    }
  }, [needsOnboarding, router]);

  useEffect(() => {
    if (hasJustCompleted && status === "authenticated" && session?.user?.onboardingCompleted) {
      try {
        sessionStorage.removeItem("onboardingJustCompleted");
      } catch {}
      setHasJustCompleted(false);
    }
  }, [hasJustCompleted, status, session?.user?.onboardingCompleted]);

  if (isInitialLoad) {
    return <Loader />;
  }

  if (needsOnboarding) {
    return <Loader />;
  }

  return children;
}
