// Checks which sitemap URLs Google has not indexed, then resubmits the sitemap.
// Run: pnpm gsc:index   (needs GOOGLE_APPLICATION_CREDENTIALS pointing at the key file)
// The API cannot press "Request indexing". Do that by hand in Search Console for the pages that matter.
import { searchconsole, auth } from "@googleapis/searchconsole";

const SITE = "https://www.fitmycv.link";
const PROPERTY = "sc-domain:fitmycv.link";
const client = searchconsole({
  version: "v1",
  auth: new auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/webmasters"] }),
});

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// ponytail: sequential, 200 URLs is well under the 2,000 a day inspection quota.
const byState = {};
for (const inspectionUrl of urls) {
  let state;
  try {
    const { data } = await client.urlInspection.index.inspect({ requestBody: { inspectionUrl, siteUrl: PROPERTY } });
    state = data.inspectionResult?.indexStatusResult?.coverageState ?? "Unknown";
  } catch (e) {
    state = `Error: ${e.message}`;
  }
  (byState[state] ??= []).push(inspectionUrl.replace(SITE, "") || "/");
}

for (const [state, paths] of Object.entries(byState).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n${state}: ${paths.length}`);
  if (state !== "Submitted and indexed") for (const p of paths) console.log(`  ${p}`);
}

await client.sitemaps.submit({ siteUrl: PROPERTY, feedpath: `${SITE}/sitemap.xml` });
console.log(`\nsitemap submitted (${urls.length} URLs)`);
