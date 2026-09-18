// Scrapes a job posting page to plain text with Exa.ai. Shared by the job link
// flow (/api/job/extract) and the CV agent's fetch_job_posting tool.

/** A scrape failure with a message that is safe to show the user. */
export class JobPageError extends Error {}

// Same job page? Compare host (minus www/regional prefix) + path + job key.
function isSamePage(requested, candidate) {
  if (!candidate) return false;
  try {
    const a = new URL(requested);
    const b = new URL(candidate);
    const domain = (h) => h.split(".").slice(-2).join(".");
    if (domain(a.hostname) !== domain(b.hostname)) return false;
    if (a.pathname.replace(/\/$/, "") !== b.pathname.replace(/\/$/, "")) return false;
    const key = (u) => u.searchParams.get("jk") || u.searchParams.get("jl") || "";
    return key(a) === key(b);
  } catch {
    return false;
  }
}

/** Rewrites known job board URLs to the canonical page Exa can crawl. */
export function normalizeJobUrl(input) {
  let url = input;

  // Transform any LinkedIn URL with currentJobId to a direct public job view URL
  if (url.includes("linkedin.com") && url.includes("currentJobId=")) {
    const match = url.match(/currentJobId=(\d+)/);
    if (match) {
      url = `https://www.linkedin.com/jobs/view/${match[1]}/`;
      console.log("[job-extract] Transformed LinkedIn search URL to:", url);
    }
  }

  // Normalize any Indeed URL to canonical viewjob?jk=VALUE form, keeping the
  // regional host (uk.indeed.com etc). A job key is not valid on www
  if (url.includes("indeed.com")) {
    // jk= appears in viewjob URLs; vjk= appears in search result URLs. Both are the same job key
    const jkMatch = url.match(/[?&]jk=([a-zA-Z0-9]+)/) || url.match(/[?&]vjk=([a-zA-Z0-9]+)/);
    if (jkMatch) {
      let host = "www.indeed.com";
      try {
        host = new URL(url).hostname;
      } catch {}
      url = `https://${host}/viewjob?jk=${jkMatch[1]}`;
      console.log("[job-extract] Normalized Indeed URL to:", url);
    }
  }

  // Glassdoor: keep only the jl= (job listing ID) param, strip all tracking noise
  if (url.includes("glassdoor.com")) {
    try {
      const urlObj = new URL(url);
      const jl = urlObj.searchParams.get("jl");
      urlObj.search = jl ? `?jl=${jl}` : "";
      url = urlObj.toString();
      console.log("[job-extract] Normalized Glassdoor URL to:", url);
    } catch {}
  }

  // Lever: strip /apply suffix and lever-* tracking params
  if (url.includes("jobs.lever.co")) {
    url = url.replace(/\/apply(\?.*)?$/, "");
    try {
      const urlObj = new URL(url);
      for (const key of [...urlObj.searchParams.keys()]) {
        if (key.startsWith("lever-")) urlObj.searchParams.delete(key);
      }
      url = urlObj.toString().replace(/\?$/, "");
      console.log("[job-extract] Normalized Lever URL to:", url);
    } catch {}
  }

  // Greenhouse: job-boards.greenhouse.io → boards.greenhouse.io (canonical domain)
  if (url.includes("greenhouse.io")) {
    url = url.replace("job-boards.greenhouse.io", "boards.greenhouse.io");
    console.log("[job-extract] Normalized Greenhouse URL to:", url);
  }

  // Workday: strip source= tracking param
  if (url.includes("myworkdayjobs.com")) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.delete("source");
      url = urlObj.toString().replace(/\?$/, "");
      console.log("[job-extract] Normalized Workday URL to:", url);
    } catch {}
  }

  // AngelList → Wellfound (rebranded domain)
  if (url.includes("angel.co/")) {
    url = url.replace("angel.co/", "wellfound.com/");
    console.log("[job-extract] Normalized AngelList URL to Wellfound:", url);
  }

  return url;
}

/** Extracts the numeric job ID from any LinkedIn job URL, or null. */
export function linkedinJobId(url) {
  if (typeof url !== "string" || !url.includes("linkedin.com")) return null;
  const match = url.match(/currentJobId=(\d+)/) || url.match(/\/jobs\/view\/(\d+)/);
  return match ? match[1] : null;
}

// Minimal entity decode for the handful LinkedIn's guest HTML actually uses.
function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

