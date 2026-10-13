// Lists Search Console sites, then the top 20 queries and pages for the last 28 days.
// Run: pnpm gsc [siteUrl]   (needs GOOGLE_APPLICATION_CREDENTIALS pointing at the key file)
import { searchconsole, auth } from "@googleapis/searchconsole";

const client = searchconsole({
  version: "v1",
  auth: new auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] }),
});

const { data } = await client.sites.list();
const sites = data.siteEntry ?? [];
console.log("Sites:");
for (const s of sites) console.log(`  ${s.siteUrl}  (${s.permissionLevel})`);

const site = process.argv[2] ?? sites.find((s) => s.siteUrl.includes("fitmycv"))?.siteUrl;
if (!site) throw new Error("No fitmycv property visible to this service account.");

// GSC data lags about 2 days, so end the window there.
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const range = { startDate: day(30), endDate: day(2) };

for (const dim of ["query", "page"]) {
  const res = await client.searchanalytics.query({
    siteUrl: site,
    requestBody: { ...range, dimensions: [dim], rowLimit: 20 },
  });
  console.log(`\nTop ${dim}s, ${range.startDate} to ${range.endDate} (${site})`);
  console.table(
    (res.data.rows ?? []).map((r) => ({
      [dim]: r.keys[0].slice(0, 70),
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: `${(r.ctr * 100).toFixed(1)}%`,
      position: r.position.toFixed(1),
    })),
  );
}
