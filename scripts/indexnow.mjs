// Tells Bing and the other IndexNow engines which URLs changed.
// Run: pnpm indexnow [url ...]   (no URLs sends every URL in the live sitemap)
// The key is public by design: Bing checks it against public/<KEY>.txt.
const SITE = "https://www.fitmycv.link";
const KEY = "4694157756a44bc697e8844bd469fab1";

let urls = process.argv.slice(2);
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// ponytail: one request, IndexNow caps it at 10,000 URLs. Chunk if the sitemap ever passes that.
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList: urls,
  }),
});
console.log(`${res.status} ${res.statusText}: sent ${urls.length} URLs`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
