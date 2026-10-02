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
// same JSON the API routes send.
const asJson = (value) => JSON.parse(JSON.stringify(value));

// One server render with one DB connection, instead of four API calls from
// the browser after a spinner. Keys and shapes match DashboardHome's queries.
export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
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
      queryClient.setQueryData(["reference-cv"], asJson(referenceCV ?? null));
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
