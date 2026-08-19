const jobs = {
  'Data Analyst role': `DATA ANALYST\n\nRequired skills: Python, SQL, Pandas, Power BI\nPreferred: Machine Learning, Docker\n\nResponsibilities\n- Build analytical reports and dashboards\n- Prepare data and communicate insights\n\nEducation: Bachelor's degree in a technical or quantitative field`,
  'Cyber Security Analyst role': `CYBER SECURITY ANALYST\n\nRequired skills: Linux, Networking, Wireshark, SIEM\nPreferred: Burp Suite, Python, Docker\n\nResponsibilities\n- Monitor security alerts and investigate incidents\n- Document vulnerability findings\n\nEducation: Bachelor's degree in Cyber Security or a related field`,
  'Frontend Developer role': `FRONTEND DEVELOPER\n\nRequired skills: React, JavaScript, TypeScript, HTML, CSS\nPreferred: Next.js, Figma, Docker\n\nResponsibilities\n- Build responsive user interfaces\n- Collaborate with designers and maintain reusable components\n\nEducation: Degree in Software Engineering, Computer Science, or related field`,
}

export const demoJobs = Object.keys(jobs)

export function getDemoJob(name) {
  return jobs[name]
}
