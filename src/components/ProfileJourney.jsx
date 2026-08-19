import './ProfileJourney.css'

const journey = [['01', 'Resume', 'Signals from your experience'], ['02', 'Skills', 'A living map of what you know'], ['03', 'Possibilities', 'Roles that fit your direction'], ['04', 'Next step', 'A focused skill to build']]

function ProfileJourney() {
  return <section className="profile-journey section-shell" id="product"><div className="journey-intro"><p className="kicker">FROM PROFILE TO POSSIBILITY</p><h2>Make the invisible<br /><i>visible.</i></h2><p>CareerLens turns the story inside your resume into a map you can actually move through.</p></div><div className="journey-track">{journey.map(([number, title, copy], index) => <div className="journey-step" key={title}><span className="journey-number">{number}</span><div className={`journey-symbol symbol-${index}`} aria-hidden="true">{index === 0 ? '▤' : index === 1 ? '◌' : index === 2 ? '⌁' : '↗'}</div><strong>{title}</strong><p>{copy}</p>{index < journey.length - 1 && <span className="journey-arrow" aria-hidden="true">→</span>}</div>)}</div></section>
}

export default ProfileJourney
