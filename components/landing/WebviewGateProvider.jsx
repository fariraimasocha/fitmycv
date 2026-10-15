"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import WebviewGateModal from "@/components/landing/WebviewGateModal";
import { shouldBlockLinkedInAuth } from "@/lib/webview";
import { trackEvent } from "@/lib/analytics";

const WebviewGateContext = createContext(null);

function blocksAuth() {
  try {
    return shouldBlockLinkedInAuth(navigator.userAgent, document.referrer);
  } catch {
    return false;
  }
}

// The gate opens only when someone in an in-app browser tries to sign in.
// It used to open full screen on the first page load, and almost everyone
// from LinkedIn left before seeing the site.
export function WebviewGateProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("/auth");

  const interceptAuth = useCallback((event, href = "/auth") => {
    if (!blocksAuth()) return false;
    event?.preventDefault();
    setPendingUrl(href);
    setOpen(true);
    trackEvent("webview_gate_intercepted", { href });
    return true;
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleContinueWithEmail = useCallback(() => {
    setOpen(false);
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
      />
    </WebviewGateContext.Provider>
  );
}

export function useWebviewGate() {
  return useContext(WebviewGateContext);
}
