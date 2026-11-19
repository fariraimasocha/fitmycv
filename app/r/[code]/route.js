import { NextResponse } from "next/server";
import { connectDB } from "@/utils/connect";
import Creator from "@/models/Creator";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

// Share link for a creator. Counts every click, counts a visitor once per
// browser (first touch wins for 30 days), then sends them to the home page.
export async function GET(request, { params }) {
  const { code } = await params;
  const url = new URL("/", request.url);
  for (const [key, value] of request.nextUrl.searchParams) {
    if (key.startsWith("utm_")) url.searchParams.set(key, value);
  }
  const res = NextResponse.redirect(url, 302);

  try {
    await connectDB();
    const hasRef = Boolean(request.cookies.get("ref")?.value);
    const creator = await Creator.findOneAndUpdate(
      { code: String(code).toLowerCase() },
      { $inc: { clicks: 1, visitors: hasRef ? 0 : 1 } },
      { projection: { code: 1 } },
    );
    if (creator && !hasRef) {
      res.cookies.set("ref", creator.code, {
        maxAge: THIRTY_DAYS,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }
  } catch (error) {
    // A tracking failure must never block the visitor.
    console.error("Ref click failed:", error);
  }
  return res;
}
