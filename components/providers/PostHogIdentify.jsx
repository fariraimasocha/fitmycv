"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";

// Links the signed-in NextAuth user to their PostHog person, and unlinks on
// sign-out. posthog itself is initialized once in instrumentation-client.js.
export default function PostHogIdentify() {
  const { data: session, status } = useSession();
  const identifiedId = useRef(null);

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;

  useEffect(() => {
    if (status === "loading") return;

    if (userId) {
      // Guard against re-identifying on every session refresh (e.g. when a page
      // calls session.update()) — only fire when the user actually changes.
      if (identifiedId.current !== userId) {
        posthog.identify(userId, { email: userEmail, name: userName });
        identifiedId.current = userId;
      }
    } else if (identifiedId.current !== null) {
      // Was identified, now signed out — reset so events go anonymous again.
      posthog.reset();
      identifiedId.current = null;
    }
  }, [userId, userEmail, userName, status]);

  return null;
}
