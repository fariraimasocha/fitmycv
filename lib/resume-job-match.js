// Client-side resume ↔ job match. Same contract as the ATS keyword checker:
// no API, no upload, a heuristic you can re-run offline. It is not a vendor
// ATS score. It reports vocabulary overlap split into skills, keywords, and
// a light experience signal (years + seniority + role phrases).

const STOP_WORDS = new Set(
  `a about above after again against all also am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves
   ability able across additional advantage apply applicant applicants bonus build built candidate candidates career company culture description desirable duties employment ensure ensuring environment essential etc excellent experience familiar familiarity fast focus following friendly get getting good great growing help including involved job join key like looking love make making must need needs new nice offer opportunity part passionate people plus position preferred proven provide ran range required requirement requirements responsibilities responsibility role roles run running skill skills strong take team teams understanding using want well work working world would years`
    .split(/\s+/)
    .filter(Boolean)
);

// Canonical skill → aliases. Order aliases longest-first when matching.
const SKILL_ALIASES = [
  ["CI/CD", ["ci/cd", "ci cd", "continuous integration", "continuous delivery", "continuous deployment"]],
  ["GraphQL", ["graphql"]],
  ["TypeScript", ["typescript"]],
  ["JavaScript", ["javascript"]],
  ["React", ["react", "react.js", "reactjs"]],
  ["Next.js", ["next.js", "nextjs", "next js"]],
  ["Node.js", ["node.js", "nodejs", "node js"]],
  ["Vue", ["vue", "vue.js", "vuejs"]],
  ["Angular", ["angular"]],
  ["Python", ["python"]],
  ["Django", ["django"]],
  ["Flask", ["flask"]],
  ["FastAPI", ["fastapi", "fast api"]],
  ["Java", ["java"]],
  ["Spring", ["spring boot", "spring"]],
  ["Kotlin", ["kotlin"]],
  ["Swift", ["swift"]],
  ["Go", ["golang"]],
  ["Rust", ["rust"]],
  ["Ruby", ["ruby"]],
  ["Rails", ["ruby on rails", "rails"]],
  ["PHP", ["php"]],
  ["C#", ["c#", "csharp", "c sharp"]],
  [".NET", [".net", "dotnet", "dot net"]],
  ["C++", ["c++"]],
  ["SQL", ["sql"]],
  ["PostgreSQL", ["postgresql", "postgres"]],
  ["MySQL", ["mysql"]],
  ["MongoDB", ["mongodb", "mongo"]],
  ["Redis", ["redis"]],
  ["AWS", ["aws", "amazon web services"]],
  ["Azure", ["azure", "microsoft azure"]],
  ["GCP", ["gcp", "google cloud", "google cloud platform"]],
  ["Docker", ["docker"]],
  ["Kubernetes", ["kubernetes", "k8s"]],
  ["Terraform", ["terraform"]],
  ["Linux", ["linux"]],
  ["Git", ["git"]],
  ["GitHub", ["github"]],
  ["GitLab", ["gitlab"]],
  ["REST", ["rest", "restful", "rest api"]],
  ["gRPC", ["grpc"]],
  ["HTML", ["html"]],
  ["CSS", ["css"]],
  ["Tailwind", ["tailwind", "tailwindcss", "tailwind css"]],
  ["Sass", ["sass", "scss"]],
  ["Redux", ["redux"]],
  ["Apollo", ["apollo"]],
  ["Prisma", ["prisma"]],
  ["Pandas", ["pandas"]],
  ["NumPy", ["numpy"]],
  ["PyTorch", ["pytorch"]],
  ["TensorFlow", ["tensorflow"]],
  ["Machine learning", ["machine learning", "ml"]],
  ["Data analysis", ["data analysis", "data analytics"]],
  ["Excel", ["excel", "microsoft excel"]],
  ["Tableau", ["tableau"]],
  ["Power BI", ["power bi", "powerbi"]],
  ["Salesforce", ["salesforce"]],
  ["HubSpot", ["hubspot"]],
  ["Figma", ["figma"]],
  ["Sketch", ["sketch"]],
  ["Jira", ["jira"]],
  ["Confluence", ["confluence"]],
  ["Agile", ["agile"]],
  ["Scrum", ["scrum"]],
  ["Kanban", ["kanban"]],
  ["Project management", ["project management"]],
  ["Product management", ["product management"]],
  ["Stakeholder management", ["stakeholder management"]],
  ["People management", ["people management"]],
  ["OKRs", ["okrs", "okr"]],
  ["A/B testing", ["a/b testing", "ab testing"]],
  ["SEO", ["seo", "search engine optimisation", "search engine optimization"]],
  ["SEM", ["sem"]],
  ["Google Analytics", ["google analytics", "ga4"]],
  ["Content strategy", ["content strategy"]],
  ["Copywriting", ["copywriting"]],
  ["Account management", ["account management"]],
  ["Business development", ["business development"]],
  ["Customer success", ["customer success"]],
  ["Financial modelling", ["financial modelling", "financial modeling"]],
  ["Forecasting", ["forecasting"]],
  ["Budgeting", ["budgeting"]],
  ["GAAP", ["gaap"]],
  ["IFRS", ["ifrs"]],
  ["QuickBooks", ["quickbooks"]],
  ["SAP", ["sap"]],
  ["HRIS", ["hris"]],
  ["Recruiting", ["recruiting", "recruitment"]],
  ["Onboarding", ["onboarding"]],
  ["HIPAA", ["hipaa"]],
  ["EMR", ["emr", "ehr"]],
  ["Clinical research", ["clinical research"]],
  ["Patient care", ["patient care"]],
  ["Communication", ["communication"]],
  ["Leadership", ["leadership"]],
  ["Problem solving", ["problem solving", "problem-solving"]],
  ["Collaboration", ["collaboration"]],
  ["Presentation", ["presentation", "presentations"]],
  ["Negotiation", ["negotiation"]],
  ["Mentoring", ["mentoring", "mentorship"]],
];

