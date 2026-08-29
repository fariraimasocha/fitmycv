"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

export default function StickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--landing-line)] bg-[var(--landing-bg)]/95 p-3 backdrop-blur-md md:hidden">
      <Link href="/auth" className="landing-primary-btn w-full text-sm">
        Get FitMyCV
        <ArrowUpRightIcon size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
