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
