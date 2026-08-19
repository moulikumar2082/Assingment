import { useRef, useState } from 'react'
import { analyzeJobMatch } from '../services/atsAnalyzer'
import { extractJobDescription, parseJobDescription } from '../services/jobDescriptionParser'
import { demoJobs, getDemoJob } from '../services/demoJobs'
import './JobMatchPanel.css'

function MatchList({ title, items, symbol }) {
  return <div className="match-list"><span className="card-label">{title}</span>{items.length ? items.map((item) => <div className="match-list-item" key={item.name}><b>{symbol}</b><span><strong>{item.name}</strong><small>{item.evidence}</small></span></div>) : <p className="empty-copy">None found.</p>}</div>
}

function JobMatchPanel({ analysis, match, onMatch }) {
  const inputRef = useRef(null)
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const calculate = (text, source = 'pasted') => {
    const job = parseJobDescription(text)
    if (!job.skills.length) {
      setMessage('No recognized requirements were found in this job description.')
      return
    }
    setMessage('')
    onMatch(analyzeJobMatch(analysis, { ...job, source }))
  }

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const job = await extractJobDescription(file)
      onMatch(analyzeJobMatch(analysis, { ...job, source: 'uploaded' }))
      setDescription(job.rawText)
      setMessage('Job description loaded from your file.')
    } catch {
      setMessage('We could not read that job description. Try a text-based PDF or paste the text.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="job-match section-shell" id="job-match">
      <div className="job-match-heading">
        <div>
          <p className="kicker">CV × TARGET ROLE</p>
          <h2>YOUR CV × YOUR NEXT ROLE</h2>
        </div>
        <p>
          Compare your actual CV evidence with specific job requirements for an instant Estimated Role Match assessment.
        </p>
      </div>

      <div className="job-match-layout">
        <div className="job-input-panel">
          <label className="card-label" htmlFor="job-description">PASTE JOB DESCRIPTION</label>
          <textarea
            id="job-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Paste the role requirements, responsibilities, and education details here..."
          />
          <div className="job-actions">
            <button className="button" type="button" disabled={!description.trim() || busy} onClick={() => calculate(description)}>
              {busy ? 'Reading role...' : 'Analyze Match'} <span aria-hidden="true">→</span>
            </button>
            <label className="upload-job-button" htmlFor="job-file">
              Upload JD
              <input ref={inputRef} id="job-file" type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleFile} />
            </label>
          </div>
          <div className="demo-job-row">
            <span>TRY DEMO JD</span>
            {demoJobs.map((job) => (
              <button type="button" key={job} onClick={() => { const text = getDemoJob(job); setDescription(text); calculate(text, 'demo') }}>
                {job}
              </button>
            ))}
          </div>
          {message && <p className="upload-message">{message}</p>}
        </div>

        {match ? (
          <div className="match-result">
            <div className="match-result-head">
              <div>
                <span className="card-label">ESTIMATED ROLE MATCH</span>
                <h3>Profile-to-Role Fit</h3>
              </div>
              <strong>{match.overall}<small>/100</small></strong>
            </div>
            <p className="match-disclaimer">
              ℹ️ <em>This is an estimated profile-to-role match, not an official ATS result.</em> {match.explanation}
            </p>
            <div className="match-metrics">
              {[
                ['Required skills', match.requiredScore],
                ['Technical keywords', match.technicalScore],
                ['Project relevance', match.projectScore],
                ['Experience relevance', match.experienceScore],
                ['Education', match.educationScore]
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <b>{value}%</b>
                  <i><em style={{ width: `${value}%` }} /></i>
                </div>
              ))}
            </div>
            <div className="match-columns">
              <MatchList title="STRONG MATCHES" items={match.strongMatches} symbol="✓" />
              <MatchList title="PARTIAL MATCHES" items={match.partialMatches} symbol="△" />
              <MatchList title="MISSING FROM CV" items={match.missingMatches} symbol="✕" />
            </div>
            {match.priorities.length > 0 && (
              <div className="match-priorities">
                <span className="card-label">TOP PRIORITIES</span>
                <ol>
                  {match.priorities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ) : (
          <div className="match-empty">
            <span className="empty-orbit-mark">+</span>
            <strong>No job description entered.</strong>
            <p>Paste a job description or choose a demo JD above to view your Estimated Role Match.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default JobMatchPanel
