import { extractResumeText } from './resumeParser'
import { getRecognizedSkillNames } from './skillAnalyzer'

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasTerm = (text, term) => new RegExp(`(?<![a-z0-9])${escapeRegex(term)}(?![a-z0-9])`, 'i').test(text)
const requirementWords = /required|must have|must be|you have|essential|minimum|experience with|proficient/i
const preferredWords = /preferred|nice to have|bonus|plus|ideally|desired/i

export function parseJobDescription(text) {
  const rawText = text.trim()
  const normalized = rawText.toLowerCase()
  const skills = getRecognizedSkillNames().filter((skill) => hasTerm(rawText, skill))
  const required = skills.filter((skill) => {
    const index = normalized.indexOf(skill.toLowerCase())
    return index >= 0 && requirementWords.test(normalized.slice(Math.max(0, index - 100), index + 100))
  })
  const preferred = skills.filter((skill) => !required.includes(skill) && (() => {
    const index = normalized.indexOf(skill.toLowerCase())
    return index >= 0 && preferredWords.test(normalized.slice(Math.max(0, index - 100), index + 100))
  })())
  const experience = rawText.match(/(?:at least|minimum of|over)\s+([0-9]+)\+?\s+years?/i)?.[0] || 'Not found in job description'
  const education = rawText.match(/(?:bachelor|master|degree|b\.?tech|bsc|msc|phd)[^.;\n]*/i)?.[0] || 'Not found in job description'
  const responsibilities = rawText.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^[-•*]/.test(line) || /responsibilit|you will|role involves/i.test(line)).slice(0, 8)
  return { rawText, skills, required, preferred, experience, education, responsibilities }
}

export async function extractJobDescription(file) {
  const text = await extractResumeText(file)
  if (!text.trim()) throw new Error('JD_EMPTY')
  return parseJobDescription(text)
}
