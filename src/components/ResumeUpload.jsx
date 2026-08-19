import { useRef, useState } from 'react'
import './ResumeUpload.css'
import { analyzeResume } from '../utils/resumeAnalyzer'

function ResumeUpload({ isOpen, onClose, onAnalyzed, isAuthenticated, guestUsed, onGuestUsed, onResetGuestLimit, onRequireSignIn }) {
  const inputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [analyzing, setAnalyzing] = useState(false)

  const [clickCount, setClickCount] = useState(0)

  const handleSecretOwnerClick = () => {
    const nextCount = clickCount + 1
    setClickCount(nextCount)
    if (nextCount >= 3) {
      localStorage.setItem('careerlens-owner-mode', 'true')
      if (onResetGuestLimit) onResetGuestLimit()
      setMessageType('success')
      setMessage('Owner Access: Free demo test limit reset! You can now check your CV.')
      setClickCount(0)
    }
  }

  const formatFileSize = (bytes) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  if (!isOpen) return null

  const handleDropzoneClick = (event) => {
    if (!isAuthenticated && guestUsed) {
      event.preventDefault()
      setMessageType('error')
      setMessage('Your 1 free demo CV test has been used. Please sign in to check another CV.')
      onRequireSignIn()
    }
  }

  const handleFile = (event) => {
    if (!isAuthenticated && guestUsed) {
      setMessageType('error')
      setMessage('Your 1 free demo CV test has been used. Please sign in to check another CV.')
      onRequireSignIn()
      return
    }
    const file = event.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setSelectedFile(null)
      setFileName('')
      setMessageType('error')
      setMessage('Please choose a PDF CV.')
      return
    }
    setSelectedFile(file)
    setFileName(file.name)
    setMessageType('success')
    setMessage('CV selected. It will be analyzed locally.')
  }

  const handleClose = () => {
    setFileName('')
    setSelectedFile(null)
    setMessage('')
    setMessageType('success')
    setAnalyzing(false)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  const analyzeFile = async (file) => {
    if (!isAuthenticated && guestUsed) {
      setMessageType('error')
      setMessage('Your 1 free demo CV test has been used. Please sign in to analyze another CV.')
      onRequireSignIn()
      return
    }

    if (!isAuthenticated && !guestUsed) {
      onGuestUsed()
    }

    setAnalyzing(true)
    setMessage('Reading profile...')
    try {
      await new Promise(r => setTimeout(r, 200))
      setMessage('Detecting skills & degree timeline...')
      await new Promise(r => setTimeout(r, 200))
      setMessage('Connecting project evidence & metrics...')
      await new Promise(r => setTimeout(r, 200))
      setMessage('Mapping career fit & preparing recommendations...')
      
      const analysis = await analyzeResume(file, 'uploaded')
      onAnalyzed(analysis)
      handleClose()
    } catch (error) {
      setAnalyzing(false)
      setMessageType('error')
      setMessage(error?.message === 'PDF_NO_TEXT' ? 'This PDF appears to be scanned or image-only. Please upload a text-based PDF.' : 'We could not read this CV. Please try exporting it again as a text-based PDF.')
    }
  }

  const handleAnalyze = async () => {
    if (!isAuthenticated && guestUsed) {
      onRequireSignIn()
      return
    }
    const file = selectedFile || inputRef.current?.files?.[0]
    if (file) await analyzeFile(file)
  }

  return (
    <div className="upload-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && handleClose()}>
      <section className="upload-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <button className="upload-close" type="button" aria-label="Close CV upload" onClick={handleClose}>×</button>
        <span className="upload-icon" onClick={handleSecretOwnerClick} title="Owner Secret Key (Triple click to reset limit)">↑</span>
        <p className="kicker">
          {isAuthenticated
            ? 'ACCOUNT ACCESS'
            : guestUsed
            ? 'FREE DEMO TEST USED'
            : '1 FREE DEMO TEST AVAILABLE'}
        </p>
        <h2 id="upload-title">
          {isAuthenticated
            ? 'Upload your CV'
            : guestUsed
            ? 'Sign In to Upload More CVs'
            : 'Upload Your CV (Free Demo Test)'}
        </h2>
        <p className="upload-copy">
          {isAuthenticated
            ? 'CareerLens reads your PDF CV locally and builds an evidence-based profile. Nothing is guessed.'
            : guestUsed
            ? 'You have used your 1 free demo test. Sign in to upload and check more CVs.'
            : 'Upload your own PDF CV to test CareerLens AI for free.'}
        </p>

        {!isAuthenticated && guestUsed && (
          <div className="guest-auth-banner guest-expired">
            <div className="guest-auth-text">
              <strong>🔒 Free Demo Test Used</strong>
              <span>Sign in with LinkedIn, GitHub, Google, or Email to upload and analyze more CVs.</span>
            </div>
            <div className="guest-banner-actions">
              <button type="button" className="guest-signin-btn" onClick={() => { handleClose(); onRequireSignIn(); }}>
                Sign In / Sign Up ↗
              </button>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          className="sr-only"
          id="resume-file"
          type="file"
          accept=".pdf,application/pdf"
          disabled={!isAuthenticated && guestUsed}
          onChange={handleFile}
        />

        <label
          className={`upload-dropzone ${!isAuthenticated && guestUsed ? 'disabled-dropzone' : ''}`}
          htmlFor="resume-file"
          onClick={handleDropzoneClick}
        >
          <strong>
            {fileName ||
              (isAuthenticated || !guestUsed
                ? 'Drop your PDF CV here'
                : 'Upload Disabled (Sign In Required)')}
          </strong>
          <span>
            {fileName
              ? `${formatFileSize(selectedFile?.size || 0)} · click to choose a different file`
              : isAuthenticated || !guestUsed
              ? 'Choose a PDF file · analyzed locally'
              : 'Sign in to upload & check your own CV'}
          </span>
        </label>

        {message && <p className={`upload-message ${messageType}`}>{message}</p>}

        <button
          className="button upload-submit"
          type="button"
          disabled={!selectedFile || analyzing || (!isAuthenticated && guestUsed)}
          onClick={handleAnalyze}
        >
          {analyzing ? 'Analyzing CV...' : 'Analyze My CV'} <span aria-hidden="true">↗</span>
        </button>

        <p className="upload-disclaimer">
          {isAuthenticated
            ? 'Your CV is read locally in this browser. No external job search is used.'
            : 'Sign in for unlimited CV uploads & personalized evidence analysis.'}
        </p>
      </section>
    </div>
  )
}

export default ResumeUpload
