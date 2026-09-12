"use client";

import Link from "next/link";
import { useWebviewGate } from "@/components/landing/WebviewGateProvider";

export default function AuthLink({ href = "/auth", onClick, ...props }) {
  const gate = useWebviewGate();

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (gate?.interceptAuth(event)) return;
        onClick?.(event);
      }}
      {...props}
    />
  );
}
