# CareerLens AI

CareerLens AI is a premium career-intelligence homepage for Acdyon Technologies Frontend Challenge Part 2. It reads a user's CV locally, connects claimed skills to project and experience evidence, and optionally compares that evidence with a supplied job description.

## Product Modes

- **Analyze My CV**: CV Readiness, skill evidence strength, project evidence, experience, education, certifications, CV gaps, and personalized improvements.
- **Match My CV to a Job**: an estimated CareerLens Match Analysis appears only after a job description is pasted or uploaded. It reports required, partial, strong, and missing evidence.
- **CareerLens AI**: a structured assistant service answers questions from the current CV analysis and optional job match. It is intentionally not presented as a live LLM or backend API.

## Evidence Rules

The uploaded CV is the source of truth. Scores describe CV evidence strength, not real-world proficiency. Missing information is rendered as `Not found in CV`. No job-board, LinkedIn, Google, GitHub, or external job-search data is used.

## Features

- Local text extraction from text-based PDF CVs with `pdfjs-dist`.
- Section parsing for education, experience, internships, skills, projects, certifications, achievements, and coursework.
- Skill-to-project and skill-to-experience evidence connections.
- Project technologies, demonstrated skills, source evidence, and project strength.
- Optional pasted or uploaded job-description parsing.
- Estimated ATS-style comparison grounded in the CV evidence object and supplied JD.
- Clearly labeled Data/Analytics, Cyber Security, Frontend, and demo job-description data.
- Responsive premium homepage with a CV-to-evidence workflow visualization and restrained product motion.
- No fabricated testimonials, user counts, company logos, awards, or customer claims.

## Tech Stack

React 19, Vite, JavaScript, CSS, `pdfjs-dist`, and `mammoth` (retained for parser compatibility, while the UI upload contract is PDF-only).

## Setup

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal. Do not open `index.html` directly with `file://`, because Vite module imports require an HTTP development server.

## Build and Lint

```bash
npm run build
npm run lint
```

## Demo Instructions

1. Open the Vite URL.
2. Choose **Analyze My CV**.
3. Select **Try Demo CV** and choose Data Science, Cyber Security, or Frontend. Each profile produces different skills, projects, evidence, and recommendations.
4. After analysis, paste a job description or choose a clearly labeled demo JD.
5. Ask CareerLens AI about strongest skills, weak evidence, projects, gaps, or match requirements.

## Deployment

Use the Vite preset on Vercel, Netlify, or another static host. Run `npm run build` and publish `dist/`. PDF extraction remains browser-local; no secret API key is required.

## Responsive Verification

The layout includes dedicated mobile rules for 390px and desktop constraints for 1440px. The upload modal, analysis columns, match metrics, demo controls, and assistant form stack at narrow widths to prevent horizontal scrolling.
# CareerLens AI

## Overview
CareerLens AI is an invented AI-powered career intelligence product. It turns the signals in a resume into a visual career map: profile, skills, possible roles, and the next skill worth building.

## Assessment
Acdyon Technologies Frontend Challenge - Part 2: The Premium Home Page.

## Features
- Career Map-led premium homepage
- Interactive career paths for Data Analyst, Business Analyst, and Data Scientist
- Selected-path match score, strong skills, gap, and recommended next step
- Profile to Skills to Possibilities to Next Step storytelling section
- Career match comparison interface
- AI recommendation interface with demonstration data
- Responsive mobile navigation and layouts for 390px and 1440px
- Resume upload and demo sign-in interactions
- Local PDF/DOCX resume text extraction with skill-based role scoring
- No fabricated testimonials, customer logos, user counts, awards, or partnerships

## Tech Stack
React, Vite, JavaScript, and CSS. The Career Map uses responsive SVG paths and CSS animation. `pdfjs-dist` and `mammoth` are used only to read uploaded PDF and DOCX text locally in the browser.

## Local Setup
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

## Deployment
Import this repository into Vercel, use the Vite preset, run `npm run build`, and publish the `dist` directory.

## Responsive Testing
The homepage is designed for 390px mobile, 1440px desktop, and intermediate widths. The map nodes, career options, text, and CTAs reflow without horizontal scrolling.

## Design Explanation
The design treats the Career Map as the product proof instead of making the page a generic SaaS feature grid. The visual language combines editorial display type, a restrained paper/ink palette, thin map lines, and product UI details so the experience feels like a considered career instrument rather than a marketing template.

## Resume Analysis
When a PDF or DOCX resume is uploaded, its text is extracted locally in the browser. CareerLens checks for skill signals such as Python, SQL, Power BI, Machine Learning, Statistics, and communication, then recalculates the visible role match percentages. This is a transparent demo scoring model, not a production AI model.

When no resume is uploaded, the interface uses clearly labeled demonstration data.