// HTML fragment to plain text: block-level closers become newlines so the
// parser still sees list items as separate lines, then tags are stripped.
function textFromHtml(html) {
  return decodeEntities(
    String(html ?? "")
      .replace(/<(?:br|\/p|\/li|\/ul|\/ol|\/div|\/h\d)[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

/**
 * Fetches a LinkedIn job via the public guest API, which needs no login.
 * Returns plain text (title/company/location header plus description), or
 * null when LinkedIn rate-limits or the page has no usable description, so
 * the caller can fall back to Exa.
 */
export async function scrapeLinkedInJob(jobId) {
  try {
    const res = await fetch(
      `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!res.ok) {
      console.log("[job-extract] LinkedIn guest API returned", res.status);
      return null;
    }
    const html = await res.text();

    const descriptionHtml = html.match(
      /show-more-less-html__markup[^>]*>([\s\S]*?)<\/div>/
    )?.[1];
    const description = textFromHtml(descriptionHtml);
    // Under ~150 chars is a stub or an error page, not a job description.
    if (description.length < 150) {
      console.log("[job-extract] LinkedIn guest API had no usable description");
      return null;
    }

    const title = textFromHtml(html.match(/topcard__title[^>]*>([\s\S]*?)<\/h\d>/)?.[1]);
    const company = textFromHtml(html.match(/topcard__org-name-link[^>]*>([\s\S]*?)<\/a>/)?.[1]);
    const location = textFromHtml(
      html.match(/topcard__flavor--bullet[^>]*>([\s\S]*?)<\/span>/)?.[1]
    );

    // The guest HTML keeps title/company/location outside the description
    // block, so hand them to the parser explicitly.
    const header = [
      title && `Job title: ${title}`,
      company && `Company: ${company}`,
      location && `Location: ${location}`,
    ]
      .filter(Boolean)
      .join("\n");

    const text = (header ? `${header}\n\n${description}` : description).slice(0, 15000);
    console.log(
      "[job-extract] LinkedIn guest API returned %d chars for job %s",
      text.length,
      jobId
    );
    return text;
  } catch (err) {
    console.error("[job-extract] LinkedIn guest API error:", err);
    return null;
  }
}

function exa(endpoint, body) {
  return fetch(`https://api.exa.ai/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
}

function blockedMessage(url) {
  if (url.includes("linkedin.com")) {
    return "LinkedIn blocks job page access. Try the company's own careers page URL instead.";
  }
  if (url.includes("indeed.com")) {
    return "Indeed blocks job page access. Try the company's own careers page URL instead.";
  }
  if (url.includes("glassdoor.com")) {
    return "Glassdoor blocks direct access. Try the company's own careers page URL instead.";
  }
  if (url.includes("myworkdayjobs.com")) {
    return "Workday job pages are JavaScript-rendered and difficult to scrape. Try the company's direct careers page URL instead.";
  }
  if (url.includes("wellfound.com") || url.includes("angel.co")) {
    return "Wellfound job pages require a login to view. Try the company's own careers page URL instead.";
  }
  return "Could not extract enough content from the page. Try a direct job listing URL.";
}

/** Returns { url, text } for a job page, or throws JobPageError. */
export async function scrapeJobPage(input) {
  if (typeof input !== "string" || !/^https?:\/\//i.test(input.trim())) {
    throw new JobPageError("A valid URL is required");
  }
  const url = normalizeJobUrl(input.trim());

  // LinkedIn blocks crawlers with a login wall, but its guest API serves the
  // posting without one. Try that first; on failure fall through to Exa.
  const jobId = linkedinJobId(url);
  if (jobId) {
    const text = await scrapeLinkedInJob(jobId);
    if (text) return { url, text };
    console.log("[job-extract] LinkedIn guest API failed, trying Exa crawl...");
  }

  // Step 1: Scrape page content via Exa.ai
  const exaRes = await exa("contents", {
    urls: [url],
    text: {
      maxCharacters: 15000,
      includeHtmlTags: false,
    },
    livecrawl: "always",
    livecrawlTimeout: 15000,
  });

  if (!exaRes.ok) {
    const exaError = await exaRes.text();
    console.error("Exa.ai error:", exaError);
    throw new JobPageError("Failed to scrape job page. Please check the URL and try again.");
  }

  const exaData = await exaRes.json();
  const pageText = exaData.results?.[0]?.text;

  console.log(
    "[job-extract] Scraped %d chars from %s | %s",
    pageText?.length ?? 0,
    url,
    pageText ? `Preview: ${pageText.substring(0, 500)}` : "No text"
  );

  // Detect LinkedIn login wall: short content with sign-in text but no job keywords
  const isLoginWall = pageText &&
    pageText.length < 2000 &&
    /sign\s*in|log\s*in/i.test(pageText) &&
    !/requirements|responsibilities|qualifications|experience/i.test(pageText);

  let finalText = pageText;

  // Fallback: try Exa.ai neural search if direct crawl was blocked or empty
  if (isLoginWall || !pageText || pageText.length < 50) {
    console.log("[job-extract] Direct crawl failed, trying Exa.ai search fallback...");
    try {
      const searchRes = await exa("search", {
        query: url,
        numResults: 1,
        contents: {
          text: { maxCharacters: 15000, includeHtmlTags: false },
        },
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const searchText = searchData.results?.[0]?.text;
        const searchUrl = searchData.results?.[0]?.url;
        // Neural search ranks by meaning, so a URL query can return a totally
        // different job. Only trust a result that is the same page.
        if (searchText && searchText.length >= 50 && isSamePage(url, searchUrl)) {
          console.log(`[job-extract] Search fallback returned ${searchText.length} chars`);
          finalText = searchText;
        } else if (searchText) {
          console.log("[job-extract] Discarded search fallback, different page:", searchUrl);
        }
      }
    } catch (err) {
      console.error("[job-extract] Search fallback error:", err);
    }
  }

  if (!finalText || finalText.length < 50) throw new JobPageError(blockedMessage(url));

  return { url, text: finalText };
}
