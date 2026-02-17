# FitMyCV

## Project Overview

FitMyCV lets users upload a reference CV, paste a job listing URL, and receive a tailored CV and cover letter optimized for that specific role. The app scrapes job requirements, matches them against the user's experience, and generates customized application documents.

## Tech Stack

- **Framework:** Next.js 16, React 19, Tailwind CSS v4
- **Auth:** NextAuth (Google OAuth)
- **DB/ORM:** mongoose/MongoDB
- **APIs:** Exa.ai (job page scraping), OpenAI (CV tailoring + cover letter), Groq (PDF text extraction)
- **PDF:** unpdf (extract text), TBD (generate downloadable PDFs)
- **Icons:** use @phosphor-icons/react for my app icons

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
