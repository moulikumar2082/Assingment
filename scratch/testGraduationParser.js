import { splitSections, parseProfile } from '../src/services/resumeParser.js'

const sampleCV1 = `
Vara Lakshmi
Email: vara@example.com

EDUCATION
B.Tech in Data Science & AI
ABC Institute of Technology
2023 - 2027 (Pursuing)

Class 12th (Intermediate)
State Board School
Year of Passing: 2021
`

const sampleCV2 = `
John Doe
EDUCATION
Bachelor of Technology in CSE | 2023 - Present
Expected Graduation: 2027
ABC University

Senior Secondary (12th Grade) - 2021
`

const sampleCV3 = `
Jane Smith
ACADEMIC QUALIFICATIONS
Degree: B.Tech in Electronics (2023 - 2027)
12th Standard: 2021
10th Standard: 2019
`

console.log('CV 1:', parseProfile(sampleCV1, splitSections(sampleCV1)))
console.log('CV 2:', parseProfile(sampleCV2, splitSections(sampleCV2)))
console.log('CV 3:', parseProfile(sampleCV3, splitSections(sampleCV3)))
