import { z } from "zod";

// JSON Patch (RFC 6902) for CV drafts, cut down to what the AI agent needs:
// add, replace and remove on the four CV sections. The agent proposes, this
// file decides whether the change is valid, and the user approves it.

// Lean Mongo documents carry nulls and _ids. Nulls become "", unknown keys drop.
const text = z
  .string()
  .nullish()
  .transform((value) => value ?? "");

export const cvShape = z.object({
  basics: z
    .object({
      name: text,
      label: text,
      email: text,
      phone: text,
      summary: text,
      location: text,
      profiles: z.array(z.object({ network: text, url: text })).default([]),
    })
    .prefault({}),
  work: z
    .array(
      z.object({
        company: text,
        position: text,
        location: text,
        startDate: text,
        endDate: text,
        description: text,
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        institution: text,
        degree: text,
        fieldOfStudy: text,
        startDate: text,
        endDate: text,
      }),
    )
    .default([]),
  skills: z
    .array(z.object({ category: text, skills: z.array(z.string()).default([]) }))
    .default([]),
});

const ROOTS = new Set(["basics", "work", "education", "skills"]);
const FORBIDDEN = new Set(["__proto__", "prototype", "constructor"]);

/** A CV reduced to the fields drafts carry, with blanks filled in. Throws on wrong types. */
export function normalizeCv(cv) {
  return cvShape.parse({
    basics: cv?.basics ?? undefined,
    work: cv?.work ?? undefined,
    education: cv?.education ?? undefined,
    skills: cv?.skills ?? undefined,
  });
}

function parsePath(path) {
  if (typeof path !== "string" || !path.startsWith("/")) {
    throw new Error(`"${path}" is not a JSON Pointer. Paths start with /, such as /basics/summary.`);
  }
  const tokens = path
    .slice(1)
    .split("/")
    .map((token) => token.replace(/~1/g, "/").replace(/~0/g, "~"));
  if (!ROOTS.has(tokens[0])) {
    throw new Error(`"${path}" is outside the CV. Paths start with /basics, /work, /education or /skills.`);
  }
  if (tokens.some((token) => FORBIDDEN.has(token))) throw new Error(`"${path}" is not allowed.`);
  return tokens;
}

function arrayIndex(token, array, allowEnd, path) {
  if (allowEnd && token === "-") return array.length;
  if (!/^\d+$/.test(token)) throw new Error(`"${path}" needs a list position where it has "${token}".`);
  const index = Number(token);
  if (index > array.length || (!allowEnd && index === array.length)) {
    throw new Error(`"${path}" points past the end of the list.`);
  }
  return index;
}

function child(parent, token, path) {
  const next = Array.isArray(parent)
    ? parent[arrayIndex(token, parent, false, path)]
    : Object.hasOwn(parent, token)
      ? parent[token]
      : undefined;
  if (next === null || typeof next !== "object") throw new Error(`"${path}" does not exist in the draft.`);
  return next;
}

/** The value at a pointer, or undefined when the path does not exist. */
export function getAtPath(cv, path) {
  try {
    const tokens = parsePath(path);
    let node = normalizeCv(cv);
    for (const token of tokens) {
      node = Array.isArray(node) ? node[arrayIndex(token, node, false, path)] : Object.hasOwn(node, token) ? node[token] : undefined;
      if (node === undefined) return undefined;
    }
    return node;
  } catch {
    return undefined;
  }
}

/**
 * Returns a new CV with the operations applied, or throws a message the agent
 * can act on. Operations apply in order, and the input is never mutated.
 */
export function applyCvPatch(cv, operations) {
  if (!Array.isArray(operations) || operations.length === 0) {
    throw new Error("A change needs at least one operation.");
  }

  const draft = structuredClone(normalizeCv(cv));

  for (const operation of operations) {
    const { op, path, value } = operation ?? {};
    if (!["add", "replace", "remove"].includes(op)) {
      throw new Error(`Unsupported operation "${op}". Use add, replace or remove.`);
    }
    const tokens = parsePath(path);
    if (tokens.length === 1 && op === "remove") throw new Error(`"${path}" would remove a whole section.`);
    if (op !== "remove" && value === undefined) throw new Error(`"${op}" at "${path}" needs a value.`);

    let parent = draft;
    for (const token of tokens.slice(0, -1)) parent = child(parent, token, path);
    const last = tokens.at(-1);

    if (Array.isArray(parent)) {
      if (op === "add") parent.splice(arrayIndex(last, parent, true, path), 0, value);
      else if (op === "replace") parent[arrayIndex(last, parent, false, path)] = value;
      else parent.splice(arrayIndex(last, parent, false, path), 1);
    } else {
      // A normalized draft already holds every real field, so a missing key is a typo.
      if (!Object.hasOwn(parent, last)) throw new Error(`"${path}" is not a CV field.`);
      if (op === "remove") delete parent[last];
      else parent[last] = value;
    }
  }

  const result = cvShape.safeParse(draft);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(`The change leaves an invalid value at /${issue.path.join("/")}: ${issue.message}.`);
  }
  return result.data;
}
