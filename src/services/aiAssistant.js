const CV_KEYWORDS = /\b(cv|resume|skill|skills|project|projects|experience|job|jobs|ats|score|scores|improve|improvement|improvements|education|degree|institution|college|university|school|work|internship|internships|achievement|achievements|certification|certifications|format|bullet|bullets|interview|career|summary|profile|gap|gaps|strength|strengths|weakness|weaknesses|depth|technical|hire|apply|role|portfolio|excel|python|pandas|vba|sql|javascript|react|node|analysis|dashboard|visualiz|tech|technology|metric|metrics|outcome|outcomes|better|fix|enhance|boost)\b|job match|ats match|role match/i

export function answerAssistant(question, analysis, match) {
  if (!question || !question.trim()) return ''
  const prompt = question.toLowerCase().trim()

  // Guardrail: Off-topic detection
  if (!CV_KEYWORDS.test(prompt)) {
    return 'Note: Ask me a topic related to CV, resume skills, projects, work experience, or job matching.'
  }

  if (!analysis) {
    return 'Please upload or choose a demo CV first so I can answer questions grounded in your document.'
  }

  const { profile, projects, dimensions, strongest, limited } = analysis

  // How to improve CV
  if (/improve|better|enhance|fix|boost|upgrade|increase|suggestion|recommendation|advice|what to do|next step|guidance/i.test(prompt)) {
    const list = []
    if (limited.length) {
      list.push(`• **Strengthen Unsupported Skills**: Add project or experience entries for ${limited.slice(0, 3).map((s) => s.name).join(', ')} so they aren't just listed as standalone keywords.`)
    }
    if (!projects.length || projects.every((p) => p.demonstrated[0] === 'Project description not found')) {
      list.push('• **Add Project Action Verbs & Metrics**: Describe what you built using strong action verbs (e.g. *Designed*, *Built*, *Automated*) and include measurable outcomes (e.g., *reduced manual effort by 25%*).')
    } else {
      list.push('• **Quantify Project Impact**: Include specific tools, metrics, and percentages in your project descriptions to boost technical evidence.')
    }
    if (profile.experience === 'Not found in CV' && profile.internships === 'Not found in CV') {
      list.push('• **Include Experience or Internships**: Add work experience, internships, or practical lab roles to demonstrate real-world application.')
    }
    if (profile.achievements === 'Not found in CV') {
      list.push('• **Highlight Achievements**: Include awards, certifications, hackathons, or academic honors.')
    }
    return `Here is how you can improve your CV based on your current evidence map:\n\n${list.join('\n\n')}`
  }

  // Strongest skills / Strengths
  if (/strongest|best skill|top skill|strength|good at|proves|proven/i.test(prompt)) {
    if (!strongest.length) return 'No recognized skills were identified in this CV yet. Add technical skills like Python, Excel, SQL, or React to your CV.'
    const names = strongest.slice(0, 4).map((s) => s.name).join(', ')
    const details = strongest.slice(0, 3).map((s) => `${s.name} (${s.evidence})`).join('; ')
    return `Your strongest evidenced skills are **${names}**.\n\nEvidence found: ${details}.`
  }

  // Weak / Limited / Unsupported skills
  if (/weak|limited|unsupported|not supported|gap|missing skill|only listed|list only/i.test(prompt)) {
    if (!limited.length) return 'Great job! None of the skills in your CV are limited to list-only mentions without supporting evidence.'
    const names = limited.slice(0, 5).map((s) => s.name).join(', ')
    return `The skills needing stronger evidence in your CV are **${names}**.\n\nThese skills are listed, but the CV does not yet connect them to a project description or work experience entry.`
  }

  // Projects / Portfolio / Technical depth
  if (/project|portfolio|technical depth|built|designed|eda|dashboard/i.test(prompt)) {
    if (!projects.length) return 'Your CV currently contains limited or no project evidence. Adding 2-3 detailed technical projects will significantly boost your score.'
    const topProj = [...projects].sort((a, b) => b.technologies.length - a.technologies.length)[0]
    return `Your CV contains **${projects.length} project(s)**.\n\nTop project: **${topProj.name}**\nTechnologies detected: ${topProj.technologies.length ? topProj.technologies.join(', ') : 'None explicitly detected'}.\nStatus: ${topProj.evidence}.`
  }

  // ATS Match / Job Description
  if (/match|ats|job|requirement|fit|apply|score/i.test(prompt)) {
    if (!match) return `Please upload a Job Description to calculate ATS Match. Currently, your Skill Evidence score is ${dimensions.skillEvidence}/100 and Project Evidence is ${dimensions.projectEvidence}/100.`
    return `Your estimated Match Analysis for the target role is **${match.overall}/100**.\n\n• Strong matches: ${match.strongMatches.map((m) => m.name).join(', ') || 'None'}\n• Missing requirements: ${match.missingMatches.map((m) => m.name).join(', ') || 'None'}`
  }

  // Profile / Education / Experience
  if (/education|degree|institution|college|university|experience|internship|achievement|certification/i.test(prompt)) {
    const info = []
    if (profile.name !== 'Not found in CV') info.push(`Name: ${profile.name}`)
    if (profile.degree !== 'Not found in CV') info.push(`Degree: ${profile.degree}`)
    if (profile.institution !== 'Not found in CV') info.push(`Institution: ${profile.institution}`)
    if (profile.graduationYear !== 'Not found in CV') info.push(`Graduation: ${profile.graduationYear}`)
    if (profile.experience !== 'Not found in CV') info.push(`Experience: ${profile.experience}`)
    return info.length ? info.join(' | ') : 'No detailed profile info found in this CV.'
  }

  // Default grounded response
  return `I have analyzed your CV (${profile.name === 'Not found in CV' ? 'Uploaded CV' : profile.name}). Your Skill Evidence is **${dimensions.skillEvidence}/100** and Technical Depth is **${dimensions.technicalDepth}/100**.\n\nYou can ask me:\n- "How can I improve my CV?"\n- "What are my strongest skills?"\n- "Which skills need more project evidence?"\n- "Tell me about my projects"`
}
