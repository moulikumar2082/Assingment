import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString()

const SECTION_MAPPINGS = [
  { key: 'education', keywords: ['education', 'educational', 'academic background', 'academics', 'academic profile', 'qualifications', 'educational qualifications', 'education and training', 'academic qualifications'] },
  { key: 'experience', keywords: ['experience', 'work experience', 'employment history', 'work history', 'professional experience', 'employment', 'work experience'] },
  { key: 'internships', keywords: ['internships', 'internship', 'internship experience'] },
  { key: 'skills', keywords: ['skills', 'technical skills', 'soft skills', 'competencies', 'technologies', 'tools', 'core competencies', 'technical proficiencies', 'skills & tools'] },
  { key: 'projects', keywords: ['projects', 'personal projects', 'academic projects', 'key projects', 'featured projects', 'projects & work'] },
  { key: 'certifications', keywords: ['certifications', 'certificates', 'licenses', 'certifications and licenses', 'licenses & certifications'] },
  { key: 'achievements', keywords: ['achievements', 'awards', 'honors', 'honors and awards', 'achievements & awards'] },
  { key: 'coursework', keywords: ['coursework', 'relevant coursework', 'courses'] },
  { key: 'summary', keywords: ['summary', 'profile', 'professional summary', 'executive summary', 'about me', 'career summary'] }
]

async function readPdf(file) {
  const buffer = await file.arrayBuffer()
  let lastError
  for (const disableWorker of [false, true]) {
    try {
      const pdf = await pdfjsLib.getDocument({ data: buffer.slice(0), disableWorker }).promise
      const pages = await Promise.all(Array.from({ length: pdf.numPages }, async (_, index) => {
        const page = await pdf.getPage(index + 1)
        const content = await page.getTextContent()
        const lines = []
        content.items.forEach((item) => {
          const text = item.str?.trim()
          if (!text) return
          const y = item.transform?.[5] ?? 0
          const line = lines.find((candidate) => Math.abs(candidate.y - y) < 4)
          if (line) line.items.push({ x: item.transform?.[4] ?? 0, text })
          else lines.push({ y, items: [{ x: item.transform?.[4] ?? 0, text }] })
        })
        return lines.sort((a, b) => b.y - a.y).map((line) => line.items.sort((a, b) => a.x - b.x).map((item) => item.text).join(' ')).join('\n')
      }))
      const text = pages.join('\n').trim()
      if (text) return text
      throw new Error('PDF_NO_TEXT')
    } catch (error) { lastError = error }
  }
  throw lastError
}

async function readDocx(file) {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return result.value
}

export async function extractResumeText(file) {
  const name = file.name.toLowerCase()
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return readPdf(file)
  if (file.type.includes('wordprocessingml') || name.endsWith('.docx')) return readDocx(file)
  return file.text()
}

function normalizeHeading(line) {
  return line.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function splitSections(text) {
  const sections = { general: [] }
  let current = 'general'
  text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).forEach((line) => {
    const heading = normalizeHeading(line)
    let matchedKey = null
    for (const mapping of SECTION_MAPPINGS) {
      if (mapping.keywords.some((kw) => heading === kw || heading.startsWith(`${kw} `) || heading.endsWith(` ${kw}`))) {
        matchedKey = mapping.key
        break
      }
    }
    if (matchedKey) {
      current = matchedKey
      sections[current] ||= []
    } else {
      sections[current].push(line)
    }
  })
  return Object.fromEntries(Object.entries(sections).map(([key, lines]) => [key, lines.join('\n')]))
}

export function firstMatch(text, patterns) {
  if (!text) return 'Not found in CV'
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1].trim()
  }
  return 'Not found in CV'
}

function cleanInstitution(name) {
  if (!name) return 'Not found in CV'
  let clean = name.trim()
    .replace(/^(?:\b(?:at|from|in|studied at|enrolled at|degree from)\b|[\s,:|\-–])+/i, '')
    .replace(/(?:,\s*|\s+|-|\()?\b(?:19|20)\d{2}\b(?:\s*[-–]\s*(?:(?:19|20)\d{2}|present|current))?\)?.*$/i, '')
    .replace(/(?:,\s*|\s+)?\b(?:gpa|cgpa|grade|score|percentage|marks|class|pass|passed)\b.*$/i, '')
    .replace(/[:|\-,;]\s*$/, '')
    .trim()
  if (clean.length < 3 || /^(education|university|college|institute|school)$/i.test(clean)) {
    return 'Not found in CV'
  }
  return clean
}

