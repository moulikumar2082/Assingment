import { useState } from 'react'
import './HomeLanding.css'

const demoRolesList = [
  'Data Analyst',
  'Data Scientist',
  'Business Analyst',
  'Frontend Developer',
  'Cyber Security Analyst'
]

// Target role requirement templates for calculating match post-upload or displaying role preview
const roleRequirementsMap = {
  'Data Analyst': {
    requiredSkills: ['Python', 'SQL', 'Power BI', 'Excel', 'Statistics'],
    idealProject: 'Data analytics & dashboard visualization'
  },
  'Data Scientist': {
    requiredSkills: ['Python', 'Scikit-Learn', 'Machine Learning', 'Pandas', 'Statistics'],
    idealProject: 'Predictive modeling or machine learning model'
  },
  'Business Analyst': {
    requiredSkills: ['SQL', 'Excel', 'Tableau', 'Business Metrics', 'Requirements'],
    idealProject: 'Business performance or sales analytics report'
  },
  'Frontend Developer': {
    requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'REST APIs', 'TypeScript'],
    idealProject: 'Interactive web application or UI component project'
  },
  'Cyber Security Analyst': {
    requiredSkills: ['Linux', 'Networking', 'Python', 'Wireshark', 'Security'],
    idealProject: 'Network security scanner or vulnerability assessment'
  }
}

