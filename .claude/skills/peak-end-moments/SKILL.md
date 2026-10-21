---
name: peak-end-moments
description: Design the peak and the ending of a user flow so the whole flow is remembered well (Kahneman's peak-end rule). Use when building or reviewing a core flow, a success screen, a completion state, onboarding, a wait screen, or when asked why a flow "feels flat" or "just ends".
---

# Peak and end moments

Source: Tim Gabe, "The Tiny Design Rule Behind Top 1% Apps" (youtube.com/watch?v=11h4H3TAGkM).

People don't remember a flow as a whole. They remember how they felt at its
**peak** (the most intense moment) and at its **end** (the last moment).
Everything in between fades. Disney, Airbnb, Ahead and Uber all design those
two moments on purpose, even when other parts are imperfect.

## The checklist

Work through these in order. Write the answer for each step down before changing code.

1. **Map the flow.** List every step of the flow you are touching, from entry
   to finish. For each step, note where the user waits, where stress peaks,
   and where nothing happens.
2. **Pick one peak.** Choose a single moment, usually right after the user
   finishes the core task or invests the most effort. Lift it above what they
   expect: a short animation, a reveal, a summary built in front of them, or
   copy that names what they just got. One peak per flow. Don't spread the
   delight thin.
3. **Design the end.** Never let a flow just stop. Close it by doing at least one of these:
   - celebrate what was done
   - reaffirm progress
   - point to the next step

   A check mark, a summary card or one honest sentence is enough, as long as it was designed on purpose.
4. **Vacuum the low points.** Negative moments stick as hard as positive ones.
   Find the wait screens, error states and long forms where someone could feel
   stuck. Add uplifting microcopy, help them before they ask, or use the wait
   to show something useful.
5. **Measure and vary.** Change one thing at a time (timing, icon or emoji,
   motion or static). Watch drop-off in PostHog before and after.

## FitMyCV map

| Flow | Peak | End |
|---|---|---|
| Tailor a CV (`app/(app)/dashboard/tailor`) | The tailored CV appearing next to the job, with the ATS score | The PDF download, then a clear next step (Applications, cover letter) |
| Upload reference CV (`dashboard/resume`) | Parsed sections appearing from the PDF | "CV saved" plus "Tailor to a job" |
| Free tools (`components/tools`) | The result or score reveal | One line on what to do next, and the handoff to the tailor |
| Upgrade (`payment/success`) | Pro switching on | Landing on the dashboard with Pro features visible |

## Rules for this repo

- **Honest peaks only.** A peak celebrates something that really happened.
  Never invent numbers or progress. The CLAUDE.md copy rules apply: no dashes
  as punctuation, every claim checkable from the data.
- **Motion:** use `motion/react`, which is already installed. Respect
  `useReducedMotion()` the way `components/dashboard/DashboardEmptyState.jsx`
  does. Keep it under about 400ms and never block the user's next action.
- **Endings use what exists:** a sonner toast with an `action`, the
  `DashboardEmptyState` next action, or an inline summary. No new dependency.
- **Smallest change first** (ponytail). One peak and one ending per flow,
  not a confetti system.
