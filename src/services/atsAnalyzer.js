const scoreFor = (skill) => Math.max(0, Math.min(100, skill?.score || 0))

export function analyzeJobMatch(analysis, job) {
  const cvSkills = new Map(analysis.skills.map((skill) => [skill.name, skill]))
  const required = job.required.length ? job.required : job.skills
  const preferred = job.preferred.filter((skill) => !required.includes(skill))
  const matchSkill = (name) => {
    const skill = cvSkills.get(name)
    if (!skill) return { name, status: 'missing', score: 0, evidence: 'Not found in CV' }
    if (scoreFor(skill) >= 70) return { name, status: 'strong', score: scoreFor(skill), evidence: skill.evidence }
    return { name, status: 'partial', score: scoreFor(skill), evidence: skill.evidence || 'Listed in CV - limited supporting evidence.' }
  }
  const requiredMatches = required.map(matchSkill)
  const preferredMatches = preferred.map(matchSkill)
  const strongMatches = [...requiredMatches, ...preferredMatches].filter((item) => item.status === 'strong')
  const partialMatches = [...requiredMatches, ...preferredMatches].filter((item) => item.status === 'partial')
  const missingMatches = [...requiredMatches, ...preferredMatches].filter((item) => item.status === 'missing')
  const requiredScore = requiredMatches.length ? Math.round(requiredMatches.reduce((sum, item) => sum + item.score, 0) / requiredMatches.length) : 0
  const technicalScore = job.skills.length ? Math.round(job.skills.map((skill) => matchSkill(skill).score).reduce((sum, score) => sum + score, 0) / job.skills.length) : 0
  const projectRelevant = required.filter((name) => analysis.skills.find((skill) => skill.name === name)?.projectCount > 0)
  const projectScore = required.length ? Math.round(projectRelevant.length / required.length * 100) : 0
  const experienceScore = required.length ? Math.round(required.filter((name) => analysis.skills.find((skill) => skill.name === name)?.experienceEvidence).length / required.length * 100) : 0
  const educationScore = job.education === 'Not found in job description' ? 0 : analysis.profile.degree === 'Not found in CV' ? 0 : 100
  const overall = Math.round(requiredScore * 0.35 + technicalScore * 0.25 + projectScore * 0.2 + experienceScore * 0.1 + educationScore * 0.1)
  const priorities = missingMatches.slice(0, 2).map((item) => `${item.name} is not found in your CV. Only add it if you genuinely have that experience.`)
  if (partialMatches.length) priorities.push(`Strengthen evidence for ${partialMatches.slice(0, 2).map((item) => item.name).join(' and ')} with relevant project or experience detail.`)
  return { overall, requiredScore, technicalScore, projectScore, experienceScore, educationScore, requiredMatches, preferredMatches, strongMatches, partialMatches, missingMatches, priorities, explanation: 'An estimated match based on the evidence in your CV and the provided job description. It is not an official company ATS result.' }
}
