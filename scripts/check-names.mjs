// npm run check:names
import { firstNameOf } from "../lib/announcement-email.js";

const { strict: assert } = await import("node:assert");
const cases = [
  ["Tawanda Mugadza", "Tawanda"],
  ["tashinga pamuke", "Tashinga"],       // all lowercase
  ["ARNOLD CHIBVONGODZE", "Arnold"],     // ALL CAPS
  ["ABDUL-LATIF AKUDUGU", "Abdul-Latif"],// caps across a hyphen
  ["BJ Kimberly", "BJ"],                 // short initialism keeps its shape
  ["Beyonce\u0301 Esther Mwale", "Beyonce\u0301"], // accents survive
  ["Ju\u0301lian Milla\u0301n", "Ju\u0301lian"],
  ["S M Asraful Islam", "Asraful"],      // skips initials
  ["i chabs", "Chabs"],
  ["Dr. Sharmila", "Sharmila"],          // skips the honorific
  ["Admire007 Muwish", "Admire"],        // strips digits
  [",fmkfkf Djdjdjf", "Fmkfkf"],         // strips leading punctuation
  ["ASHELL GONESE (A.T.G 1738)", "Ashell"],
  ["S. K.", "there"],                    // nothing usable
  ["", "there"],
  [null, "there"],
  [undefined, "there"],
  ["   ", "there"],
];
for (const [input, expected] of cases) {
  assert.equal(
    firstNameOf(input),
    expected,
    `firstNameOf(${JSON.stringify(input)}) gave ${JSON.stringify(firstNameOf(input))}, wanted ${JSON.stringify(expected)}`,
  );
}
console.log(`firstNameOf: ${cases.length} cases pass`);
