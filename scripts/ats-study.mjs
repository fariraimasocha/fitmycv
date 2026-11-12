// Builds data/ats-study-sp500.json: which applicant tracking system each S&P 500
// company's job board runs on. Feeds the /ats-market-share study page.
// Run: node --env-file=.env scripts/ats-study.mjs <path to S&P 500 wikitext>
//   wikitext: https://en.wikipedia.org/w/index.php?title=List_of_S%26P_500_companies&action=raw
//
// Method: one Exa search per company, limited to vendor hosts. A result counts
// only when the board's tenant (subdomain or path slug) or the page title names
// the company. Every claimed vendor keeps one evidence URL, and
// scripts/check-ats-study.mjs re-checks each one with lib/ats-detect.js.
// ponytail: name matching, so a company hiring under a brand name with no word
// in common with its listed name lands in "not found". Add an alias below.
import { readFileSync, writeFileSync } from "node:fs";
import { detectAts } from "../lib/ats-detect.js";

const HOSTS = [
  "greenhouse.io", "lever.co", "myworkdayjobs.com", "myworkdaysite.com", "ashbyhq.com",
  "smartrecruiters.com", "workable.com", "successfactors.com", "successfactors.eu",
  "taleo.net", "oraclecloud.com", "icims.com", "bamboohr.com", "teamtailor.com",
  "jobvite.com", "recruitee.com", "breezy.hr",
];

// Listed name -> extra words the company hires under.
const ALIASES = {
  // No Google alias for Alphabet: google.wd501 is Google Operations Center, a
  // subsidiary. Google itself hires through its own site.
  "Meta Platforms": ["meta", "facebook"], "Berkshire Hathaway": ["berkshire"],
  "3M": ["3m", "mmm"], "AT&T": ["att"], "Procter & Gamble": ["pg", "procter"],
  "Johnson & Johnson": ["jnj", "johnson"], "JPMorgan Chase": ["jpmc", "jpmorgan"],
  "Coca-Cola Company (The)": ["coca", "cocacola", "coke"], "PepsiCo": ["pepsico", "pepsi"],
  "Walt Disney Company (The)": ["disney"], "Home Depot (The)": ["homedepot"],
};

const STOP = new Set(["inc", "corp", "corporation", "company", "the", "co", "group", "holdings",
  "class", "plc", "ltd", "technologies", "international", "industries", "and", "of", "a", "b", "c"]);

function parseWiki(text) {
  const table = text.split('id="constituents"')[1].split("\n|}")[0];
  return table.split("\n|-").slice(1).map((row) => {
    // Rows start "|| " or, now and then, "| ". One cell per line either way.
    const cells = row.split("\n").map((l) => l.replace(/^\|\|?\s*/, "").trim()).filter(Boolean);
    const ticker = cells[0]?.match(/\|([A-Z.]+)\}\}/)?.[1];
    const name = cells[1]?.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1").trim();
    return name && ticker ? { ticker, name, sector: cells[2]?.trim() } : null;
  }).filter(Boolean);
}

// Hand review, November 2026. A one-word tenant can be a different employer, and
// a regional board does not show where the parent mainly hires.
const OVERRIDES = {
  UNP: null, // jobs.ashbyhq.com/Union is a startup
  PH: null, // jobs.ashbyhq.com/parker is a startup
  FLEX: null, // "flex" boards on Lever, Greenhouse and Ashby are startups
  ALGN: null, // greenhouse "align" is not Align Technology
  DPZ: null, // smartrecruiters "Dominos" is not the US company
  ETN: null, // board sits on Boyd's Workday tenant
  MET: null, // Lever board covers MetLife Colombia's sales force only
  SKYD: null, // Lever board is the Madrid animation studio only
  CEG: { ats: "icims", url: "https://careers-constellationenergy.icims.com/jobs" }, // ashby "constellation" is a startup
};

const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();

function tokens(name) {
  const all = norm(name.replace(/\(.*?\)/g, "")).split(" ").filter((w) => !STOP.has(w));
  const words = all.filter((w) => w.length > 1);
  const joined = all.join("");
  // First word only when it is long enough to be distinctive ("abbott", not "air").
  const first = all[0]?.length >= 4 ? [all[0]] : [];
  return [...new Set([...(ALIASES[name] ?? []), ...first, joined].filter(Boolean))];
}

const GENERIC = new Set(["job", "jobs", "boards", "board", "careers", "career", "apply", "www", "en", "us", "hcmui"]);

