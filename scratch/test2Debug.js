function extractGraduationYearImproved(educationText, fullText) {
  const textSources = [educationText, fullText].filter(Boolean)
  const currentYear = new Date().getFullYear()

  const isSchoolLine = (line) => /\b(10th|12th|ssc|hsc|intermediate|class\s*x|class\s*xii|high\s*school|secondary|senior\s*secondary|cbse|icse)\b/i.test(line)

  for (const source of textSources) {
    const cleanedLines = source
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !isSchoolLine(l))
    
    const cleanSection = cleanedLines.join('\n')

    // 1. Check for explicit range: e.g. "2023 - 2027", "2023 – 2027", "2023 to 2027", "2023-2027"
    const explicitRangeMatch = cleanSection.match(/\b(20\d{2})\s*(?:[-–to/]+|\bto\b)\s*(20\d{2})\b/i)
    if (explicitRangeMatch) {
      const startYr = explicitRangeMatch[1]
      const endYr = explicitRangeMatch[2]
      const endNum = parseInt(endYr, 10)
      if (endNum >= currentYear) {
        return `${startYr} – ${endYr} (Pursuing)`
      }
      return `${startYr} – ${endYr}`
    }

    // 2. Check for "2023 - Present" or "2023 - Current"
    const presentRangeMatch = cleanSection.match(/\b(20\d{2})\s*(?:[-–to/]+|\bto\b)\s*(?:present|current|ongoing)\b/i)
    const expectedMatch = cleanSection.match(/(?:expected|graduat(?:ing|ion)?|passing|completion|est\.?)[^0-9\r\n]{0,40}\b(20\d{2})\b/i)

    if (presentRangeMatch) {
      const startYr = presentRangeMatch[1]
      if (expectedMatch?.[1]) {
        const endYr = expectedMatch[1]
        const endNum = parseInt(endYr, 10)
        if (endNum >= currentYear) {
          return `${startYr} – ${endYr} (Pursuing)`
        }
        return `${startYr} – ${endYr}`
      }
      
      const allYears = (cleanSection.match(/\b(20\d{2})\b/g) || []).map(y => parseInt(y, 10))
      const futureYears = allYears.filter(y => y >= currentYear)
      if (futureYears.length > 0) {
        const expectedYr = Math.max(...futureYears)
        return `${startYr} – ${expectedYr} (Pursuing)`
      }

      return `${startYr} – Present`
    }

    // 3. Single expected/graduation year: e.g. "Graduation: 2027" or "Expected 2027"
    if (expectedMatch?.[1]) {
      const yrNum = parseInt(expectedMatch[1], 10)
      return yrNum >= currentYear ? `${expectedMatch[1]} (Expected)` : expectedMatch[1]
    }

    // 4. Any single year in higher education (excluding school years)
    const degreeYears = (cleanSection.match(/\b(19|20)\d{2}\b/g) || []).map(y => parseInt(y, 10))
    if (degreeYears.length > 0) {
      const maxYear = Math.max(...degreeYears)
      return maxYear >= currentYear ? `${maxYear} (Expected)` : `${maxYear}`
    }
  }

  // Fallback: Overall text max year
  const fullYears = (fullText || '').match(/\b(19|20)\d{2}\b/g)
  if (fullYears && fullYears.length) {
    const sorted = fullYears.map((y) => parseInt(y, 10)).sort((a, b) => b - a)
    const topYear = sorted[0]
    return topYear >= currentYear ? `${topYear} (Expected)` : `${topYear}`
  }

  return 'Not found in CV'
}

const test6 = `
EDUCATION
B.Tech in Mechanical Engineering (2018 - 2022)
High School 2016
`

const test7 = `
EDUCATION
Bachelor of Science
Graduation Year: 2020
Class 12th: 2017
`

console.log('Test 6:', extractGraduationYearImproved(test6, test6))
console.log('Test 7:', extractGraduationYearImproved(test7, test7))
