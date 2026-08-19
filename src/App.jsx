import { useState } from 'react'
import Navbar from './components/Navbar'
import HomeLanding from './components/HomeLanding'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'
import ResumeUpload from './components/ResumeUpload'
import SignIn from './components/SignIn'
import AnalysisDashboard from './components/AnalysisDashboard'
import JobMatchPanel from './components/JobMatchPanel'
import AIAssistant from './components/AIAssistant'
import './index.css'

import ContactSection from './components/ContactSection'

function App() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [resumeAnalysis, setResumeAnalysis] = useState(null)
  const [matchAnalysis, setMatchAnalysis] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('careerlens-demo-auth') === 'true')
  const [guestUsed, setGuestUsed] = useState(() => localStorage.getItem('careerlens-guest-used') === 'true')

  const handleAuthenticated = () => {
    localStorage.setItem('careerlens-demo-auth', 'true')
    setIsAuthenticated(true)
    setSignInOpen(false)
  }

  const handleGuestUsed = () => {
    localStorage.setItem('careerlens-guest-used', 'true')
    setGuestUsed(true)
  }

  const handleAnalyzed = (analysis) => {
    setResumeAnalysis(analysis)
    setMatchAnalysis(null)
  }

  const handleOpenUpload = () => {
    setUploadOpen(true)
  }

  const handleResetGuestLimit = () => {
    localStorage.removeItem('careerlens-guest-used')
    setGuestUsed(false)
  }

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        onSignIn={() => setSignInOpen(true)}
        onGetStarted={handleOpenUpload}
      />
      <main>
        {resumeAnalysis ? (
          <>
            <AnalysisDashboard analysis={resumeAnalysis} onAnalyzeAnother={handleOpenUpload} />
            <JobMatchPanel analysis={resumeAnalysis} match={matchAnalysis} onMatch={setMatchAnalysis} />
            <AIAssistant analysis={resumeAnalysis} match={matchAnalysis} />
          </>
        ) : (
          <>
            <HomeLanding
              hasCV={Boolean(resumeAnalysis)}
              analysis={resumeAnalysis}
              onAnalyze={handleOpenUpload}
              onMatch={handleOpenUpload}
            />
            <HowItWorks />
          </>
        )}
        <ContactSection />
      </main>
      <Footer
        onSignIn={() => setSignInOpen(true)}
        onAnalyze={handleOpenUpload}
        isAuthenticated={isAuthenticated}
      />
      <ResumeUpload
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onAnalyzed={handleAnalyzed}
        isAuthenticated={isAuthenticated}
        guestUsed={guestUsed}
        onGuestUsed={handleGuestUsed}
        onResetGuestLimit={handleResetGuestLimit}
        onRequireSignIn={() => { setUploadOpen(false); setSignInOpen(true); }}
      />
      <SignIn
        isOpen={signInOpen}
        isAuthenticated={isAuthenticated}
        onAuthenticated={handleAuthenticated}
        onClose={() => setSignInOpen(false)}
      />
    </>
  )
}

export default App
