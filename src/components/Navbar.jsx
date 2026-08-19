import { useState } from 'react'

const links = [
  ['Product', 'analysis'],
  ['Match My CV', 'job-match'],
  ['How It Works', 'how-it-works'],
]

function Navbar({ isAuthenticated, onSignIn, onGetStarted }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#top" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">CL</span>
          <span>CareerLens <em>AI</em></span>
          <span className="brand-badge">AI Career Intelligence</span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="sr-only">Toggle navigation</span>
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
        <div id="main-menu" className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>)}
          </div>
          <div className="nav-actions">
            <button type="button" className="sign-in" onClick={() => { closeMenu(); onSignIn() }}>{isAuthenticated ? 'Account' : 'Sign In'}</button>
            <button type="button" className="button button-small" onClick={() => { closeMenu(); onGetStarted() }}>Analyze My CV <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
