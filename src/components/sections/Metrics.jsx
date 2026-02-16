import { useLanguage } from '../../context/LanguageContext'

export default function Metrics() {
  const { t } = useLanguage()
  const items = t('metrics.items')
  const metricItems = Array.isArray(items) ? items : []

  return (
    <section id="metrics" className="section metrics-section">
      <div className="container">
        <p className="eyebrow">{t('metrics.eyebrow')}</p>
        <h2 className="section-title">{t('metrics.title')}</h2>

        <div className="metrics-grid">
          {metricItems.map((item) => (
            <article key={item.label} className="metric-card">
              <p className="metric-value">{item.value}</p>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
