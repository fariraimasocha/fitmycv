// Labels every page in the live sitemap from 90 days of Search Console data,
// so pruning and merging rest on numbers, not guesses. Prints markdown.
// Run: pnpm -s seo:triage > triage.md   (needs GOOGLE_APPLICATION_CREDENTIALS)
//
// Labels:
//   deepen   5+ clicks, or 200+ impressions at position 4 to 20
//   keep     has impressions but not enough to act on yet
//   merge?   shares its main query with a stronger page (see the merge table)
//   prune?   under 10 impressions in 90 days. Check it is older than 6 weeks
//            before noindexing: new pages have not had time to rank.
// ponytail: thresholds are guesses tuned for a site this size. Raise them as traffic grows.
import { searchconsole, auth } from "@googleapis/searchconsole";

const SITEMAP = "https://www.fitmycv.link/sitemap.xml";
const ORIGIN = /^https?:\/\/(www\.)?fitmycv\.link/;

const client = searchconsole({
  version: "v1",
  auth: new auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] }),
});
const site = "sc-domain:fitmycv.link";
const day = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

async function rows(dimensions) {
  const out = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await client.searchanalytics.query({
      siteUrl: site,
      requestBody: { startDate: day(92), endDate: day(2), dimensions, rowLimit: 25000, startRow },
    });
    out.push(...(res.data.rows ?? []));
    if ((res.data.rows ?? []).length < 25000) return out;
  }
}

const path = (url) => url.replace(ORIGIN, "") || "/";
const xml = await (await fetch(SITEMAP)).text();
const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => path(m[1]));

const byPage = new Map(pages.map((p) => [p, { clicks: 0, impr: 0, posSum: 0, queries: [] }]));
for (const r of await rows(["page"])) {
  const p = byPage.get(path(r.keys[0]));
  if (p) Object.assign(p, { clicks: r.clicks, impr: r.impressions, posSum: r.position * r.impressions });
}

const queryPages = new Map();
for (const r of await rows(["query", "page"])) {
  const [query, url] = r.keys;
  const p = byPage.get(path(url));
  if (!p) continue;
  p.queries.push({ query, impr: r.impressions, pos: r.position, clicks: r.clicks });
  (queryPages.get(query) ?? queryPages.set(query, []).get(query)).push({ page: path(url), impr: r.impressions, pos: r.position });
}

// A query is cannibalised when two pages each take 20%+ of its impressions.
const merges = [...queryPages.entries()]
  .map(([query, list]) => {
    const total = list.reduce((s, x) => s + x.impr, 0);
    return { query, total, list: list.filter((x) => x.impr / total >= 0.2).sort((a, b) => b.impr - a.impr) };
  })
  .filter((m) => m.list.length > 1 && m.total >= 20)
  .sort((a, b) => b.total - a.total);
const loser = new Set(merges.flatMap((m) => m.list.slice(1).map((x) => x.page)));

const label = (page, p) => {
  const pos = p.impr ? p.posSum / p.impr : null;
  if (p.clicks >= 5 || (p.impr >= 200 && pos >= 4 && pos <= 20)) return "deepen";
  if (loser.has(page)) return "merge?";
  if (p.impr < 10) return "prune?";
  return "keep";
};

const table = [...byPage.entries()]
  .map(([page, p]) => ({ page, ...p, pos: p.impr ? p.posSum / p.impr : null, label: label(page, p) }))
  .sort((a, b) => b.clicks - a.clicks || b.impr - a.impr);

console.log(`# SEO triage, ${day(92)} to ${day(2)}\n`);
const counts = Object.groupBy(table, (r) => r.label);
console.log(Object.entries(counts).map(([k, v]) => `- ${k}: ${v.length}`).join("\n"), "\n");

console.log("## Pages\n\n| Label | Page | Clicks | Impr | Pos |\n|---|---|---|---|---|");
for (const r of table) console.log(`| ${r.label} | ${r.page} | ${r.clicks} | ${r.impr} | ${r.pos?.toFixed(1) ?? ""} |`);

console.log("\n## Queries split across pages (merge candidates)\n\n| Query | Impr | Pages (impr, pos) |\n|---|---|---|");
for (const m of merges.slice(0, 40)) {
  console.log(`| ${m.query} | ${m.total} | ${m.list.map((x) => `${x.page} (${x.impr}, ${x.pos.toFixed(0)})`).join("; ")} |`);
}

// Easiest keyword wins: Google already ranks you on page 1 to 3 for these.
console.log("\n## Easy wins: position 8 to 30, 20+ impressions\n\n| Query | Page | Impr | Pos |\n|---|---|---|---|");
table
  .flatMap((r) => r.queries.map((q) => ({ ...q, page: r.page })))
  .filter((q) => q.pos >= 8 && q.pos <= 30 && q.impr >= 20)
  .sort((a, b) => b.impr - a.impr)
  .slice(0, 60)
  .forEach((q) => console.log(`| ${q.query} | ${q.page} | ${q.impr} | ${q.pos.toFixed(1)} |`));
