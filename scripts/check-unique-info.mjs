// Lists which blog posts carry information only FitMyCV has: screenshots of the
// product in use, a recording, first-party data, a real user quote, a named
// expert, our own position, a named method, or a working tool. Generic pages
// don't get cited, so a post with none of these is the next one to deepen.
// Run: npm run check:unique   (--strict exits 1 when an indexed post has none)
//
// ponytail: a regex over the content files instead of importing them. The
// registry imports without file extensions, which plain node can't resolve,
// and the block keys are distinctive enough to match as text.
import { readdirSync, readFileSync } from "node:fs";

const KINDS = {
  figure: "screenshot",
  video: "video",
  data: "own data",
  testimonial: "user quote",
  expert: "expert",
  take: "our take",
  framework: "method",
  tool: "tool",
  compare: "before/after",
};

const dir = new URL("../content/blog/", import.meta.url);
const rows = readdirSync(dir)
  .filter((f) => f.endsWith(".js") && f !== "index.js")
  .map((file) => {
    const src = readFileSync(new URL(file, dir), "utf8");
    const found = Object.keys(KINDS).filter((k) => new RegExp(`[{,]\\s*${k}:`).test(src));
    return { slug: file.replace(/\.js$/, ""), found, noindex: /noindex:\s*true/.test(src) };
  })
  .sort((a, b) => a.found.length - b.found.length);

const pad = Math.max(...rows.map((r) => r.slug.length));
for (const { slug, found, noindex } of rows) {
  const tags = found.length ? found.map((k) => KINDS[k]).join(", ") : "none";
  console.log(`${slug.padEnd(pad)}  ${noindex ? "(noindex) " : ""}${tags}`);
}

const bare = rows.filter((r) => !r.noindex && r.found.length === 0);
console.log(`\n${bare.length} of ${rows.filter((r) => !r.noindex).length} indexed posts carry nothing only we have.`);
if (process.argv.includes("--strict") && bare.length) process.exit(1);
