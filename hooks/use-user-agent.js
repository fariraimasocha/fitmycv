import { useSyncExternalStore } from "react";
import { isAndroid, isIOS } from "@/lib/webview";

const subscribe = () => () => {};

/** navigator.userAgent, or "" during SSR and hydration. It never changes. */
export function useUserAgent() {
  return useSyncExternalStore(subscribe, () => navigator.userAgent || "", () => "");
}

export function platformOf(ua) {
  if (!ua) return "unknown";
  if (isAndroid(ua)) return "android";
  if (isIOS(ua)) return "ios";
  return "desktop";
}
