// npm run check:sentences
import { countSentences } from "../utils/count-sentences.js";

const eq = (got, want, label) => {
  if (got !== want) throw new Error(`${label}: got ${got}, want ${want}`);
};
eq(countSentences(""), 0, "empty");
eq(countSentences("   "), 0, "whitespace");
eq(countSentences("No terminator yet"), 1, "no terminator");
eq(countSentences("One. Two! Three?"), 3, "three sentences");
eq(countSentences("Done. Trailing fragment"), 1, "trailing fragment uncounted");
eq(countSentences("Wait... really?"), 2, "ellipsis");
console.log("countSentences OK");
