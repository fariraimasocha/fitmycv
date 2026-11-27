import { countLandingStats } from "@/lib/landing-stats";

// Homepage traction numbers. A fresh Workers isolate has no cached counts, so
// the page fetches them here. Cached at the edge for an hour, then served
// stale while it refreshes.
export async function GET() {
  try {
    const stats = await countLandingStats();
    return Response.json(stats, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return Response.json({ users: null, tailored: null, tracked: null }, { status: 503 });
  }
}
