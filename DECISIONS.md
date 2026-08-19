# DECISIONS.md — CareerLens AI (Part 2: The Premium Home Page)

## 1. Why the Evidence-Map Approach Over a Conventional Dashboard
Traditional career platforms and basic ATS checkers present ungrounded skill percentages (e.g. "Python: 85%") without proving where that number comes from. This leads candidates to blindly optimize keywords without building real evidence.

CareerLens AI introduces an **Evidence-Map Architecture** (`SKILL → PROJECT → EVIDENCE STRENGTH → ROLE FIT`). Every skill claim must be anchored to concrete proof:
- A specific project repository or algorithm implementation
- An academic degree timeline (handling ongoing college degrees like `2023 – 2027 (Pursuing)`)
- Verified experience bullets or technical certifications

If no evidence exists in the CV text, CareerLens displays an honest empty state ("No projects detected in this CV") rather than inventing arbitrary scores.

## 2. Real Trade-off Made Under the Time Limit
* **Deterministic Local Parsing vs. Heavy Cloud LLM Latency**: To deliver instantaneous, privacy-first sub-second feedback without exposing user CV data to third-party endpoints or suffering cloud API rate limits, we built a robust local client-side evidence parser in Web API JavaScript.
* **What I'd do with a full week**:
  - Implement canvas-level PDF bounding box annotations to highlight exact source text snippets in the original CV document.
  - Build live webhook integration with public job board RSS feeds to dynamically recalculate role requirements.
  - Expand automated Playwright visual regression test coverage across all mobile (390px) and desktop (1440px) viewports.

## 3. AI Tools Usage & Personal Verification
* **Where AI tools were used**: AI tools were used to assist with CSS grid token architecture, initial component scaffolding, and regex pattern optimization for date range parsing.
* **What was personally verified and changed**:
  - **Graduation Date Logic**: Updated `extractGraduationYear` in `src/services/resumeParser.js` to explicitly filter out 10th/12th/SSC/Intermediate school lines so high school completion years never override ongoing college degree ranges (e.g. correctly outputting `2023 – 2027 (Pursuing)`).
  - **Honesty & Credibility Audit**: Removed all fabricated claims (e.g. "99% ATS Fit Accuracy", "100% Data Privacy", fake testimonials, fake company logos). Replaced them with honest product truths ("CV → EVIDENCE — Connect skills to actual projects", "Estimated Role Match").
  - **Easter Egg Refinement**: Removed the previous owner backdoor popup button and replaced it with a subtle, harmless **CareerLens Constellation Signal** star Easter Egg.
