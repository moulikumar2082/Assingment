# CareerLens AI: Interview Explanation

## What is CareerLens AI?
CareerLens AI is an invented career intelligence product. It helps someone understand the skills in their resume, discover suitable career paths, identify gaps, and choose a practical next step.

## Why the Career Map?
A normal dashboard can show numbers, but a map explains relationships. The homepage connects a profile to skill signals, then to roles, then to the next skill that could open another path. That is the central product idea and the reason the hero visual is not a generic screenshot.

## Component structure
`App.jsx` composes `Navbar`, `Hero`, `ProfileJourney`, `CareerMatches`, `HowItWorks`, `AIInsight`, `CTA`, and `Footer`. `CareerMap` owns the map selection state. `ResumeUpload` and `SignIn` are lightweight demo interactions that remain separate from the homepage sections.

## How the Career Map works
The map uses an SVG layer for three relationships between the profile and possible roles. The active line changes when a user selects Data Analyst, Business Analyst, or Data Scientist. The selected role updates its match score, strong skills, gap, and recommendation. CSS draws the active line with a short stroke animation.

## How resume percentages work
The upload flow reads PDF text with `pdfjs-dist` and DOCX text with `mammoth`, entirely in the browser. A small understandable scoring function checks for known skill signals and calculates a role score from the matching skills. The result is passed from `App` into the map, match panel, and AI insight. It is a transparent demo model, not a claim of production AI accuracy.

## How the career match works
The Career Match section uses the same role model with three selectable options. Selecting a role changes the detail panel without a backend. All values are labeled demo content for the assessment.

## Responsive design
The page uses a max-width grid on desktop and intentional single-column layouts below 900px. At 390px the map remains legible, the role cards stack, the navigation becomes a menu, and the SVG stays inside its container. At 1440px the hero uses the available width for the map without stretching the content beyond a readable measure.

## Why this visual language?
The paper background and fine lines echo a planning surface. Dark ink creates seriousness, blue marks active paths, and coral identifies signals or alternate directions. Manrope keeps product text readable while Playfair Display gives the narrative headings a distinct editorial voice.

## Trade-offs
The project demonstrates the product experience rather than implementing resume parsing, accounts, or a recommendation service. With more time I would connect the map to an API, add saved profiles and a real upload pipeline, and test visual regressions across browsers.

## AI usage
AI helped with scaffolding, component drafts, CSS exploration, and documentation. The concept, scope, demo-data labeling, responsive decisions, interaction behavior, and final validation were reviewed and adjusted for the assessment.

## Likely questions

**Why not use a standard dashboard?**  
The Career Map communicates the product's unique value more clearly: it shows how skills connect to possibilities and next steps.

**How is the map interactive?**  
The role buttons update the active SVG path and the selected-path detail panel. The transition is supported by a short CSS path animation.

**How did you avoid fabricated content?**  
There are no testimonials, logos, customers, awards, or user counts. Numbers only appear inside product demonstrations and are labeled demo data.

**Why use SVG instead of a chart library?**  
The map only needs a few curved relationships. SVG keeps it lightweight, understandable, and responsive without adding a dependency.

**How would this become a real product?**  
Connect resume extraction and role data to an API, persist the user's profile, add privacy controls, and handle loading, errors, and model explanations.
