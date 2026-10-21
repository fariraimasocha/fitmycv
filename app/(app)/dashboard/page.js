import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/auth";
import { connectDB } from "@/utils/connect";
import {
  getReferenceCV,
  listApplications,
  listCompanyResearch,
  listTailoredCVs,
} from "@/lib/dashboard-data";
import DashboardHome from "./DashboardHome";

// Mongo documents carry ObjectIds and Dates. The client cache must hold the
// same JSON the API routes send. This serializes, it is not a clone.
// react-doctor-disable-next-line react-doctor/no-json-parse-stringify-clone
const asJson = (value) => JSON.parse(JSON.stringify(value));

// One server render with one DB connection, instead of four API calls from
// the browser after a spinner. Keys and shapes match DashboardHome's queries.
export default async function DashboardPage({ searchParams }) {
  // Sign-up from a pricing page lands here first, then goes on to checkout.
  const { checkout, plan } = await searchParams;
  if (checkout === "pending") {
    redirect(`/api/polar/checkout?plan=${encodeURIComponent(plan ?? "lifetime")}`);
  }

  const session = await auth();
  const userId = session?.user?.id;
  // A server component runs once per request, so a new client per render is
  // the pattern TanStack documents for server prefetching.
  // react-doctor-disable-next-line react-doctor/query-stable-query-client
  const queryClient = new QueryClient();

  if (userId) {
    try {
      await connectDB();
      const isPremium = Boolean(session.user.isPremium);
      const [tailoredCVs, referenceCV, research, applications] = await Promise.all([
        listTailoredCVs(userId),
        getReferenceCV(userId),
        isPremium ? listCompanyResearch(userId) : null,
        isPremium ? listApplications(userId) : null,
      ]);
      queryClient.setQueryData(["tailored-cvs"], asJson(tailoredCVs));
      queryClient.setQueryData(["resume"], asJson(referenceCV ?? null));
      if (isPremium) {
        queryClient.setQueryData(["company-research"], asJson(research));
        queryClient.setQueryData(["applications"], asJson(applications));
      }
    } catch (error) {
      // The client queries fetch whatever is missing.
      console.error("Dashboard prefetch failed:", error);
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardHome />
    </HydrationBoundary>
  );
}
