import { useState } from 'react'
import './ContactSection.css'

const faqs = [
  {
    icon: '🔲',
    question: 'How does the skill analysis work?',
    answer: 'We compare your resume against 13,896 skills from our database, matching them line by line to the job description you provide.'
  },
  {
    icon: '⚠️',
    question: 'Can I get a personalized roadmap?',
    answer: 'Yes! Our roadmap system creates phased learning paths tailored to your target role and current skills.'
  },
  {
    icon: '⭕',
    question: 'Is it suitable for recruiters too?',
    answer: 'Absolutely. Batch analyze candidates, get objective skill matching, and make hiring 70% faster.'
  },
  {
    icon: '✦',
    question: 'How secure is my data?',
    answer: 'Your data is encrypted and confidential. We never store or share your raw resume details.'
  }
]

function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    role: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', role: '', message: '' })
    }, 3000)
  }

  return (
    <section className="contact-section section-shell" id="contact">
      <div className="contact-grid">
        {/* Left Column: Heading & FAQs */}
        <div className="contact-left">
          <p className="kicker">HAVE QUESTIONS?</p>
          <h2>
            Have a question? <span>We're here to help.</span>
          </h2>
          <p className="contact-lede">
            Whether you're a student exploring career paths or a recruiter looking to streamline hiring, we're ready to support your journey.
          </p>

          <div className="faq-list">
            {faqs.map((faq) => (
              <article className="faq-card" key={faq.question}>
                <span className="faq-icon" aria-hidden="true">{faq.icon}</span>
                <div>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact-right">
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <div className="success-icon">✅</div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. Our team will respond to your email within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="contact-fullname">FULL NAME *</label>
                  <input
                    id="contact-fullname"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email-addr">EMAIL ADDRESS *</label>
                  <input
                    id="contact-email-addr"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-subject">SUBJECT *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-user-role">YOU ARE A *</label>
                  <select
                    id="contact-user-role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="student">Student / Job Seeker</option>
                    <option value="recruiter">Recruiter / Hiring Manager</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="contact-msg">YOUR MESSAGE *</label>
                  <textarea
                    id="contact-msg"
                    required
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button className="contact-submit-btn" type="submit">
                  Send Message <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
