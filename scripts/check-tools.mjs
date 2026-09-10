// Self check for the pure logic behind the free tool components.
//
// ponytail: the helpers live inside .jsx files, which node cannot import, so
// this slices the marked pure region out of each file and imports it as a data
// URL. The upgrade, if a fourth tool needs the same helpers, is to move them
// into lib/ and import them normally.
//
// Run: npm run check:tools

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const REGIONS = {
  "components/tools/BulletRewriter.jsx": [
    "// pure-region-start",
    "// pure-region-end",
  ],
  "components/tools/HeadlineGenerator.jsx": [
    "// pure-helpers:start",
    "// pure-helpers:end",
  ],
};

/** Slices the marked region out of a component and imports it as a module. */
async function loadRegion(path) {
  const [start, end] = REGIONS[path];
  const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  assert.ok(from !== -1 && to > from, `${path}: pure region markers missing`);

  // Every top level declaration in the region is exported so the check can
  // reach it without the component file having to export anything.
  const body = source
    .slice(from + start.length, to)
    .replace(/^(function|const|let) /gm, "export $1 ");
  return import(`data:text/javascript,${encodeURIComponent(body)}`);
}

const failures = [];
const check = (name, fn) => {
  try {
    fn();
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  }
};

// ---------------------------------------------------------------- file names
{
  const source = await readFile(
    new URL("../components/tools/FileNameGenerator.jsx", import.meta.url),
    "utf8"
  );
  const end = source.indexOf("// ---- end of pure logic");
  assert.ok(end > 0, "FileNameGenerator: pure logic marker missing");
  const body = source.slice(0, end).replace(/^import[^\n]*\n/gm, "");
  const { sanitizePart, buildFileName, findIssues } = await import(
    `data:text/javascript,${encodeURIComponent(body)}`
  );

  check("strips characters that break uploads", () => {
    assert.equal(
      buildFileName(['Fari/rai:Maso*cha', 'Software "Engineer"']),
      "Fari-rai-Maso-cha-Software-Engineer-Resume.pdf"
    );
  });

  check("keeps the letter when dropping an accent", () => {
    assert.equal(sanitizePart("José Muñoz", "-"), "Jose-Munoz");
  });

  check("collapses whitespace runs to one separator", () => {
    assert.equal(sanitizePart("  Farirai   Masocha  ", "-"), "Farirai-Masocha");
  });

  check("leaves the user's capitalisation alone", () => {
    assert.equal(sanitizePart("van der Berg", "-"), "van-der-Berg");
  });

  check("never emits an empty stem", () => {
    assert.equal(buildFileName(["", "   ", "///"]), "Resume.pdf");
  });

  check("caps a very long name and still ends in Resume.pdf", () => {
    const out = buildFileName([("Alexandria ").repeat(20), "Engineer"]);
    assert.ok(out.length < 110, `too long: ${out.length}`);
    assert.ok(out.endsWith("-Resume.pdf"), out);
    assert.ok(!out.includes("--"), out);
  });

  check("honours the underscore convention", () => {
    assert.equal(
      buildFileName(["Farirai Masocha", "Software Engineer"], "_"),
      "Farirai_Masocha_Software_Engineer_Resume.pdf"
    );
  });

  check("flags a version word and an all lowercase name", () => {
    const issues = findIssues({ name: "farirai masocha", role: "Engineer v2" }, false);
    assert.ok(issues.some((i) => i.includes("final, draft and v2")), issues.join(" | "));
    assert.ok(issues.some((i) => i.includes("lowercase")), issues.join(" | "));
  });

  check("says nothing when nothing is typed", () => {
    assert.deepEqual(findIssues({}, false), []);
  });
}