const SENIORITY = [
  { label: "intern", rank: 0, patterns: ["intern", "internship"] },
  { label: "entry level", rank: 1, patterns: ["entry-level", "entry level", "graduate"] },
  { label: "junior", rank: 2, patterns: ["junior"] },
  { label: "mid level", rank: 3, patterns: ["mid-level", "mid level", "intermediate"] },
  { label: "senior", rank: 4, patterns: ["senior"] },
  { label: "staff", rank: 5, patterns: ["staff"] },
  { label: "lead", rank: 5, patterns: ["lead", "tech lead", "team lead"] },
  { label: "principal", rank: 6, patterns: ["principal"] },
  { label: "manager", rank: 5, patterns: ["manager", "engineering manager"] },
  { label: "director", rank: 6, patterns: ["director", "head of"] },
];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[-./]+|[-./]+$/g, ""))
    .filter((word) => word.length > 1);
}

function stem(word) {
  if (word.length <= 4) return word;
  for (const suffix of ["ing", "ies", "ed", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      const base = word.slice(0, -suffix.length);
      return suffix === "ies" ? `${base}y` : base;
    }
  }
  return word;
}

const isContent = (word) => word && !STOP_WORDS.has(word);

function extractTerms(text, limit) {
  const tokens = tokenize(text);
  const unigrams = new Map();
  const bigrams = new Map();

  tokens.forEach((token, i) => {
    if (isContent(token)) unigrams.set(token, (unigrams.get(token) || 0) + 1);

    const next = tokens[i + 1];
    if (!isContent(token) || !isContent(next)) return;
    const phrase = `${token} ${next}`;
    bigrams.set(phrase, (bigrams.get(phrase) || 0) + 1);
  });

  const scored = [
    ...[...bigrams.entries()]
      .filter(([, count]) => count >= 2)
      .map(([term, count]) => ({ term, score: count * 1.8, words: term.split(" ") })),
    ...[...unigrams.entries()].map(([term, count]) => ({
      term,
      score: count,
      words: [term],
    })),
  ].sort((a, b) => b.score - a.score);

  const kept = [];
  for (const item of scored) {
    const covered =
      item.words.length === 1 &&
      kept.some((other) => other.words.length > 1 && other.words.includes(item.term));
    if (!covered) kept.push(item);
    if (kept.length >= limit) break;
  }
  return kept;
}

