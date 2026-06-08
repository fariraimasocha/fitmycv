"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import posthog from "posthog-js";

// posthog is initialized once in instrumentation-client.js; here we just expose
// the client through context so hooks like usePostHog / useFeatureFlagEnabled work.
export default function PostHogProvider({ children }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
