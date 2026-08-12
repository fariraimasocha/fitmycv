"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const ONBOARDING_PATH = "/dashboard/onboarding";

export default function OnboardingGuard({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isInitialLoad = status === "loading" && !session;
  const needsOnboarding =
    status === "authenticated" &&
    session?.user?.onboardingCompleted === false &&
    pathname !== ONBOARDING_PATH;

  useEffect(() => {
    if (needsOnboarding) {
      router.replace(ONBOARDING_PATH);
    }
  }, [needsOnboarding, router]);

  if (isInitialLoad) {
    return <Loader />;
  }

  if (needsOnboarding) {
    return <Loader />;
  }

  return children;
}
