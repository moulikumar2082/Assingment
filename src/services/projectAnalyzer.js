const TECH_NAMES = [
  'Python', 'Excel', 'VBA', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Power BI', 'Tableau', 'SQL',
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Machine Learning', 'Scikit-learn', 'TensorFlow',
  'PyTorch', 'Keras', 'EDA', 'Exploratory Data Analysis', 'Pivot Tables', 'Linux', 'Networking', 'Wireshark',
  'Burp Suite', 'SIEM', 'Docker', 'AWS', 'Git', 'GitHub', 'Figma', 'MySQL', 'PostgreSQL', 'MongoDB'
]

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const hasTerm = (text, term) => new RegExp(`(?<![a-z0-9])${escapeRegex(term)}(?![a-z0-9])`, 'i').test(text)

const ACTION_START = /^(built|developed|created|designed|implemented|trained|deployed|performed|analyzed|analysed|automated|secured|led|used|worked|conducted|delivered|worked on|utilized|utilised|derived|cleaned|preprocessed|extracted|engineered|leveraged|evaluated|processed|handled|visualized|visualised)\b/i

const looksLikeTitle = (line, hasCurrentProject) => {
  const clean = line.replace(/^[-•*]\s*/, '').trim()
  if (!clean) return false
  if (/^(tech|technologies|tools|stack|environment)\s*[:|-]/i.test(clean)) return false
  if (!hasCurrentProject) return !ACTION_START.test(clean)
  if (clean.length > 80) return false
  if (/^[-•*]/.test(line)) return false
  if (ACTION_START.test(clean)) return false
  if (/[.!?:;]$/.test(clean)) return false
  if (/\b(using|with|for|to|and|from|that|which)\b/i.test(clean) && !/\|/.test(clean)) return false
  return clean.split(/\s+/).length <= 12
}

export function detectProjects(sections, rawText = '') {
  let source = sections.projects || ''
  if (!source || source === 'Not found in CV' || source.trim().length < 10) {
    const projectSectionMatch = (rawText || '').match(/(?:projects?|academic projects?|personal projects?|key projects?|featured projects?|project details|project work|featured work)\s*[:|-]?\s*\n([\s\S]+?)(?=\n\s*(?:skills?|technical skills|experience|work experience|education|certifications?|achievements?|coursework|summary)|$)/i)
    if (projectSectionMatch?.[1] && projectSectionMatch[1].trim().length >= 10) {
      source = projectSectionMatch[1].trim()
    } else {
      source = rawText || ''
    }
  }
  if (!source.trim()) return []
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const projects = []
  let current = null
  lines.forEach((line) => {
    if (looksLikeTitle(line, Boolean(current))) {
      current = { name: line.replace(/^[-•*]\s*/, '').trim(), lines: [] }
      projects.push(current)
    } else if (current) {
      current.lines.push(line.replace(/^[-•*]\s*/, '').trim())
    } else if (ACTION_START.test(line) || /^tech\s*:/i.test(line) || /\|/.test(line)) {
      current = { name: 'Highlighted Project Work', lines: [line.replace(/^[-•*]\s*/, '').trim()] }
      projects.push(current)
    }
  })
  if (!projects.length && lines.length) {
    projects.push({ name: 'Projects & Work', lines: lines })
  }
  return projects.map((project) => {
    const raw = [project.name, ...project.lines].join(' ')
    const technologies = TECH_NAMES.filter((tech) => hasTerm(raw, tech))
    const demonstrated = project.lines.filter((line) => ACTION_START.test(line)).slice(0, 3)
    const demonstratedSkills = [
      [/preprocess|prepare|clean|missing values/i, 'Data preprocessing'],
      [/classif|churn|prediction model/i, 'Classification'],
      [/machine learning|trained/i, 'Machine learning'],
      [/dashboard|visualiz|trend|charts|plots|heatmap|distributions/i, 'Data visualization'],
      [/exploratory data analysis|\beda\b|market analysis|insights/i, 'Exploratory Data Analysis'],
      [/vba|automating|automate/i, 'Workflow Automation'],
      [/responsive|component|frontend|interface/i, 'Frontend development'],
      [/penetration|vulnerability|security assessment/i, 'Security testing'],
      [/monitor|traffic/i, 'Network monitoring'],
      [/api|integration/i, 'Integration'],
      [/deployed|deployment/i, 'Deployment'],
    ].filter(([pattern]) => pattern.test(raw)).map(([, skill]) => skill)
    const complexity = [/api|authentication|deployment|cloud|database|model|classification|integration|real-time|optimization|eda|vba|visualization/i, ACTION_START].filter((pattern) => pattern.test(raw)).length
    const evidence = demonstrated.length ? 'Strong project evidence' : project.lines.length ? 'Partial project evidence' : 'Project description not found'
    return { name: project.name, technologies, demonstratedSkills, demonstrated: demonstrated.length ? demonstrated : ['Project description not found'], complexity: complexity >= 2 ? 'Several complexity signals' : complexity === 1 ? 'Some complexity signals' : 'Limited complexity signals', evidence, raw }
  })
}

