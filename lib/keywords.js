// Keyword extraction shared by the free keyword tools and the hero job link
// preview. Runs in the browser: no model call, no storage.

// Words that carry no signal when matching a CV against a posting. The second
// block is job-advert boilerplate. Without it the top of the list fills up
// with "strong experience", "essential", and "responsibilities".
export const STOP_WORDS = new Set(
  `a about above after again against all also am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves

   ability able across additional advantage apply applicant applicants bonus build built candidate candidates career company culture description desirable duties employment ensure ensuring environment essential etc excellent experience familiar familiarity fast focus following friendly get getting good great growing help including involved job join key like looking love make making must need needs new nice offer opportunity part passionate people plus position preferred proven provide ran range required requirement requirements responsibilities responsibility role roles run running skill skills strong take team teams understanding using want well work working world would years hiring hire seeking reports head senior junior write someone know every day location`
    .split(/\s+/)
    .filter(Boolean)
);

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^[-./]+|[-./]+$/g, ""))
    .filter((word) => word.length > 1);
}

/**
 * Crude suffix stripping so "mentored" matches "mentor" and "services" matches
 * "service". Not a real stemmer. It only needs to stop obvious inflections
 * from being reported as missing keywords.
 */
export function stem(word) {
  if (word.length <= 4) return word;
  for (const suffix of ["ing", "ies", "ed", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      const base = word.slice(0, -suffix.length);
      return suffix === "ies" ? `${base}y` : base;
    }
  }
  return word;
}

// A token with no letters ("4+", "2026") is never a keyword.
export const isContent = (word) => word && /[a-z]/.test(word) && !STOP_WORDS.has(word);


/**
 * Ranks the terms a posting leans on. Unigrams score by frequency; bigrams are
 * only admitted when the exact phrase recurs, which keeps real compounds
 * ("project management", "incident response") and drops one-off prose
 * fragments ("build distributed", "run services").
 *
 * `score` is the ranking weight (bigrams are boosted). `count` is the raw
 * number of times the term appears, which is the only number gaps mode is
 * allowed to put on screen.
 *
 * ponytail: `count` counts the literal token, so a posting that writes
 * "managing" three times and "manage" once reports them as two terms rather
 * than one term mentioned four times. Stemming is applied when matching
 * against the CV, not when counting the posting.
 */
// Nouns only places follow. Either case on the first letter, so a sentence
// can start with one ("Travel to Kitwe").
const PLACE_NOUNS = "clients customers offices? branch(?:es)? stores? shops? sites? schools? hospitals? clinics? regions? markets? cities towns areas? provinces? countries locations? partners suppliers communities warehouses? depots? plants travel travelling traveling relocate relocating commute".split(" ");

// "Acme Retail is hiring", "About Acme", "Join Acme": the company name is not
// a keyword. Same line only, so a job title on the line above is never caught.
// ponytail: three phrasings, not entity detection. A name the posting only
// writes as "at Acme" still slips through.
const COMPANY_PATTERNS = [
  /([A-Z][\w&.'-]*(?:[ \t]+[A-Z][\w&.'-]*){0,2})[ \t]+(?:is|are)[ \t]+(?:hiring|looking|seeking|recruiting)\b/g,
  /\b(?:About|Join)[ \t]+([A-Z][\w&.'-]*(?:[ \t]+[A-Z][\w&.'-]*){0,2})/g,
  // Places the posting marks as places: "based in London", "Location: Cape Town".
  /\b(?:based|located|team|office|offices|role|hybrid|remote)[ \t]+in[ \t]+([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){0,2})/g,
  /\bLocation[ \t]*:[ \t]*([A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){0,2})/g,
  // Any town, listed or not, after a noun only places follow: "clients in
  // Polokwane", "branches across Limpopo and Mpumalanga", "travel to Kitwe".
  new RegExp(
    `\\b(?:${PLACE_NOUNS.map((w) => `[${w[0].toUpperCase()}${w[0]}]${w.slice(1)}`).join("|")})` +
      "[ \\t]+(?:in|to|across|throughout|around)[ \\t]+" +
      "((?:[A-Z][a-z]+)(?:,?[ \\t]+(?:and[ \\t]+|or[ \\t]+)?[A-Z][a-z]+){0,4})",
    "g"
  ),
  // "Polokwane-based", "a Harare based team".
  /\b([A-Z][a-z]+)[ \t-]based\b/g,
];

