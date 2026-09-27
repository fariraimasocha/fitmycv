// Jev (TypeSafe) judges which parts of the reference CV matter for a job, so
// the Groq rewrite gets relevance as a given instead of working it out while
// it writes. One call, every question answered in parallel. Docs:
// https://docs.typesafe.ai/api
const ENDPOINT = "https://api.typesafe.ai/v1/systemone";

// ponytail: untuned thresholds, adjust after reading a few real tailors.
const STRONG = 1.5; // score levels are 0 to 2
const WEAK = 0.5;
const ASKS_FOR = 0.5;
const MAX_QUESTIONS = 150;

// Stored CVs keep a role's bullets in one `description` string; the tailored
// shape uses `highlights`. Accept either.
function roleLines(role) {
  if (Array.isArray(role.highlights)) return role.highlights.filter(Boolean);
  return (role.description || "")
    .split(/\n+/)
    .map((line) => line.replace(/^[\s•*·-]+/, "").trim())
    .filter((line) => line.length > 15);
}

function skillNames(cv) {
  const names = (cv.skills || []).flatMap((group) =>
    typeof group === "string" ? [group] : group.skills || group.keywords || [],
  );
  return [...new Set(names.map((s) => String(s).trim()).filter(Boolean))];
}

export function buildQuestions(cv) {
  const questions = {};
  const lookup = {};
  (cv.work || []).forEach((role, r) => {
    roleLines(role).forEach((highlight, i) => {
      const id = `h_${r}_${i}`;
      lookup[id] = { role: `${role.position || "Role"} at ${role.company || "company"}`, text: highlight };
      questions[id] = {
        type: "score",
        instructions: {
          highlight,
          question: "How directly does `highlight` show experience this job asks for?",
        },
        criteria: ["Not relevant", "Loosely related", "Directly relevant"],
      };
    });
  });
  skillNames(cv).forEach((skill, k) => {
    const id = `s_${k}`;
    lookup[id] = { text: skill };
    questions[id] = {
      type: "noul",
      instructions: { skill, question: "Does this job ask for `skill` or a close equivalent?" },
    };
  });
  const ids = Object.keys(questions).slice(0, MAX_QUESTIONS);
  return { questions: Object.fromEntries(ids.map((id) => [id, questions[id]])), lookup };
}

export function formatNotes(answers, lookup) {
  const strong = {};
  const weak = [];
  const skills = [];
  for (const [id, answer] of Object.entries(answers)) {
    const item = lookup[id];
    if (!item) continue;
    if (answer.type === "score") {
      if (answer.score >= STRONG) (strong[item.role] ??= []).push(item.text);
      else if (answer.score < WEAK) weak.push(item.text);
    } else if (answer.type === "noul" && answer.noul >= ASKS_FOR) {
      skills.push(item.text);
    }
  }
  const lines = [];
  for (const [role, texts] of Object.entries(strong)) {
    lines.push(`Directly relevant (${role}):`, ...texts.map((t) => `- ${t}`));
  }
  if (weak.length) lines.push("Not relevant to this job:", ...weak.map((t) => `- ${t}`));
  if (skills.length) lines.push(`Skills this job asks for: ${skills.join(", ")}`);
  return lines.join("\n");
}

/** Relevance notes for the tailor prompt, or "" when Jev is off or fails. */
export async function relevanceNotes(cv, job) {
  if (!process.env.JEV) return "";
  const { questions, lookup } = buildQuestions(cv);
  if (!Object.keys(questions).length) return "";

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.JEV}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "jev-latest",
        state: {
          title: job.title,
          company: job.company,
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          qualifications: job.qualifications || [],
        },
        questions,
      }),
      // Tailoring must never wait long on, or fail because of, this step.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.warn(`Jev relevance skipped: HTTP ${res.status}`, await res.text());
      return "";
    }
    const { answers, model, usage } = await res.json();
    const notes = formatNotes(answers || {}, lookup);
    console.log(
      `Jev relevance ok: ${model}, ${Object.keys(questions).length} questions, ${usage?.input_tokens} input tokens, ${notes ? notes.split("\n").length : 0} note lines`,
    );
    return notes;
  } catch (err) {
    console.warn("Jev relevance skipped:", err.message);
    return "";
  }
}