function extractInstitution(educationText, fullText) {
  const textSources = [educationText, fullText].filter(Boolean)

  const explicitLabelRegex = /^(?:institution|university|college|school|institute|academy|varsity|college\/university)\s*[:|-]\s*(.+)$/im
  for (const source of textSources) {
    const match = source.match(explicitLabelRegex)
    if (match?.[1]) {
      const cleaned = cleanInstitution(match[1])
      if (cleaned !== 'Not found in CV') return cleaned
    }
  }

  const keywordRegexes = [
    /(?:^|\b(?:at|from|in|studied at|enrolled at)\b|[\n\r|,–-])\s*([A-Z0-9][A-Za-z0-9&.' -]*(?:University|College|Institute|School|Academy|Polytechnic|Faculty|Campus|Centre|Center)(?:\s+of\s+[A-Z0-9][A-Za-z0-9&.' -]+)?)/i,
    /\b((?:University|Institute|College|School|Academy|Polytechnic)\s+of\s+[A-Z0-9][A-Za-z0-9&.' -]+)/i,
    /\b((?:National|Indian|State|International|Royal)\s+(?:Institute|University|College|School)(?:\s+of\s+[A-Z0-9][A-Za-z0-9&.' -]+)?)/i,
    /\b([A-Z0-9][A-Za-z0-9&.' -]*\b(?:University|College|Institute|School|Academy|Polytechnic|Campus|Faculty|Centre|Center)\b)/i,
    /\b((?:IIT|NIT|IIIT|BITS|VIT|SRM|LPU|MIT|CMU|HARVARD|STANFORD|OXFORD|CAMBRIDGE|UCLA|UCB|NYU|ETH|NUS|NTU)(?:\s+[A-Za-z0-9&.' -]+)?)/i,
  ]

  for (const source of textSources) {
    for (const regex of keywordRegexes) {
      const match = source.match(regex)
      if (match?.[1]) {
        const cleaned = cleanInstitution(match[1])
        if (cleaned !== 'Not found in CV') return cleaned
      }
    }

    const lines = source.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    for (const line of lines) {
      const parts = line.split(/[,|–-]/).map((p) => p.trim())
      if (parts.length >= 2) {
        for (const part of parts) {
          if (/\b(?:University|College|Institute|School|Academy|Polytechnic|IIT|NIT|BITS|VIT|SRM)\b/i.test(part)) {
            const cleaned = cleanInstitution(part)
            if (cleaned !== 'Not found in CV') return cleaned
          }
        }
      }
    }
  }

  return 'Not found in CV'
}

function cleanDegree(degree) {
  if (!degree) return 'Not found in CV'
  let clean = degree.trim()
    .replace(/(?:,\s*|\s+|-|\()?\b(?:19|20)\d{2}\b.*$/i, '')
    .replace(/^[:|-]\s*/, '')
    .trim()
  return clean.length >= 2 ? clean : 'Not found in CV'
}

function extractDegree(educationText, fullText) {
  const textSources = [educationText, fullText].filter(Boolean)

  const explicitRegex = /^(?:degree|qualification|program|course)\s*[:|-]\s*(.+)$/im
  for (const source of textSources) {
    const match = source.match(explicitRegex)
    if (match?.[1]) {
      const cleaned = cleanDegree(match[1])
      if (cleaned !== 'Not found in CV') return cleaned
    }
  }

  const degreePatterns = [
    /(b\.?tech[^\n,;|]*|bachelor[^\n,;|]*|master[^\n,;|]*|m\.?tech[^\n,;|]*|bsc[^\n,;|]*|msc[^\n,;|]*|bca[^\n,;|]*|mca[^\n,;|]*|phd[^\n,;|]*|b\.?e\.?[^\n,;|]*|m\.?e\.?[^\n,;|]*|b\.?s\.?[^\n,;|]*|m\.?s\.?[^\n,;|]*|b\.?a\.?[^\n,;|]*|m\.?a\.?[^\n,;|]*|mba[^\n,;|]*|bba[^\n,;|]*|diploma[^\n,;|]*)/i,
  ]

  for (const source of textSources) {
    for (const pattern of degreePatterns) {
      const match = source.match(pattern)
      if (match?.[1]) {
        const cleaned = cleanDegree(match[1])
        if (cleaned !== 'Not found in CV') return cleaned
      }
    }
  }

  return 'Not found in CV'
}

function extractGraduationYear(educationText, fullText) {
  const textSources = [educationText, fullText].filter(Boolean)
  const currentYear = new Date().getFullYear()

  const isSchoolLine = (line) => /\b(10th|12th|ssc|hsc|intermediate|class\s*x|class\s*xii|high\s*school|secondary|senior\s*secondary|cbse|icse)\b/i.test(line)

  for (const source of textSources) {
    // Clean text by removing 10th/12th/school lines to prevent school years (like 2021) from interfering
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
      
      const allYears = (cleanSection.match(/\b(20\d{2})\b/g) || []).map((y) => parseInt(y, 10))
      const futureYears = allYears.filter((y) => y >= currentYear)
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
    const degreeYears = (cleanSection.match(/\b(19|20)\d{2}\b/g) || []).map((y) => parseInt(y, 10))
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

function extractName(text) {
  const explicitMatch = text.match(/^(?:name|full name)\s*[:|-]\s*(.+)$/im)
  if (explicitMatch?.[1]) {
    const name = explicitMatch[1].trim()
    if (name) return name
  }

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  for (const line of lines.slice(0, 6)) {
    if (/^(resume|curriculum vitae|cv|biodata|profile|page \d+)$/i.test(line)) continue
    if (/@/.test(line) || /^\+?\d[\d\s-]{7,}/.test(line)) continue
    if (/^(education|experience|skills|projects|summary)/i.test(line)) continue
    if (line.length > 50) continue
    return line
  }

  return 'Not found in CV'
}

export function parseProfile(text, sections) {
  const eduText = sections.education || ''
  return {
    name: extractName(text),
    degree: extractDegree(eduText, text),
    institution: extractInstitution(eduText, text),
    graduationYear: extractGraduationYear(eduText, text),
    experience: sections.experience || sections['work experience'] || 'Not found in CV',
    internships: sections.internships || 'Not found in CV',
    certifications: sections.certifications || 'Not found in CV',
    achievements: sections.achievements || 'Not found in CV',
    coursework: sections.coursework || 'Not found in CV',
  }
}