// Big cities in the markets FitMyCV serves, matched only when capitalised. A
// posting names them as the place, never as a skill. Names that are also words
// or tools (Reading, Bath, Mobile, Phoenix) are left out on purpose.
const CITIES = [
  "Johannesburg", "Cape Town", "Durban", "Pretoria", "Gqeberha", "Port Elizabeth", "Bloemfontein", "Sandton", "Centurion", "Stellenbosch",
  "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Nairobi", "Mombasa", "Accra", "Kumasi", "Harare", "Bulawayo", "Lusaka", "Kampala", "Kigali", "Dar es Salaam", "Cairo", "Casablanca",
  "Mumbai", "New Delhi", "Delhi", "Bangalore", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata", "Gurgaon", "Gurugram", "Noida",
  "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Edinburgh", "Bristol", "Liverpool", "Cardiff", "Belfast",
  "Warsaw", "Krakow", "Kraków", "Wroclaw", "Gdansk", "Poznan", "Berlin", "Munich", "Hamburg", "Frankfurt", "Dublin", "Amsterdam", "Paris", "Madrid", "Barcelona", "Lisbon",
  "New York", "San Francisco", "Seattle", "Boston", "Chicago", "Los Angeles", "Toronto", "Vancouver", "Sydney", "Melbourne", "Dubai", "Singapore",
];

// Every country name, from the runtime's own region list. Built once, lazily.
// ponytail: countries only. A city counts only when a pattern above marks it.
// Null on an old runtime without Intl.DisplayNames: countries are then skipped.
const REGION_NAMES =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

let countryNames = null;
function countries() {
  if (countryNames) return countryNames;
  countryNames = [];
  if (!REGION_NAMES) return countryNames;
  for (let a = 65; a <= 90; a += 1) {
    for (let b = 65; b <= 90; b += 1) {
      const code = String.fromCharCode(a, b);
      const name = REGION_NAMES.of(code);
      if (name && name !== code) countryNames.push(name.toLowerCase());
    }
  }
  return countryNames;
}

/**
 * Lowercase words of the company name and the places the posting names. None
 * of them are keywords a CV should add.
 */
export function companyWords(text) {
  const words = new Set();
  // The tokeniser keeps "gweru-based" whole, so that form goes in too.
  const addWords = (phrase) =>
    tokenize(phrase).forEach((word) => {
      if (!isContent(word)) return;
      words.add(word);
      words.add(`${word}-based`);
    });
  for (const pattern of COMPANY_PATTERNS) {
    for (const match of text.matchAll(pattern)) addWords(match[1]);
  }
  for (const city of CITIES) {
    if (new RegExp(`\\b${city}\\b`).test(text)) addWords(city);
  }
  const lower = ` ${tokenize(text).join(" ")} `;
  for (const name of countries()) {
    if (lower.includes(` ${tokenize(name).join(" ")} `)) addWords(name);
  }
  return words;
}

/** Filter for terms from the tools that keep their own extractor copy. */
export function notCompanyTerm(jobText) {
  const company = companyWords(jobText);
  return (term) => !term.toLowerCase().split(" ").every((word) => company.has(word));
}

export function extractTerms(text, limit) {
  const company = companyWords(text);
  // Blank, not removed, so the words either side never join into a phrase.
  const tokens = tokenize(text).map((token) => (company.has(token) ? "" : token));
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
      .map(([term, count]) => ({
        term,
        count,
        score: count * 1.8,
        words: term.split(" "),
      })),
    ...[...unigrams.entries()].map(([term, count]) => ({
      term,
      count,
      score: count,
      words: [term],
    })),
  ].sort((a, b) => b.score - a.score);

  // A unigram already carried by a higher-ranked phrase adds nothing.
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
