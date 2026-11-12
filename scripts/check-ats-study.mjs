// Self check for data/ats-study-sp500.json, the data behind /ats-market-share.
// Run: node scripts/check-ats-study.mjs
// Every vendor claim needs an evidence URL that lib/ats-detect.js reads as that
// vendor, and no row may still be waiting on a manual review.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { detectAts } from "../lib/ats-detect.js";

const { checkedOn, companies } = JSON.parse(
  readFileSync(new URL("../data/ats-study-sp500.json", import.meta.url), "utf8")
);

assert.match(checkedOn, /^\d{4}-\d{2}-\d{2}$/);
assert.ok(companies.length >= 490, `only ${companies.length} companies`);

const tickers = new Set();
for (const c of companies) {
  assert.ok(!tickers.has(c.ticker), `duplicate ${c.ticker}`);
  tickers.add(c.ticker);
  assert.ok(!c.review, `${c.ticker}: still flagged for review`);
  if (c.ats === null) {
    assert.equal(c.evidenceUrl, null, `${c.ticker}: evidence without a vendor`);
    continue;
  }
  assert.equal(detectAts(c.evidenceUrl)?.id, c.ats, `${c.ticker}: ${c.evidenceUrl}`);
}

const found = companies.filter((c) => c.ats).length;
console.log(`ats-study: ok (${found} of ${companies.length} companies tied to a vendor)`);
