// Fake CV used to render the public template gallery. The in-app picker
// previews the signed-in user's real CV; the marketing page has no user, so it
// shows this instead of an empty shell.
//
// Written to the same rules the templates and the blog argue for: Mon YYYY
// dates on the same line as the title, plain-text skill lines, boring section
// content. Keep it ASCII — see scripts/check-ats-chars.mjs.
export const SAMPLE_CV = {
  basics: {
    name: "John Doe",
    label: "Senior Backend Engineer",
    email: "john.doe@example.com",
    phone: "+1 555 0142",
    location: "Austin, TX",
    summary:
      "Backend engineer with eight years building payment and data systems at scale. Led the migration of a monolithic billing service to event-driven microservices handling 40M transactions a month. Comfortable owning a system end to end, from schema design to on-call.",
    profiles: [
      { network: "LinkedIn", url: "linkedin.com/in/johndoe" },
      { network: "GitHub", url: "github.com/johndoe" },
    ],
  },
  work: [
    {
      company: "Northwind Payments",
      position: "Senior Backend Engineer",
      location: "Austin, TX",
      startDate: "Mar 2022",
      endDate: "Present",
      description: [
        "Led the split of a monolithic billing service into six event-driven services, cutting p99 checkout latency from 1.8s to 240ms.",
        "Designed the idempotency layer behind 40M monthly transactions, reducing duplicate charge incidents to zero over 14 months.",
        "Mentored four engineers through the on-call rotation and wrote the runbooks the team still uses.",
      ].join("\n"),
    },
    {
      company: "Cobalt Analytics",
      position: "Backend Engineer",
      location: "Denver, CO",
      startDate: "Jun 2019",
      endDate: "Feb 2022",
      description: [
        "Built the ingestion pipeline that took the product from 200 to 4,000 customer accounts without added headcount.",
        "Cut warehouse spend 38% by rewriting the nightly aggregation jobs to incremental loads.",
        "Introduced contract testing across eight services, dropping integration failures in CI by roughly half.",
      ].join("\n"),
    },
    {
      company: "Bright Harbor Software",
      position: "Software Engineer",
      location: "Denver, CO",
      startDate: "Aug 2017",
      endDate: "May 2019",
      description: [
        "Shipped the public REST API and its client libraries, adopted by 60 integration partners in the first year.",
        "Automated the release process, taking deploys from fortnightly and manual to daily and unattended.",
      ].join("\n"),
    },
  ],
  education: [
    {
      institution: "University of Colorado Boulder",
      degree: "BSc",
      fieldOfStudy: "Computer Science",
      startDate: "Sep 2013",
      endDate: "May 2017",
    },
  ],
  skills: [
    { category: "Languages", skills: ["Go", "Python", "TypeScript", "SQL"] },
    {
      category: "Infrastructure",
      skills: ["AWS", "Kubernetes", "Terraform", "Kafka", "PostgreSQL"],
    },
    {
      category: "Practices",
      skills: ["Distributed systems", "CI/CD", "Observability", "Mentoring"],
    },
  ],
};
