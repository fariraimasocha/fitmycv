"use client";

import { useEffect, useRef } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import posthog from "posthog-js";

function PostHogIdentity() {
  const { data: session, status } = useSession();
  const identifiedUserId = useRef(null);
  const user = session?.user;

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    if (status !== "authenticated" || !user?.id) {
      if (status === "unauthenticated" && identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    if (identifiedUserId.current === user.id) return;

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.isPremium ? "premium" : "free",
    });
    identifiedUserId.current = user.id;
  }, [status, user?.email, user?.id, user?.isPremium, user?.name, user?.role]);

  return null;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <PostHogIdentity />
      {children}
    </SessionProvider>
  );
}
