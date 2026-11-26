"use client";

import { useSession } from "next-auth/react";
import AuthLink from "@/components/landing/AuthLink";
import { trackEvent } from "@/lib/analytics";

export default function ProductActionLink({ product, children, className = "landing-primary-btn public-hero-cta" }) {
  const { data: session } = useSession();
  const destination = product === "tracker" ? "/dashboard/applications" : "/dashboard/tailor";
  return <AuthLink
    href={session?.user ? destination : `/auth?next=${encodeURIComponent(destination)}`}
    className={className}
    onClick={() => trackEvent("marketing_product_started", { product, signed_in: Boolean(session?.user) })}
  >{children}</AuthLink>;
}
