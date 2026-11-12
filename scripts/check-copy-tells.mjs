// Fails on writing patterns that read as AI filler, in the blog and the
// marketing pages. The list follows the writer skill's banned slop and the
// CLAUDE.md copy rules (no dashes as punctuation).
// Run: npm run check:copy        Run it before every content commit.
// ponytail: phrase list, not a classifier. Add a pattern when a draft slips
// one past review; drop one if it ever fires on a sentence a human would write.
import { readFileSync, readdirSync } from "node:fs";

const DIRS = ["content/blog", "content/pages"];

const TELLS = [
  [/—|–/, "em or en dash"],
  [/\s--\s/, "double hyphen used as a dash"],
  [/\bdelv(e|es|ing)\b/i, "delve"],
  [/\bin today's\b/i, "in today's"],
  [/\bhere's the thing\b/i, "here's the thing"],
  [/\bthe truth is\b/i, "the truth is"],
  [/\bpassionate about\b/i, "passionate about"],
  [/\bleverag(e|es|ed|ing)\b/i, "leverage"],
  [/\bgame[- ]changer\b/i, "game changer"],
  [/\bseamless(ly)?\b/i, "seamless"],
  [/\bunlock (your|the)\b/i, "unlock your"],
  [/\b(let's )?dive (in|into)\b/i, "dive into"],
  [/\blook no further\b/i, "look no further"],
  [/\belevate (your|the)\b/i, "elevate your"],
  [/\bwhether you're an?\b/i, "whether you're a"],
  [/\bin the (ever[- ]evolving|fast[- ]paced)\b/i, "ever-evolving / fast-paced"],
  // "It's not X, it's Y." The contrast frame that pads half of AI copy.
  [/(?<!\bif )\b(it|this|that)(?:'s| is) not [^.;:!?]{1,60}[,;] (it|this|that)(?:'s| is)\b/i, "it's not X, it's Y"],
];

let failures = 0;
for (const dir of DIRS) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
    readFileSync(`${dir}/${file}`, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments never render
        if (line.includes("copy-ok")) return; // a bad example quoted on purpose
        for (const [re, name] of TELLS) {
          const hit = line.match(re);
          if (hit) {
            failures++;
            console.log(`${dir}/${file}:${i + 1}  ${name}  "${line.trim().slice(Math.max(0, hit.index - 40), hit.index + 60)}"`);
          }
        }
      });
  }
}

if (failures) {
  console.error(`\ncheck:copy found ${failures} AI tell${failures === 1 ? "" : "s"}. Rewrite those lines in plain words.`);
  process.exit(1);
}
console.log("check:copy ok");