// The parts of a board URL that can name the employer: first subdomain label,
// first path segment, and a ?company= param, with generic words dropped.
function tenants(url) {
  const u = new URL(url);
  const parts = [u.hostname.split(".")[0], u.pathname.split("/").filter(Boolean)[0], u.searchParams.get("company")];
  return parts
    .filter(Boolean)
    .map((p) => norm(p).split(" ").filter((w) => !GENERIC.has(w) && !/^career\d+$/.test(w)).join(""))
    .filter(Boolean);
}

// The tenant has to be the company's name exactly: "smithengineering" is not
// A. O. Smith, "aflaccentralsouthernillinois" is a franchise, not Aflac. Oracle tenants are opaque
// ids, so only there the page title may carry the match.
function matches(result, words, vendor, joined) {
  if (tenants(result.url).some((t) => words.includes(t))) return true;
  // Title match needs the whole name: "american" alone would tie American
  // Express and American Tower to the same board.
  return vendor === "oracle" && norm(result.title ?? "").replace(/ /g, "").includes(joined);
}

async function exa(query) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.EXA_API_KEY}` },
      body: JSON.stringify({ query, type: "auto", numResults: 10, includeDomains: HOSTS }),
    });
    if (res.ok) return (await res.json()).results ?? [];
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
  throw new Error(`Exa failed for ${query}`);
}

// Small-business systems on an S&P 500 name are usually a franchise or a
// squatted tenant (amazon.breezy.hr), so they are flagged for a manual look.
const REVIEW_VENDORS = new Set(["breezy", "workable", "bamboohr", "recruitee", "teamtailor"]);

async function study(company) {
  const words = tokens(company.name);
  const joined = norm(company.name.replace(/\(.*?\)/g, "")).split(" ").filter((w) => !STOP.has(w)).join("");
  const name = company.name.replace(/\(.*?\)/g, "").trim();
  const votes = {};
  // Second query only when the first finds nothing.
  for (const query of [`${name} careers jobs`, `${name} job openings apply`]) {
    for (const r of await exa(query)) {
      const vendor = detectAts(r.url);
      if (!vendor || !matches(r, words, vendor.id, joined)) continue;
      (votes[vendor.id] ??= []).push(r.url);
    }
    if (Object.keys(votes).length) break;
  }
  const ranked = Object.entries(votes).sort((a, b) => b[1].length - a[1].length);
  return {
    ...company,
    ats: ranked[0]?.[0] ?? null,
    evidenceUrl: ranked[0]?.[1][0] ?? null,
    review: REVIEW_VENDORS.has(ranked[0]?.[0]) || undefined,
    others: ranked.slice(1).map(([id, urls]) => ({ ats: id, url: urls[0] })),
  };
}

const companies = parseWiki(readFileSync(process.argv[2], "utf8")).slice(0, Number(process.env.LIMIT) || undefined);
// Alphabet, Fox and News Corp list two share classes. One company, one row.
const seen = new Set();
const unique = companies.filter((c) => {
  const key = c.name.replace(/\s*\(Class [A-Z]\)/, "");
  return seen.has(key) ? false : seen.add(key);
});

// Small-business hits checked by hand were never the company's main board, so
// fall back to the next major vendor found, or to none.
function settle(c) {
  if (c.ticker in OVERRIDES) {
    const o = OVERRIDES[c.ticker];
    return { ...c, ats: o?.ats ?? null, evidenceUrl: o?.url ?? null, review: undefined, others: [] };
  }
  if (!c.review) return c;
  const alt = c.others.find((o) => !REVIEW_VENDORS.has(o.ats));
  return { ...c, ats: alt?.ats ?? null, evidenceUrl: alt?.url ?? null, review: undefined, others: c.others.filter((o) => o !== alt) };
}

// ONLY=RDDT,XYZ re-runs those tickers and keeps every other row as it is.
const only = process.env.ONLY?.split(",");
const FILE = new URL("../data/ats-study-sp500.json", import.meta.url);
const todo = only ? unique.filter((c) => only.includes(c.ticker)) : unique;

const fresh = [];
for (let i = 0; i < todo.length; i += 5) {
  fresh.push(...(await Promise.all(todo.slice(i, i + 5).map(study))).map(settle));
  process.stderr.write(`${fresh.length}/${todo.length}\r`);
}

const previous = only ? JSON.parse(readFileSync(FILE, "utf8")) : null;
const byTicker = new Map(fresh.map((c) => [c.ticker, c]));
const out = only
  ? unique.map((c) => byTicker.get(c.ticker) ?? previous.companies.find((p) => p.ticker === c.ticker)).filter(Boolean)
  : fresh;

writeFileSync(
  FILE,
  JSON.stringify({ checkedOn: previous?.checkedOn ?? new Date().toISOString().slice(0, 10), companies: out }, null, 1)
);
const found = out.filter((c) => c.ats).length;
console.log(`\n${found} of ${out.length} companies matched to a vendor`);
