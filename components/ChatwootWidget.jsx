"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL || "https://app.chatwoot.com";
const WEBSITE_TOKEN =
  process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN || "KXAMrRdPE45NvWU2ChRPnvKs";

function identifyVisitor(user) {
  if (typeof window === "undefined" || !window.$chatwoot) return;

  if (!user?.id) {
    window.$chatwoot.reset();
    return;
  }

  window.$chatwoot.setUser(String(user.id), {
    email: user.email ?? "",
    name: user.name ?? "",
    avatar_url: user.image ?? "",
  });
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
    if (!WEBSITE_TOKEN || hideWidget || window.chatwootSDK) return;

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
      window.chatwootSDK.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      });
    };
    document.body.appendChild(script);
  }, [hideWidget]);

  useEffect(() => {
    if (!WEBSITE_TOKEN) return;

    const user = userId
      ? { id: userId, email: userEmail, name: userName, image: userImage }
      : null;

    if (window.$chatwoot) {
      window.$chatwoot.toggleBubbleVisibility(hideWidget ? "hide" : "show");
      if (!hideWidget) identifyVisitor(user);
    }

    const onReady = () => {
      window.$chatwoot?.toggleBubbleVisibility(hideWidget ? "hide" : "show");
      if (!hideWidget) identifyVisitor(user);
    };

    window.addEventListener("chatwoot:ready", onReady);
    return () => window.removeEventListener("chatwoot:ready", onReady);
  }, [hideWidget, userId, userEmail, userName, userImage]);

  return null;
}
