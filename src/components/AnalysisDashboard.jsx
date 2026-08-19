import './AnalysisDashboard.css'

const label = (value) => value === 'Not found in CV' ? <span className="not-found">Not found in CV</span> : value

function AnalysisDashboard({ analysis, onAnalyzeAnother }) {
  const { profile, skills, projects, dimensions, improvements, strongest, limited, overview } = analysis
  const dimensionLabels = [
    ['skillEvidence', 'Skill Evidence'],
    ['projectEvidence', 'Project Evidence'],
    ['experienceEvidence', 'Experience Evidence'],
    ['technicalDepth', 'Technical Depth'],
    ['achievementEvidence', 'Achievement Evidence'],
    ['cvCompleteness', 'CV Completeness']
  ]

  // Calculate Overall Evidence Score
  const dimValues = Object.values(dimensions || {})
  const avgScore = dimValues.length ? Math.round(dimValues.reduce((a, b) => a + b, 0) / dimValues.length) : 80
  const scoreTier = avgScore >= 80 ? 'Exceptional' : avgScore >= 60 ? 'Strong' : 'Developing'

  return (
    <section className="analysis-shell section-shell" id="analysis">
      {/* --- DASHBOARD HEAD --- */}
      <div className="analysis-head">
        <div>
          <p className="kicker">PERSONALIZED ANALYSIS / {analysis.source === 'demo' ? 'DEMO DATA' : 'YOUR CV'}</p>
          <h2>{profile.name === 'Not found in CV' ? 'Your CV, understood.' : `${profile.name}'s evidence map.`}</h2>
          <p>{overview}</p>
        </div>
        <button className="button button-outline" type="button" onClick={onAnalyzeAnother}>
          Analyze another CV <span aria-hidden="true">↗</span>
        </button>
      </div>

      {/* --- TOP SUMMARY CARDS --- */}
      <div className="analysis-grid">
        {/* CV Evidence Overview Card */}
        <article className="evidence-card evidence-summary">
          <div className="summary-card-head">
            <div className="card-label">CV EVIDENCE OVERVIEW</div>
            <div className="overall-score-badge">
              <strong>{avgScore}<span>/100</span></strong>
              <small>{scoreTier} Profile</small>
            </div>
          </div>

          <div className="dimension-list">
            {dimensionLabels.map(([key, title]) => (
              <div className="dimension" key={key}>
                <span>{title}</span>
                <strong>{dimensions[key]}<small>/100</small></strong>
                <div>
                  <i style={{ width: `${dimensions[key]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="evidence-note">These are evidence strengths based on your CV text, not subjective opinion.</p>
        </article>

        {/* Profile Details Card */}
        <article className="evidence-card profile-card">
          <div className="card-label">PROFILE DETAILS</div>
          <dl>
            <div>
              <dt><span className="profile-icon">👤</span> Name</dt>
              <dd className="profile-val">{label(profile.name)}</dd>
            </div>
            <div>
              <dt><span className="profile-icon">🎓</span> Degree</dt>
              <dd className="profile-val">{label(profile.degree)}</dd>
            </div>
            <div>
              <dt><span className="profile-icon">🏫</span> Institution</dt>
              <dd className="profile-val">{label(profile.institution)}</dd>
            </div>
            <div>
              <dt><span className="profile-icon">📅</span> Graduation</dt>
              <dd className="profile-val highlight-grad">{label(profile.graduationYear)}</dd>
            </div>
          </dl>
        </article>
      </div>

      {/* --- SKILLS & PROJECTS COLUMNS --- */}
      <div className="analysis-columns">
        {/* Strongest Skills Panel */}
        <article className="analysis-panel">
          <div className="panel-heading">
            <div>
              <span className="card-label">STRONGEST EVIDENCED SKILLS</span>
              <h3>What your CV proves</h3>
            </div>
            <span className="panel-count">{skills.length} found</span>
          </div>

          {strongest.length ? (
            <div className="skill-evidence-list">
              {strongest.map((skill) => (
                <div className="skill-evidence" key={skill.name}>
                  <div>
                    <strong>{skill.name}</strong>
                    <span className={`evidence-level level-${skill.level.split(' ')[0].toLowerCase()}`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="evidence-bar">
                    <i style={{ width: `${skill.score}%` }} />
                  </div>
                  <small>{skill.evidence}</small>
                  {skill.supportingProjects?.length > 0 && (
                    <small className="supporting-projects">Supported by: {skill.supportingProjects.join(', ')}</small>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-copy">No recognized technical or soft skills were found in this CV.</p>
          )}
        </article>

        {/* Projects Panel */}
        <article className="analysis-panel projects-panel">
          <div className="panel-heading">
            <div>
              <span className="card-label">PROJECT EVIDENCE</span>
              <h3>Work behind the words</h3>
            </div>
            <span className="panel-count">{projects.length} found</span>
          </div>

          {projects.length ? (
            projects.map((project) => (
              <div className="project-evidence" key={project.name}>
                <div className="project-head-row">
                  <strong>{project.name}</strong>
                  <span className="project-badge">{project.complexity}</span>
                </div>
                <span className="project-sub-evidence">{project.evidence}</span>
                
                {project.technologies?.length > 0 && (
                  <div className="tech-tags-wrapper">
                    <span className="tech-tag-label">Tech:</span>
                    {project.technologies.map((tech) => (
                      <span className="tech-tag-pill" key={tech}>{tech}</span>
                    ))}
                  </div>
                )}

                {project.demonstratedSkills?.length > 0 && (
                  <p className="skills-demo-text">Demonstrated: {project.demonstratedSkills.join(', ')}</p>
                )}
                <small>Found: {project.demonstrated.join(' ')}</small>
              </div>
            ))
          ) : (
            <p className="empty-copy">Projects were not found in this CV.</p>
          )}
        </article>
      </div>

      {/* --- LOWER COLUMNS: LIMITED & IMPROVEMENTS --- */}
      <div className="analysis-columns lower-columns">
        <article className="analysis-panel">
          <div className="panel-heading">
            <div>
              <span className="card-label">LIMITED EVIDENCE</span>
              <h3>Skills listed without proof</h3>
            </div>
          </div>
          {limited.length ? (
            <div className="limited-tags-container">
              {limited.map((skill) => (
                <span className="limited-tag-pill" key={skill.name}>{skill.name}</span>
              ))}
            </div>
          ) : (
            <p className="empty-copy">No skills in this CV are limited to a list-only mention.</p>
          )}
        </article>

        <article className="analysis-panel improve-panel">
          <div className="panel-heading">
            <div>
              <span className="card-label">WHAT TO IMPROVE</span>
              <h3>Useful next edits</h3>
            </div>
          </div>
          <ul>
            {improvements.map((item) => (
              <li key={item}>
                <span className="improve-bullet">✓</span>
                <div>{item}</div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="not-found-strip">
        <strong>CV source of truth</strong>
        <span>Information not present in the uploaded CV is shown as “Not found in CV” instead of being guessed.</span>
      </div>
    </section>
  )
}

export default AnalysisDashboard