function HomeLanding({ hasCV = false, analysis = null, onAnalyze }) {
  const [selectedRole, setSelectedRole] = useState('Data Analyst')
  const [activeDnaSkill, setActiveDnaSkill] = useState(null)
  const [easterEggActive, setEasterEggActive] = useState(false)

  const triggerConstellationEgg = () => {
    setEasterEggActive(true)
    setTimeout(() => setEasterEggActive(false), 4000)
  }

  // Calculate real role fit score using multi-factor evidence (Skill alignment + Project proof + Experience evidence)
  const getRealRoleFit = (roleName) => {
    if (!hasCV || !analysis) return null

    const reqs = roleRequirementsMap[roleName] || roleRequirementsMap['Data Analyst']
    const cvSkills = (analysis.skills || []).map(s => typeof s === 'string' ? s : s.name || '')
    const projects = analysis.projects || []
    const experience = analysis.experience || []
    
    // 1. Skill Alignment (50% weight)
    const matched = reqs.requiredSkills.filter(req => 
      cvSkills.some(cs => cs.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(cs.toLowerCase()))
    )
    const missing = reqs.requiredSkills.filter(req => !matched.includes(req))
    const skillRatio = reqs.requiredSkills.length ? matched.length / reqs.requiredSkills.length : 0
    const skillScore = skillRatio * 100

    // 2. Project Evidence (30% weight)
    const projectEvidencedSkills = matched.filter(sk => 
      projects.some(p => 
        (p.tech || []).some(t => t.toLowerCase().includes(sk.toLowerCase())) ||
        (p.description || '').toLowerCase().includes(sk.toLowerCase())
      )
    )
    const projectRatio = matched.length ? projectEvidencedSkills.length / matched.length : 0
    const projectScore = (projects.length > 0 ? 50 : 0) + (projectRatio * 50)

    // 3. Experience & Degree Evidence (20% weight)
    const hasExp = experience.length > 0
    const hasDegree = analysis.profile?.degree && analysis.profile.degree !== 'Not found in CV'
    const expScore = (hasExp ? 60 : 20) + (hasDegree ? 40 : 0)

    // Weighted Overall Score
    const overallScore = Math.min(98, Math.max(35, Math.round(skillScore * 0.50 + projectScore * 0.30 + expScore * 0.20)))
    
    const hasProjects = projects.length > 0
    const sampleProject = hasProjects ? projects[0].name : 'No project detected in CV'

    return {
      score: overallScore,
      matched,
      missing,
      hasProjects,
      sampleProject
    }
  }

  const realFit = getRealRoleFit(selectedRole)

  // Build real Career DNA rows if CV is uploaded
  const getRealCareerDna = () => {
    if (!hasCV || !analysis) return []

    const skills = analysis.skills || []
    const projects = analysis.projects || []
    const experience = analysis.experience || []

    if (skills.length === 0) return []

    return skills.slice(0, 5).map((skillObj) => {
      const skillName = typeof skillObj === 'string' ? skillObj : skillObj.name || ''
      
      // Find matching project evidence
      const matchingProject = projects.find(p => 
        (p.tech || []).some(t => t.toLowerCase().includes(skillName.toLowerCase())) ||
        (p.description || '').toLowerCase().includes(skillName.toLowerCase()) ||
        (p.name || '').toLowerCase().includes(skillName.toLowerCase())
      )

      // Find matching experience evidence
      const matchingExp = experience.find(e => 
        (e.highlights || []).some(h => h.toLowerCase().includes(skillName.toLowerCase())) ||
        (e.role || '').toLowerCase().includes(skillName.toLowerCase())
      )

      let evidenceText = 'Listed in Skills section'
      let projectText = 'No supporting project evidence detected in CV'

      if (matchingProject) {
        projectText = matchingProject.name
        evidenceText = 'Verified Project Evidence'
      } else if (matchingExp) {
        projectText = `${matchingExp.role} (${matchingExp.company || 'Experience'})`
        evidenceText = 'Verified Experience Evidence'
      }

      return {
        skill: skillName,
        project: projectText,
        evidence: evidenceText,
        role: selectedRole
      }
    })
  }

  const realDnaRows = getRealCareerDna()

  return (
    <div className="home-landing">
      {/* --- EASTER EGG TOAST NOTIFICATION --- */}
      {easterEggActive && (
        <div className="constellation-toast">
          <span className="toast-star">✦</span>
          <div>
            <strong>CareerLens Constellation Unlocked</strong>
            <small>Skill Evidence Signal Node Graph is fully aligned.</small>
          </div>
        </div>
      )}

      {/* --- 1. HERO SECTION --- */}
      <section className="hero-section section-shell" id="top">
        <div className="hero-content">
          <div className="hero-header">
            <p className="kicker">
              <span className="kicker-dot" /> CAREERLENS AI — AI CAREER INTELLIGENCE
            </p>
            <h1 className="hero-title">
              YOUR CV IS MORE THAN A LIST OF SKILLS.
            </h1>
            <h2 className="hero-subtitle">
              SEE WHAT YOUR EXPERIENCE CAN BECOME.
            </h2>
            <p className="hero-lede">
              CareerLens connects the skills, projects and experience in your CV to the opportunities that fit you — then shows you what to do next.
            </p>
          </div>

          <div className="hero-cta-wrapper">
            <button className="button hero-primary-cta" type="button" onClick={onAnalyze}>
              Analyze My CV <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="hero-truth-pills">
            <div className="truth-pill">
              <span className="truth-icon">✦</span>
              <div>
                <strong>CV → EVIDENCE</strong>
                <small>Connect skills to actual projects</small>
              </div>
            </div>
            <div className="truth-pill">
              <span className="truth-icon">✦</span>
              <div>
                <strong>CV × ROLE</strong>
                <small>Estimated career fit</small>
              </div>
            </div>
            <div className="truth-pill">
              <span className="truth-icon">✦</span>
              <div>
                <strong>EVIDENCE FIRST</strong>
                <small>Only what your CV supports</small>
              </div>
            </div>
          </div>
        </div>

        {/* --- HERO CAREER SIGNAL NODE GRAPH --- */}
        <div className="hero-signal-wrapper">
          <div className="signal-card">
            <div className="signal-card-head">
              <span><i /> CAREER SIGNAL MAP</span>
              <button 
                type="button" 
                className="star-egg-btn"
                onClick={triggerConstellationEgg}
                title="CareerLens Constellation Signal"
              >
                ✦
              </button>
            </div>

            <div className="signal-node-graph">
              {/* SVG Connecting Lines */}
              <svg className="signal-lines-svg" viewBox="0 0 400 320">
                <line x1="200" y1="160" x2="70" y2="60" className="signal-line pulse-1" />
                <line x1="200" y1="160" x2="330" y2="60" className="signal-line pulse-2" />
                <line x1="200" y1="160" x2="70" y2="260" className="signal-line pulse-3" />
                <line x1="200" y1="160" x2="330" y2="260" className="signal-line pulse-4" />
              </svg>

              {/* Central Node */}
              <div className="signal-node node-center">
                <strong>YOUR PROFILE</strong>
                <small>{hasCV ? 'CV Analyzed' : 'Awaiting CV Upload'}</small>
              </div>

              {/* Surrounding Nodes */}
              <div className="signal-node node-top-left">
                <span>SKILLS</span>
                <strong>{hasCV && analysis?.skills?.length ? (typeof analysis.skills[0] === 'string' ? analysis.skills[0] : analysis.skills[0].name) : 'YOUR SKILLS'}</strong>
              </div>

              <div className="signal-node node-top-right">
                <span>PROJECTS</span>
                <strong>{hasCV && analysis?.projects?.length ? analysis.projects[0].name : 'YOUR PROJECTS'}</strong>
              </div>

              <div className="signal-node node-bottom-left">
                <span>EXPERIENCE</span>
                <strong>{hasCV && analysis?.experience?.length ? analysis.experience[0].role : 'YOUR EXPERIENCE'}</strong>
              </div>

              <div className="signal-node node-bottom-right">
                <span>TARGET ROLE</span>
                <strong>{selectedRole}</strong>
              </div>
            </div>

            <div className="signal-footer">
              <span>MAPPED EVIDENCE</span>
              <span>GROUNDED IN YOUR CV</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. STORYTELLING SECTION --- */}
      <section className="story-section section-shell">
        <div className="story-head">
          <p className="kicker">PRODUCT PHILOSOPHY</p>
          <h2>CAREER DECISIONS SHOULDN’T BE A GUESS.</h2>
          <p className="story-sub">
            CareerLens transforms flat resume text into an evidence map so you know exactly where you stand before submitting an application.
          </p>
        </div>

        <div className="story-flow-grid">
          <article className="story-flow-step">
            <span className="step-num">01</span>
            <div className="step-content">
              <h3>UNDERSTAND</h3>
              <p>Connect your listed skills directly to the real projects, code repositories, and experience that prove them.</p>
            </div>
          </article>

          <span className="flow-connector">→</span>

          <article className="story-flow-step">
            <span className="step-num">02</span>
            <div className="step-content">
              <h3>MATCH</h3>
              <p>Compare your actual evidenced capabilities with the specific role requirements of your target job opportunity.</p>
            </div>
          </article>

          <span className="flow-connector">→</span>

          <article className="story-flow-step">
            <span className="step-num">03</span>
            <div className="step-content">
              <h3>MOVE</h3>
              <p>Know your exact skill gaps and follow step-by-step next edits to upgrade your profile and land interviews.</p>
            </div>
          </article>
        </div>
      </section>

      {/* --- 3. MAIN PRODUCT SHOWCASE (INTERACTIVE DEMO / PRE-UPLOAD vs POST-UPLOAD) --- */}
      <section className="showcase-section section-shell" id="showcase">
        <div className="showcase-head">
          <div>
            <p className="kicker">MAIN PRODUCT SHOWCASE</p>
            <h2>SEE YOUR CAREER FIT</h2>
          </div>
          <span className="demo-tag-pill">
            {hasCV ? 'YOUR PERSONALIZED FIT' : 'PRODUCT DEMO · EXAMPLE ONLY'}
          </span>
        </div>

        <p className="showcase-desc">
          {hasCV 
            ? 'Based on your uploaded CV, select a target role below to see your calculated evidence match.'
            : 'Upload your CV to generate a career fit based on your actual skills, projects and experience.'}
        </p>

        {/* Role Selector Buttons */}
        <div className="role-selector-bar">
          {demoRolesList.map((role) => (
            <button
              key={role}
              type="button"
              className={`role-btn ${selectedRole === role ? 'is-active' : ''}`}
              onClick={() => setSelectedRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Display Box */}
        <div className="showcase-demo-card">
          <div className="demo-card-header">
            <div>
              <span className="card-kicker">TARGET ROLE MATCH</span>
              <h3>{selectedRole}</h3>
            </div>
            <div className="demo-score-badge">
              {hasCV && realFit ? (
                <>
                  <strong>{realFit.score}<span>/100</span></strong>
                  <small>{realFit.score >= 75 ? 'Strong Fit' : 'Developing Fit'}</small>
                </>
              ) : (
                <>
                  <strong className="awaiting-score">—<span>/100</span></strong>
                  <small className="awaiting-label">Awaiting your CV</small>
                </>
              )}
            </div>
          </div>

          {hasCV && realFit ? (
            /* POST-UPLOAD REAL PERSONALIZED RESULTS */
            <>
              <div className="demo-card-grid">
                <div className="demo-col">
                  <span className="col-label">STRONG EVIDENCE SIGNALS (FROM YOUR CV)</span>
                  <div className="skill-pills-row">
                    {realFit.matched.length > 0 ? (
                      realFit.matched.map((s) => (
                        <span className="skill-pill pill-strong" key={s}>✓ {s}</span>
                      ))
                    ) : (
                      <span className="empty-pill">No direct matching skills detected for this role</span>
                    )}
                  </div>
                </div>

                <div className="demo-col">
                  <span className="col-label">DEVELOPING / MISSING SKILLS</span>
                  <div className="skill-pills-row">
                    {realFit.missing.length > 0 ? (
                      realFit.missing.map((s) => (
                        <span className="skill-pill pill-developing" key={s}>△ {s}</span>
                      ))
                    ) : (
                      <span className="skill-pill pill-strong">✓ All key skills detected in your CV!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="demo-card-footer">
                <div>
                  <span className="col-label">SUPPORTING PROJECT EVIDENCE</span>
                  <strong>{realFit.sampleProject}</strong>
                </div>
                <div className="demo-recommendation">
                  <span className="col-label">NEXT RECOMMENDED MOVE</span>
                  <p>💡 {realFit.missing.length > 0 ? `Add a project demonstrating ${realFit.missing[0]} to strengthen your fit.` : 'Your CV shows strong alignment for this role!'}</p>
                </div>
              </div>
            </>
          ) : (
            /* PRE-UPLOAD HONEST UNLOCKED / EMPTY STATE */
            <div className="pre-upload-showcase">
              <div className="pre-upload-banner">
                <span className="lock-icon">🔒</span>
                <div>
                  <strong>{selectedRole} selected.</strong>
                  <p>Upload your CV to calculate your estimated match score and skill evidence.</p>
                </div>
                <button type="button" className="button button-small" onClick={onAnalyze}>
                  Upload Your CV →
                </button>
              </div>

              <div className="demo-card-grid disabled-grid">
                <div className="demo-col">
                  <span className="col-label">STRONG EVIDENCE SIGNALS</span>
                  <p className="placeholder-text">Upload CV to analyze</p>
                </div>
                <div className="demo-col">
                  <span className="col-label">DEVELOPING / MISSING SKILLS</span>
                  <p className="placeholder-text">Upload CV to analyze</p>
                </div>
              </div>

              <div className="demo-card-footer disabled-footer">
                <div>
                  <span className="col-label">SUPPORTING PROJECT EVIDENCE</span>
                  <strong className="placeholder-text">No profile analyzed yet</strong>
                </div>
                <div className="demo-recommendation">
                  <span className="col-label">NEXT RECOMMENDED MOVE</span>
                  <p className="placeholder-text">Upload your CV to receive a personalized recommendation.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- 4. YOUR CAREER DNA (EVIDENCE MAP / PRE-UPLOAD vs POST-UPLOAD) --- */}
      <section className="career-dna-section section-shell" id="career-dna">
        <div className="dna-head">
          <div>
            <p className="kicker">EVIDENCE RELATIONSHIP MAP</p>
            <h2>YOUR CAREER DNA</h2>
          </div>
          <p className="dna-copy">
            {hasCV
              ? 'CareerLens mapped the skills, projects, and evidence directly from your CV.'
              : 'Upload your CV to see how your skills connect to projects, evidence, and career opportunities.'}
          </p>
        </div>

        <div className="dna-graph-container">
          {hasCV ? (
            /* POST-UPLOAD REAL CV EVIDENCE ROWS */
            realDnaRows.length > 0 ? (
              <div className="dna-nodes-grid">
                {realDnaRows.map((item) => {
                  const isHovered = activeDnaSkill === item.skill
                  const isDimmed = activeDnaSkill !== null && !isHovered

                  return (
                    <div
                      key={item.skill}
                      className={`dna-node-row ${isHovered ? 'is-highlighted' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
                      onMouseEnter={() => setActiveDnaSkill(item.skill)}
                      onMouseLeave={() => setActiveDnaSkill(null)}
                    >
                      <div className="dna-cell cell-skill">
                        <span className="dna-label">SKILL</span>
                        <strong>{item.skill}</strong>
                      </div>

                      <span className="dna-arrow">→</span>

                      <div className="dna-cell cell-project">
                        <span className="dna-label">RELEVANT PROJECT / EXP</span>
                        <strong>{item.project}</strong>
                      </div>

                      <span className="dna-arrow">→</span>

                      <div className="dna-cell cell-evidence">
                        <span className="dna-label">EVIDENCE STRENGTH</span>
                        <strong>{item.evidence}</strong>
                      </div>

                      <span className="dna-arrow">→</span>

                      <div className="dna-cell cell-role">
                        <span className="dna-label">CAREER FIT</span>
                        <strong>{item.role}</strong>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="dna-empty-state">
                <span className="empty-icon">📁</span>
                <strong>No skills or projects detected in this CV.</strong>
                <p>Ensure your PDF contains readable text for skills and projects.</p>
              </div>
            )
          ) : (
            /* PRE-UPLOAD HONEST ABSTRACT PREVIEW */
            <div className="dna-pre-upload-wrapper">
              <div className="dna-placeholder-rows">
                <div className="dna-node-row placeholder-row">
                  <div className="dna-cell"><span className="dna-label">SKILLS</span><strong>YOUR SKILLS</strong></div>
                  <span className="dna-arrow">→</span>
                  <div className="dna-cell"><span className="dna-label">PROJECTS</span><strong>YOUR PROJECTS</strong></div>
                  <span className="dna-arrow">→</span>
                  <div className="dna-cell"><span className="dna-label">EVIDENCE</span><strong>YOUR EVIDENCE</strong></div>
                  <span className="dna-arrow">→</span>
                  <div className="dna-cell"><span className="dna-label">CAREER FIT</span><strong>YOUR CAREER FIT</strong></div>
                </div>

                <div className="dna-node-row placeholder-row">
                  <div className="dna-cell"><span className="dna-label">SKILLS</span><strong>[ Awaiting CV ]</strong></div>
                  <span className="dna-arrow">→</span>
                  <div className="dna-cell"><span className="dna-label">PROJECTS</span><strong>[ Awaiting CV ]</strong></div>
                  <span className="dna-arrow">→</span>
                  <div className="dna-cell"><span className="dna-label">EVIDENCE</span><strong>[ Awaiting CV ]</strong></div>
                  <span className="dna-arrow">→</span>
                  <div className="dna-cell"><span className="dna-label">CAREER FIT</span><strong>[ Awaiting CV ]</strong></div>
                </div>
              </div>

              <div className="dna-pre-upload-notice">
                <p>🔒 <strong>Waiting for your CV</strong> — Your career evidence map will appear here after analysis.</p>
                <button type="button" className="button" onClick={onAnalyze}>
                  Upload Your CV →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --- 5. ASK CAREERLENS (AI CAREER ASSISTANT PREVIEW) --- */}
      <section className="ask-section section-shell">
        <div className="ask-container">
          <div className="ask-info">
            <p className="kicker">REAL-TIME CAREER GUIDANCE</p>
            <h2>YOU DON’T HAVE TO FIGURE IT OUT ALONE.</h2>
            <p>
              Ask CareerLens anything about your CV, missing skills, or interview preparation. Our AI assistant analyzes your evidence map to give tailored guidance.
            </p>

            <div className="quick-prompts-list">
              <span className="prompt-label">TRY QUICK PROMPTS:</span>
              <button type="button" className="prompt-chip" onClick={onAnalyze}>
                "What roles fit me?"
              </button>
              <button type="button" className="prompt-chip" onClick={onAnalyze}>
                "What should I learn next?"
              </button>
              <button type="button" className="prompt-chip" onClick={onAnalyze}>
                "Why is my match low?"
              </button>
              <button type="button" className="prompt-chip" onClick={onAnalyze}>
                "How do I prepare for interviews?"
              </button>
            </div>
          </div>

          {/* Conversation Mock Card */}
          <div className="chat-mock-card">
            <div className="chat-mock-head">
              <span>💬 ASK CAREERLENS AI</span>
              <small>{hasCV ? 'GUIDANCE FROM YOUR CV' : 'CAREERLENS PREVIEW'}</small>
            </div>

            <div className="chat-messages-mock">
              <div className="chat-msg msg-user">
                <strong>You</strong>
                <p>What should I improve first to become a Data Scientist?</p>
              </div>

              <div className="chat-msg msg-ai">
                <strong>CareerLens AI</strong>
                <p>
                  Upload your CV so I can scan your project evidence and point out your exact missing skill gaps!
                </p>
              </div>
            </div>

            <div className="chat-input-mock">
              <input type="text" readOnly value="Ask CareerLens a question about your CV..." />
              <button type="button" onClick={onAnalyze}>Ask →</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. FINAL CTA SECTION --- */}
      <section className="final-cta-section section-shell">
        <div className="final-cta-card">
          <p className="kicker">START YOUR ANALYSIS</p>
          <h2>STOP GUESSING. START MOVING.</h2>
          <p className="final-cta-sub">
            Understand where your experience fits — and what to do next.
          </p>
          <button className="button final-cta-button" type="button" onClick={onAnalyze}>
            Analyze My CV <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomeLanding
