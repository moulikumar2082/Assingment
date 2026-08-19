function extractGraduationYearImproved(educationText, fullText) {
  const textSources = [educationText, fullText].filter(Boolean)
  const currentYear = new Date().getFullYear()

  const isSchoolLine = (line) => /\b(10th|12th|ssc|hsc|intermediate|class\s*x|class\s*xii|high\s*school|secondary|senior\s*secondary|cbse|icse)\b/i.test(line)
  const isDegreeLine = (line) => /\b(b\.?tech|bachelor|b\.?e\.?|m\.?tech|master|m\.?s\.?|bsc|msc|bca|mca|mba|bba|phd|diploma|degree|university|college|institute|engineering|graduation)\b/i.test(line)

  // 1. Scan for ranges (e.g. 2023 - 2027, 2023–2027, 2023 to 2027, 2023-Present)
  for (const source of textSources) {
    const lines = source.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (isSchoolLine(line) && !isDegreeLine(line)) continue

      const contextBlock = [lines[i - 1] || '', line, lines[i + 1] || '', lines[i + 2] || ''].join(' ')

      const rangeMatch = contextBlock.match(/\b(20\d{2})\s*(?:[-–to/]+|\bto\b)\s*(20\d{2}|present|current|ongoing)\b/i)
      const expectedMatch = contextBlock.match(/(?:expected|graduat(?:ing|ion)?|passing|completion|est\.?)[^0-9\r\n]{0,30}\b(20\d{2})\b/i)

      if (rangeMatch) {
        const startYr = rangeMatch[1]
        let endYrStr = rangeMatch[2]

        if (/present|current|ongoing/i.test(endYrStr)) {
          if (expectedMatch?.[1]) {
            endYrStr = expectedMatch[1]
          }
        }

        if (/present|current|ongoing/i.test(endYrStr)) {
          return `${startYr} – Present`
        }

        const endYrNum = parseInt(endYrStr, 10)
        if (endYrNum >= currentYear) {
          return `${startYr} – ${endYrStr} (Pursuing)`
        }
        return `${startYr} – ${endYrStr}`
      }

      if (expectedMatch?.[1]) {
        const yrNum = parseInt(expectedMatch[1], 10)
        return yrNum >= currentYear ? `${expectedMatch[1]} (Expected)` : expectedMatch[1]
      }
    }
  }

  // 2. Scan degree lines for single years (e.g. B.Tech (2027), Passing Year: 2027)
  const degreeYears = []
  for (const source of textSources) {
    const lines = source.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    for (const line of lines) {
      if (isSchoolLine(line) && !isDegreeLine(line)) continue
      const matches = line.match(/\b(19|20)\d{2}\b/g)
      if (!matches) continue
      matches.forEach((y) => {
        const num = parseInt(y, 10)
        degreeYears.push(num)
      })
    }
  }

  if (degreeYears.length > 0) {
    const maxYear = Math.max(...degreeYears)
    if (maxYear >= currentYear) {
      return `${maxYear} (Expected)`
    }
    return `${maxYear}`
  }

  // 3. Fallback: Max year from overall text
  const fullYears = (fullText || '').match(/\b(19|20)\d{2}\b/g)
  if (fullYears && fullYears.length) {
    const sorted = fullYears.map((y) => parseInt(y, 10)).sort((a, b) => b - a)
    const topYear = sorted[0]
    if (topYear >= currentYear) {
      return `${topYear} (Expected)`
    }
    return `${topYear}`
  }

  return 'Not found in CV'
}

// Test cases
const test1 = `
Vara Lakshmi
EDUCATION
B.Tech in Data Science & AI
ABC Institute of Technology
2023 - 2027 (Pursuing)

Class 12th (Intermediate)
State Board School
Year of Passing: 2021
`

const test2 = `
John Doe
EDUCATION
Bachelor of Technology in CSE | 2023 - Present
Expected Graduation: 2027
ABC University

Senior Secondary (12th Grade) - 2021
`

const test3 = `
Rahul Kumar
EDUCATION
B.Tech Computer Science (2023 - 2027)
Inter 12th - 2021
SSC 10th - 2019
`

const test4 = `
Ananya Sharma
EDUCATIONAL QUALIFICATIONS
* B.E. Information Technology: 2023 - Present
* Higher Secondary (12th): 2021
`

const test5 = `
Lakshmi
EDUCATION
Graduation: B.Tech (2023 - 2027)
Inter: 2021
`

console.log('Test 1 Output:', extractGraduationYearImproved(test1, test1))
console.log('Test 2 Output:', extractGraduationYearImproved(test2, test2))
console.log('Test 3 Output:', extractGraduationYearImproved(test3, test3))
console.log('Test 4 Output:', extractGraduationYearImproved(test4, test4))
console.log('Test 5 Output:', extractGraduationYearImproved(test5, test5))
