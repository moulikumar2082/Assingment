const CATALOG = [
  ['Python', ['python']],
  ['JavaScript', ['javascript', 'js']],
  ['TypeScript', ['typescript', 'ts']],
  ['React', ['react']],
  ['Next.js', ['next.js', 'nextjs']],
  ['HTML', ['html']],
  ['CSS', ['css']],
  ['SQL', ['sql', 'mysql', 'postgresql']],
  ['Pandas', ['pandas']],
  ['NumPy', ['numpy']],
  ['Excel', ['excel', 'ms excel', 'microsoft excel']],
  ['VBA', ['vba', 'visual basic']],
  ['Pivot Tables', ['pivot tables', 'pivot charts', 'slicers', 'timelines']],
  ['Matplotlib', ['matplotlib']],
  ['Seaborn', ['seaborn']],
  ['Plotly', ['plotly']],
  ['Exploratory Data Analysis', ['exploratory data analysis', 'eda', 'market analysis']],
  ['Data Analysis', ['data analysis', 'exploratory data analysis', 'eda', 'market analysis']],
  ['Power BI', ['power bi', 'powerbi']],
  ['Tableau', ['tableau']],
  ['Machine Learning', ['machine learning', 'ml', 'deep learning']],
  ['Scikit-learn', ['scikit-learn', 'sklearn']],
  ['TensorFlow', ['tensorflow']],
  ['PyTorch', ['pytorch']],
  ['Keras', ['keras']],
  ['Statistics', ['statistics', 'statistical']],
  ['Linux', ['linux']],
  ['Networking', ['networking', 'tcp/ip', 'dns']],
  ['Wireshark', ['wireshark']],
  ['Burp Suite', ['burp suite']],
  ['SIEM', ['siem']],
  ['SOC', ['soc analyst', 'security operations center']],
  ['Penetration Testing', ['penetration testing', 'pentesting']],
  ['Git', ['git', 'github']],
  ['Docker', ['docker']],
  ['AWS', ['aws', 'amazon web services']],
  ['Communication', ['communication']],
  ['Leadership', ['leadership']],
  ['Data Visualization', ['data visualization', 'tableau', 'matplotlib', 'seaborn', 'plotly', 'pivot charts', 'dashboards', 'dashboard']],
  ['Figma', ['figma']],
]

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasAlias = (text, alias) => new RegExp(`(?<![a-z0-9])${escapeRegex(alias)}(?![a-z0-9])`, 'i').test(text)
const occurrences = (text, aliases) => aliases.reduce((total, alias) => total + (text.match(new RegExp(`(?<![a-z0-9])${escapeRegex(alias)}(?![a-z0-9])`, 'gi')) || []).length, 0)
const supportsSkillInProject = (name, aliases, project) => aliases.some((alias) => hasAlias(project.raw, alias)) || (name === 'Machine Learning' && /prediction|classification|model|trained/i.test(project.raw)) || (name === 'Exploratory Data Analysis' && /eda|exploratory|market analysis|visualizations/i.test(project.raw)) || (name === 'Data Visualization' && /dashboard|visualiz|charts|plots|heatmap|slicers/i.test(project.raw))

export function getRecognizedSkillNames() {
  return CATALOG.map(([name]) => name)
}

export function detectSkills(text, sections, projects) {
  const normalized = text.toLowerCase()
  return CATALOG.filter(([, aliases]) => aliases.some((alias) => hasAlias(normalized, alias))).map(([name, aliases]) => {
    const listed = [sections.skills, sections['technical skills'], sections['soft skills']].filter(Boolean).some((section) => aliases.some((alias) => hasAlias(section, alias)))
    const supportingProjects = projects.filter((project) => supportsSkillInProject(name, aliases, project)).map((project) => project.name)
    const projectCount = supportingProjects.length
    const experienceEvidence = [sections.experience, sections.internships].filter(Boolean).some((section) => aliases.some((alias) => hasAlias(section, alias)))
    const certificationEvidence = sections.certifications !== 'Not found in CV' && aliases.some((alias) => hasAlias(sections.certifications, alias))
    const score = Math.min(100, (listed ? 20 : 0) + Math.min(projectCount, 2) * 17 + (projectCount > 2 ? 15 : 0) + (projectCount ? 15 : 0) + (experienceEvidence ? 20 : 0) + (certificationEvidence ? 10 : 0))
    const evidence = []
    if (listed) evidence.push('Listed in CV')
    if (projectCount) evidence.push(`Used in ${projectCount} project${projectCount > 1 ? 's' : ''}`)
    if (experienceEvidence) evidence.push('Mentioned in experience')
    if (certificationEvidence) evidence.push('Supported by certification')
    return { name, score: score || Math.min(100, occurrences(normalized, aliases) * 10), listed, projectCount, supportingProjects, experienceEvidence, certificationEvidence, evidence: evidence.join(', ') || 'Mentioned in CV text', level: score >= 70 ? 'Strong evidence' : score >= 40 ? 'Moderate evidence' : 'Limited evidence' }
  })
}
