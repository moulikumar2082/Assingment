import { useState } from 'react'
import './SignIn.css'

function SignIn({ isOpen, isAuthenticated, onAuthenticated, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    onAuthenticated()
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setIsSignUp(false)
    onClose()
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
  }

  return (
    <div className="signin-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && handleClose()}>
      <section className="signin-dialog" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <button className="signin-close" type="button" aria-label="Close sign in" onClick={handleClose}>×</button>
        {isAuthenticated ? (
          <div className="signin-success">
            <span className="signin-icon">✓</span>
            <p className="kicker">DEMO ACCESS GRANTED</p>
            <h2 id="signin-title">Welcome back.</h2>
            <p>Your CareerLens AI dashboard is ready to explore.</p>
            <button className="button signin-submit" type="button" onClick={handleClose}>
              Open dashboard <span aria-hidden="true">↗</span>
            </button>
          </div>
        ) : (
          <>
            <span className="signin-icon">CL</span>
            <p className="kicker">{isSignUp ? 'CREATE AN ACCOUNT' : 'WELCOME BACK'}</p>
            <h2 id="signin-title">{isSignUp ? 'Create your account.' : 'Sign in to CareerLens.'}</h2>
            <p className="signin-copy">
              {isSignUp ? 'Join CareerLens to analyze your skills, roles, and next career move.' : 'Continue exploring your skills, roles, and next career move.'}
            </p>

            <div className="social-auth-options">
              <button type="button" className="signin-social-btn linkedin-btn" onClick={onAuthenticated}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
              <button type="button" className="signin-social-btn github-btn" onClick={onAuthenticated}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                <span>GitHub</span>
              </button>
              <button type="button" className="signin-social-btn google-btn" onClick={onAuthenticated}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.16h6.6c-.28 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.82z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.32 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27a7.22 7.22 0 0 1 0-4.54V6.58H1.26a11.98 11.98 0 0 0 0 10.84l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.25 2.68 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>

            <div className="signin-divider">
              <span>OR CONTINUE WITH EMAIL</span>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="signin-email">Email address</label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <label htmlFor="signin-password">Password</label>
              <div className="password-field">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength="6"
                  required
                />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <button className="button signin-submit" type="submit">
                {isSignUp ? 'Sign up with Email' : 'Sign in with Email'} <span aria-hidden="true">↗</span>
              </button>
            </form>
            <p className="signin-signup-toggle">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
              <button type="button" onClick={toggleMode}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
            <p className="signin-disclaimer">Demo product · No account or real credentials are required.</p>
          </>
        )}
      </section>
    </div>
  )
}

export default SignIn
