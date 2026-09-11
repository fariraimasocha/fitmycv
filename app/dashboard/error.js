"use client";

import { useEffect } from "react";
import Link from "next/link";

// Renders inside DashboardShell, so the sidebar and header stay put and the
// reader keeps their place. app/error.js would replace the whole shell.
export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-16 text-center">
      <p className="font-outfit text-sm font-bold uppercase tracking-widest text-muted-foreground">
        Error
      </p>
      <h1 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        This page didn&apos;t load
      </h1>
      <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
        Your CVs and cover letters are safe. Try again, or go back to your
        dashboard home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex rounded-lg bg-foreground px-5 py-2.5 font-sans text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg border border-[var(--landing-line)] bg-[var(--landing-surface)] px-5 py-2.5 font-sans text-sm font-semibold text-foreground transition-colors hover:border-foreground/20"
        >
          Go to dashboard home
        </Link>
      </div>
    </div>
  );
}
