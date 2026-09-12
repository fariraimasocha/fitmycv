import { getServerPricing } from "@/lib/server-pricing";

export async function GET() {
  const { tier, country, pricing } = await getServerPricing();
  return Response.json({ tier, country, pricing });
}
