"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || "https://app.chatwoot.com";
const WEBSITE_TOKEN =
  process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || "KXAMrRdPE45NvWU2ChRPnvKs";

// The Chatwoot SDK exposes a widget API that throws when its DOM holders are
// not mounted yet (for example during the boot race right after a page load).
// A throw inside these calls would propagate through React and, from a root
// layout component, crash the whole page. Every interaction is therefore
// wrapped: if the widget is not ready, the chatwoot:ready listener retries.
function identifyVisitor(user) {
  if (typeof window === "undefined" || !window.$chatwoot) return;
  try {
    if (!user?.id) {
      window.$chatwoot.reset();
      return;
    }

    window.$chatwoot.setUser(String(user.id), {
      email: user.email ?? "",
      name: user.name ?? "",
      avatar_url: user.image ?? "",
    });
  } catch (error) {
    console.error("Chatwoot identifyVisitor failed:", error);
  }
}

function setBubbleVisibility(hidden) {
  if (typeof window === "undefined" || !window.$chatwoot) return;
  try {
    window.$chatwoot.toggleBubbleVisibility(hidden ? "hide" : "show");
    if (hidden) window.$chatwoot.hideMessageBubble = true;
  } catch (error) {
    console.error("Chatwoot toggleBubbleVisibility failed:", error);
  }
}

export default function ChatwootWidget() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const userImage = session?.user?.image;
  const hideWidget = pathname?.startsWith("/print");

  useEffect(() => {
    if (!WEBSITE_TOKEN || hideWidget) return;
    // Guard against React StrictMode double-mounting in dev, which would
    // otherwise append two SDK scripts and boot the widget twice.
    if (window.__fitmycvChatwootBooted) return;
    window.__fitmycvChatwootBooted = true;

    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "en",
      type: "standard",
    };

    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      try {
        window.chatwootSDK?.run({
          websiteToken: WEBSITE_TOKEN,
          baseUrl: BASE_URL,
        });
      } catch (error) {
        console.error("Chatwoot failed to start:", error);
      }
    };
    document.body.appendChild(script);
  }, [hideWidget]);

  useEffect(() => {
    if (!WEBSITE_TOKEN) return;

    const user = userId
      ? { id: userId, email: userEmail, name: userName, image: userImage }
      : null;

    const apply = () => {
      if (!window.$chatwoot) return;
      setBubbleVisibility(hideWidget);
      if (!hideWidget) identifyVisitor(user);
    };

    apply();

    const onReady = () => apply();
    window.addEventListener("chatwoot:ready", onReady);
    return () => window.removeEventListener("chatwoot:ready", onReady);
  }, [hideWidget, userId, userEmail, userName, userImage]);

  return null;
}