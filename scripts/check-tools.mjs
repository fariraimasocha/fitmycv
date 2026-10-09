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
  "components/tools/SummaryGenerator.jsx": [
    "// pure-helpers:start",
    "// pure-helpers:end",
  ],
  "components/tools/LinkedInUrlFormatter.jsx": [
    "// pure-helpers:start",
    "// pure-helpers:end",
  ],
  "components/tools/DutiesToBullets.jsx": [
    "// pure-helpers:start",
    "// pure-helpers:end",
  ],
  "components/tools/CvFormatChecker.jsx": ["// pure-region-start", "// pure-region-end"],
  "components/tools/WeakWordsChecker.jsx": ["// pure-region-start", "// pure-region-end"],
  "components/tools/GapExplainer.jsx": ["// pure-region-start", "// pure-region-end"],
  "components/agent/ThreadSidebar.jsx": [
    "// pure-region-start",
    "// pure-region-end",
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
  const { findIssues } = await import(
    `data:text/javascript,${encodeURIComponent(body)}`
  );
  const { sanitizePart, buildFileName, buildPdfFilename } = await import(
    "../utils/pdf-filename.js"
  );

  check("names downloads after the person and the role", () => {
    assert.equal(
      buildPdfFilename("Farirai Masocha", "cv", "Software Engineer"),
      "Farirai-Masocha-Software-Engineer-Resume.pdf"
    );
    assert.equal(
      buildPdfFilename("Farirai Masocha", "cover-letter", "Software Engineer"),
      "Farirai-Masocha-Software-Engineer-Cover-Letter.pdf"
    );
    assert.equal(buildPdfFilename("", "cv"), "Resume.pdf");
  });

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

// ---------------------------------------------------------------- summaries
{
  const { generateSummaries, findResultLines } = await loadRegion(
    "components/tools/SummaryGenerator.jsx"
  );

  const JOB = `Senior Data Analyst
We are hiring a Senior Data Analyst to join our fintech team.
You will build dashboards in Tableau, write SQL, and model data in Python.
Experience with SQL, Tableau and Python is essential. Stakeholder reporting matters.
The Senior Data Analyst reports to the Head of Data.`;

  const CV = `Jane Doe
Data Analyst, Acme Payments (fintech), 2018 to present
Built Tableau dashboards used by 40 managers across the business.
Cut monthly reporting time by 35% by automating SQL extracts in Python.
Email jane@example.com, phone +44 7700 900123`;

  const out = generateSummaries(JOB, CV, 2026);

  check("summary takes the role title from the posting", () => {
    assert.equal(out.title, "Senior Data Analyst");
    assert.equal(out.titleSource, "posting");
  });

  check("summary only claims skills found in both documents", () => {
    const cvLower = CV.toLowerCase();
    for (const { term } of out.matched) {
      for (const word of term.split(" ")) {
        assert.ok(cvLower.includes(word.slice(0, 4)), `${term} not in CV`);
      }
    }
    for (const summary of out.summaries) {
      for (const { label } of out.missing) {
        assert.ok(!summary.text.includes(label), `${label} leaked into a summary`);
      }
    }
  });

  check("summary picks a CV line with an impact number", () => {
    assert.equal(
      out.result,
      "Cut monthly reporting time by 35% by automating SQL extracts in Python."
    );
    assert.ok(out.summaries.every((summary) => !summary.hasSlot));
  });

  check("a date alone does not count as a result", () => {
    assert.deepEqual(
      findResultLines("Worked at Acme from March 2019 to June 2022 as an analyst."),
      []
    );
  });

  check("contact lines are never picked as a result", () => {
    assert.deepEqual(findResultLines("Call me on +44 7700 900123 or write to me any time."), []);
  });

  check("no number in the CV leaves a visible slot", () => {
    const plain = generateSummaries(
      JOB,
      "Data Analyst at Acme. Work with SQL and Tableau every day on reporting.",
      2026
    );
    assert.equal(plain.result, null);
    assert.ok(plain.summaries.length > 0);
    assert.ok(plain.summaries.every((summary) => summary.hasSlot));
  });

  check("three distinct summaries come back", () => {
    assert.equal(out.summaries.length, 3);
    assert.equal(new Set(out.summaries.map((s) => s.text)).size, 3);
  });
}

// ------------------------------------------------------------ LinkedIn links
// Add "components/tools/LinkedInUrlFormatter.jsx": ["// pure-helpers:start", "// pure-helpers:end"] to REGIONS.
{
  const { parseLinkedInUrl, formatLinks, findLinkIssues } = await loadRegion(
    "components/tools/LinkedInUrlFormatter.jsx"
  );

  check("strips tracking, country prefix and trailing slash", () => {
    const parsed = parseLinkedInUrl("https://za.linkedin.com/in/Jane-Doe/?originalSubdomain=za");
    assert.equal(parsed.handle, "Jane-Doe");
    assert.equal(formatLinks(parsed.handle).short, "linkedin.com/in/jane-doe");
    assert.equal(formatLinks(parsed.handle).full, "https://www.linkedin.com/in/jane-doe");
  });

  check("accepts a bare domain, mobile host, locale path and /in/ paste", () => {
    assert.equal(parseLinkedInUrl("linkedin.com/in/jdoe").handle, "jdoe");
    assert.equal(parseLinkedInUrl("m.linkedin.com/in/jdoe").handle, "jdoe");
    assert.equal(parseLinkedInUrl("www.linkedin.com/in/jdoe/en").handle, "jdoe");
    assert.equal(parseLinkedInUrl("/in/jdoe").handle, "jdoe");
    assert.equal(parseLinkedInUrl("jdoe").handle, "jdoe");
  });

  check("rejects pages that are not a profile", () => {
    assert.ok(parseLinkedInUrl("https://www.linkedin.com/company/acme").error);
    assert.ok(parseLinkedInUrl("https://www.linkedin.com/posts/jdoe_activity-1").error);
    assert.ok(parseLinkedInUrl("https://github.com/jdoe").error);
    assert.ok(parseLinkedInUrl("https://www.linkedin.com/in/").error);
    assert.ok(parseLinkedInUrl("https://evil-linkedin.com/in/jdoe").error);
  });

  check("flags LinkedIn's auto suffix but not a plain name", () => {
    assert.equal(findLinkIssues("jane-doe-4b2a19c3").length, 1);
    assert.equal(findLinkIssues("jane-doe-12345678").length, 1);
    assert.equal(findLinkIssues("jane-doe").length, 0);
    assert.equal(findLinkIssues("jane-doe-dev").length, 0);
  });

  check("flags characters outside letters, numbers and hyphens", () => {
    const parsed = parseLinkedInUrl("https://www.linkedin.com/in/jos%C3%A9-mu%C3%B1oz");
    assert.equal(parsed.handle, "josé-muñoz");
    assert.ok(findLinkIssues(parsed.handle).length >= 1);
  });

  check("empty input is not an error message", () => {
    assert.equal(parseLinkedInUrl("   ").error, "");
  });
}

// -------------------------------------------------------------------- duties
{
  const { splitDuties, dutyToBullet, dutiesToBullets, pastTense } = await loadRegion(
    "components/tools/DutiesToBullets.jsx"
  );

  check("splits lines, bullets, numbers and semicolons into duties", () => {
    const duties = splitDuties(
      "• Manage the support inbox\n1. Handle refund requests daily\n- Maintain the help centre; Train new starters on tools"
    );
    assert.deepEqual(duties, [
      "Manage the support inbox",
      "Handle refund requests daily",
      "Maintain the help centre",
      "Train new starters on tools",
    ]);
  });

  check("drops fragments and duplicates", () => {
    assert.deepEqual(splitDuties("Duties\nManage the inbox daily\nmanage the inbox daily"), [
      "Manage the inbox daily",
    ]);
  });

  check("removes weak openers and leads with a past tense verb", () => {
    ["Responsible for managing the customer support inbox", "Tasked with preparing month end reports", "Assisted with onboarding new customers", "Duties included stock control and ordering"].forEach((duty) => {
      const { bullet } = dutyToBullet(duty);
      assert.ok(!/^(responsible|tasked|assisted|duties|managing|preparing|onboarding)/i.test(bullet), bullet);
      assert.match(bullet, /^[A-Z][a-z]+(ed|led|ran|ove|ew|ilt|ght|ut)?\b/, bullet);
    });
  });

  check("puts an advert duty into the past tense", () => {
    assert.match(dutyToBullet("You will develop and maintain internal dashboards").bullet, /^Developed and maintained internal dashboards/);
    assert.match(dutyToBullet("Monitor satisfaction scores and prepare weekly reports").bullet, /^Monitored satisfaction scores and prepared weekly reports/);
  });

  check("keeps the partner in a work with duty", () => {
    assert.match(dutyToBullet("Work with the product team to report bugs").bullet, /^Partnered with the product team/);
  });

  check("marks a slot for the number and never invents one", () => {
    const { bullet, note } = dutyToBullet("Handle refunds and billing questions from customers");
    assert.ok(/\[[^\]]+\]/.test(bullet), bullet);
    assert.ok(!/\d/.test(bullet), `invented a number: ${bullet}`);
    assert.ok(note.length > 10);
  });

  check("does not repeat a swapped verb across one list", () => {
    const verbs = dutiesToBullets(
      "Responsible for the budget\nResponsible for the roadmap\nResponsible for vendor contracts\nResponsible for the hiring plan"
    ).map((b) => b.verb);
    assert.equal(new Set(verbs).size, verbs.length, verbs.join(", "));
  });

  check("is deterministic for the same input", () => {
    const text = "Manage the support queue\nMaintain the help centre";
    assert.deepEqual(dutiesToBullets(text), dutiesToBullets(text));
  });

  check("forms regular and irregular past tenses", () => {
    assert.equal(pastTense("prepare"), "prepared");
    assert.equal(pastTense("plan"), "planned");
    assert.equal(pastTense("lead"), "led");
    assert.equal(pastTense("identify"), "identified");
  });
}

