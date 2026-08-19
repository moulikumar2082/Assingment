import './FeatureDetails.css'

function FeatureDetails({ feature, onClose }) {
  if (!feature) return null

  return <div className="feature-detail-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="feature-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="feature-detail-title"><button className="feature-detail-close" type="button" aria-label="Close feature details" onClick={onClose}>×</button><span className="feature-detail-icon">{feature.icon}</span><p className="kicker">CAREERLENS AI FEATURE</p><h2 id="feature-detail-title">{feature.title}</h2><p>{feature.detail}</p><button className="button feature-detail-action" type="button" onClick={onClose}>Back to overview <span aria-hidden="true">↗</span></button></section></div>
}

export default FeatureDetails
