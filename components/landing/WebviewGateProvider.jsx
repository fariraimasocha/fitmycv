"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import WebviewGateModal from "@/components/landing/WebviewGateModal";
import { shouldBlockLinkedInAuth } from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";

const WebviewGateContext = createContext(null);
const SEEN_KEY = "webview-gate-seen";

function blocksAuth() {
  try {
    return shouldBlockLinkedInAuth(navigator.userAgent, document.referrer);
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
}

// Read on every client render (false on the server), the same way
// OnboardingGuard reads sessionStorage, so no effect has to copy it into state.
function readAutoGate() {
  if (!blocksAuth()) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}
const subscribe = () => () => {};

export function WebviewGateProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [manualOpen, setOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("/auth");
  const [dismissed, setDismissed] = useState(false);

  // Auto-show only once per session and not on the /auth page itself,
  // which already has its own in-app warning. Normal Chrome/Safari with a
  // linkedin.com referrer is not considered in-app (shouldBlock returns false).
  const autoGate = useSyncExternalStore(subscribe, readAutoGate, () => false);
  const autoOpen = autoGate && !dismissed && pathname !== "/auth";
  const open = manualOpen || autoOpen;

  useEffect(() => {
    if (autoOpen) trackEvent("webview_gate_auto_shown", { pathname });
  }, [autoOpen, pathname]);

  const interceptAuth = useCallback((event, href = "/auth") => {
    if (!blocksAuth()) return false;
    event?.preventDefault();
    setPendingUrl(href);
    setOpen(true);
    trackEvent("webview_gate_intercepted", { href });
    return true;
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setDismissed(true);
    markSeen();
  }, []);

  const handleContinueWithEmail = useCallback(() => {
    setOpen(false);
    setDismissed(true);
    markSeen();
    router.push(manualOpen ? pendingUrl : "/auth");
  }, [router, manualOpen, pendingUrl]);

  const target = manualOpen ? pendingUrl : "/auth";
  const targetUrl =
    typeof window !== "undefined" ? `${window.location.origin}${target}` : target;

  return (
    <WebviewGateContext.Provider value={{ interceptAuth, setOpen, open, pendingUrl: target }}>
      {children}
      <WebviewGateModal
        open={open}
        onClose={handleClose}
        onContinueWithEmail={handleContinueWithEmail}
        targetUrl={targetUrl}
        fullScreen={autoOpen && !manualOpen}
      />
    </WebviewGateContext.Provider>
  );
}

export function useWebviewGate() {
  return useContext(WebviewGateContext);
}
