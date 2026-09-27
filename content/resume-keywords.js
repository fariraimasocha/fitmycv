// Role + problem pages: /<role>-resume-keywords
//
// Each role carries its own vocabulary, its own placement rules, its own
// worked evidence, and its own failure modes. The builder at the bottom only
// supplies the frame (headings, tool, CTA, two shared FAQs). Everything a
// reader is here for comes from the role payload, because a page that swaps
// one job title into shared prose is worth nothing to the person reading it
// and nothing to the search result it is trying to win.

const ROLES = [
  {
    slug: "software-engineer",
    role: "Software Engineer",
    plural: "software engineers",
    examplePath: "/resume-examples/software-engineer",
    seoTitle: "Software Engineer Resume Keywords: The 2026 List",
    description:
      "The keywords software engineering postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "software engineer resume keywords",
      "software developer resume keywords",
      "backend developer resume keywords",
      "frontend developer resume keywords",
      "ats keywords for software engineer resume",
      "software engineer resume skills",
      "technical resume keywords",
    ],
    lede:
      "The terms engineering postings actually repeat, grouped by where they belong on the page. Copy nothing you have not done. Every term below is only worth adding if you can point at the work behind it.",
    why:
      "Engineering adverts are unusually literal. They name the language, the cloud, the orchestrator and the database, often in the same sentence, and a recruiter later searches their applicant tracking system for those exact strings. That is why an engineer with eight years of Go experience gets filtered out by a Go role: the CV says **Golang** and the search said **Go**, or the CV says **k8s** and the search said **Kubernetes**. Write both forms once and the problem disappears.",
    groups: [
      {
        title: "System and craft",
        note: "The nouns that describe what you can be trusted to own. These matter more than the language list and are the part most CVs leave out.",
        terms: [
          "system design", "distributed systems", "microservices", "API design",
          "data modelling", "concurrency", "performance optimisation",
          "scalability", "code review", "automated testing", "debugging",
          "technical design document",
        ],
      },
      {
        title: "Languages and frameworks",
        note: "List only what you would be willing to be interviewed on this week. Spell out anything with a common short form: Go (Golang), TypeScript (TS), JavaScript (JS).",
        terms: [
          "Go", "Python", "Java", "TypeScript", "JavaScript", "C#", "Rust",
          "Kotlin", "React", "Node.js", "Spring Boot", "Django", "SQL",
        ],
      },
      {
        title: "Infrastructure and tooling",
        note: "The cluster of terms that decides whether a platform or infrastructure role surfaces you at all. Name the cloud you actually used, not all three.",
        terms: [
          "AWS", "GCP", "Azure", "Docker", "Kubernetes (k8s)", "Terraform",
          "CI/CD", "GitHub Actions", "observability", "Datadog", "Prometheus",
          "PostgreSQL", "Redis", "Kafka", "infrastructure as code",
        ],
      },
      {
        title: "How you work",
        note: "Seniority is signalled here, not by a number of years. On-call and incident response say more about your level than any adjective.",
        terms: [
          "Agile", "Scrum", "on-call", "incident response", "postmortem",
          "SLO", "mentoring", "pair programming", "technical documentation",
          "cross-functional",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with built or worked on. Each one implies a before and an after, which is what forces a number out of you.",
        terms: [
          "shipped", "migrated", "refactored", "profiled", "instrumented",
          "scaled", "hardened", "decomposed", "owned", "mentored",
        ],
      },
    ],
    placement: [
      {
        title: "Skills block: languages, frameworks, infrastructure",
        body: "A compact, honest list near the top. Group it (Languages, Infrastructure, Data) rather than running forty items together. This block exists to be found by a search, not to be read.",
      },
      {
        title: "Bullets: system and craft terms",
        body: "**system design**, **distributed systems** and **performance optimisation** mean nothing in a skills list. In a bullet with a latency number attached, they are the whole argument.",
      },
      {
        title: "Headline: the two that define you",
        body: "Your discipline plus the one or two technologies you want the next role built on. 'Senior Backend Engineer | Go, Kubernetes, Payments' does more work than a paragraph.",
      },
      {
        title: "Nowhere: proficiency bars and logo grids",
        body: "A five-star rating for Python is unverifiable and parsers read the image as nothing. Cut them and put the space into evidence.",
      },
    ],
    evidence: [
      {
        title: "performance optimisation",
        context: "The keyword is present in both. Only the second proves it.",
        before: "Skills: performance optimisation, profiling, PostgreSQL",
        after:
          "Profiled the 12 slowest endpoints and added covering indexes, cutting p95 latency from 840ms to 210ms and removing a planned read replica from the roadmap.",
      },
      {
        title: "Kubernetes",
        context: "One of these survives a technical interview.",
        before: "Experience with Docker, Kubernetes and CI/CD pipelines.",
        after:
          "Migrated 14 services from EC2 to Kubernetes with zero customer-visible downtime, cutting deploy time from 40 minutes to 6.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will design and own backend services in Go, run them on Kubernetes, and take part in the on-call rotation. We expect strong system design, comfort with distributed systems, and a track record of shipping. Experience with AWS, Terraform and observability tooling is highly desirable.\"\n\nEight of the terms above appear in four sentences. That density is normal, and it is why a generic CV loses to a tailored one on identical experience.",
    },
    pitfalls: [
      "**A logo wall instead of a skills block.** Thirty technologies at the top signals that none of them is yours. Cut to what you would defend in an interview.",
      "**Seniority claimed in years, not scope.** '8 years experience' is weaker than 'owned the payments service through a 4x traffic increase'.",
      "**Performance work with no numbers.** 'Improved performance' is the single most common wasted bullet on an engineering CV.",
      "**One form of an acronym only.** Write CI/CD and continuous integration, Kubernetes and k8s, once each.",
      "**Side projects competing with production work.** A hobby repo above a system that took real traffic reads as thin.",
    ],
    faqs: [
      {
        q: "How many programming languages should I list?",
        a: "Three to five you would be happy to be tested on, ordered by how well you know them. Listing ten reads as a course history rather than a working set, and the interview will find the gap in about four minutes.",
      },
      {
        q: "Should I write Go or Golang?",
        a: "Write Go in the skills block and Golang once in a bullet, or the reverse. Recruiters search both. This is the cheapest keyword fix on an engineering CV and almost nobody does it.",
      },
      {
        q: "Do I need every cloud on my resume?",
        a: "No. Name the one you actually used at depth. Claiming AWS, GCP and Azure together usually means a tutorial on two of them, and an interviewer will pick the one you are weakest on.",
      },
      {
        q: "Where do I put open source contributions?",
        a: "In their own short section below your experience, and only when the project is recognisable or your contribution was substantial. A merged typo fix costs you the line it sits on.",
      },
    ],
  },

  {
    slug: "data-analyst",
    role: "Data Analyst",
    plural: "data analysts",
    examplePath: "/resume-examples/data-analyst",
    seoTitle: "Data Analyst Resume Keywords: The 2026 List",
    description:
      "The keywords data analyst postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "data analyst resume keywords",
      "keywords for data analyst resume",
      "data analyst resume skills",
      "ats keywords for data analyst resume",
      "sql resume keywords",
      "data analytics resume keywords",
    ],
    lede:
      "The terms analytics postings repeat, grouped by where they belong on the page. The distinguishing feature of a strong analyst CV is not the tool list. It is whether any decision changed because of your work.",
    why:
      "Analyst adverts split cleanly in two. The first half is tools, and it is where filtering happens: **SQL** appears in almost every posting, and a CV without it is often gone before a human reads it. The second half is judgement, and it is where offers are decided: whether you can turn a question into a query, a query into a finding, and a finding into a decision somebody actually made. Most CVs cover the first half and skip the second.",
    groups: [
      {
        title: "Analysis and method",
        note: "The half that separates an analyst from a dashboard operator. These belong in bullets, attached to a decision.",
        terms: [
          "exploratory data analysis", "A/B testing", "hypothesis testing",
          "statistical significance", "cohort analysis", "segmentation",
          "forecasting", "regression analysis", "funnel analysis",
          "data quality", "data cleaning", "root cause analysis",
        ],
      },
      {
        title: "Tools and languages",
        note: "SQL is non negotiable and should appear early. Name the warehouse and the BI tool by product, because that is what the search looks for.",
        terms: [
          "SQL", "Python", "pandas", "R", "Excel", "Tableau", "Power BI",
          "Looker", "dbt", "BigQuery", "Snowflake", "Redshift",
          "Google Analytics (GA4)", "Jupyter",
        ],
      },
      {
        title: "Business and communication",
        note: "The terms that decide whether you are hired as a service desk or a partner. Every one of them needs a bullet behind it.",
        terms: [
          "stakeholder management", "requirements gathering", "KPI definition",
          "dashboard design", "reporting automation", "data storytelling",
          "executive reporting", "self-serve analytics", "data governance",
        ],
      },
      {
        title: "Certifications worth naming",
        note: "Only if you hold them. Write the certificate name in full plus its code, because postings use both.",
        terms: [
          "Google Data Analytics Certificate", "Microsoft Power BI (PL-300)",
          "Tableau Desktop Specialist", "AWS Certified Data Analytics",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Notice that none of them is 'analysed'. Analysis is the assumption, not the achievement.",
        terms: [
          "quantified", "modelled", "forecast", "automated", "segmented",
          "validated", "reconciled", "surfaced", "recommended",
        ],
      },
    ],
    placement: [
      {
        title: "Skills block: tools, languages, warehouse",
        body: "SQL first, then the language, then the BI tool, then the warehouse. This block is read by a search before it is read by a person.",
      },
      {
        title: "Bullets: method plus the decision it changed",
        body: "**cohort analysis** and **A/B testing** only count where they end in an outcome. 'Ran the pricing test' is a task. 'Ran the pricing test that moved the team off the 20% discount' is analysis.",
      },
      {
        title: "Bullets: the size of the data",
        body: "Rows, tables, sources, refresh frequency, number of stakeholders served. Scale is the fastest way to show the difference between a spreadsheet and a warehouse.",
      },
      {
        title: "Near the top: the certificate, if you are early career",
        body: "For a first analyst role a named certificate does real work. Three years in, it belongs at the bottom.",
      },
    ],
    evidence: [
      {
        title: "A/B testing",
        context: "The second one names the decision that followed.",
        before: "Skills: A/B testing, statistical significance, experimentation",
        after:
          "Designed and read 14 pricing experiments, and killed a discount that testing showed cost 4% of margin for no measurable lift in conversion.",
      },
      {
        title: "reporting automation",
        context: "Automation is only interesting as time returned to somebody.",
        before: "Automated reports for the sales and marketing teams.",
        after:
          "Replaced 9 hand-built weekly spreadsheets with a dbt model and a Looker dashboard, returning roughly 6 hours a week to the commercial team.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will write SQL against our Snowflake warehouse, build and maintain Looker dashboards, and partner with product to design and read A/B tests. Strong stakeholder management is essential. Experience with dbt and Python is a plus.\"\n\nSeven terms in three sentences, and only two of them are tools. The rest describe judgement, which is where most analyst CVs go quiet.",
    },
    pitfalls: [
      "**A tool list with no decision attached.** Every analyst lists Tableau. Almost none says what changed because of a dashboard they built.",
      "**'Insights' as a noun with nothing after it.** An insight nobody acted on is a slide. Name the action.",
      "**No sense of scale.** Rows, sources, refresh cadence, audience size. Without them a reader cannot tell a 200 row spreadsheet from a warehouse.",
      "**Excel hidden out of embarrassment.** Advanced Excel is still named in a large share of analyst postings. Keep it, and say advanced.",
      "**SQL buried at the end of a long skills line.** It is the term most likely to be searched. Put it first.",
    ],
    faqs: [
      {
        q: "Is SQL really the most important data analyst resume keyword?",
        a: "It is the one most consistently present in analyst adverts, and the one most likely to be used as a hard filter. If you know SQL, it should be visible in the first third of your CV and evidenced in at least one bullet.",
      },
      {
        q: "Should I list Excel on a data analyst resume?",
        a: "Yes, and specify the level. 'Advanced Excel: Power Query, pivot tables, index match' is credible. Bare 'Excel' next to Python reads like padding.",
      },
      {
        q: "Do I need a portfolio for a data analyst role?",
        a: "It helps most when you are moving into analytics without an analytics job title. Link it once from the header. Do not let three tutorial projects sit above real work you did in a previous role.",
      },
      {
        q: "How do I show impact when I only supported decisions?",
        a: "Name the decision and your part in it honestly. 'Analysis behind the decision to close two regional depots' is strong and true. Claiming you closed them is neither.",
      },
    ],
  },

  {
    slug: "project-manager",
    role: "Project Manager",
    plural: "project managers",
    examplePath: "/resume-examples/project-manager",
    seoTitle: "Project Manager Resume Keywords: The 2026 List",
    description:
      "The keywords project manager postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "project manager resume keywords",
      "project management resume keywords",
      "ats keywords for project manager resume",
      "pmp resume keywords",
      "agile project manager resume keywords",
      "programme manager resume keywords",
    ],
    lede:
      "The terms delivery postings repeat, grouped by where they belong on the page. The trap for project managers is describing the process rather than what the process delivered.",
    why:
      "Project management adverts are written in method and certification, and both are used as filters. **PMP**, **PRINCE2** and **Scrum** are frequently searched as literal strings, so an unabbreviated certification alone can cost you the screen. But the method words are also where these CVs die: a page that lists stand-ups, retros and RAID logs describes a calendar. What a hiring manager is buying is a project that landed on a date, inside a budget, with the stakeholders still speaking to each other.",
    groups: [
      {
        title: "Delivery and control",
        note: "The core vocabulary of the job. Each of these should appear in a bullet where something went wrong and you handled it.",
        terms: [
          "scope management", "risk management", "dependency management",
          "stakeholder management", "budget management", "resource planning",
          "change control", "RAID log", "governance", "status reporting",
          "critical path", "benefits realisation",
        ],
      },
      {
        title: "Methods and frameworks",
        note: "Name the ones you have actually run. Hybrid delivery is worth saying out loud, because most real programmes are hybrid and few CVs admit it.",
        terms: [
          "Agile", "Scrum", "Kanban", "Waterfall", "SAFe", "PRINCE2",
          "hybrid delivery", "sprint planning", "backlog refinement",
          "retrospectives", "release management",
        ],
      },
      {
        title: "Certifications",
        note: "Write the acronym and the full name once each. A CV that only says PMP misses a search for Project Management Professional, and the reverse is just as common.",
        terms: [
          "PMP (Project Management Professional)", "PRINCE2 Practitioner",
          "CSM (Certified ScrumMaster)", "PMI-ACP", "SAFe Agilist",
          "MSP (Managing Successful Programmes)",
        ],
      },
      {
        title: "Tools",
        note: "Boring but searched. Name the one your organisation ran on rather than every tool you have opened.",
        terms: [
          "Jira", "Confluence", "Asana", "Microsoft Project", "Smartsheet",
          "Monday.com", "Miro", "ServiceNow", "Power BI",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "These imply a problem existed. That is the point: nobody hires a project manager for projects that were never at risk.",
        terms: [
          "delivered", "de-risked", "unblocked", "escalated", "negotiated",
          "recovered", "consolidated", "forecast", "governed",
        ],
      },
    ],
    placement: [
      {
        title: "Headline and top line: the certification",
        body: "If you hold PMP or PRINCE2, it belongs beside your title, not at the bottom of page two. It is used as a filter more often than any other term on this page.",
      },
      {
        title: "Bullets: budget, headcount, duration, outcome",
        body: "Four numbers that make a project real. A reader cannot size 'led a large transformation programme' and will assume the smaller end.",
      },
      {
        title: "Bullets: the control terms, attached to a save",
        body: "**risk management** and **change control** are proven by one recovered project, not by naming the artefact you maintained.",
      },
      {
        title: "Skills block: methods and tools only",
        body: "Keep it short. This block exists for the search. The argument is made in your experience section.",
      },
    ],
    evidence: [
      {
        title: "stakeholder management",
        context: "The first names an activity. The second names a conflict that was resolved.",
        before: "Responsible for stakeholder management across multiple business units.",
        after:
          "Brought finance and operations to a single scope after four months of disagreement, unblocking a 2.4M programme that had slipped two quarters.",
      },
      {
        title: "risk management",
        context: "A risk log is an artefact. A protected go-live is an outcome.",
        before: "Maintained the RAID log and reported risks to the steering committee.",
        after:
          "Identified a vendor dependency 11 weeks out and resequenced two workstreams around it, protecting an immovable regulatory go-live date.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will own delivery of a multi-workstream programme, managing scope, budget and risk across a hybrid Agile and Waterfall environment. PMP or PRINCE2 certification required. You will run governance forums, maintain the RAID log, and report status to an executive steering committee.\"\n\nNine terms in three sentences, and one of them is a hard requirement. If your certification is spelled only one way, that is the sentence that removes you.",
    },
    pitfalls: [
      "**Ceremonies listed as achievements.** Running stand-ups, retros and planning is the job description, not evidence you did it well.",
      "**No budget or headcount anywhere.** These two numbers set your level faster than any title.",
      "**The certification spelled one way only.** Write both PMP and Project Management Professional once.",
      "**Every project a success.** A CV where nothing ever went wrong reads as a CV where nothing was ever owned. One recovered project is worth three green ones.",
      "**Job title inflation with no scope behind it.** Programme Manager over a single team invites the question you least want asked.",
    ],
    faqs: [
      {
        q: "Do I need PMP on my resume to pass an ATS?",
        a: "Only when the posting names it, and then it matters a great deal because it is often a hard filter. If you hold it, write both the acronym and the full name. If you do not, do not imply it, and lead instead with delivery scope and outcomes.",
      },
      {
        q: "Should I say Agile or Scrum?",
        a: "Whichever you actually ran, and match the posting where both are true. Agile is the umbrella, Scrum is a specific framework with roles and ceremonies. Claiming Scrum when you ran loose iterations is caught in the first interview.",
      },
      {
        q: "How do I show project size on a resume?",
        a: "Budget, team size, duration, number of workstreams, and the business consequence of the deadline. Two of the five is usually enough to place you.",
      },
      {
        q: "What if my projects were confidential?",
        a: "Describe the shape without the name: 'a core banking migration for a FTSE 250 retail bank'. Sector, scale and complexity carry the signal. The client name rarely does.",
      },
    ],
  },

  {
    slug: "marketing-manager",
    role: "Marketing Manager",
    plural: "marketing managers",
    examplePath: "/resume-examples/marketing-manager",
    seoTitle: "Marketing Manager Resume Keywords: The 2026 List",
    description:
      "The keywords marketing manager postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "marketing manager resume keywords",
      "keywords for marketing manager resume",
      "digital marketing resume keywords",
      "ats keywords for marketing resume",
      "marketing resume skills",
      "growth marketing resume keywords",
      "marketing manager resume skills",
    ],
    lede:
      "The terms marketing postings repeat, grouped by where they belong on the page. The one thing that separates a strong marketing CV from a weak one is whether the numbers are commercial or cosmetic.",
    why:
      "Marketing adverts name channels and platforms with precision, and both get searched literally: **HubSpot**, **GA4**, **Meta Ads Manager**. But the reason marketing CVs get rejected is rarely the tool list. It is the metrics. A page full of impressions, followers and engagement rate reads as somebody who ran activity. A page with **CAC**, **ROAS**, pipeline and revenue reads as somebody who ran a budget. Hiring managers are buying the second one.",
    groups: [
      {
        title: "Channels",
        note: "Name the ones you personally owned, and be honest about the split. Owning paid social is different from briefing an agency that owned it.",
        terms: [
          "paid social", "paid search (PPC)", "SEO", "content marketing",
          "email marketing", "lifecycle marketing", "marketing automation",
          "affiliate marketing", "influencer marketing", "events",
          "partner marketing", "ABM (account based marketing)",
        ],
      },
      {
        title: "Metrics that carry weight",
        note: "This group is the difference between a shortlist and a rejection. Use the acronym and the full term once each, because postings use both.",
        terms: [
          "CAC (customer acquisition cost)", "LTV", "ROAS", "MQL", "SQL (sales qualified lead)",
          "pipeline contribution", "conversion rate optimisation (CRO)",
          "attribution", "funnel analysis", "churn", "payback period",
        ],
      },
      {
        title: "Platforms and tools",
        note: "Boring, specific, and searched constantly. Name the CRM by product, since that alone decides some shortlists.",
        terms: [
          "HubSpot", "Salesforce", "Marketo", "Klaviyo", "Mailchimp",
          "Google Ads", "Meta Ads Manager", "LinkedIn Campaign Manager",
          "GA4", "Semrush", "Ahrefs", "Webflow", "Figma",
        ],
      },
      {
        title: "Scope and leadership",
        note: "Where seniority is actually signalled. Budget ownership is the single most useful number on a marketing CV.",
        terms: [
          "budget ownership", "agency management", "go-to-market",
          "brand positioning", "campaign planning", "cross-functional",
          "team leadership", "product marketing", "market research",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Every one of these implies a number came out the other end.",
        terms: [
          "launched", "scaled", "grew", "cut", "repositioned", "tested",
          "consolidated", "rebuilt", "owned",
        ],
      },
    ],
    placement: [
      {
        title: "Bullets: the commercial metric, every time",
        body: "**ROAS**, **CAC** and pipeline belong in bullets with a before and an after. This is the section a marketing director reads first and often only.",
      },
      {
        title: "Bullets: the budget you controlled",
        body: "A campaign that grew signups 30% on a 5k budget and one that did it on 500k are different jobs. State which one you did.",
      },
      {
        title: "Skills block: platforms and channels",
        body: "Short, grouped, and specific by product name. This block is for the search, not for the reader.",
      },
      {
        title: "Nowhere: impressions, reach, follower count",
        body: "Unless you are applying for a brand awareness role that explicitly asks for them, these cost you credibility with anyone who owns a number.",
      },
    ],
    evidence: [
      {
        title: "paid social",
        context: "The first is activity. The second is a budget decision with a result.",
        before: "Managed paid social campaigns across Meta and LinkedIn.",
        after:
          "Rebuilt Meta and LinkedIn targeting around three tested audiences, cutting blended CAC from 92 to 61 while holding volume flat.",
      },
      {
        title: "email marketing",
        context: "Open rate is a vanity metric. Revenue per send is not.",
        before: "Ran the weekly email newsletter and grew the list to 40,000.",
        after:
          "Replaced a single weekly blast with a 6 stage lifecycle flow in Klaviyo, lifting email revenue from 4% to 11% of monthly total.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will own the paid acquisition budget across Google Ads and Meta, report on CAC and ROAS to the leadership team, and run lifecycle campaigns in HubSpot. Experience with attribution modelling and conversion rate optimisation is essential. You will manage one direct report and an external SEO agency.\"\n\nTen terms in three sentences, and the two that decide the shortlist are CAC and ROAS.",
    },
    pitfalls: [
      "**Vanity metrics doing the heavy lifting.** Impressions, reach and followers are the fastest way to look junior to somebody who owns a budget.",
      "**No budget size anywhere.** Without it a reader cannot tell whether you were spending 2k a month or 200k.",
      "**Agency work described as in-house work.** Say which you did. Being found out on this one ends the process.",
      "**Channels listed with no result attached.** A channel list is a claim. A channel with a cost per acquisition is proof.",
      "**The CRM left unnamed.** HubSpot and Salesforce shops filter for their own platform constantly.",
    ],
    faqs: [
      {
        q: "Which marketing metrics matter most on a resume?",
        a: "The ones tied to money: CAC, ROAS, LTV, pipeline contribution and revenue. Engagement metrics are supporting evidence at best. If you only have room for two numbers per role, make them commercial ones.",
      },
      {
        q: "Should I list every marketing tool I have used?",
        a: "No. List the CRM, the ad platforms and the analytics tool you used at depth. A list of twenty tools reads as a trial account history and invites a question about the one you know least.",
      },
      {
        q: "How do I write a marketing resume with no revenue attribution?",
        a: "Use the closest number you genuinely owned: cost per lead, conversion rate, volume at a held cost, time to launch. Then name what the business did with it. Honest proximate metrics beat invented revenue every time.",
      },
      {
        q: "Is SEO worth listing if it was a small part of my role?",
        a: "Yes, if a posting asks for it and you can evidence one concrete thing: a migration you protected, a set of pages that ranked, a technical fix you specified. Bare 'SEO' in a skills list does very little.",
      },
    ],
  },

  {
    slug: "customer-service",
    role: "Customer Service Representative",
    plural: "customer service representatives",
    examplePath: "/resume-examples/customer-service-representative",
    seoTitle: "Customer Service Resume Keywords: The 2026 List",
    description:
      "The keywords customer service postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "customer service resume keywords",
      "customer support resume keywords",
      "ats keywords for customer service resume",
      "customer service resume skills",
      "call centre resume keywords",
      "customer success resume keywords",
    ],
    lede:
      "The terms support postings repeat, grouped by where they belong on the page. Support CVs are the easiest to improve, because the work generates numbers constantly and almost nobody writes them down.",
    why:
      "Support adverts are specific about two things: the platform and the metric. **Zendesk**, **Freshdesk** and **Intercom** are searched as literal strings, and so are **CSAT**, **SLA** and **first contact resolution**. The gap on most support CVs is that the job is measured daily and the CV says 'excellent communication skills'. You almost certainly know your ticket volume, your CSAT and your response time. Those three numbers will move a support CV further than any rewrite.",
    groups: [
      {
        title: "Metrics you already have",
        note: "Every one of these is on a dashboard you have looked at. Take three into your bullets.",
        terms: [
          "CSAT", "NPS", "first contact resolution (FCR)", "first response time",
          "average handle time", "SLA compliance", "ticket volume",
          "resolution rate", "backlog reduction", "QA score",
        ],
      },
      {
        title: "Platforms and channels",
        note: "Name the helpdesk by product. A Zendesk shop searches for Zendesk, and generic 'ticketing system' does not match it.",
        terms: [
          "Zendesk", "Freshdesk", "Intercom", "Salesforce Service Cloud",
          "HubSpot Service Hub", "Talkdesk", "live chat", "phone support",
          "email support", "social support", "omnichannel",
        ],
      },
      {
        title: "The work itself",
        note: "The verbs and nouns that describe difficulty. Escalation and de-escalation are what separate a second line agent from a first line one.",
        terms: [
          "escalation management", "de-escalation", "complaint handling",
          "triage", "troubleshooting", "root cause analysis", "refunds and billing",
          "account management", "retention", "churn prevention",
        ],
      },
      {
        title: "Process and growth",
        note: "The terms that say you improved the queue rather than only working it. This is how a support CV signals readiness for a lead role.",
        terms: [
          "knowledge base", "macros and templates", "workflow automation",
          "onboarding", "training and coaching", "shift handover",
          "process improvement", "voice of the customer",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "'Handled' is the weakest common opener on a support CV. Every one of these is stronger.",
        terms: [
          "resolved", "de-escalated", "reduced", "recovered", "retained",
          "trained", "documented", "streamlined", "coached",
        ],
      },
    ],
    placement: [
      {
        title: "Bullets: volume, speed, satisfaction",
        body: "Three numbers, one bullet each. Tickets per week, response or handle time, and CSAT. This is the fastest possible upgrade to a support CV.",
      },
      {
        title: "Skills block: the platform, by name",
        body: "**Zendesk** or **Intercom** written out, plus the channels you covered. Short and specific.",
      },
      {
        title: "Bullets: one hard case",
        body: "**de-escalation** and **complaint handling** need a real example. One recovered account tells a hiring manager more than a paragraph of adjectives.",
      },
      {
        title: "Bullets: anything you improved for the team",
        body: "A macro set, a help centre rewrite, a new triage rule. Process work is what moves you from agent to team lead on paper.",
      },
    ],
    evidence: [
      {
        title: "ticket handling",
        context: "The numbers were always there. The first version just did not write them down.",
        before: "Managed customer support tickets and responded to queries.",
        after:
          "Resolved roughly 80 tickets a week across email and live chat, holding first response under two hours and CSAT at 94%.",
      },
      {
        title: "de-escalation",
        context: "The second names a stake, which is what makes it credible.",
        before: "Handled escalations and difficult customers professionally.",
        after:
          "Took over 20 escalated accounts flagged for cancellation and retained 14, protecting roughly 60k of annual recurring revenue.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will handle inbound tickets across email, chat and phone in Zendesk, meeting a two hour first response SLA and maintaining CSAT above 90%. You will escalate technical issues, contribute to the knowledge base, and support onboarding for new customers.\"\n\nEight terms in two sentences, and three of them are numbers you can match directly from your own dashboard.",
    },
    pitfalls: [
      "**Adjectives instead of metrics.** 'Excellent communication skills' appears on nearly every support CV and distinguishes none of them.",
      "**No ticket volume.** Volume is the clearest signal of the environment you can handle. Twenty a day and two hundred a day are different jobs.",
      "**The helpdesk left unnamed.** Teams filter for their own platform. Write Zendesk, not 'ticketing software'.",
      "**Escalations mentioned without an outcome.** Say what happened to the account, not that escalations existed.",
      "**Process improvements left out entirely.** The macro set you wrote is the thing that makes you a team lead candidate.",
    ],
    faqs: [
      {
        q: "What are the most important customer service resume keywords?",
        a: "The platform you worked in, the channels you covered, and the metrics you were measured on: CSAT, first response time, first contact resolution and SLA. Those four metrics appear in a large share of support adverts and are usually absent from support CVs.",
      },
      {
        q: "What if I do not know my CSAT or ticket numbers?",
        a: "Estimate honestly and say so with a rounded figure: 'roughly 70 tickets a week'. Anyone who has done the job knows these are approximate. An estimate you can defend is far better than no number at all.",
      },
      {
        q: "Is customer service the same as customer success on a resume?",
        a: "No, and the adverts use different vocabulary. Support is measured on resolution and response. Success is measured on retention, expansion and churn. Match whichever the posting uses, and only claim success language if you owned renewals.",
      },
      {
        q: "How do I move from support to a team lead role?",
        a: "Lead with the process work, not the ticket count. Training, coaching, QA scoring, macros and knowledge base ownership are the terms lead adverts look for, and they are the ones agents most often leave off.",
      },
    ],
  },

  {
    slug: "accountant",
    role: "Accountant",
    plural: "accountants",
    examplePath: "/resume-examples/accountant",
    seoTitle: "Accountant Resume Keywords: The 2026 List",
    description:
      "The keywords accounting postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "accountant resume keywords",
      "accounting resume keywords",
      "ats keywords for accounting resume",
      "accountant resume skills",
      "finance resume keywords",
      "management accountant cv keywords",
    ],
    lede:
      "The terms accounting postings repeat, grouped by where they belong on the page. Two things decide an accounting shortlist quickly: your qualification status and the system you have closed a month in.",
    why:
      "Accounting adverts filter harder than most. Qualification is often a stated requirement, and **ACCA**, **ACA**, **CIMA** and **CPA** are searched as literal strings, as are the systems: **SAP**, **NetSuite**, **Xero**, **Sage**. The second filter is less obvious. Adverts describe the cycle precisely, from **month end close** to **statutory accounts**, and a CV that says 'prepared financial reports' matches none of that language even when the person has done every part of it.",
    groups: [
      {
        title: "The cycle",
        note: "The exact phrases postings use. Write them the way the advert does, because generic wording matches nothing.",
        terms: [
          "month end close", "year end close", "reconciliations",
          "accounts payable (AP)", "accounts receivable (AR)", "general ledger",
          "journal entries", "accruals and prepayments", "fixed asset register",
          "intercompany", "consolidation", "trial balance",
        ],
      },
      {
        title: "Analysis and reporting",
        note: "Where a management accountant separates from a bookkeeper. These belong in bullets with a business consequence.",
        terms: [
          "variance analysis", "budgeting and forecasting", "cash flow forecasting",
          "management accounts", "board reporting", "KPI reporting",
          "cost control", "margin analysis", "business partnering",
        ],
      },
      {
        title: "Compliance and standards",
        note: "Name the framework you actually reported under. IFRS and GAAP are not interchangeable and postings mean the one they name.",
        terms: [
          "IFRS", "UK GAAP", "US GAAP", "statutory accounts", "VAT returns",
          "corporation tax", "audit support", "internal controls", "SOX",
          "transfer pricing",
        ],
      },
      {
        title: "Systems",
        note: "One of the highest value groups on this page. The ERP is frequently a hard filter, and the difference between SAP and Xero is the difference between two different jobs.",
        terms: [
          "SAP", "Oracle", "NetSuite", "Xero", "QuickBooks", "Sage",
          "Microsoft Dynamics", "advanced Excel", "Power BI", "Workday Financials",
        ],
      },
      {
        title: "Qualifications",
        note: "State the status plainly, including part qualified and the number of exams remaining. Ambiguity here reads as evasion.",
        terms: [
          "ACCA", "ACA", "CIMA", "CPA", "AAT", "part qualified",
          "qualified by experience (QBE)", "ICAEW",
        ],
      },
    ],
    placement: [
      {
        title: "Top line: qualification status",
        body: "Beside your name or in the headline. **ACCA qualified** or **CIMA part qualified, 2 exams remaining**. This is checked before anything else on the page.",
      },
      {
        title: "Skills block: the ERP, by name and version era",
        body: "**SAP**, **NetSuite** or **Xero** written plainly. A finance team running SAP will search for SAP.",
      },
      {
        title: "Bullets: the close, with a timeline",
        body: "**month end close** means little alone. 'Cut the close from 9 working days to 5' is the whole argument for hiring you.",
      },
      {
        title: "Bullets: the size of what you accounted for",
        body: "Turnover, number of entities, ledger size, headcount of the finance team. Scale places you faster than a job title.",
      },
    ],
    evidence: [
      {
        title: "month end close",
        context: "The first states a duty every accountant shares. The second states an improvement.",
        before: "Responsible for month end close and reconciliations.",
        after:
          "Ran month end close for 4 entities and cut it from 9 working days to 5 by automating 12 recurring journals in NetSuite.",
      },
      {
        title: "cash flow forecasting",
        context: "A forecast is only interesting when a decision hung on it.",
        before: "Prepared cash flow forecasts and management accounts.",
        after:
          "Built a rolling 13 week cash flow forecast that surfaced a Q3 shortfall early enough to renegotiate supplier terms rather than draw down the facility.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will own month end close for two entities, prepare management accounts and variance analysis, and support the year end audit under IFRS. ACCA or CIMA qualified or finalist. Strong Excel essential, NetSuite experience desirable.\"\n\nNine terms in three sentences, and two of them are hard filters. A CV that says 'prepared financial reports' matches almost none of it.",
    },
    pitfalls: [
      "**Qualification status left vague.** 'Studying towards ACCA' with no exam count reads as further away than it probably is. State the number.",
      "**The ERP unnamed.** System experience is one of the most common hard filters in finance recruitment.",
      "**No close timeline.** Days to close is the clearest measure of an accountant who improved a process rather than maintained one.",
      "**No sense of scale.** Turnover, entity count and ledger size place you in seconds. Without them a reader guesses low.",
      "**Generic wording instead of the cycle vocabulary.** 'Prepared financial reports' matches nothing. 'Management accounts and variance analysis' matches the advert.",
    ],
    faqs: [
      {
        q: "Should I put ACCA or CIMA at the top of my resume?",
        a: "Yes, beside your name or in the headline. Qualification is frequently a stated requirement and is checked first. Include the status honestly: qualified, finalist, or part qualified with the number of exams remaining.",
      },
      {
        q: "How important is naming the accounting system?",
        a: "Very. Finance teams recruit for their own stack, and SAP, NetSuite, Xero and Sage are searched as literal strings. If you have used more than one, list them in order of depth rather than all at equal weight.",
      },
      {
        q: "What if I am part qualified?",
        a: "Say so plainly and give the detail: 'CIMA part qualified, 2 exams remaining, expected 2026'. Employers hire part qualified accountants constantly. Vagueness costs you far more than the missing exams do.",
      },
      {
        q: "IFRS or GAAP, which should I list?",
        a: "The one you have actually reported under, and both only if that is true. They are not interchangeable, and a posting that names IFRS means IFRS. Claiming both is a question you will be asked in the first interview.",
      },
    ],
  },

  {
    slug: "nurse",
    role: "Nurse",
    plural: "nurses",
    examplePath: "/resume-examples/nurse",
    seoTitle: "Nurse Resume Keywords: The 2026 List",
    description:
      "The keywords nursing postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for nurse resume",
      "nurse resume keywords",
      "ats keywords for nurse resume",
      "nurse resume skills",
      "registered nurse resume keywords",
      "nursing cv keywords",
      "rn resume keywords",
    ],
    lede:
      "The terms nursing adverts repeat, grouped by where they belong on the page. Registration comes first, clinical scope comes second, and every term below only counts if you can describe the shift behind it.",
    why:
      "Nursing adverts filter hard before they judge. The first screen is registration: **NMC PIN** in the UK, an active **RN license** in the US, plus life support certificates such as **BLS** and **ILS**. Miss those and a strong CV is never read. The second screen is clinical scope: the setting, the specialty, and the patients you can safely manage. Most nursing CVs describe care in collective, modest terms, which hides exactly the scope a recruiter is searching for.",
    groups: [
      {
        title: "Registration and certificates",
        note: "Hard filters. Write each one exactly as the advert does, with its status, in the top third of the page.",
        terms: [
          "registered nurse (RN)", "NMC PIN", "active RN license", "BLS",
          "ILS", "ALS", "ACLS", "PALS", "safeguarding level 3",
          "revalidation", "NCLEX",
        ],
      },
      {
        title: "Clinical skills",
        note: "The procedures you can do unsupervised. List only what you would be happy to demonstrate on your first shift.",
        terms: [
          "patient assessment", "medication administration", "IV therapy",
          "venepuncture", "cannulation", "wound management",
          "catheterisation", "tracheostomy care", "NEWS2", "early warning scores",
          "infection prevention and control", "tissue viability",
        ],
      },
      {
        title: "Setting and specialty",
        note: "Recruiters filter by setting before anything else. Name the ward type, the specialty and the acuity in plain words.",
        terms: [
          "acute care", "medical surgical", "post-operative care", "ICU",
          "emergency department", "theatres", "community nursing",
          "mental health", "paediatrics", "oncology", "care of the elderly",
          "high dependency unit",
        ],
      },
      {
        title: "Practice and leadership",
        note: "The terms that signal band 6 and above. Each one needs a number: nurses precepted, audits run, beds covered.",
        terms: [
          "care planning", "discharge planning", "multidisciplinary team (MDT)",
          "preceptorship", "clinical audit", "escalation", "handover",
          "shift coordination", "patient safety", "duty of candour",
          "electronic patient record (EPR)",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with provided care. Each one points at a judgement you made, which is what the reader wants to see.",
        terms: [
          "assessed", "triaged", "escalated", "managed", "precepted",
          "audited", "coordinated", "administered", "stabilised", "educated",
        ],
      },
    ],
    placement: [
      {
        title: "Top three lines: registration and status",
        body: "Write **NMC PIN (active)** or **RN license, State of Texas, active** in the summary or directly under your name. It is the first literal string a nursing recruiter searches.",
      },
      {
        title: "Skills block: certificates and clinical skills",
        body: "Certificates first, then the procedures you do unsupervised. Keep it to what the posting names. A long list of every skill from training reads as a student CV.",
      },
      {
        title: "Bullets: caseload, acuity and escalation",
        body: "Beds on the ward, patients per shift, and how often you escalated. **NEWS2** and **escalation** only count inside a bullet that shows you used them to act.",
      },
      {
        title: "Bullets: audit and teaching",
        body: "Audits, preceptorship and link nurse roles belong in bullets with a result. They are the evidence that separates band 5 from band 6.",
      },
    ],
    evidence: [
      {
        title: "patient assessment",
        context: "The second one gives scope and a result without any patient detail.",
        before: "Skills: patient assessment, escalation, NEWS2",
        after:
          "Assessed 8 to 10 post-operative patients per shift on a 28-bed surgical ward, and escalated deteriorating patients to the outreach team using NEWS2.",
      },
      {
        title: "preceptorship",
        context: "Teaching is only interesting as people who stayed and signed off.",
        before: "Helped train new nurses on the ward.",
        after:
          "Precepted 6 newly qualified nurses through their first year, with all 6 signed off on schedule.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will hold active NMC registration and ILS. You will deliver high standards of care on a busy acute medical ward, use NEWS2 to recognise deterioration, and work within the multidisciplinary team to plan safe discharges. Experience of mentoring students is desirable.\"\n\nTwo of these terms are hard filters and appear in the first sentence. The rest describe setting and judgement, which is where most nursing CVs stay vague.",
    },
    pitfalls: [
      "**Registration hidden at the bottom.** It is the first thing searched. Put it in the top three lines with its status.",
      "**'Provided high quality patient care'.** True of everyone on the rota. Replace it with caseload, setting and acuity.",
      "**No sense of scale.** Beds, patients per shift, ward type. Without them a reader cannot tell a day unit from an acute ward.",
      "**Patient detail to prove a point.** You never need it. Scope at the service level is enough and keeps you inside confidentiality.",
      "**Every skill from training listed.** A long procedure list reads as a newly qualified CV. Keep what the advert names and what you do unsupervised.",
    ],
    faqs: [
      {
        q: "What is the most important keyword on a nurse resume?",
        a: "Your registration, written the way the advert writes it. In the UK that is NMC registration or an NMC PIN. In the US it is an active RN license and the state. It is a hard filter, so it belongs in the top third of the page.",
      },
      {
        q: "Should I list BLS and ILS on a nursing CV?",
        a: "Yes, if they are current, with the expiry month if the advert asks for it. Life support certificates are often a screening question, and a recruiter will search for the short form.",
      },
      {
        q: "How do I show impact as a nurse without breaching confidentiality?",
        a: "Describe the service, not the patient. Beds, caseload per shift, escalations, audit results and discharge times are all service level evidence. None of them needs a single patient detail.",
      },
      {
        q: "Do I need a different CV for each specialty?",
        a: "You need a different top half. The setting and clinical skills should match the ward you are applying to. Your registration and history stay the same.",
      },
    ],
  },
  {
    slug: "teacher",
    role: "Teacher",
    plural: "teachers",
    examplePath: "/resume-examples/teacher",
    seoTitle: "Teacher Resume Keywords: The 2026 List",
    description:
      "The keywords teaching postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for teacher resume",
      "teacher resume keywords",
      "ats keywords for teacher resume",
      "teacher resume skills",
      "teaching cv keywords",
      "secondary teacher resume keywords",
      "primary teacher cv keywords",
    ],
    lede:
      "The terms teaching adverts repeat, grouped by where they belong on the page. Subject, phase and qualification come first. After that, the terms that win interviews are the ones attached to outcomes.",
    why:
      "School adverts filter on three things before they read anything else: the **subject**, the **phase or key stage**, and the qualification, such as **QTS** in England or a state **teaching license** in the US. Then they look for evidence of progress: attainment, intervention and responsibility beyond your own classroom. Most teaching CVs describe the timetable. The ones that get shortlisted describe what changed for the pupils.",
    groups: [
      {
        title: "Qualification and phase",
        note: "Hard filters. Write them in the first two lines, exactly as the advert does.",
        terms: [
          "QTS", "PGCE", "teaching license", "ECT", "early career teacher",
          "KS1", "KS2", "KS3", "KS4", "KS5", "EYFS", "primary", "secondary",
          "A level", "GCSE",
        ],
      },
      {
        title: "Teaching and assessment",
        note: "The craft terms. Each one reads better attached to a class, a cohort or a result.",
        terms: [
          "lesson planning", "differentiation", "formative assessment",
          "summative assessment", "scheme of work", "curriculum design",
          "behaviour management", "adaptive teaching", "retrieval practice",
          "mastery", "marking and feedback",
        ],
      },
      {
        title: "Progress and inclusion",
        note: "The terms that show you track and act on data. They carry the most weight when a number follows them.",
        terms: [
          "attainment", "progress data", "intervention", "SEND",
          "EAL", "pupil premium", "IEP", "data tracking", "raising attainment",
          "closing the gap",
        ],
      },
      {
        title: "Responsibility and safeguarding",
        note: "The terms that signal readiness for a TLR or a middle leadership post. Name the role and what it covered.",
        terms: [
          "safeguarding", "DBS", "form tutor", "pastoral care",
          "head of year", "subject lead", "TLR", "parental engagement",
          "extracurricular", "mentoring trainee teachers",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with taught. Teaching is the assumption. These verbs describe what you did with it.",
        terms: [
          "raised", "designed", "led", "rewrote", "tracked", "mentored",
          "introduced", "coordinated", "differentiated", "moderated",
        ],
      },
    ],
    placement: [
      {
        title: "First two lines: subject, phase and qualification",
        body: "**Secondary Mathematics Teacher (QTS), KS3 to KS5** does the job of a whole paragraph. Schools filter on all three before they read the rest.",
      },
      {
        title: "Skills block: qualifications and teaching approaches",
        body: "QTS, PGCE and safeguarding training first, then the approaches the school names in its advert, such as **mastery** or **adaptive teaching**.",
      },
      {
        title: "Bullets: attainment and intervention",
        body: "Cohort, starting point, result. **Intervention** only counts where it ends in a grade, a reading age or a progress measure.",
      },
      {
        title: "Bullets: responsibility beyond the classroom",
        body: "Form tutor, subject lead, trips, clubs, mentoring. Give each one a number: pupils, colleagues, years.",
      },
    ],
    evidence: [
      {
        title: "intervention",
        context: "The second one names the cohort and the result.",
        before: "Skills: intervention, data tracking, raising attainment",
        after:
          "Designed a Year 11 intervention for 34 borderline students, with 27 achieving a grade 4 or above in the summer series.",
      },
      {
        title: "scheme of work",
        context: "Curriculum work is only interesting as time or progress returned.",
        before: "Helped write schemes of work for the department.",
        after:
          "Rewrote the KS3 scheme of work around mastery sequencing with two colleagues, cutting reteaching time in Year 9.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"We are looking for a qualified teacher of English (QTS) to teach across KS3 and KS4. You will plan engaging lessons, use assessment to adapt your teaching, support pupils with SEND and EAL, and contribute to the wider life of the school as a form tutor.\"\n\nThree hard filters in the first sentence. The rest describe inclusion and responsibility, which is where most teaching CVs go quiet.",
    },
    pitfalls: [
      "**Subject and phase buried in a paragraph.** They are the first filter. Put them in the first line.",
      "**The timetable instead of the outcomes.** Six classes across three year groups says what you were given, not what you achieved.",
      "**'Passionate about education'.** Every applicant says it. A single attainment figure says more.",
      "**Safeguarding left out.** It is named in almost every school advert. List your training level and date.",
      "**No numbers for responsibilities.** A form group of 28 or a club of 15 is concrete. 'Ran clubs' is not.",
    ],
    faqs: [
      {
        q: "What keywords should a teacher CV include?",
        a: "Your subject, phase or key stage, and qualification first, because schools filter on them. After that, take the terms from the advert itself, such as SEND, adaptive teaching or a named curriculum, and put each one inside a bullet with a result.",
      },
      {
        q: "Should I put QTS on my CV?",
        a: "Yes, in the first two lines, with your ECT status if you are early career. It is a literal string recruiters search for, and leaving it out makes a strong application look unqualified.",
      },
      {
        q: "How do I show impact as a teacher?",
        a: "Use the data you already track. Attainment against target, progress from a starting point, and intervention results are all evidence you have. State the cohort so the number means something.",
      },
      {
        q: "Should a teacher CV be one page or two?",
        a: "Two pages is normal for experienced teachers in the UK. Keep the first page to your role, qualification, key results and current school. Many schools also ask for an application form, so check before you spend time on layout.",
      },
    ],
  },
  {
    slug: "product-manager",
    role: "Product Manager",
    plural: "product managers",
    examplePath: "/resume-examples/product-manager",
    seoTitle: "Product Manager Resume Keywords: The 2026 List",
    description:
      "The keywords product manager postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for product manager resume",
      "product manager resume keywords",
      "ats keywords for product manager resume",
      "product manager resume skills",
      "product owner resume keywords",
      "senior product manager resume keywords",
      "technical product manager resume keywords",
    ],
    lede:
      "The terms product adverts repeat, grouped by where they belong on the page. A shipped feature list proves you had a roadmap. These terms only earn their place when they sit next to a decision and a result.",
    why:
      "Product adverts mix two vocabularies. The first is method: **discovery**, **roadmap prioritisation**, **experimentation** and the metrics you owned. The second is the domain: B2B SaaS, payments, marketplaces, growth. Recruiters search both, and hiring managers then read for judgement: what you chose to build, what you chose to drop, and what moved. Most product CVs list features shipped, which answers none of those questions.",
    groups: [
      {
        title: "Discovery and strategy",
        note: "The terms that describe how you decide. They belong in bullets that end with what you built or dropped.",
        terms: [
          "product discovery", "user research", "customer interviews",
          "problem framing", "product strategy", "product vision",
          "opportunity sizing", "jobs to be done", "competitive analysis",
          "go-to-market",
        ],
      },
      {
        title: "Delivery and prioritisation",
        note: "The terms that show you can run the work. Name the framework only if the advert does.",
        terms: [
          "roadmap", "prioritisation", "OKRs", "Agile", "Scrum",
          "backlog management", "user stories", "product requirements document (PRD)",
          "release planning", "cross-functional", "stakeholder management",
        ],
      },
      {
        title: "Metrics and experimentation",
        note: "The terms that show you measure. Name the metric you owned and how far it moved.",
        terms: [
          "A/B testing", "experimentation", "activation", "retention",
          "conversion", "net revenue retention", "churn", "north star metric",
          "product analytics", "funnel analysis",
        ],
      },
      {
        title: "Tools",
        note: "A short list. Tools matter less for product than for any other role, but analytics and SQL are searched.",
        terms: [
          "Amplitude", "Mixpanel", "Looker", "SQL", "Jira", "Linear",
          "Figma", "Productboard", "Confluence",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with owned or responsible for. Each one implies a choice and a result.",
        terms: [
          "launched", "killed", "reprioritised", "validated", "grew",
          "reduced", "negotiated", "aligned", "piloted", "scaled",
        ],
      },
    ],
    placement: [
      {
        title: "Summary: domain, seniority and one result",
        body: "**Senior Product Manager, B2B SaaS, pricing and monetisation** plus one metric you moved. Domain is searched as often as the job title.",
      },
      {
        title: "Skills block: method and tools",
        body: "Discovery, experimentation and prioritisation first, then analytics tools and SQL. Keep it short. The bullets carry product CVs, not the skills line.",
      },
      {
        title: "Bullets: decision, reasoning, result",
        body: "**Discovery** and **prioritisation** only count where they end in a choice. 'Ran discovery' is a task. 'Ran 30 interviews and dropped the integration we had committed to' is product management.",
      },
      {
        title: "Bullets: the metric you owned",
        body: "Activation, retention, revenue or cycle time, with a before and an after. One owned metric per role is enough.",
      },
    ],
    evidence: [
      {
        title: "prioritisation",
        context: "The second one names what was cut and what it bought.",
        before: "Skills: roadmap prioritisation, stakeholder management",
        after:
          "Cut the roadmap from 14 initiatives to 5 after a usage audit, and shortened average time to ship from 11 weeks to 6.",
      },
      {
        title: "customer interviews",
        context: "Research is only interesting as a decision it changed.",
        before: "Ran user research and gathered feedback.",
        after:
          "Ran 32 customer interviews across two segments and dropped a committed integration, moving a quarter of engineering capacity to onboarding.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will own the roadmap for our onboarding experience, run discovery with customers, define success metrics, and work with engineering and design to ship and iterate. Experience with experimentation and product analytics tools such as Amplitude is essential. SQL is a plus.\"\n\nSix terms in three sentences, and only one of them is a tool. The rest describe how you decide, which is what most product CVs leave out.",
    },
    pitfalls: [
      "**A list of features shipped.** It proves a roadmap existed. It says nothing about your judgement.",
      "**No metric you owned.** Product is measured. If no number moved, a reader assumes you did not know which one mattered.",
      "**'Led a cross-functional team'.** Every PM writes it. Name the teams and the decision you aligned them on.",
      "**Domain left out.** Payments, B2B SaaS, marketplaces. Recruiters search the domain as often as the title.",
      "**Nothing you said no to.** A dropped project with its reasoning is one of the strongest product signals you can show.",
    ],
    faqs: [
      {
        q: "What keywords should a product manager resume include?",
        a: "Your domain, the metrics you owned, and the method terms the advert uses, such as discovery, experimentation or roadmap. Put each one inside a bullet that shows a decision and a result, not in a long skills line.",
      },
      {
        q: "Should product managers list tools on their CV?",
        a: "A short list. Analytics tools such as Amplitude or Mixpanel and SQL are worth naming, because postings search for them. Project tools such as Jira add little. Everyone has used them.",
      },
      {
        q: "How do I show impact if my team shipped the work?",
        a: "Describe your part honestly: the decision you made, the evidence behind it, and the result. 'Chose to rebuild onboarding before adding integrations' is yours, even though engineering built it.",
      },
      {
        q: "Is product owner the same keyword as product manager?",
        a: "Not quite. Some adverts use product owner for a Scrum role focused on the backlog. If your job title was product owner and the advert says product manager, keep your real title and use the advert's term in your summary where it is true.",
      },
    ],
  },
  {
    slug: "business-analyst",
    role: "Business Analyst",
    plural: "business analysts",
    examplePath: "/resume-examples/business-analyst",
    seoTitle: "Business Analyst Resume Keywords: The 2026 List",
    description:
      "The keywords business analyst postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for business analyst resume",
      "business analyst resume keywords",
      "ats keywords for business analyst resume",
      "business analyst resume skills",
      "business analyst cv keywords",
      "it business analyst resume keywords",
      "requirements analyst resume keywords",
    ],
    lede:
      "The terms business analysis adverts repeat, grouped by where they belong on the page. The documents are assumed. What gets you shortlisted is whether a requirement you wrote shipped, and whether a process you mapped actually changed.",
    why:
      "Business analyst adverts are written around artefacts: **requirements gathering**, **user stories**, **process mapping**, **UAT**. Recruiters search those exact strings, so they need to be on the page. But a hiring manager already assumes you can write a BRD. They read for outcomes: rework avoided, cycle time cut, a bad release blocked. Most BA CVs list the documents and stop there.",
    groups: [
      {
        title: "Requirements and analysis",
        note: "The core craft terms. Each one belongs in a bullet that says what the requirement was for.",
        terms: [
          "requirements gathering", "requirements elicitation", "user stories",
          "acceptance criteria", "business requirements document (BRD)",
          "functional requirements", "gap analysis", "impact analysis",
          "root cause analysis", "use cases",
        ],
      },
      {
        title: "Process and change",
        note: "The terms that show you changed how work gets done. Name the process and the measure that moved.",
        terms: [
          "process mapping", "process improvement", "BPMN", "as is to be",
          "workflow design", "change management", "operating model",
          "Lean", "Six Sigma", "value stream mapping",
        ],
      },
      {
        title: "Delivery and testing",
        note: "The terms that place you inside a delivery team. UAT is searched in almost every IT BA advert.",
        terms: [
          "UAT", "test scenarios", "Agile", "Scrum", "backlog refinement",
          "sprint planning", "stakeholder workshops", "stakeholder management",
          "traceability matrix", "go-live support",
        ],
      },
      {
        title: "Tools and certifications",
        note: "Name the tools the advert names. List certifications only if you hold them, in full and with their short form.",
        terms: [
          "Jira", "Confluence", "SQL", "Excel", "Visio", "Miro", "Power BI",
          "CBAP", "ECBA", "BCS Business Analysis Diploma", "PMI-PBA",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with gathered or supported. Each one points at an outcome.",
        terms: [
          "elicited", "mapped", "translated", "prioritised", "facilitated",
          "validated", "streamlined", "blocked", "reconciled", "defined",
        ],
      },
    ],
    placement: [
      {
        title: "Skills block: method, tools, certification",
        body: "Requirements, process mapping and UAT first, then Jira, SQL and the modelling tool. This block is searched before it is read.",
      },
      {
        title: "Bullets: the requirement and what it produced",
        body: "**User stories** and **requirements gathering** only count where they end in something that shipped, or in rework that did not happen.",
      },
      {
        title: "Bullets: the process and the measure",
        body: "Cycle time, handoffs removed, error rate, hours saved. **Process mapping** without a before and an after reads as a diagram, not a change.",
      },
      {
        title: "Summary: domain and delivery method",
        body: "Banking, insurance, SaaS or public sector, plus Agile or waterfall. Recruiters filter on domain as often as on the title.",
      },
    ],
    evidence: [
      {
        title: "UAT",
        context: "The second one names what testing caught.",
        before: "Skills: UAT, test scenarios, go-live support",
        after:
          "Designed and ran UAT for a billing change with 14 testers, logged 27 issues before go-live, and blocked a release that would have double charged 300 accounts.",
      },
      {
        title: "process mapping",
        context: "A map is only interesting as the change that followed it.",
        before: "Mapped processes and identified improvements.",
        after:
          "Mapped the claims handoff across operations and finance, removed two approval steps, and cut cycle time from 9 days to 4.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will elicit and document requirements, write user stories with clear acceptance criteria, map current and future state processes, and support UAT. You will work closely with stakeholders across operations and IT. SQL and experience in an Agile environment are desirable.\"\n\nSeven terms in three sentences. All of them are artefacts or methods, which is why the BA CVs that stand out are the ones that say what those artefacts changed.",
    },
    pitfalls: [
      "**An inventory of documents.** BRDs, user stories, process maps. The reader assumes them. Say what they were for.",
      "**No outcome after 'identified improvements'.** Identified is not delivered. Name the change and the measure.",
      "**Domain left out.** Banking and SaaS BAs are hired from different pools. Put your domain in the summary.",
      "**SQL skipped.** A growing share of BA adverts name it. If you can query data, say so and show one bullet that uses it.",
      "**Certifications you are still studying for listed as held.** Write 'in progress' or leave it out.",
    ],
    faqs: [
      {
        q: "What keywords should a business analyst resume include?",
        a: "Requirements gathering, user stories, process mapping and UAT are the terms most BA adverts search. Add the domain, the delivery method, and the tools the advert names, and put each one in a bullet with an outcome.",
      },
      {
        q: "Is SQL necessary on a business analyst CV?",
        a: "Not for every role, but it is named in many IT and data focused BA adverts. If you use it, list it in your skills block and show it in at least one bullet.",
      },
      {
        q: "Should I list CBAP or ECBA on my resume?",
        a: "Only if you hold it. Write the full name and the short form once, because postings use both. A certification is a tiebreaker, not a substitute for outcomes.",
      },
      {
        q: "How is a business analyst CV different from a data analyst CV?",
        a: "A BA CV centres on requirements, process and delivery. A data analyst CV centres on queries, models and findings. If you do both, lead with the one the advert leads with.",
      },
    ],
  },
  {
    slug: "data-scientist",
    role: "Data Scientist",
    plural: "data scientists",
    examplePath: "/resume-examples/data-scientist",
    seoTitle: "Data Scientist Resume Keywords: The 2026 List",
    description:
      "The keywords data scientist postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for data scientist resume",
      "data scientist resume keywords",
      "ats keywords for data scientist resume",
      "data scientist resume skills",
      "machine learning resume keywords",
      "data science cv keywords",
      "ml engineer resume keywords",
    ],
    lede:
      "The terms data science adverts repeat, grouped by where they belong on the page. The algorithm list is where most CVs spend their words. The terms that get you hired are the ones that show a model reached production and changed a decision.",
    why:
      "Data science adverts have three layers. The first is language and libraries: **Python**, **SQL** and a modelling stack, and that is where filtering happens. The second is method: the kind of models you build and how you evaluate them. The third is production: **model deployment**, monitoring and experimentation. Most CVs are thick on the first two and silent on the third, which leaves a hiring manager unable to tell a practitioner from a strong student.",
    groups: [
      {
        title: "Modelling and method",
        note: "Name the model family and the problem it solved. A technique on its own is coursework.",
        terms: [
          "machine learning", "predictive modelling", "classification",
          "regression", "time series forecasting", "gradient boosting",
          "deep learning", "natural language processing (NLP)",
          "recommendation systems", "causal inference", "feature engineering",
          "model evaluation",
        ],
      },
      {
        title: "Languages and libraries",
        note: "Python and SQL are near universal. List only the libraries you would be happy to be interviewed on.",
        terms: [
          "Python", "SQL", "R", "pandas", "NumPy", "scikit-learn", "XGBoost",
          "PyTorch", "TensorFlow", "Spark", "Jupyter",
        ],
      },
      {
        title: "Production and MLOps",
        note: "The layer most CVs skip. Even one deployed model moves you into a different pile.",
        terms: [
          "model deployment", "MLOps", "MLflow", "Airflow", "Docker",
          "AWS SageMaker", "Vertex AI", "Databricks", "feature store",
          "model monitoring", "data drift", "CI/CD",
        ],
      },
      {
        title: "Experimentation and statistics",
        note: "The terms that show you can prove a model helped. Attach each one to a result.",
        terms: [
          "A/B testing", "experiment design", "hypothesis testing",
          "statistical significance", "Bayesian statistics", "uplift modelling",
          "online evaluation", "stakeholder communication",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with built or used. Each one implies the model went somewhere.",
        terms: [
          "deployed", "productionised", "reduced", "forecast", "ranked",
          "retrained", "monitored", "validated", "replaced", "scaled",
        ],
      },
    ],
    placement: [
      {
        title: "Skills block: languages, modelling stack, production tools",
        body: "Python and SQL first, then the modelling libraries, then the deployment and orchestration tools. This block is searched before it is read.",
      },
      {
        title: "Bullets: the model and what it changed",
        body: "**Machine learning** and **predictive modelling** only count where a decision followed. Name the data size, the model, and the business result.",
      },
      {
        title: "Bullets: production and monitoring",
        body: "Traffic served, retraining cadence, drift caught. **Model deployment** in a bullet is worth more than any algorithm in the skills line.",
      },
      {
        title: "Links: a repository or a paper, if it is real",
        body: "A single link to real work helps early in your career. Do not let tutorial projects sit above production work from a previous role.",
      },
    ],
    evidence: [
      {
        title: "machine learning",
        context: "The second one names the data, the deployment and the result.",
        before: "Skills: machine learning, predictive modelling, XGBoost",
        after:
          "Built and deployed a gradient boosted churn model over 2.4M accounts, and moved retention spend to the top decile, cutting quarterly churn from 7.1% to 5.3%.",
      },
      {
        title: "A/B testing",
        context: "Experimentation is most convincing when it stopped a rollout.",
        before: "Used A/B testing to evaluate model performance.",
        after:
          "Ran the ranking model as a 6 week online experiment against the incumbent, and held the rollout when lift proved flat outside the top two segments.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will build and deploy machine learning models in Python, work with large datasets in SQL and Spark, design experiments to measure impact, and partner with engineering to take models into production. Experience with MLflow or a similar platform is a plus.\"\n\nEight terms in two sentences, and half of them are about production. That is the half most data science CVs leave out.",
    },
    pitfalls: [
      "**A list of algorithms with no result.** Every data scientist lists random forests. Few say what a model changed.",
      "**Accuracy as the only metric.** A reader wants the business result: churn, revenue, hours, cost.",
      "**Nothing about production.** If a model shipped, say where, how much traffic it served, and how it was monitored.",
      "**No sense of scale.** Rows, features, users, refresh frequency. Scale separates a notebook from a system.",
      "**Kaggle ranks above real work.** Competitions help early on. After your first data science job they belong near the bottom.",
    ],
    faqs: [
      {
        q: "What keywords should a data scientist resume include?",
        a: "Python and SQL, the model families you have used, and the production and experimentation terms the advert names. Put the method terms inside bullets that end in a business result.",
      },
      {
        q: "Should I list every machine learning library I know?",
        a: "No. List the ones you would be comfortable being interviewed on, and the ones the advert names. A long library list with no evidence reads as coursework.",
      },
      {
        q: "How do I show impact if my model never reached production?",
        a: "Describe the decision it informed and what happened next. A model that changed a pricing decision or a forecast the team relied on is real impact. Be honest that it was offline.",
      },
      {
        q: "Is a data scientist CV different from a machine learning engineer CV?",
        a: "Yes, in emphasis. A data scientist CV leads with problems, methods and decisions. An ML engineer CV leads with deployment, infrastructure and reliability. If you do both, lead with the one the advert leads with.",
      },
    ],
  },

  {
    slug: "ux-designer",
    role: "UX Designer",
    plural: "UX designers",
    examplePath: "/resume-examples/ux-designer",
    seoTitle: "UX Designer Resume Keywords: The 2026 List",
    description:
      "The keywords UX design postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for ux designer resume",
      "ux designer resume keywords",
      "ats keywords for ux designer resume",
      "ux designer resume skills",
      "product designer resume keywords",
      "ui ux designer resume keywords",
      "ux researcher resume keywords",
    ],
    lede:
      "The terms UX postings repeat, grouped by where they belong on the page. Every design CV lists Figma. What moves a design CV onto the shortlist is proof that a design shipped and changed something a team measured.",
    why:
      "Design adverts ask for two things in the same breath. The first is craft and tooling: **Figma**, **prototyping**, **design systems**, **usability testing**. These are the literal strings a recruiter searches, and a CV that only says 'designed screens' matches none of them. The second is outcome: postings for product and UX roles talk about **activation**, **conversion**, **accessibility** and working with engineering through to release. Most design CVs cover the tools and leave the outcome to the portfolio, which the screen often never opens.",
    groups: [
      {
        title: "Research and discovery",
        note: "The half of the job most CVs compress into one word. Name the method, then say how many people you learned from.",
        terms: [
          "user research", "usability testing", "user interviews",
          "contextual inquiry", "journey mapping", "personas",
          "jobs to be done", "card sorting", "tree testing",
          "survey design", "research synthesis", "competitive analysis",
        ],
      },
      {
        title: "Design craft",
        note: "What you can be trusted to produce. Write the artefact the advert names, because 'wireframes' and 'high fidelity prototypes' are searched separately.",
        terms: [
          "wireframes", "prototyping", "high fidelity prototypes",
          "interaction design", "information architecture", "visual design",
          "user flows", "design systems", "component library",
          "responsive design", "microcopy", "accessibility (WCAG)",
        ],
      },
      {
        title: "Tools",
        note: "Figma is close to universal, so it earns its place without winning you anything. Add the research and testing tools you actually used.",
        terms: [
          "Figma", "FigJam", "Sketch", "Adobe XD", "Maze", "UserTesting",
          "Dovetail", "Hotjar", "Miro", "Framer", "HTML/CSS basics",
        ],
      },
      {
        title: "Product and collaboration",
        note: "The terms that separate a product designer from a production designer. Each needs a bullet showing you worked past the handoff.",
        terms: [
          "cross-functional", "design handoff", "developer collaboration",
          "product strategy", "A/B testing", "design critique",
          "stakeholder management", "design QA", "iteration",
          "metrics driven design",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with designed or created. Each one points at a before and an after.",
        terms: [
          "redesigned", "simplified", "tested", "validated", "shipped",
          "reduced", "consolidated", "standardised", "interviewed", "launched",
        ],
      },
    ],
    placement: [
      {
        title: "Header: the portfolio link",
        body: "One link, next to your email, that opens without a password. A design CV with no portfolio link is usually read as unfinished.",
      },
      {
        title: "Skills block: tools and methods",
        body: "**Figma** first, then the research and testing tools, then the methods. Keep it short. A reader searches this block and then goes looking for proof.",
      },
      {
        title: "Bullets: method plus the metric it moved",
        body: "**usability testing** only counts where it ends in a change. 'Ran 16 usability tests' is a process note. 'Ran 16 usability tests and cut onboarding from 9 steps to 5' is design.",
      },
      {
        title: "Bullets: who you shipped with",
        body: "Name the squads, the engineers or the design system consumers. Scale here shows whether your work reached one screen or a whole product.",
      },
    ],
    evidence: [
      {
        title: "usability testing",
        context: "The second one says what the tests changed.",
        before: "Skills: usability testing, user research, prototyping",
        after:
          "Ran 16 usability tests on the onboarding flow, cut it from 9 steps to 5, and activation rose from 44% to 61% in the six weeks after release.",
      },
      {
        title: "design systems",
        context: "A component library is only interesting when other people use it.",
        before: "Built and maintained a design system in Figma.",
        after:
          "Extended the design system with 18 components used by 4 squads, and cut design to dev questions on those screens by about half in a quarter.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will run user research and usability testing, turn findings into wireframes and high fidelity prototypes in Figma, and contribute to our design system. You will partner closely with product and engineering through to release. Experience with accessibility standards is a plus.\"\n\nEight terms in three sentences, and only one of them is a tool. The rest describe research, craft and delivery, which is where most design CVs go quiet.",
    },
    pitfalls: [
      "**A tool list standing in for a career.** Figma, FigJam, Miro and Maze tell a reader what you can open, not what you changed.",
      "**Methods with no outcome.** 'Conducted user research' appears on almost every design CV. Say what you learned and what shipped because of it.",
      "**Everything left to the portfolio.** The first screen is often a keyword search and a quick read. The CV has to make the case on its own.",
      "**No sign of engineering.** Postings for product roles ask for collaboration through to release. A CV that stops at handoff reads as junior.",
      "**Accessibility missing.** It is named in a growing share of design adverts. If you have designed to WCAG, say so and name the level.",
    ],
    faqs: [
      {
        q: "Should a UX designer resume list Figma?",
        a: "Yes, because it is searched as a literal string. It will not set you apart, though, since almost every applicant lists it. Put it in the skills block and spend your bullets on what your designs changed.",
      },
      {
        q: "Do I need metrics on a UX design resume?",
        a: "Use them wherever you have them: activation, conversion, task success, support tickets, time on task. If a metric was never measured, name the decision your research led to instead. Both are stronger than a list of methods.",
      },
      {
        q: "UX designer or product designer, which title should I use?",
        a: "Match the posting when it is honest. Many teams use the two titles for the same job. If you worked on strategy, metrics and delivery as well as screens, product designer is usually accurate.",
      },
      {
        q: "How do I show research skills if I had no researcher on the team?",
        a: "Describe the research you ran yourself, with the method and the number of people. 'Interviewed 22 customers about search' is research, whatever your title said at the time.",
      },
    ],
  },
  {
    slug: "sales-manager",
    role: "Sales Manager",
    plural: "sales managers",
    examplePath: "/resume-examples/sales-manager",
    seoTitle: "Sales Manager Resume Keywords: The 2026 List",
    description:
      "The keywords sales manager postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for sales manager resume",
      "sales manager resume keywords",
      "ats keywords for sales manager resume",
      "sales manager resume skills",
      "sales resume keywords",
      "sales leadership resume keywords",
      "account manager resume keywords",
    ],
    lede:
      "The terms sales leadership postings repeat, grouped by where they belong on the page. In sales the numbers are the argument. A manager CV without a quota and an attainment figure reads as a CV hiding one.",
    why:
      "Sales manager adverts are built around a small set of numbers and the systems that track them. **Quota attainment**, **pipeline management** and **forecasting** appear in most of them, next to a CRM named as a product: **Salesforce** or **HubSpot**. The second half of the advert is leadership: **coaching**, **hiring**, **territory planning**, a qualification method like **MEDDIC**. A CV that says 'grew revenue and led a team' matches almost none of that, even when the person has done all of it.",
    groups: [
      {
        title: "Numbers and targets",
        note: "The group a hiring manager reads first. Each term needs a figure next to it, and the quota needs the attainment beside it.",
        terms: [
          "quota attainment", "revenue growth", "annual quota",
          "average deal size", "win rate", "sales cycle",
          "pipeline coverage", "net new revenue", "expansion revenue",
          "retention", "forecast accuracy",
        ],
      },
      {
        title: "Sales process and method",
        note: "Name the methodology you actually ran. Postings search for MEDDIC or Challenger as literal strings.",
        terms: [
          "pipeline management", "sales forecasting", "territory planning",
          "account planning", "MEDDIC", "MEDDPICC", "Challenger Sale",
          "solution selling", "consultative selling", "deal reviews",
          "enterprise sales", "negotiation",
        ],
      },
      {
        title: "Leadership",
        note: "Where a manager separates from a top rep. Every one of these belongs in a bullet with a team outcome.",
        terms: [
          "team leadership", "sales coaching", "performance management",
          "hiring and onboarding", "quota setting", "ramp time",
          "compensation planning", "cross-functional",
          "quarterly business reviews (QBRs)",
        ],
      },
      {
        title: "Systems",
        note: "The CRM is often named in the advert, and a team on Salesforce will search for Salesforce. List the tools you ran reviews and forecasts in.",
        terms: [
          "Salesforce", "HubSpot", "Gong", "Outreach", "Salesloft",
          "LinkedIn Sales Navigator", "Clari", "Excel",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with managed or responsible for. Each one implies a number.",
        terms: [
          "closed", "exceeded", "grew", "built", "coached", "hired",
          "ramped", "expanded", "negotiated", "turned around",
        ],
      },
    ],
    placement: [
      {
        title: "Summary: quota, attainment and team size",
        body: "The first two lines should give the team you lead, the quota you carry and the attainment you hit. **112% of a 6.4M team quota** says more than any adjective.",
      },
      {
        title: "Skills block: CRM and methodology",
        body: "**Salesforce** or **HubSpot** by name, then the qualification method, then the tools your team uses. This block is searched before it is read.",
      },
      {
        title: "Bullets: team results, not your own deals",
        body: "At manager level the reader wants to know what happened to the team. How many reps hit target, how ramp time changed, how the forecast held.",
      },
      {
        title: "Bullets: the market you sold into",
        body: "Segment, region and deal size. SMB and enterprise are different jobs, and the reader needs to know which one you ran.",
      },
    ],
    evidence: [
      {
        title: "quota attainment",
        context: "The first states a duty. The second gives the target, the result and the team behind it.",
        before: "Managed a sales team and consistently exceeded targets.",
        after:
          "Lead 8 account executives against a 6.4M annual quota, closing 2025 at 112% with 6 of 8 reps individually above target.",
      },
      {
        title: "sales coaching",
        context: "Coaching only counts when a named rep or metric moved.",
        before: "Coached team members to improve their performance.",
        after:
          "Introduced weekly deal reviews and a MEDDIC qualification standard, taking 3 underperforming reps above quota within two quarters.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will lead a team of account executives, own the regional forecast and pipeline, and coach reps through complex deals. A track record of quota attainment is essential. Experience with Salesforce and a structured qualification method such as MEDDIC is preferred.\"\n\nEight terms in three sentences, and most of them ask for a number. A CV that says 'drove revenue growth' answers none of them.",
    },
    pitfalls: [
      "**Attainment without the quota.** 112% of what? A percentage with no base reads as a number chosen to flatter.",
      "**Your own deals at manager level.** A reader hiring a manager wants the team result. Keep one line on your personal closing if it matters.",
      "**No segment or deal size.** Without them a reader cannot tell a transactional desk from an enterprise team.",
      "**The CRM left out.** Salesforce and HubSpot are among the most searched terms in sales postings.",
      "**Adjectives instead of figures.** 'Results driven' and 'high performing' take up space that a number would fill better.",
    ],
    faqs: [
      {
        q: "What numbers should a sales manager resume include?",
        a: "Quota and attainment together, team size, average deal size, and at least one team outcome such as reps above target or ramp time. Those four let a reader place you in seconds.",
      },
      {
        q: "Should I name my sales methodology?",
        a: "Yes, if you actually ran it. MEDDIC, MEDDPICC, Challenger and solution selling are searched as literal strings. Put the name in a bullet that shows what changed when the team adopted it.",
      },
      {
        q: "What if I missed quota one year?",
        a: "Give your strongest honest period and explain context where it helps, such as a territory change or a new product. Leaving every number off draws more suspicion than one weaker year.",
      },
      {
        q: "Do I list Salesforce if everyone uses it?",
        a: "Yes. It is often a stated requirement and it is searched literally. Add what you did in it, such as building the forecast or the deal review dashboard, so it reads as ownership rather than access.",
      },
    ],
  },
  {
    slug: "financial-analyst",
    role: "Financial Analyst",
    plural: "financial analysts",
    examplePath: "/resume-examples/financial-analyst",
    seoTitle: "Financial Analyst Resume Keywords: The 2026 List",
    description:
      "The keywords financial analyst postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for financial analyst resume",
      "financial analyst resume keywords",
      "ats keywords for financial analyst resume",
      "financial analyst resume skills",
      "fp&a resume keywords",
      "finance analyst cv keywords",
      "financial modelling resume keywords",
    ],
    lede:
      "The terms FP&A and commercial finance postings repeat, grouped by where they belong on the page. Every analyst builds models. The CVs that get shortlisted say which decision the model informed.",
    why:
      "Financial analyst adverts split into method and system. The method half is precise: **financial modelling**, **variance analysis**, **forecasting**, **budgeting**, **scenario analysis**. The system half is just as literal: **advanced Excel** is close to universal, and many adverts name the ERP or planning tool, such as **SAP**, **NetSuite**, **Anaplan** or **Power BI**. A CV that says 'prepared financial reports' matches almost none of it. The second filter comes from the hiring manager: whether anyone acted on your analysis.",
    groups: [
      {
        title: "Planning and analysis",
        note: "The core vocabulary of FP&A. Write it the way the advert does, because 'forecasting' and 'rolling forecast' are searched separately.",
        terms: [
          "financial modelling", "variance analysis", "forecasting",
          "rolling forecast", "budgeting", "scenario analysis",
          "sensitivity analysis", "three statement model", "long range planning",
          "driver based planning", "margin analysis", "cost analysis",
        ],
      },
      {
        title: "Reporting",
        note: "What you produce each month. These belong in bullets with the audience and the cadence.",
        terms: [
          "management accounts", "monthly reporting", "board packs",
          "KPI reporting", "executive dashboards", "month end",
          "P&L analysis", "cash flow analysis", "commentary",
        ],
      },
      {
        title: "Commercial and investment",
        note: "Where an analyst becomes a partner to the business. Each term needs a decision attached.",
        terms: [
          "business partnering", "pricing analysis", "business cases",
          "investment appraisal", "NPV", "IRR", "ROI analysis",
          "capex", "unit economics", "cost control",
        ],
      },
      {
        title: "Systems and tools",
        note: "Name the ERP and the planning tool by product. Say advanced Excel and give one example of what that means.",
        terms: [
          "advanced Excel", "Power Query", "pivot tables", "Power BI",
          "Tableau", "SAP", "Oracle", "NetSuite", "Anaplan", "Adaptive Insights",
          "SQL", "VBA",
        ],
      },
      {
        title: "Qualifications",
        note: "Only if you hold them or are studying. State the status and the level plainly.",
        terms: [
          "CFA", "CFA Level I", "ACCA", "CIMA", "ACA", "CPA",
          "FMVA", "finance degree",
        ],
      },
    ],
    placement: [
      {
        title: "Summary: scope and one decision",
        body: "The size of the business, the units you cover and one decision your analysis shaped. **Built the model behind a pricing change** is the kind of line a reader remembers.",
      },
      {
        title: "Skills block: Excel, ERP, planning tool",
        body: "**advanced Excel** with the specifics, then the ERP, then the BI or planning tool. This is where the search looks first.",
      },
      {
        title: "Bullets: the analysis and what the business did",
        body: "**variance analysis** means little alone. 'Flagged a freight overrun 6 weeks before year end' shows the analysis mattered.",
      },
      {
        title: "Bullets: cycle time and scale",
        body: "Cost centres, entities, days to close or consolidate. These show whether you ran the process or supported it.",
      },
    ],
    evidence: [
      {
        title: "financial modelling",
        context: "The second one names the decision the model informed.",
        before: "Built financial models in Excel to support decision making.",
        after:
          "Built the margin model behind a pricing review, and the scenario the board chose recovered 2.1 points of gross margin on the affected range.",
      },
      {
        title: "budgeting",
        context: "Owning a budget cycle is only interesting when the cycle got better.",
        before: "Assisted with the annual budgeting process.",
        after:
          "Ran the budget cycle for 14 cost centres and cut consolidation from 11 days to 4 by replacing emailed templates with one Power BI model.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will own the monthly forecast and variance analysis for two business units, build financial models to support pricing and investment decisions, and partner with budget holders. Advanced Excel is essential. SAP and Power BI experience is desirable. Part qualified CIMA or ACCA welcome.\"\n\nNine terms in four sentences, and three of them could be hard filters. A CV that says 'supported the finance team' matches none of them.",
    },
    pitfalls: [
      "**Deliverables with no decision.** 'Built models and decks' describes every analyst. Say what the business did differently.",
      "**Excel written without a level.** Bare 'Excel' next to SAP reads as padding. Say advanced and name one technique.",
      "**No scale.** Turnover, business units, cost centres. Without them a reader cannot place the role.",
      "**The ERP or planning tool unnamed.** Finance teams recruit for their own stack and search for it by name.",
      "**Qualification status vague.** 'Studying CFA' reads further away than 'CFA Level II candidate, June 2026'. Be exact.",
    ],
    faqs: [
      {
        q: "What are the most important financial analyst resume keywords?",
        a: "Financial modelling, forecasting, variance analysis and budgeting appear in most postings, along with advanced Excel. After that, the ERP and planning tool the advert names. Take the final list from the posting in front of you.",
      },
      {
        q: "Should I list CFA progress on my resume?",
        a: "Yes, with the exact status: 'CFA Level II candidate' or 'passed CFA Level I, 2025'. Employers know what each level means. Vague wording costs you more than the level itself.",
      },
      {
        q: "How do I show impact as a junior analyst?",
        a: "Name the decision and your part in it honestly. 'Built the forecast the team used to delay a hire by a quarter' is strong and true. Claiming the decision as yours is neither.",
      },
      {
        q: "Is SQL worth adding to a financial analyst CV?",
        a: "If you use it, yes. More finance postings mention SQL and Power BI than before, especially in FP&A roles that pull their own data. Show it in a bullet, not just the skills line.",
      },
    ],
  },
  {
    slug: "hr-manager",
    role: "HR Manager",
    plural: "HR managers",
    examplePath: "/resume-examples/hr-manager",
    seoTitle: "HR Manager Resume Keywords: The 2026 List",
    description:
      "The keywords HR manager postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for hr manager resume",
      "hr manager resume keywords",
      "ats keywords for hr manager resume",
      "hr manager resume skills",
      "human resources resume keywords",
      "hr business partner resume keywords",
      "hr generalist resume keywords",
    ],
    lede:
      "The terms HR postings repeat, grouped by where they belong on the page. HR work can be measured. The strongest HR CVs pull two or three numbers from a system the writer already reports from.",
    why:
      "HR manager adverts are written in the vocabulary of the employee lifecycle: **employee relations**, **performance management**, **talent acquisition**, **onboarding**, **employment law**. They also name the qualification and the system: **CIPD** in the UK or **SHRM** in the US, and an HRIS such as **Workday** or **BambooHR**. A CV that says 'supported staff with HR matters' matches none of that. The second filter is scale and outcome, which most HR CVs leave out on the belief the work cannot be quantified.",
    groups: [
      {
        title: "Employee lifecycle",
        note: "The phrases postings use for the core of the job. Write them exactly, because each one is searched on its own.",
        terms: [
          "talent acquisition", "recruitment", "onboarding",
          "performance management", "succession planning",
          "learning and development", "career development", "offboarding",
          "workforce planning", "organisational design",
        ],
      },
      {
        title: "Employee relations and compliance",
        note: "The part of the job with the most risk attached. Case volume and outcomes belong here.",
        terms: [
          "employee relations", "grievances", "disciplinaries",
          "absence management", "employment law", "policy development",
          "TUPE", "redundancy", "investigations", "right to work",
          "health and safety", "GDPR",
        ],
      },
      {
        title: "Reward and engagement",
        note: "Where an HR manager shows commercial judgement. Give the before and after on any survey or pay review you ran.",
        terms: [
          "compensation and benefits", "pay benchmarking", "pay banding",
          "employee engagement", "engagement survey", "retention",
          "attrition", "DEI", "wellbeing", "employer branding",
        ],
      },
      {
        title: "Systems",
        note: "The HRIS is frequently named in the advert. List the ones you administered, not the ones you logged into.",
        terms: [
          "Workday", "BambooHR", "SAP SuccessFactors", "HiBob", "Personio",
          "Greenhouse", "Lever", "ADP", "HR analytics", "Excel",
        ],
      },
      {
        title: "Qualifications and partnering",
        note: "State the level of the qualification plainly. Business partnering is a role signal in its own right.",
        terms: [
          "CIPD Level 5", "CIPD Level 7", "SHRM-CP", "SHRM-SCP", "PHR",
          "HR business partnering", "coaching managers", "change management",
        ],
      },
    ],
    placement: [
      {
        title: "Summary: headcount, sites and one outcome",
        body: "The number of employees you support, the sites or countries, and one result. **Supporting 340 employees across 4 sites** places you before a reader gets to the bullets.",
      },
      {
        title: "Skills block: qualification and HRIS",
        body: "**CIPD Level 7** or **SHRM-CP**, then the HRIS by name. Both are checked early and searched literally.",
      },
      {
        title: "Bullets: the metric from your own reports",
        body: "Time to hire, attrition, absence rate, engagement score, case volume. Two of these turn a generic HR CV into a specific one.",
      },
      {
        title: "Bullets: employee relations, with the outcome",
        body: "Case count and how they closed. **No case escalated to tribunal** is a strong, honest line if it is true.",
      },
    ],
    evidence: [
      {
        title: "talent acquisition",
        context: "The first describes a responsibility. The second gives the change and the result.",
        before: "Responsible for the recruitment process across the business.",
        after:
          "Rebuilt hiring around structured scorecards and a two stage process, cutting time to hire from 54 days to 31.",
      },
      {
        title: "employee relations",
        context: "Case work is only persuasive when the volume and the outcome are there.",
        before: "Handled employee relations issues and disciplinary matters.",
        after:
          "Led 30+ employee relations cases including 6 formal grievances, with none escalating to tribunal and all closed inside the policy timeframe.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will partner with managers across the full employee lifecycle, lead employee relations casework, and drive engagement and retention. Strong knowledge of employment law is essential. CIPD Level 5 or above required. Experience with Workday is desirable.\"\n\nEight terms in four sentences, and two of them are hard filters. A CV that says 'provided HR support' matches almost none of it.",
    },
    pitfalls: [
      "**Believing HR cannot be measured.** Attrition, time to hire and absence are already in a system you report from. Use them.",
      "**No headcount.** Supporting 40 people and 4,000 people are different jobs. Say which.",
      "**The qualification level missing.** 'CIPD qualified' is weaker than 'CIPD Level 7'. Postings often name the level.",
      "**Employee relations with no outcome.** A list of case types reads as exposure. Case volume with clean outcomes reads as skill.",
      "**The HRIS unnamed.** Workday and BambooHR are searched as literal strings.",
    ],
    faqs: [
      {
        q: "How do I quantify an HR manager resume?",
        a: "Start with the numbers your HR system already holds: headcount supported, time to hire, attrition, absence rate, engagement score and case volume. Two or three of these, with a before and after, are enough.",
      },
      {
        q: "Should I put CIPD or SHRM on my resume?",
        a: "Yes, near the top, with the level. Many HR postings state a minimum qualification, and it is checked early. If you are studying, give the level and the expected completion date.",
      },
      {
        q: "HR manager or HR business partner, which keywords matter?",
        a: "They overlap heavily. Business partner postings lean harder on coaching managers, workforce planning and change management. Match the language of the advert you are answering.",
      },
      {
        q: "How much employment law detail should I include?",
        a: "Name the areas you have handled, such as TUPE, redundancy or investigations, and the outcomes. Do not list legislation you have only read about. It is a common interview topic.",
      },
    ],
  },
  {
    slug: "administrative-assistant",
    role: "Administrative Assistant",
    plural: "administrative assistants",
    examplePath: "/resume-examples/administrative-assistant",
    seoTitle: "Administrative Assistant Resume Keywords (2026)",
    description:
      "The keywords admin assistant postings actually lean on, grouped by where they belong on your CV, with worked examples. Free checker on the page.",
    extraKeywords: [
      "keywords for administrative assistant resume",
      "administrative assistant resume keywords",
      "ats keywords for administrative assistant resume",
      "administrative assistant resume skills",
      "admin assistant resume keywords",
      "office administrator resume keywords",
      "executive assistant resume keywords",
    ],
    lede:
      "The terms admin postings repeat, grouped by where they belong on the page. Every admin CV says it supported the team. The ones that get calls show volume and turnaround on the tasks the advert names.",
    why:
      "Administrative adverts are unusually specific about tasks: **calendar management**, **travel booking**, **expense reports**, **data entry**, **minute taking**. They name the software as well: **Microsoft Office**, often with **Excel** and **Outlook** called out, or **Google Workspace**. Recruiters search for those exact phrases. A CV that says 'provided administrative support' matches none of them, even when the person has done every task on the list.",
    groups: [
      {
        title: "Core tasks",
        note: "The exact phrases postings use. Write them the way the advert does, because 'diary management' and 'calendar management' are searched separately.",
        terms: [
          "calendar management", "diary management", "scheduling",
          "travel booking", "expense reports", "inbox management",
          "meeting coordination", "minute taking", "data entry",
          "filing", "document preparation", "event coordination",
        ],
      },
      {
        title: "Office and front of house",
        note: "Many admin roles cover the office itself. Name the parts you ran.",
        terms: [
          "reception", "visitor management", "phone handling",
          "office supplies", "vendor coordination", "facilities",
          "mail handling", "onboarding support", "office management",
        ],
      },
      {
        title: "Software",
        note: "List what you use every day, and say advanced for Excel only if you can build a pivot table without looking it up.",
        terms: [
          "Microsoft Office", "Outlook", "Word", "Excel", "PowerPoint",
          "Google Workspace", "Slack", "Microsoft Teams", "Zoom",
          "Expensify", "SAP Concur", "Calendly",
        ],
      },
      {
        title: "Working style",
        note: "Soft skills only count with an example. Each of these needs a bullet that shows it.",
        terms: [
          "confidentiality", "attention to detail", "prioritisation",
          "time management", "stakeholder coordination", "problem solving",
          "written communication", "discretion",
        ],
      },
      {
        title: "Verbs that carry evidence",
        note: "Open bullets with these rather than with helped or assisted. Each one points at a task you owned.",
        terms: [
          "coordinated", "scheduled", "organised", "processed", "booked",
          "triaged", "maintained", "streamlined", "drafted", "tracked",
        ],
      },
    ],
    placement: [
      {
        title: "Summary: who you supported",
        body: "The team size or the executive, and the tasks you owned. **Supporting a 12 person operations team** places you straight away.",
      },
      {
        title: "Skills block: software by name",
        body: "**Microsoft Office** or **Google Workspace**, with Excel and Outlook named if the posting names them. This block is searched first.",
      },
      {
        title: "Bullets: volume and turnaround",
        body: "Trips booked, meetings scheduled, emails triaged, days to close expenses. Numbers turn routine tasks into evidence.",
      },
      {
        title: "Bullets: a problem you prevented",
        body: "Clashes resolved, late payments avoided, a process that stopped breaking. One of these shows you think ahead.",
      },
    ],
    evidence: [
      {
        title: "calendar management",
        context: "The second shows the scale and the result.",
        before: "Managed calendars and scheduled meetings for the team.",
        after:
          "Ran the shared calendar for 12 people and resolved clashes the same day, so unbooked conflicts dropped from several a week to one or two a month.",
      },
      {
        title: "expense reports",
        context: "A task becomes evidence when it has volume and turnaround.",
        before: "Booked travel and processed expenses.",
        after:
          "Booked 40+ domestic and 8 international trips in a year and closed expense reports within two working days.",
      },
    ],
    jobExcerpt: {
      title: "How the terms cluster in a real advert",
      body: "\"You will manage calendars and book travel for a busy team, process expense reports, take minutes at weekly meetings, and act as the first point of contact for visitors. Strong Microsoft Office skills, especially Excel and Outlook, are essential. Confidentiality is a must.\"\n\nNine terms in three sentences, and most of them are tasks. A CV that says 'provided administrative support' matches none of them.",
    },
    pitfalls: [
      "**'Provided administrative support' as the whole story.** It restates the job title. Name the tasks the advert names.",
      "**No volume.** Without a number of people, trips or emails, a reader cannot tell a light role from a busy one.",
      "**Software listed as a paragraph.** Keep it to the tools you use daily, in a short line the search can find.",
      "**Soft skills with nothing behind them.** 'Excellent attention to detail' needs a bullet that proves it.",
      "**The wrong word for the market.** UK postings often say diary management. US postings say calendar management. Use the advert's word.",
    ],
    faqs: [
      {
        q: "What keywords should an administrative assistant resume include?",
        a: "Start with the tasks the posting names, such as calendar management, travel booking, expense reports and minute taking, then the software, usually Microsoft Office or Google Workspace. Put each task in a bullet with a number.",
      },
      {
        q: "Should I say diary management or calendar management?",
        a: "Use the word in the advert. UK postings often say diary management and US postings calendar management. If you apply in both markets, write the one the posting uses.",
      },
      {
        q: "How do I make routine admin work sound specific?",
        a: "Add volume and turnaround. 'Booked 40+ trips a year' and 'closed expenses within two working days' are routine tasks written as evidence.",
      },
      {
        q: "Can I use these keywords for an executive assistant role?",
        a: "Many overlap. Executive assistant postings lean harder on diary management for one senior person, confidentiality, board papers and gatekeeping. Read the advert and add those if you have done them.",
      },
    ],
  },
];

// Two questions every one of these pages gets asked. Everything else in the
// FAQ comes from the role.
const SHARED_FAQS = [
  {
    q: "Can I just copy these keywords onto my resume?",
    a: "No, and a CV built that way falls apart in the first interview. Use the list as a checklist against work you have actually done. A term you cannot evidence in a bullet is a term that moves your rejection from the screen to the phone call, which is worse for you, not better.",
  },
  {
    q: "How many keywords should a resume have?",
    a: "There is no target number, and any tool that gives you one is guessing. What matters is coverage of the specific posting in front of you: the terms it repeats should be findable on your CV, in your own evidence. Twelve well placed terms beat forty in a list.",
  },
];

/** Turns a role payload into a marketing page object for the /[slug] route. */
function buildPage(role) {
  const {
    slug, role: name, plural, examplePath, seoTitle, description,
    extraKeywords, lede, why, groups, placement, evidence, jobExcerpt,
    pitfalls, faqs,
  } = role;

  return {
    slug: slug + "-resume-keywords",
    seoTitle,
    description,
    keywords: [
      ...extraKeywords,
      name.toLowerCase() + " cv keywords",
      "resume keywords for " + plural,
      "ats keywords",
    ],
    eyebrow: "Keyword list",
    breadcrumbName: name + " resume keywords",
    h1: "Resume keywords for " + plural,
    lede,
    ctas: [
      { label: "Check my CV", href: "#tool" },
      { label: "See a " + name + " CV", href: examplePath, variant: "secondary" },
    ],
    tool: "gaps",
    howTo: {
      name: "How to use " + name + " resume keywords",
      description:
        "Match your CV against the vocabulary " + plural + " postings actually use.",
      steps: [
        {
          name: "Read the groups below",
          text: "Mark every term you have genuinely done. Ignore the rest. The list is a checklist against your own history, not a menu.",
        },
        {
          name: "Put each marked term inside a bullet",
          text: "A term in a skills list is a claim. The same term in a bullet with a number attached is evidence, and evidence is what survives the interview.",
        },
        {
          name: "Check against the real posting",
          text: "Paste the job description and your CV into the checker on this page. Every posting weights these terms differently, so the advert in front of you beats any generic list.",
        },
      ],
    },
    faqs: [...faqs, ...SHARED_FAQS],
    faqHeading: name + " resume keywords: FAQ",
    blocks: [
      { h2: "What " + plural + " postings actually ask for" },
      { p: why },

      { h2: "The keywords, grouped" },
      {
        p: "Grouped by the job each one does, because where a term belongs on the page matters as much as whether it is there at all.",
      },
      {
        table: {
          head: ["Group", "Terms a posting uses", "Why this group matters"],
          rows: groups.map((g) => [g.title, g.terms.join(", "), g.note]),
        },
      },

      { h2: "Where each group belongs on the page" },
      { steps: placement },

      { h2: "A keyword only counts inside evidence" },
      {
        p: "Both columns below contain the keyword. Only one of them survives a hiring manager reading it, which is the whole reason a keyword list is not a strategy on its own.",
      },
      ...evidence.map((item) => ({ compare: item })),

      { h2: "How these terms appear in a real posting" },
      { callout: jobExcerpt },

      { h2: "Where these CVs lose points" },
      { ul: pitfalls },

      { h2: "Check your CV against the posting in front of you" },
      {
        p: "This page lists what " + plural + " postings tend to ask for. The advert you are answering today weights them differently, and that is the list that decides your application. Paste both into the checker at the top of this page to see which of its terms your CV never mentions, or read the [worked " + name + " CV example](" + examplePath + ") to see the terms sitting inside real bullets.",
      },
      {
        cta: {
          title: "Get the gaps fixed, not just listed",
          body: "Paste the job link and FitMyCV rewrites your CV and cover letter against that posting, keeping your real experience and your real numbers.",
          href: "/tailor-cv-from-job-link",
          label: "Tailor my CV",
        },
      },
    ],
    related: [
      {
        label: name + " CV example",
        href: examplePath,
        body: "A worked example with rewritten bullets and a skills block.",
      },
      {
        label: "Missing resume keywords",
        href: "/missing-resume-keywords",
        body: "Paste a posting and your CV. See exactly which terms you never mention.",
      },
      {
        label: "Free ATS resume checker",
        href: "/ats-resume-checker",
        body: "Score your CV against a specific posting before you apply.",
      },
    ],
  };
}

export const RESUME_KEYWORD_PAGES = ROLES.map(buildPage);

// Resume example slug to keyword page slug, so /resume-examples/<role> can
// link to the matching keyword list. Derived from examplePath, so a renamed
// example cannot silently orphan a keyword page.
const BY_EXAMPLE = Object.fromEntries(
  ROLES.map((r) => [
    r.examplePath.replace("/resume-examples/", ""),
    { slug: r.slug + "-resume-keywords", role: r.role },
  ])
);

/** The keyword page for a resume example slug, or null when there is none. */
export function keywordsPageFor(exampleSlug) {
  return BY_EXAMPLE[exampleSlug] ?? null;
}

export default ROLES;

