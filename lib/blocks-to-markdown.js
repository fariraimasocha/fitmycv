// Turns the structured `blocks` used by components/content/Blocks.jsx into
// CommonMark. Inline `**bold**` and `[label](href)` already live in the
// content, so they pass through.

function fence(text) {
  return String(text ?? "").replace(/\n+$/, "");
}

function tableCell(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", "<br>");
}

function renderTable({ head = [], rows = [] }) {
  const header = `| ${head.map(tableCell).join(" | ")} |`;
  const divider = `| ${head.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map(tableCell).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

export function blocksToMarkdown(blocks = []) {
  const parts = [];

  for (const block of blocks) {
    if (block.h2) {
      parts.push(`## ${block.h2}`);
      continue;
    }
    if (block.h3) {
      parts.push(`### ${block.h3}`);
      continue;
    }
    if (block.p) {
      parts.push(block.p);
      continue;
    }
    if (block.ul) {
      parts.push(block.ul.map((item) => `- ${item}`).join("\n"));
      continue;
    }
    if (block.ol) {
      parts.push(block.ol.map((item, i) => `${i + 1}. ${item}`).join("\n"));
      continue;
    }
    if (block.table) {
      parts.push(renderTable(block.table));
      continue;
    }
    if (block.callout) {
      const { title, body } = block.callout;
      parts.push(`> **${title}**\n>\n> ${String(body).replaceAll("\n", "\n> ")}`);
      continue;
    }
    if (block.compare) {
      const { title, context, before, after } = block.compare;
      parts.push(
        [
          title ? `### ${title}` : null,
          context || null,
          "**Before**",
          "",
          fence(before),
          "",
          "**After**",
          "",
          fence(after),
        ]
          .filter((line) => line !== null)
          .join("\n"),
      );
      continue;
    }
    if (block.steps) {
      parts.push(
        block.steps
          .map(({ title, body }, i) => `${i + 1}. **${title}.** ${body}`)
          .join("\n"),
      );
      continue;
    }
    if (block.cta) {
      const { title, body, href, label } = block.cta;
      parts.push(
        [`### ${title}`, body, href && label ? `[${label}](${href})` : null]
          .filter(Boolean)
          .join("\n\n"),
      );
    }
  }

  return parts.join("\n\n").trim();
}

export function faqsToMarkdown(faqs = [], heading = "FAQ") {
  if (!faqs.length) return "";
  const items = faqs.map(({ q, a }) => `### ${q}\n\n${a}`).join("\n\n");
  return `## ${heading}\n\n${items}`;
}

export function howToMarkdown(howTo) {
  if (!howTo) return "";
  const steps = (howTo.steps ?? [])
    .map((step, i) => `${i + 1}. **${step.name}.** ${step.text}`)
    .join("\n");
  return [`## ${howTo.name}`, howTo.description, steps].filter(Boolean).join("\n\n");
}

export function joinMarkdown(...sections) {
  return sections
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
