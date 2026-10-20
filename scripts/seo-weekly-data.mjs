// Compact Search Console data for the weekly SEO run (.claude/commands/seo-weekly.md).
// Run: pnpm -s seo:data   (needs GOOGLE_APPLICATION_CREDENTIALS pointing at the key file)
// Thresholds follow the RomeoSEO audit defaults; tune them here, not in the prompt.
import { searchconsole, auth } from "@googleapis/searchconsole";

const client = searchconsole({
  version: "v1",
  auth: new auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] }),
});

const { data } = await client.sites.list();
const site = (data.siteEntry ?? []).find((s) => s.siteUrl.includes("fitmycv"))?.siteUrl;
if (!site) throw new Error("No fitmycv property visible to this service account.");

// GSC data lags about 2 days, so every window ends there.
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const windows = {
  current: [day(8), day(2)],
  previous: [day(15), day(9)],
  last28: [day(29), day(2)],
};

async function rows([startDate, endDate], dimensions, rowLimit = 500) {
  const res = await client.searchanalytics.query({
    siteUrl: site,
    requestBody: { startDate, endDate, dimensions, rowLimit },
  });
  return (res.data.rows ?? []).map((r) => ({
    ...(dimensions.length ? { query: r.keys[0], page: r.keys[1]?.replace(/^https:\/\/www\.fitmycv\.link/, "") || "/" } : {}),
    clicks: r.clicks,
    impr: r.impressions,
    ctr: +(r.ctr * 100).toFixed(2),
    pos: +r.position.toFixed(1),
  }));
}

const out = { site, windows };
for (const [name, range] of Object.entries(windows)) {
  out[name] = { totals: (await rows(range, [], 1))[0] ?? null, rows: await rows(range, ["query", "page"]) };
}

const prevPos = new Map(out.previous.rows.map((r) => [`${r.query}|${r.page}`, r.pos]));
for (const r of out.current.rows) {
  const before = prevPos.get(`${r.query}|${r.page}`);
  r.prevPos = before ?? null; // null = new query this week
  if (before != null && r.impr >= 20 && Math.abs(before - r.pos) >= 5) r.mover = +(before - r.pos).toFixed(1);
}
for (const r of out.last28.rows) {
  const flags = [];
  if (r.pos >= 11 && r.pos <= 30 && r.impr >= 50) flags.push("page2");
  if (r.impr > 200 && r.ctr < 1) flags.push(r.impr > 1000 ? "severeLowCtr" : "lowCtr");
  if (r.ctr > 3 && r.impr < 100) flags.push("scaling");
  if (flags.length) r.flags = flags;
}

// ponytail: rows under 5 impressions are noise for a site this size; drop them so
// the agent's context stays small. Raise the floor as traffic grows.
for (const name of Object.keys(windows)) out[name].rows = out[name].rows.filter((r) => r.impr >= 5);

console.log(JSON.stringify(out));
