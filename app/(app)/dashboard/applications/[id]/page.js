import { redirect } from "next/navigation";

// Applications open in a detail sheet on the tracker now, as in Reactive
// Resume. Old links to /dashboard/applications/:id land on that sheet.
export default async function ApplicationRedirect({ params }) {
  const { id } = await params;
  redirect(`/dashboard/applications?applicationId=${encodeURIComponent(id)}`);
}