// ------------------------------------------------------------------- bullets
{
  const { rewriteBullet, diagnoseBullet, tailoringTerms } = await loadRegion(
    "components/tools/BulletRewriter.jsx"
  );

  check("replaces a duty opener with an action verb", () => {
    const { variants, opener } = rewriteBullet("Managed customer support tickets.");
    assert.equal(opener, "managed");
    assert.equal(variants.length, 3);
    variants.forEach((v) => {
      assert.ok(!/^Managed\b/i.test(v), `still opens with Managed: ${v}`);
      assert.ok(/\[/.test(v), `no metric slot: ${v}`);
    });
  });

  check("gives three genuinely different rewrites", () => {
    const { variants } = rewriteBullet("Responsible for the payments service.");
    assert.equal(new Set(variants).size, 3, variants.join(" | "));
  });

  check("is deterministic for the same input", () => {
    const a = rewriteBullet("Helped with social media campaigns.");
    const b = rewriteBullet("Helped with social media campaigns.");
    assert.deepEqual(a.variants, b.variants);
  });

  check("keeps a bullet that already opens with an action verb", () => {
    const { opener } = rewriteBullet("Rebuilt the billing pipeline.");
    assert.equal(opener, null);
  });

  check("flags a missing number and clears one that is present", () => {
    const weak = diagnoseBullet("Managed customer support tickets.");
    assert.ok(weak.some((n) => n.tone === "warn" && n.text.includes("No number")));
    const strong = diagnoseBullet("Resolved 80 tickets a week.");
    assert.ok(strong.some((n) => n.tone === "ok" && n.text.includes("Has a number")));
  });

  check("flags a pronoun and a vague word", () => {
    const notes = diagnoseBullet("I managed various customer accounts.");
    assert.ok(notes.some((n) => n.text.includes('"I"')), notes.map((n) => n.text).join(" | "));
    assert.ok(notes.some((n) => n.text.includes("various")));
  });

  check("suggests only posting terms the bullet is missing", () => {
    const job =
      "Support Specialist. Own the Zendesk queue and resolve customer tickets. " +
      "Zendesk experience and clear written communication required. Zendesk is our core tool.";
    const terms = tailoringTerms("Managed customer support tickets.", job);
    assert.ok(terms.includes("zendesk"), terms.join(", "));
    assert.ok(!terms.includes("tickets"), terms.join(", "));
  });

  check("suggests nothing without a posting", () => {
    assert.deepEqual(tailoringTerms("Managed tickets.", ""), []);
  });
}

// ----------------------------------------------------------------- headlines
{
  const { extractRoleTitle, generateHeadlines, findYearsOfExperience } =
    await loadRegion("components/tools/HeadlineGenerator.jsx");

  const JOB = `Senior Backend Engineer. We are hiring a Senior Backend Engineer to
    own our payments platform. You will write Go, run services on Kubernetes, and
    design payments APIs. Kubernetes and Go experience essential. Payments domain
    knowledge preferred. The Senior Backend Engineer reports to the platform lead.`;

  check("pulls the role title out of the posting", () => {
    const { title } = extractRoleTitle(JOB);
    assert.match(title, /Backend Engineer/i);
  });

  check("says so rather than guessing when there is no title", () => {
    const { confident } = extractRoleTitle("We are looking for someone great. Apply today.");
    assert.equal(confident, false);
  });

  check("reads years of experience only when the CV states them", () => {
    assert.equal(findYearsOfExperience("7 years of backend experience", 2026)?.years, 7);
    assert.equal(findYearsOfExperience("Backend engineer at Acme", 2026), null);
  });

  check("never claims a skill the CV does not evidence", () => {
    const cv = "Backend engineer. Built services in Go. Ran deployments on Kubernetes.";
    const { headlines } = generateHeadlines(JOB, cv, 2026);
    assert.ok(headlines.length > 0);
    headlines.forEach(({ text }) => {
      assert.ok(!/payments/i.test(text), `claims payments, absent from the CV: ${text}`);
    });
  });

  check("gives five distinct shapes", () => {
    const cv = "Senior backend engineer with 7 years of experience in Go, Kubernetes and payments.";
    const { headlines } = generateHeadlines(JOB, cv, 2026);
    assert.equal(new Set(headlines.map((h) => h.text)).size, headlines.length);
  });

  check("is deterministic for the same input", () => {
    const cv = "Backend engineer. Go, Kubernetes, payments.";
    const a = generateHeadlines(JOB, cv, 2026).headlines.map((h) => h.text);
    const b = generateHeadlines(JOB, cv, 2026).headlines.map((h) => h.text);
    assert.deepEqual(a, b);
  });
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
console.log("All free tool checks passed.");
