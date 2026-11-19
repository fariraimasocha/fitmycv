---
name: ceiling-breaker
description: Push a product past the "commodity ceiling" so it feels premium and worth paying for, then keep people coming back with honest progression. Covers every-state design (feedback, undo, next step), cross-screen consistency, failure recovery, controlled surprise, compounding progress and visible status. Use when a screen or flow "looks fine but feels generic", when reviewing limit, error, empty or offline states, when auditing consistency across pages, or when designing streaks, milestones, progress or retention mechanics.
---

# Ceiling breaker

Sources: Tim Gabe, two talks: "the commodity ceiling" (premium through lived
experience) and "three mechanisms behind addictive progression" (craving
machine, infinite game, invisible scoreboard).

AI tools make every product look decent, so looking decent is now the floor.
People don't detect "premium". They keep a quiet score of evidence that the
product is good, and that evidence lives in what it's like to *live in* the
product, not in how one screen looks. Part one gets you above the ceiling.
Part two keeps people there.

## Part one: break the ceiling

Work through these in order. Write the answer for each step down before changing code.

1. **Fill the gaps AI leaves out ("design theater").** AI builders explain
   good choices and then skip about a quarter of them, always the unglamorous
   ones. Walk the core flow and check every action against three questions:
   - **What just happened?** Visible feedback for every tap, upload and generate.
   - **Can I take it back?** Undo, edit or a clear way back.
   - **What do I do next?** One obvious next step. Never "nothing" where the
     user expected "anything".
2. **Make 80 screens feel like one product.** People use the product for
   months, not one screen at a time, and they badly underestimate how much
   small inconsistencies slow them down (a moved nav bar more than doubled
   time on page). Use it for an hour like a real user and list every spot
   where it stops feeling like the same product. When two screens handle the
   same situation, give them one pattern: same badge, same wording, same
   numbers. Example: two "out of sessions" screens became one pattern with a
   "2 of 2 used" badge, one plain line, and the exact refresh date.
3. **Design the worst moment as the finale.** Break it on purpose: turn off
   Wi-Fi mid-flow, fail a payment, hit every limit, empty every list, feed it
   a bad URL or a scanned PDF. Then design those states as carefully as the
   success screen. A failure handled well can leave people happier than if
   nothing broke (service recovery paradox). Every failure state answers:
   what went wrong, is my work safe, and what do I do now (with the button
   right there).

## Part two: keep them above it

Three mechanisms, and they stack. Use the honest version of each.

1. **Controlled surprise (the craving machine).** Most of the reward system
   stays predictable and transparent. Sprinkle in moments the user didn't see
   coming that are still true: a milestone noticed early, a bonus insight,
   a "your match score went up 12 points since your first CV". Track **one**
   measure of total progress people care about, not 20 scattered badges.
2. **No done state (the infinite game).** Audit for places where the user
   "finishes" the product and has no reason to return. Make progress compound
   into something worth keeping (a growing story bank, a stronger base CV,
   an application history with outcomes), not a counter that resets.
3. **Visible progress (the invisible scoreboard).** Progress people can see,
   compare with their own past, or choose to share, turns effort into
   identity. Design metrics as a mirror ("you vs. last month"), not a report.

## Ethics line for this repo

The talks admit these mechanics can trap people. FitMyCV helps people get a
job and then *leave*. So:

- **No fake randomness, no rigged odds, no hidden ratings** that steer results.
  Surprise must come from real data.
- **No loss-aversion traps.** Never threaten to take away work the user made.
  No streaks that punish a missed day. A job hunt ending is a win, celebrate it.
- **No public shaming.** Comparison is with the user's own past, or opt-in only.
  Never invent social proof or activity numbers.
- The CLAUDE.md copy rules apply: no dashes as punctuation, every claim
  checkable from the data, plain words. Respect `useReducedMotion()`, and no
  motion inside the CV document.

## FitMyCV map

| Where | Ceiling check |
|---|---|
| Tailor (`app/(app)/dashboard/tailor`) | Feedback during generation, undo or edit after, next step to cover letter or download |
| Limits (`components/UpgradePromptModal.jsx`, `dashboard/upgrade`) | One pattern everywhere: what was used, how many, exact reset date |
| Errors (`dashboard/error.js`, `components/dashboard/DashboardLoadError.jsx`, `components/ErrorPage.jsx`) | Is my work safe, what now, a retry or support button right there |
| Empty lists (`components/dashboard/DashboardEmptyState.jsx`) | An empty list is onboarding, never a dead end |
| Upload (`components/ResumeUpload.jsx`, `UploadProgress.jsx`) | Bad PDF, scanned PDF, dropped connection mid-upload |
| Progress (`DashboardActivation.jsx`, `DashboardActivityChart.jsx`, `CvHealthCard.jsx`) | One honest measure that compounds, shown as a mirror |

## How to apply

- Report findings as a short list grouped by part and step, each with the
  file, the state that's missing, and the smallest fix.
- **Smallest change first** (ponytail). Reuse existing components, sonner
  toasts with an `action`, and `motion/react`. No new dependency for a state.
- Pair with `peak-end-moments` for the success peak, `behavior-design` for
  wait states, and `ux-writing` for every line of copy you touch.
- Measure in PostHog before and after: drop-off at the state you fixed.
