"use client";

import Loader from "@/components/Loader";

// Shows on every dashboard click while the server renders the next page.
export default function DashboardLoading() {
  return <Loader fullPage={false} className="min-h-75" />;
}
