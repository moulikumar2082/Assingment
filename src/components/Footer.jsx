import { useState } from 'react'
import './Footer.css'

function Footer({ onSignIn, onAnalyze, isAuthenticated }) {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [modalType, setModalType] = useState(null) // 'privacy' | null

  const githubUrl = 'https://github.com/VARALAKSHMI07'
  const linkedinUrl = 'https://www.linkedin.com/in/devatha-varalakshmi07/'

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    setNewsletterSubscribed(true)
    setTimeout(() => {
      setNewsletterSubscribed(false)
      setNewsletterEmail('')
    }, 3500)
  }

  return (
    <footer className="footer-dark" id="footer">
      <div className="footer-dark-shell section-shell">
        {/* --- TOP BRAND & NAV COLUMNS ROW --- */}
        <div className="footer-dark-top">
          {/* Brand & Socials Column */}
          <div className="footer-brand-col">
            <div className="footer-logo-pill">
              <span className="pill-mark">📈</span>
              <strong>CareerLens</strong>
            </div>
            <p className="footer-tagline">
              Know your skill gaps before recruiters do. Built for students and recruiters in India.
            </p>
            <div className="footer-social-row">
              <a className="social-btn" href={githubUrl} target="_blank" rel="noreferrer" title="Devatha Varalakshmi's GitHub">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a className="social-btn" href={linkedinUrl} target="_blank" rel="noreferrer" title="Devatha Varalakshmi's LinkedIn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-nav-col">
            <span className="col-heading">NAVIGATE</span>
            <ul>
              <li><a href="#top"><span className="bullet-dot">•</span> Home</a></li>
              <li><a href="#analysis"><span className="bullet-dot">•</span> Features</a></li>
              <li><a href="#how-it-works"><span className="bullet-dot">•</span> Benefits</a></li>
              <li><a href="#contact"><span className="bullet-dot">•</span> Contact</a></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <span className="col-heading">PLATFORM</span>
            <ul>
              <li>
                <button type="button" className="footer-text-btn" onClick={onAnalyze}>
                  <span className="bullet-dot">•</span> Analyse My Resume
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={onSignIn}>
                  <span className="bullet-dot">•</span> {isAuthenticated ? 'Account' : 'Sign In'}
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={onAnalyze}>
                  <span className="bullet-dot">•</span> Demo
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <span className="col-heading">BUILT WITH</span>
            <ul>
              <li><span><span className="bullet-dot">•</span> FastAPI Backend</span></li>
              <li><span><span className="bullet-dot">•</span> React Frontend</span></li>
              <li><span><span className="bullet-dot">•</span> Python / ML</span></li>
              <li><span><span className="bullet-dot">•</span> MySQL Database</span></li>
            </ul>
          </div>
        </div>

        {/* --- NEWSLETTER SUBSCRIPTION BOX ROW ("Stay in the loop") --- */}
        <div className="newsletter-box">
          <div className="newsletter-info">
            <h3>Stay in the loop</h3>
            <p>Career insights and product updates — straight to your inbox.</p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            {newsletterSubscribed ? (
              <div className="newsletter-subscribed-msg">
                <span>✓ Subscribed successfully!</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>

        {/* --- BOTTOM COPYRIGHT STRIP --- */}
        <div className="footer-bottom-bar">
          <div className="bottom-left">
            <span>© 2026 CareerLens AI. All rights reserved.</span>
            <button type="button" className="footer-text-btn" onClick={() => setModalType('privacy')}>Privacy Policy</button>
          </div>
          <span className="corner-home-tag">Home Page</span>
        </div>
      </div>

      {/* --- PRIVACY POLICY MODAL --- */}
      {modalType === 'privacy' && (
        <div className="signin-backdrop" onClick={() => setModalType(null)}>
          <div className="signin-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <button className="signin-close" onClick={() => setModalType(null)} type="button">×</button>
            <div className="signin-icon" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>🔒</div>
            <h2>Privacy Policy</h2>
            <p className="signin-copy">Your data privacy and security are our top priorities.</p>

            <div style={{ display: 'grid', gap: '16px', color: '#475569', fontSize: '13px', lineHeight: '1.65' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>1. CV File Confidentiality</strong>
                <p style={{ margin: 0 }}>Uploaded CV documents are analyzed securely in real-time. We never store, publish, or sell your personal resume text to third parties.</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>2. Data Encryption & Security</strong>
                <p style={{ margin: 0 }}>All transmissions between your browser and our analysis engine use end-to-end HTTPS SSL encryption protocols.</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>3. Local Storage Usage</strong>
                <p style={{ margin: 0 }}>We use local browser storage strictly to remember your single-time demo session status and signed-in preferences on your own device.</p>
              </div>
            </div>

            <button
              className="button signin-submit"
              type="button"
              onClick={() => setModalType(null)}
              style={{ marginTop: '24px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer
