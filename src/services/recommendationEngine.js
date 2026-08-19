export function buildRecommendations({ profile, skills, projects }) {
  const improvements = []
  const limited = skills.filter((skill) => skill.listed && skill.projectCount === 0 && !skill.experienceEvidence)
  if (!projects.length) improvements.push('Your CV currently contains limited project evidence.')
  if (limited.length >= 2) improvements.push('Several listed skills have limited supporting project or experience evidence.')
  if (projects.length && projects.every((project) => project.demonstrated[0] === 'No detailed project evidence found')) improvements.push('Strengthen project descriptions with your role, technologies, and outcome.')
  if (profile.achievements === 'Not found in CV') improvements.push('Achievements are not found in your CV; add measurable outcomes if you have them.')
  if (profile.experience === 'Not found in CV' && profile.internships === 'Not found in CV') improvements.push('Experience and internships are not found in your CV.')
  if (!improvements.length) improvements.push('Your CV has evidence across skills and projects. Keep linking technologies to concrete outcomes.')
  const dimensions = {
    skillEvidence: skills.length ? Math.min(100, Math.round(skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length)) : 0,
    projectEvidence: projects.length ? Math.min(100, 35 + projects.reduce((sum, project) => sum + project.technologies.length * 8 + project.demonstrated.length * 6, 0)) : 0,
    experienceEvidence: profile.experience !== 'Not found in CV' || profile.internships !== 'Not found in CV' ? 75 : 0,
    technicalDepth: skills.length ? Math.min(100, skills.filter((skill) => skill.projectCount > 0 || skill.experienceEvidence).length * 18) : 0,
    achievementEvidence: profile.achievements !== 'Not found in CV' ? 80 : 0,
    cvCompleteness: Math.round(Object.values(profile).filter((value) => value !== 'Not found in CV').length / Object.keys(profile).length * 100),
  }
  const strongest = [...skills].sort((a, b) => b.score - a.score).slice(0, 6)
  return { improvements, limited, strongest, dimensions, overview: strongest.length ? `Your CV provides evidence for ${strongest.slice(0, 3).map((skill) => skill.name).join(', ')}, with project and experience depth shown where available.` : 'Your CV does not contain enough recognized skill evidence yet. Review the extracted sections and add concrete evidence where appropriate.' }
}