// ------------------------------------------------------------ cv format
{
  const { checkCvFormat } = await loadRegion("components/tools/CvFormatChecker.jsx");
  const cv = "Thandi Nkosi\nthandi@example.com\nID number: 9001015009087\nMarital status: Single\nCareer objective: to grow\nReferences available on request";
  const ids = (country) => checkCvFormat(cv, country).checks.filter((c) => !c.ok).map((c) => c.id);

  check("flags the SA ID number, marital status, objective and references line", () => {
    const failed = ids("za");
    for (const id of ["id", "personal", "objective", "references"]) assert.ok(failed.includes(id), failed.join(","));
    assert.ok(!failed.includes("email"), "email was found");
  });

  check("asks Nigerian CVs for NYSC status", () => {
    assert.ok(ids("ng").includes("nysc"));
    assert.ok(!checkCvFormat(cv + "\nNYSC: completed 2021", "ng").checks.find((c) => c.id === "nysc").ok === false);
  });

  check("flags long CVs by page estimate", () => {
    const long = "word ".repeat(1400);
    assert.equal(checkCvFormat(long, "us").checks.find((c) => c.id === "length").ok, false);
  });
}

// ------------------------------------------------------------ weak words
{
  const { findWeakWords } = await loadRegion("components/tools/WeakWordsChecker.jsx");

  check("finds duty phrases and merges spelling variants", () => {
    const { found } = findWeakWords("Responsible for payroll.\nA hard-working and hardworking team player.");
    const phrases = found.map((f) => f.phrase);
    assert.ok(phrases.includes("responsible for"), phrases.join(","));
    assert.equal(found.filter((f) => f.fix.startsWith("Show it: a deadline")).length, 1);
    assert.equal(found.find((f) => f.phrase === "hard-working").count, 2);
  });

  check("does not match inside other words", () => {
    assert.equal(findWeakWords("Etcetera is fine, dynamically too").found.length, 0);
  });

  check("counts lines with numbers", () => {
    const r = findWeakWords("Cut costs by 20 percent across three regional offices\nManaged the regional sales team across five offices");
    assert.equal(r.lines, 2);
    assert.equal(r.withNumbers, 1);
  });
}

