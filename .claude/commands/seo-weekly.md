---
description: Weekly SEO audit. Pulls GSC and PostHog, ranks work by conversions, ships 1 or 2 QA-passed page changes as a PR.
---

You run FitMyCV's weekly SEO loop. You work alone, nobody answers questions. Today is the run date; use it as YYYY-MM-DD below.
Adapted from the RomeoSEO opportunity research, performance audit and content QA skills. The goal is paying customers, not clicks.

## 1. Load memory
- Read the newest 4 files in `docs/seo-weekly/` (may be none on the first run).
- `gh pr list --label seo-weekly --state all --limit 8 --json number,title,state,mergedAt,body`
- Anything already reported and unchanged is "already tracked". Do not report it again as new.
- For each page changed in a merged seo-weekly PR, compare its clicks, CTR and position now against the report that changed it. Say whether the change helped. This is how the loop learns.

## 2. Pull data
- `pnpm -s seo:data`. Compact GSC JSON: `current` and `previous` 7-day windows, `last28`. Rows carry `flags` (page2, lowCtr, severeLowCtr, scaling) and `mover` (positions gained, negative = lost).
- PostHog MCP, `execute-sql`. Load the `querying-posthog-data` skill first and confirm columns with `read-data-schema`. Use the sessions table for the last 7 and 28 days, broken down by `$entry_pathname`: sessions, organic search sessions (`$channel_type = 'Organic Search'`), and the number of those sessions' people who later fired `onboarding_completed`, `checkout_start` and `purchase_complete`. Every query needs a timestamp bound.
- If a source fails, carry on and list it under data gaps.

## 3. Audit
Find, with evidence:
- Rises and drops (`mover`, or clicks/impressions up or down 25% or more on real volume).
- Page-2 pushes: position 11 to 30 with business fit.
- CTR lifts: more than 200 impressions and CTR under 1%.
- Scaling pages: CTR over 3% and low impressions.
- New queries (`prevPos: null`) that show how customers phrase things.
- Cannibalization: several URLs splitting one intent.
- GSC vs PostHog mismatches.

Do not call normal fluctuation a problem. Ignore branded queries ("fitmycv", "fit my cv") for opportunities.

## 4. Score and choose
Score each candidate 0 to 5 on business fit, evidence strength, demand, rankability, conversion path, urgency, effort (reversed) and risk (reversed). Pages whose visitors sign up or pay get a higher score than pages that only get clicks.
Prefer improving an existing page over creating a new one. Create only when no page matches the intent.
Pick the top 1 or 2 actions. Never more than 2 page changes in one run.

## 5. Make the change
- Blog posts live in `content/blog/*.js` (`meta`, `faqs`, body exports). Landing and tool pages are in `content/pages/`. Copy an existing file's shape exactly. A new post also needs an image path, so reuse an existing image only if it fits; otherwise list the image as a manual follow-up.
- Invoke the `ux-writing` skill before writing copy. For blog bodies, use `claude-blog:blog-rewrite` (refresh) or `claude-blog:blog-write` (new).
- Follow CLAUDE.md copy rules: no em dash, en dash or double hyphen as punctuation; short plain sentences; second person; every claim must be backed by the product or data. Prices: check `lib/pricing.js`. Do not invent stats, quotes, reviews or features.
- Changing `title`, `seoTitle`, `description` or slug of a page that already ranks in the top 10 is risky. Do it only for a clear CTR problem, and write a risk note in the PR.
- Bump `meta.updated` on edited posts.

## 6. QA gate
Score the change 0 to 5 in each area: search intent fit, structure and usefulness (answer in the first section), human voice, SEO hygiene, product accuracy, competitor and source safety, links and schema (FAQ items match visible FAQs, internal links to a conversion page like `/ats-resume-checker` or `/tailor-cv-from-job-link`), publishing readiness.
Critical fails: wrong intent, no answer-first section, a wrong product or pricing fact, invented facts, a dash used as punctuation, a risky title change with no risk note.
PASS needs no critical fail, 32/40 or more, and no area under 3. Fix and re-score up to 2 times. If it still fails, revert that change and report why.
Then run `pnpm lint` and fix anything you introduced.

## 7. Write the report
`docs/seo-weekly/YYYY-MM-DD.md`:
- Summary: 3 to 6 bullets, what matters.
- Totals: this week vs last (clicks, impressions, CTR, position).
- Conversions by landing page (table).
- Findings: each with URL, query, numbers now vs before, why it matters, action, confidence, and new / repeat / already tracked.
- Last changes: did previous seo-weekly PRs help.
- This run's changes with QA verdict and score.
- Watch next week.
- Data gaps.

## 8. Open the PR
- `git checkout -b seo/weekly-YYYY-MM-DD`, commit the report and page changes with a plain message, `git push -u origin HEAD`.
- `gh pr create --label seo-weekly --title "SEO weekly YYYY-MM-DD: <main change>" --body <summary, changes, QA verdicts, risk notes, manual follow-ups>`.
- Never push to main. If there are no page changes, still open the PR with just the report.
