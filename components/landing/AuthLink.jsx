"use client";

import { Link } from "@/i18n/navigation";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";

export default function AuthLink({ href = "/auth", onClick, ...props }) {
  const gate = useWebviewGate();

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (href.startsWith("/auth") && gate?.interceptAuth(event, href)) return;
        onClick?.(event);
      }}
      {...props}
    />
  );
}
