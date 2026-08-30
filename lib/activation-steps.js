// The three post-onboarding steps. The onboarding payoff screen and the
// dashboard checklist render the same list, so the wizard's last screen and
// the dashboard's first screen say the same thing.
//
// Only the first two are reachable on the free plan — /api/applications is
// behind requirePremium — so the third is appended for premium users only.
// Without that, a free user's checklist could never complete.
export const ACTIVATION_STEPS = [
  {
    key: "resume",
    title: "Add your CV",
    description:
      "One upload becomes the source for every tailored application.",
    href: "/dashboard/resume",
    cta: "Upload your CV",
  },
  {
    key: "tailor",
    title: "Tailor your first CV",
    description:
      "Paste a job URL, get a rewritten CV and a matching cover letter.",
    href: "/dashboard/tailor",
    cta: "Tailor a CV",
  },
];

export const PREMIUM_ACTIVATION_STEP = {
  key: "applications",
  title: "Track your applications",
  description: "Keep every role you have applied to in one pipeline.",
  href: "/dashboard/applications",
  cta: "Open your pipeline",
};

export function getActivationSteps(isPremium) {
  return isPremium
    ? [...ACTIVATION_STEPS, PREMIUM_ACTIVATION_STEP]
    : ACTIVATION_STEPS;
}
