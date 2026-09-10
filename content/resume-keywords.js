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
      "data analyst resume skills",
      "ats keywords for data analyst resume",
      "business analyst resume keywords",
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