function normalizeForSearch(text) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, " ")} `;
}

function containsAlias(haystack, alias) {
  const needle = alias.toLowerCase();
  if (needle.includes(" ") || /[^a-z0-9]/.test(needle)) {
    return haystack.includes(` ${needle} `) || haystack.includes(needle);
  }
  return new RegExp(`[^a-z0-9]${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^a-z0-9]`).test(
    haystack
  );
}

function extractSkills(text) {
  const haystack = normalizeForSearch(text);
  const found = [];
  const seen = new Set();

  for (const [canonical, aliases] of SKILL_ALIASES) {
    if (seen.has(canonical)) continue;
    const hit = aliases.some((alias) => containsAlias(haystack, alias));
    if (!hit) continue;
    seen.add(canonical);
    found.push(canonical);
  }
  return found;
}

function extractYears(text) {
  return [...text.matchAll(/(\d+)\s*\+?\s*(?:years?|yrs?)/gi)]
    .map((match) => Number(match[1]))
    .filter((n) => n >= 1 && n <= 40);
}

function extractSeniority(text) {
  const lower = text.toLowerCase();
  let best = null;
  for (const row of SENIORITY) {
    if (row.patterns.some((pattern) => lower.includes(pattern))) {
      if (!best || row.rank > best.rank) best = row;
    }
  }
  return best;
}

function yearsScore(jobYears, cvYears) {
  if (!jobYears.length) return null;
  const required = Math.max(...jobYears);
  if (!cvYears.length) return 35;
  const have = Math.max(...cvYears);
  if (have >= required) return 100;
  if (have >= required - 2) return 70;
  if (have >= Math.ceil(required / 2)) return 45;
  return 25;
}

function seniorityScore(jobLevel, cvLevel) {
  if (!jobLevel) return null;
  if (!cvLevel) return 40;
  if (cvLevel.rank >= jobLevel.rank) return 100;
  if (cvLevel.rank === jobLevel.rank - 1) return 70;
  return 35;
}

function keywordCoverage(jobText, cvText, limit = 24) {
  const terms = extractTerms(jobText, limit);
  const cvStems = new Set(tokenize(cvText).map(stem));
  const scored = terms.map((item) => ({
    ...item,
    present: item.words.every((word) => cvStems.has(stem(word))),
  }));
  const weightTotal = scored.reduce((sum, item) => sum + item.score, 0);
  const weightHit = scored
    .filter((item) => item.present)
    .reduce((sum, item) => sum + item.score, 0);

  return {
    terms: scored,
    score: weightTotal ? Math.round((weightHit / weightTotal) * 100) : 0,
    missing: scored.filter((item) => !item.present),
    present: scored.filter((item) => item.present),
  };
}

function skillsCoverage(jobSkills, cvSkills) {
  const cvSet = new Set(cvSkills);
  const strong = jobSkills.filter((skill) => cvSet.has(skill));
  const missing = jobSkills.filter((skill) => !cvSet.has(skill));
  return {
    strong,
    missing,
    score: jobSkills.length ? Math.round((strong.length / jobSkills.length) * 100) : 0,
  };
}

function experienceCoverage(jobText, cvText, keywords) {
  const jobYears = extractYears(jobText);
  const cvYears = extractYears(cvText);
  const jobLevel = extractSeniority(jobText);
  const cvLevel = extractSeniority(cvText);
  const yearPart = yearsScore(jobYears, cvYears);
  const levelPart = seniorityScore(jobLevel, cvLevel);

  const roleTerms = keywords.terms.filter(
    (item) =>
      item.words.length > 1 ||
      ["engineer", "manager", "designer", "analyst", "developer", "nurse", "accountant"].includes(
        item.term
      )
  );
  const roleHits = roleTerms.filter((item) => item.present).length;
  const rolePart = roleTerms.length
    ? Math.round((roleHits / roleTerms.length) * 100)
    : null;

  const parts = [yearPart, levelPart, rolePart].filter((value) => value !== null);
  return {
    score: parts.length
      ? Math.round(parts.reduce((sum, value) => sum + value, 0) / parts.length)
      : keywords.score,
    requiredYears: jobYears.length ? Math.max(...jobYears) : null,
    cvYears: cvYears.length ? Math.max(...cvYears) : null,
    jobLevel: jobLevel?.label ?? null,
    cvLevel: cvLevel?.label ?? null,
  };
}

const WEAK_KEYWORD_TIPS = new Set([
  "software",
  "engineer",
  "developer",
  "ship",
  "lead",
  "team",
  "role",
  "work",
]);

function isUsefulKeywordTip(term) {
  if (!term || term.length < 3) return false;
  if (/^\d/.test(term)) return false;
  if (WEAK_KEYWORD_TIPS.has(term)) return false;
  return true;
}

function buildImprovements({ skills, keywords, experience }) {
  const items = [];

  for (const skill of skills.missing) {
    if (items.length >= 5) break;
    items.push(`Add ${skill} inside a bullet you can honestly evidence, not only a skills list.`);
  }

  const namedSkills = new Set(
    [...skills.missing, ...skills.strong].map((skill) => skill.toLowerCase())
  );

  for (const { term } of keywords.missing) {
    if (items.length >= 5) break;
    if (!isUsefulKeywordTip(term)) continue;
    if (namedSkills.has(term) || [...namedSkills].some((skill) => skill.includes(term))) {
      continue;
    }
    const already = items.some((item) => item.toLowerCase().includes(term));
    if (already) continue;
    items.push(
      `Use the posting's wording for "${term}" if that work is already on your CV under different words.`
    );
  }

  if (
    items.length < 5 &&
    experience.requiredYears &&
    (experience.cvYears === null || experience.cvYears < experience.requiredYears)
  ) {
    items.push(
      `The posting asks for ${experience.requiredYears} years. Put the matching roles near the top so that number is easy to find.`
    );
  }

  if (items.length < 5 && experience.jobLevel && experience.cvLevel !== experience.jobLevel) {
    items.push(
      `The posting reads as ${experience.jobLevel}. Lead with the closest title and scope you actually held.`
    );
  }

  if (items.length < 5 && skills.strong.length) {
    items.push(
      `Keep ${skills.strong[0]} in a result bullet with a number, so it is proof rather than a claim.`
    );
  }

  if (!items.length) {
    items.push(
      "Your CV already covers the posting's main terms. Check that each one sits in a bullet with a result attached."
    );
  }

  return items.slice(0, 5);
}

export function scoreResumeJobMatch(jobText, cvText) {
  const keywords = keywordCoverage(jobText, cvText);
  const jobSkills = extractSkills(jobText);
  const cvSkills = extractSkills(cvText);
  const skills = skillsCoverage(jobSkills, cvSkills);
  const experience = experienceCoverage(jobText, cvText, keywords);

  const overall = Math.round(
    skills.score * 0.4 + keywords.score * 0.35 + experience.score * 0.25
  );

  return {
    overall,
    skills,
    keywords,
    experience,
    improvements: buildImprovements({ skills, keywords, experience }),
  };
}
