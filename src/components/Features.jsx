import { useState } from 'react'
import FeatureDetails from './FeatureDetails'
import './Features.css'

const features = [
  { number: '01', title: 'Resume Intelligence', copy: 'Understand the skills and experience already present in your resume.', detail: 'CareerLens AI turns the important signals in your resume into a clear view of your skills, experience, and strengths.', icon: '▤' },
  { number: '02', title: 'Job Matching', copy: 'See how closely your profile matches the roles you want.', detail: 'Compare your current profile with target roles and see which opportunities are closest to your existing experience.', icon: '⌁' },
  { number: '03', title: 'Skill Gap Analysis', copy: 'Identify the skills that could make you a stronger candidate.', detail: 'Find the specific skills worth improving so your learning time is focused on the career path you actually want.', icon: '◒' },
  { number: '04', title: 'AI Career Guidance', copy: 'Get practical recommendations based on your current profile and goals.', detail: 'Receive clear next-step recommendations that connect your strengths and gaps to a realistic career direction.', icon: '✦' },
]

function Features() {
  const [selectedFeature, setSelectedFeature] = useState(null)

  return <><section className="features section-shell" id="features"><div className="section-intro"><p className="kicker">A CLEARER PATH FORWARD</p><h2>Everything you need to understand your <i>career path.</i></h2></div><div className="feature-grid">{features.map((feature) => <button className="feature-card" type="button" key={feature.title} onClick={() => setSelectedFeature(feature)}><span className="feature-top"><span className="feature-icon">{feature.icon}</span><span className="feature-number">{feature.number}</span></span><span className="feature-card-title">{feature.title}</span><span className="feature-card-copy">{feature.copy}</span><span className="card-arrow" aria-hidden="true">↗</span></button>)}</div></section><FeatureDetails feature={selectedFeature} onClose={() => setSelectedFeature(null)} /></>
}

export default Features
