const steps = [['01', 'Build your profile', 'Bring your resume, experience, and direction into one place.'], ['02', 'Map your skills', 'CareerLens finds the signals that shape your current possibilities.'], ['03', 'Explore your paths', 'Compare roles without losing sight of the person behind the profile.'], ['04', 'Take your next step', 'Leave with one focused skill and a clearer reason to build it.']]

function HowItWorks() {
  return <section className="how-it-works section-shell" id="how-it-works"><div className="how-heading"><p className="kicker">HOW IT WORKS</p><h2>Clarity is a process,<br /><i>not a guess.</i></h2></div><div className="steps-list">{steps.map(([number, title, copy], index) => <article className="step" key={number}><span className="step-number">{number}</span><div className="step-copy"><h3>{title}</h3><p>{copy}</p></div>{index < steps.length - 1 && <span className="step-connector" aria-hidden="true">→</span>}</article>)}</div></section>
}

export default HowItWorks
