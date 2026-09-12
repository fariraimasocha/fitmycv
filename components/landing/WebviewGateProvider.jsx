"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import WebviewGateModal from "@/components/landing/WebviewGateModal";
import { shouldBlockLinkedInAuth } from "@/lib/webview";

const WebviewGateContext = createContext(null);

export function WebviewGateProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      shouldBlockLinkedInAuth(navigator.userAgent, document.referrer)
    ) {
      setOpen(true);
    }
  }, []);

  const interceptAuth = useCallback((event) => {
    if (!shouldBlockLinkedInAuth(navigator.userAgent, document.referrer)) {
      return false;
    }
    event?.preventDefault();
    setOpen(true);
    return true;
  }, []);

  const continueToAuth = useCallback(() => {
    setOpen(false);
    router.push("/auth");
  }, [router]);

  return (
    <WebviewGateContext.Provider value={{ interceptAuth, setOpen }}>
      {children}
      <WebviewGateModal
        open={open}
        onClose={continueToAuth}
        fullScreen
      />
    </WebviewGateContext.Provider>
  );
}

export function useWebviewGate() {
  return useContext(WebviewGateContext);
}
