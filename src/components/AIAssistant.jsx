import { useState } from 'react'
import { answerAssistant } from '../services/aiAssistant'
import './AIAssistant.css'

const prompts = ['How can I improve my CV?', 'What are my strongest skills?', 'Which skills need more evidence?']

function AIAssistant({ analysis, match }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const ask = (value = question) => {
    if (!value.trim()) return
    setQuestion(value)
    setAnswer(answerAssistant(value, analysis, match))
  }
  return <section className="assistant-section section-shell" id="assistant"><div className="assistant-heading"><p className="kicker">CAREERLENS AI / CONTEXT AWARE</p><h2>Ask about the evidence<br /><i>behind your profile.</i></h2><p>This assistant answers from the CV and optional job description you provided. It does not invent missing information.</p></div><div className="assistant-panel"><div className="assistant-panel-top"><span className="assistant-avatar">CL</span><div><strong>CareerLens AI</strong><small>{match ? 'CV + job match context loaded' : 'CV analysis context loaded'}</small></div><span className="assistant-status">READY</span></div><div className="assistant-message"><span className="assistant-spark">✦</span><p>{answer || `Hi! I've analyzed ${analysis?.profile?.name === 'Not found in CV' ? 'your CV' : `${analysis?.profile?.name}'s CV`}. Ask me about skills, projects, CV gaps, or your job match.`}</p></div><div className="assistant-prompts">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => ask(prompt)}>{prompt}</button>)}</div><form className="assistant-form" onSubmit={(event) => { event.preventDefault(); ask() }}><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about your CV..." aria-label="Ask CareerLens AI" /><button type="submit" aria-label="Ask CareerLens AI">↗</button></form></div></section>
}

export default AIAssistant
