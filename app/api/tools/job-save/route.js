import { getCloudflareContext } from "@opennextjs/cloudflare";
import { JobPageError, scrapeJobPage } from "@/lib/job-extract";

// Public on purpose: the free job posting saver runs signed out. Every call
// costs an Exa request, so the Workers rate limit binding (JOB_SAVE_LIMITER in
// wrangler.jsonc) caps it per IP across every isolate. No model call: saving a
// posting means keeping its text as written.
// ponytail: add model cleanup only if people complain the saved text is noisy.

const MAX_URL_CHARS = 2000;

async function isRateLimited(request) {
  let limiter;
  try {
    limiter = getCloudflareContext().env?.JOB_SAVE_LIMITER;
  } catch {
    return false; // next dev has no Workers context.
  }
  if (!limiter) return false;
  const key = request.headers.get("cf-connecting-ip") || "unknown";
  const { success } = await limiter.limit({ key });
  return !success;
}

function validUrl(value) {
  if (typeof value !== "string" || !value.trim() || value.length > MAX_URL_CHARS) return null;
  try {
    const url = new URL(value.trim());
    return /^https?:$/.test(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const url = validUrl(body?.url);
  if (!url) {
    return Response.json(
      { error: "Paste the full job link, starting with https://." },
      { status: 400 }
    );
  }

  if (await isRateLimited(request)) {
    return Response.json(
      { error: "You saved a lot of postings in a short time. Wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    const page = await scrapeJobPage(url);
    // Exa returns markdown. Drop heading and bold marks so the PDF reads as text.
    const text = page.text.replace(/^#{1,6}\s+/gm, "").replace(/\*\*/g, "");
    return Response.json({ url: page.url, text });
  } catch (error) {
    // The scraper's own message asks for a pasted description, and this tool
    // has no paste box.
    if (error instanceof JobPageError) {
      return Response.json(
        { error: "We couldn't read that posting. It may have closed, or the site may block us. Open it in your browser and use Print, then Save as PDF." },
        { status: 422 }
      );
    }
    console.error("Job save error:", error);
    return Response.json(
      { error: "We couldn't open that posting. Try again, or open the page and save it from your browser." },
      { status: 500 }
    );
  }
}
