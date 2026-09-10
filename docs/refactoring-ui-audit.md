# FitMyCV: Refactoring UI audit

## Context

An audit of the app's UI against *Refactoring UI* (Wathan & Schoger), covering all
eight chapters from "Starting from Scratch" to "Finishing Touches".

Every item is verified in the code with a file reference and names the chapter it
comes from. **Tier 1 is fixed.** Tiers 2 and 3 are open.

Scope and its limits: the counts below come from pattern searches across all 120 UI
files, so they are totals rather than samples. But only nine files were read in
full, and the app was never rendered during the audit. That means this is a
reliable inventory of defects with a textual signature (a colour outside the ramp, a
missing max-width) and an unreliable one for composition, which is what the
"Hierarchy is Everything" chapter is mostly about. Judging whether a screen has one
clear focal point needs eyes on it. `/dashboard` and `/dashboard/tailor` are the two
densest screens and the most likely to hide something this pass could not see.

## The headline

Your **design tokens already follow the book closely**. `app/globals.css` has warm
greys (`--landing-ink: #1a1a1a` / `--landing-ink-soft: #5c5c5c` over `#f7f4ef`
paper, which is "Greys don't have to be grey" done right), two-part shadows
(`--landing-shadow` pairs a soft ambient shadow with a tight dark one, which is
"Shadows can have two parts"), an accent ramp with measured contrast ratios in a
comment, and borderless cards that lean on shadow instead (`.dashboard-card`,
whose comment reasons about exactly the "Use fewer borders" trade-off).

So the gap is not the system. **The gap is component drift away from it.** Almost
everything below is a component ignoring a token or recipe that already exists.

## Tier 1: visible in a screenshot — FIXED

**1. The tab bar stretches the full page width.**
`components/dashboard/DashboardTabBar.jsx:10` sets `w-full sm:w-auto`, but both
call sites put it in a `flex flex-col` parent
(`app/dashboard/tailored/[id]/page.js:268`, `app/dashboard/tailor/page.js`).
Flex defaults to `align-items: stretch`, so `w-auto` does not stop the track from
filling the row. The pills occupy the left third and the border runs to the right
edge.
→ *"You don't have to fill the whole screen"*: give each element just the space it
needs.
*Fixed:* added `sm:self-start`. A stretch is stopped by an alignment, not a width.

**2. Reading text has no line-length limit.**
`components/CoverLetterCard.jsx:94` renders the cover letter in a bare `<p>`, and
`components/WhyThisRoleCard.jsx` does the same with its textarea. Inside a
`max-w-4xl` shell (`DashboardPageShell`) at 14px, that is roughly 120 to 150
characters per line.
→ *"Keep your line length in check"*: 45 to 75 characters, 20 to 35em. These are
the two screens where the user actually reads prose, so it is the worst place to
lose this.
*Fixed:* `max-w-prose` (65ch) on both bodies and both textareas.

**3. Card-header icons carry the same contrast as the headings.**
Three cards pass a bare icon into `CardTitle` so it inherits full ink:
`components/CoverLetterCard.jsx:39`, `components/CompanyResearchCard.jsx:57,83`,
`components/WhyThisRoleCard.jsx:53`. (An earlier draft of this doc also named
`ATSScoreCard`; that card has no header icon.)
→ *"Balance weight and contrast"*: solid icons cover more surface area than text,
so at equal color they read as heavier than the title they sit beside. The book's
fix is to lower the icon's contrast, not its size.
*Fixed:* `text-muted-foreground` on all four icons.

**4. Washed-out text on the one dark card.**
`app/dashboard/page.jsx:321` used `text-background/70` on a `bg-foreground` panel.
→ *"Don't use grey text on colored backgrounds"*: overlaying white at reduced
opacity desaturates whatever sits under it and reads as disabled. Hand-pick a
solid colour at the background's hue instead.
*Fixed:* new `--landing-ink-inverse-soft` token, measured at 8.8:1.
Worth being honest about this one: it is the weakest of the four. The surface is
nearly neutral (chroma 0.02), so there was little saturation for the white overlay
to kill, and the old value measured 13.5:1 rather than failing contrast. The gain
is structural (a named, reusable, hue-matched shade instead of an alpha composite)
more than visible.

