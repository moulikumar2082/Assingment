function CTA({ onAnalyze }) {
  return <section className="cta section-shell" id="cta"><div className="cta-line" /><div className="cta-content"><p className="kicker">SEE WHAT'S POSSIBLE</p><h2>There's more than<br /><i>one path forward.</i></h2><p>Start with the skills you already have. Leave with a clearer next move.</p><button className="button button-dark" type="button" onClick={onAnalyze}>Explore My Career Path <span aria-hidden="true">↗</span></button></div><div className="cta-orbit orbit-one" /><div className="cta-orbit orbit-two" /></section>
}

export default CTA
