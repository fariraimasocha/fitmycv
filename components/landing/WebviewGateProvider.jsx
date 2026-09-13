"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import WebviewGateModal from "@/components/landing/WebviewGateModal";
import { shouldBlockLinkedInAuth } from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";

const WebviewGateContext = createContext(null);

export function WebviewGateProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("/auth");
  const [initialAutoShown, setInitialAutoShown] = useState(false);

  // Auto-show only once per session and not on the /auth page itself,
  // which already has its own in-app warning. Normal Chrome/Safari with a
  // linkedin.com referrer is not considered in-app (shouldBlock returns false).
  useEffect(() => {
    if (pathname === "/auth") return;
    if (typeof navigator === "undefined") return;
    let shouldBlock = false;
    try {
      shouldBlock = shouldBlockLinkedInAuth(navigator.userAgent, document.referrer);
    } catch {
      shouldBlock = false;
    }
    if (!shouldBlock) return;

    let hasSeen = false;
    try {
      hasSeen = sessionStorage.getItem("webview-gate-seen") === "1";
    } catch {
      hasSeen = false;
    }
    if (hasSeen) return;

    setPendingUrl("/auth");
    setOpen(true);
    setInitialAutoShown(true);
    trackEvent("webview_gate_auto_shown", { pathname });
  }, [pathname]);

  const interceptAuth = useCallback(
    (event, href = "/auth") => {
      let shouldBlock = false;
      try {
        shouldBlock = shouldBlockLinkedInAuth(navigator.userAgent, document.referrer);
      } catch {
        shouldBlock = false;
      }
      if (!shouldBlock) return false;
      event?.preventDefault();
      setPendingUrl(href);
      setOpen(true);
      setInitialAutoShown(false);
      trackEvent("webview_gate_intercepted", { href });
      return true;
    },
    []
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem("webview-gate-seen", "1");
    } catch {}
  }, []);

  const handleContinueWithEmail = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem("webview-gate-seen", "1");
    } catch {}
    router.push(pendingUrl);
  }, [router, pendingUrl]);

  const targetUrl =
    typeof window !== "undefined" ? `${window.location.origin}${pendingUrl}` : pendingUrl;

  return (
    <WebviewGateContext.Provider value={{ interceptAuth, setOpen, open, pendingUrl }}>
      {children}
      <WebviewGateModal
        open={open}
        onClose={handleClose}
        onContinueWithEmail={handleContinueWithEmail}
        targetUrl={targetUrl}
        fullScreen={initialAutoShown}
      />
    </WebviewGateContext.Provider>
  );
}

export function useWebviewGate() {
  return useContext(WebviewGateContext);
}
