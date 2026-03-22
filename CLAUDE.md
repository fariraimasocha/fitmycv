# FitMyCV

## Project Overview

FitMyCV lets users upload a reference CV, paste a job listing URL, and receive a tailored CV and cover letter optimized for that specific role. The app scrapes job requirements, matches them against the user's experience, and generates customized application documents.

## Tech Stack

- **Framework:** Next.js 16, React 19, Tailwind CSS v4
- **Tailwind CSS:** use Tailwind v4 native utility values (e.g. `min-h-75`, `p-4`, `gap-6`) instead of arbitrary bracket syntax (e.g. `min-h-[300px]`, `p-[16px]`, `gap-[24px]`). Tailwind v4's spacing scale is `1 unit = 4px` (so `75 = 300px`).
- **Auth:** NextAuth (Google OAuth)
- **DB/ORM:** mongoose/MongoDB
- **APIs:** Exa.ai (job page scraping), OpenAI (CV tailoring + cover letter), Groq (PDF text extraction)
- **PDF:** unpdf (extract text), TBD (generate downloadable PDFs)
- **Icons:** use @phosphor-icons/react — always use the `Icon` suffix (e.g. `HouseIcon`, `XIcon`, `ListIcon`). Bare names like `X`, `List` are deprecated.
- **Data fetching, caching and Mutations:** use tanstack-query
- **Toasts:** use react-hot-toast for all notifications
- **State Management:** use zustand for global state management
- **Loading:** use `<Loader />` from `@/components/Loader` — default full-page loader for all pages

## User Flow

1. Sign in (Google OAuth via NextAuth)
2. Upload reference CV (PDF) — text extracted via unpdf, parsed via Groq into structured JSON
3. Paste a job link — Exa.ai scrapes the page, Groq extracts key requirements
4. Generate tailored CV — OpenAI rewrites CV to match job requirements
5. Generate cover letter — OpenAI creates a cover letter from the tailored CV + job context
6. Download tailored CV and cover letter as PDFs
7. View history of all generated CVs

## Key Models

- **ReferenceCV** — user's uploaded base CV (structured JSON)
- **JobPosting** — scraped job requirements
- **TailoredCV** — generated CV matched to a specific job
- **CoverLetter** — generated cover letter for a specific job

## Implementation Phases

1. Models — ReferenceCV, JobPosting, TailoredCV, CoverLetter
2. Reference CV upload — API route + server actions + My CV page
3. Job scraping — Exa.ai util + API route + JobLinkInput component
4. CV tailoring — OpenAI util + API route + TailoredCVView component
5. Cover letter — API route + CoverLetterView component
6. Dashboard layout — Sidebar + all pages wired up
7. PDF export — pdf-generator util + download API route
8. History page — List all generated CVs with download links

## Smoke Tests

1. Upload a PDF CV — verify it parses and saves to ReferenceCV model
2. Visit My CV page — verify stored CV displays correctly
3. Re-upload CV — verify it updates (not duplicates)
4. Paste a LinkedIn job URL — verify Exa.ai scrapes requirements correctly
5. Generate tailored CV — verify content is adjusted for the job
6. Generate cover letter — verify it references the job and user's experience
7. Download PDF — verify CV and cover letter render as proper PDFs

## React Hooks Rules

- **Always include all referenced variables in dependency arrays.** Every variable used inside `useEffect`, `useMemo`, or `useCallback` must appear in its dependency array. Missing deps cause stale closure bugs and lint errors.
- **Never call impure functions during render.** Functions like `Date.now()`, `Math.random()`, or `new Date()` must not be called directly in the render body or inside `useMemo`/`useCallback`. Capture them in a `useState` lazy initializer (`useState(() => Date.now())`) so they run once on mount, then reference the state value in hooks.
