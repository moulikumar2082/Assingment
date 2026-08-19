import { extractResumeText, parseProfile, splitSections } from '../services/resumeParser'
import { detectProjects } from '../services/projectAnalyzer'
import { detectSkills } from '../services/skillAnalyzer'
import { buildRecommendations } from '../services/recommendationEngine'

export async function analyzeResume(file, source = 'uploaded') {
  const rawText = await extractResumeText(file)
  if (!rawText.trim()) throw new Error('CV_EMPTY')
  const sections = splitSections(rawText)
  const projects = detectProjects(sections, rawText)
  const skills = detectSkills(rawText, sections, projects)
  const profile = parseProfile(rawText, sections)
  const recommendations = buildRecommendations({ profile, skills, projects, sections })
  return { fileName: file.name, source, rawText, sections, profile, skills, projects, ...recommendations }
}