// ------------------------------------------------------------ gap explainer
{
  const { explainGap, monthsBetween } = await loadRegion("components/tools/GapExplainer.jsx");

  check("counts months and rejects reversed dates", () => {
    assert.equal(monthsBetween("2024-03", "2025-01"), 10);
    assert.equal(monthsBetween("2025-01", "2024-03"), null);
  });

  check("builds the CV line with dates and what you did", () => {
    const r = explainGap({ reason: "study", from: "2024-03", to: "2025-01", did: "completed a data course." });
    assert.equal(r.cv, "Mar 2024 to Jan 2025. Full-time study. Completed a data course.");
    assert.ok(r.answer.endsWith("I also completed a data course."), r.answer);
    assert.equal(r.short, false);
  });

  check("says short gaps may not need explaining", () => {
    assert.equal(explainGap({ reason: "travel", from: "2024-03", to: "2024-04" }).short, true);
  });
}

// ------------------------------------------------------------ agent threads
{
  const { threadListView } = await loadRegion("components/agent/ThreadSidebar.jsx");
  const view = (over) =>
    threadListView({ sessionLoading: false, isPremium: true, isLoading: false, count: 0, ...over });

  check("free users get the upgrade state, not a crash on a 402", () => {
    // The 402 leaves no threads and no loading flag. That must never reach .map.
    assert.equal(view({ isPremium: false }), "upgrade");
  });

  check("waits for the session before deciding", () => {
    assert.equal(view({ sessionLoading: true, isPremium: false }), "loading");
  });

  check("a failed or empty query for Pro shows the empty state", () => {
    assert.equal(view({}), "empty");
    assert.equal(view({ isLoading: true }), "loading");
    assert.equal(view({ count: 2 }), "list");
  });
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:\n`);
  failures.forEach((f) => console.error(`  x ${f}`));
  process.exit(1);
}
console.log("All free tool checks passed.");