**5. White text on a white card. Not from the book, found while doing item 4.**
`app/support/page.js:107-115` styled the contact card's icon, heading and body as
`text-white` / `text-white/80` / `bg-white/15`, but its container
`.landing-card-strong` has `background: var(--landing-surface)`, which is
`#ffffff`. The heading and paragraph were invisible on the live page. The block
was evidently written when that class was dark and never updated when the landing
palette was reworked.
*Fixed:* switched to the ink tokens. Only the button inside was ever visible,
because `.landing-secondary-btn` sets its own colour.

## Tier 2: systematic drift

**5. Twenty-six uses of sub-12px text.**
`text-[10px]`, `text-[9px]`, `text-[11px]`, `text-[0.6rem]`, `text-[0.65rem]`
across nine files: `components/dashboard/DashboardActivation.jsx:63,105`,
`app/dashboard/applications/page.js:163,189`,
`app/dashboard/story-bank/page.js:36,72`, `components/nav-main.jsx:19`,
`components/TemplatePicker.jsx:89`, `components/tools/KeywordChecker.jsx:117`,
and 11 in `components/ResumePreview.jsx`.
→ *"Size isn't everything"*: leaning on font size for hierarchy produces secondary
content that is too small. Use a lighter color or a lighter weight and keep the
size readable. The `ResumePreview` ones are arguable, since that is a scaled CV
document, but the app-chrome ones are labels shrunk to get out of the way.
These also violate your own CLAUDE.md rule against bracket syntax.

**6. Card padding: 18 files inline, 6 using the recipe.**
`globals.css` defines `.dashboard-card-pad` and `.dashboard-row-pad` with a
comment saying "two padding recipes only" because cards previously had four
different insets. Only 6 files use them. Eighteen set `px-4 py-4 sm:px-6` and
friends inline, including `CoverLetterCard.jsx:64`, `ATSScoreCard.jsx`,
`ResumeForm.jsx`, `InterviewPrepCard.jsx`, `DashboardActivation.jsx`, and eight
dashboard pages.
→ *"Limit your choices"* and *"Establish a spacing and sizing system"*: the system
only pays off if it is the path of least resistance. Content starts at a different
left edge in different blocks of the same column.

**7. Raw Tailwind palette in app chrome.**
155 uses of stock palette colors: 82 `gray-*` plus `blue`, `purple`, `rose`,
`yellow`, `emerald` in `components/LinkedInOutreachModal.jsx`,
`components/CompanyResearchCard.jsx`, `app/dashboard/profile/page.jsx`,
`components/ui/download-button.jsx`, `components/ui/checkbox-field-input.jsx`.
→ *"Greys don't have to be grey"*: Tailwind's `gray` is cool, your paper is warm,
so cool grey text on warm paper reads slightly dirty. And *"Define your shades up
front"*: ad-hoc hues outside the ramp mean "you might as well have no color
system at all."
Exclude `components/ResumePreview.jsx` and `app/print/page.js` from this. Those
render the CV document itself and neutral grey is correct there.

## Tier 3: content

**8. Six dead-end empty states inside cards.**
Your page-level empty states are good: `DashboardEmptyState` gives an icon in a
shape, a title, a description, and a CTA, and the "icon in a shape" choice is
straight out of *"Everything has an intended size."* But the in-card ones are a
single grey line with nothing to click: `CoverLetterCard.jsx:99` ("No cover
letter generated yet."), `ResumeForm.jsx:240,313,416,506`, and
`WhyThisRoleCard.jsx:106`.
→ *"Don't overlook empty states"*: an empty state is a user's first interaction
with a feature, and should carry the call to action rather than describe absence.
Per CLAUDE.md, rewriting these needs the `ux-writing` skill.

## Not problems, do not "fix"

Checked against the book and already correct, listed so a later pass does not
undo them:

- Type scale sits on Tailwind's hand-crafted scale, not a modular ratio, which is
  what the book recommends for UI work.
- Line height is inversely proportional to size: `--landing-heading` 1.08,
  `.dashboard-body` 1.75 at 14px, `leading-none` on the big stat numbers.
- `.landing-copy` caps at `34em`, inside the 20 to 35em target.
- Button hierarchy holds: at most two solid dark buttons per file, outline for
  secondary.
- `.dashboard-tab-pills` computes its outer radius as inner + padding, which is
  the nested-radius detail most designs get wrong.
- The `prefers-reduced-motion` block at the end of `globals.css`.

## Verifying

Tier 1: `npx eslint` passes on all seven touched files. Not yet checked in a
browser, which is how items 1 and 3 should really be judged. `npm run dev`, then
`/dashboard/tailored/<id>` for items 1 to 3, `/dashboard` for item 4, `/support`
for item 5.
